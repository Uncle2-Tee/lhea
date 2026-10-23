import { randomInt, randomUUID } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { categories, getNominee, votePackages } from "@/lib/election-data";
import { isDemoState } from "@/lib/demo-state";
import { getVoterSessionId, isSameOriginRequest, readVoterState } from "@/lib/voter-data";
import { prisma } from "@/lib/prisma";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const MAX_REQUEST_BYTES = 15 * 1024 * 1024;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function logDatabaseError(message: string, error: unknown) {
  const details = error instanceof Prisma.PrismaClientKnownRequestError
    ? { code: error.code }
    : { name: error instanceof Error ? error.name : "UnknownError" };
  console.error(message, details);
}

async function readJson(request: Request) {
  const body = await request.text();
  if (Buffer.byteLength(body, "utf8") > MAX_REQUEST_BYTES) {
    throw new Error("The submitted data is too large.");
  }
  return JSON.parse(body) as unknown;
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function createVotingCode() {
  const part = Array.from({ length: 12 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
  return `LHEA-${part.slice(0, 4)}-${part.slice(4, 8)}-${part.slice(8)}`;
}

function validPhoto(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 1_400_000) return false;
  const match = /^data:image\/(jpeg|png|webp|gif);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) return false;

  const image = Buffer.from(match[2], "base64");
  return image.length > 0 && image.length <= 1024 * 1024;
}

async function importLocalState(state: unknown, sessionId: string) {
  if (!isDemoState(state) ||
    !state.codes.every((code) => UUID_PATTERN.test(code.id) && Number.isInteger(code.total) &&
      Number.isInteger(code.remaining) && code.total > 0 && code.remaining >= 0 && code.remaining <= code.total &&
      Number.isFinite(Date.parse(code.createdAt))) ||
    !state.votes.every((vote) => UUID_PATTERN.test(vote.id) && UUID_PATTERN.test(vote.codeId) &&
      typeof vote.nomineeId === "string" && vote.nomineeId.length > 0 &&
      Number.isFinite(Date.parse(vote.createdAt)) && categories.some((category) =>
        category.id === vote.categoryId &&
        getNominee(vote.nomineeId, state.registeredNominees ?? [])?.category.id === category.id)) ||
    !(state.registeredNominees ?? []).every((nominee) =>
      UUID_PATTERN.test(nominee.id) && categories.some((category) => category.id === nominee.categoryId) &&
      validPhoto(nominee.photoDataUrl) && nominee.email.includes("@") &&
      nominee.name.trim().length >= 2 && nominee.bio.length >= 20 &&
      Number.isFinite(Date.parse(nominee.createdAt)))) {
    return errorResponse("The saved browser data is invalid and could not be imported.", 400);
  }

  const codeIds = new Set(state.codes.map((code) => code.id));
  if (!state.votes.every((vote) => codeIds.has(vote.codeId))) {
    return errorResponse("The saved votes do not match their voting codes.", 400);
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.browserSession.findUniqueOrThrow({
        where: { id: sessionId },
        select: {
          codes: { select: { id: true }, take: 1 },
          votes: { select: { id: true }, take: 1 },
          registeredNominees: { select: { id: true }, take: 1 },
        },
      });
      if (existing.codes.length || existing.votes.length || existing.registeredNominees.length) {
        throw new Error("This browser already has saved database data.");
      }

      if (state.codes.length) {
        await tx.votingCode.createMany({
          data: state.codes.map((code) => ({
            id: code.id,
            sessionId,
            value: code.value,
            total: code.total,
            remaining: code.remaining,
            createdAt: new Date(code.createdAt),
          })),
        });
      }
      if (state.votes.length) {
        await tx.demoVote.createMany({
          data: state.votes.map((vote) => ({
            id: vote.id,
            sessionId,
            codeId: vote.codeId,
            nomineeId: vote.nomineeId,
            categoryId: vote.categoryId,
            createdAt: new Date(vote.createdAt),
          })),
        });
      }
      if (state.registeredNominees?.length) {
        await tx.registeredNominee.createMany({
          data: state.registeredNominees.map((nominee) => ({
            ...nominee,
            sessionId,
            createdAt: new Date(nominee.createdAt),
          })),
        });
      }
    });
    return null;
  } catch (error) {
    logDatabaseError("Failed to import saved browser data into PostgreSQL.", error);
    return errorResponse("Your saved data could not be imported. It remains in this browser.", 409);
  }
}

export async function GET() {
  try {
    const sessionId = await getVoterSessionId();
    return NextResponse.json(await readVoterState(sessionId), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    logDatabaseError("Failed to load voter data from PostgreSQL.", error);
    return errorResponse("Voting data could not be loaded. Please try again.", 503);
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return errorResponse("This request is not allowed.", 403);
  }

  try {
    const body = record(await readJson(request));
    if (!body) return errorResponse("Invalid request data.", 400);

    const sessionId = await getVoterSessionId();
    if (body.action === "import-local-state") {
      const result = await importLocalState(body.state, sessionId);
      if (result) return result;
      return NextResponse.json(await readVoterState(sessionId));
    }

    if (body.action === "create-code") {
      const votes = body.votes;
      if (typeof votes !== "number" || !votePackages.some((pack) => pack.votes === votes)) {
        return errorResponse("Select a valid voting pack.", 400);
      }

      const code = await prisma.votingCode.create({
        data: {
          id: randomUUID(),
          sessionId,
          value: createVotingCode(),
          total: votes,
          remaining: votes,
        },
      });
      return NextResponse.json({
        id: code.id,
        value: code.value,
        total: code.total,
        remaining: code.remaining,
        createdAt: code.createdAt.toISOString(),
      }, { status: 201 });
    }

    if (body.action === "cast-vote") {
      const { codeId, nomineeId, categoryId } = body;
      if (typeof codeId !== "string" || !UUID_PATTERN.test(codeId) ||
        typeof nomineeId !== "string" || nomineeId.length === 0 || nomineeId.length > 120 ||
        typeof categoryId !== "string" || !categories.some((category) => category.id === categoryId)) {
        return errorResponse("Select a valid voting code and nominee.", 400);
      }

      const state = await readVoterState(sessionId);
      const nominee = getNominee(nomineeId, state.registeredNominees);
      if (!nominee || nominee.category.id !== categoryId) {
        return errorResponse("The selected nominee is not in this category.", 400);
      }

      const voteId = randomUUID();
      const createdAt = new Date();
      const updated = await prisma.$transaction(async (tx) => {
        const deduction = await tx.votingCode.updateMany({
          where: { id: codeId, sessionId, remaining: { gt: 0 } },
          data: { remaining: { decrement: 1 } },
        });
        if (deduction.count !== 1) return false;

        await tx.demoVote.create({
          data: { id: voteId, sessionId, codeId, nomineeId, categoryId, createdAt },
        });
        return true;
      });

      if (!updated) return errorResponse("This code is unavailable or has no votes remaining.", 409);
      return NextResponse.json({
        id: voteId,
        codeId,
        nomineeId,
        categoryId,
        createdAt: createdAt.toISOString(),
      }, { status: 201 });
    }

    if (body.action === "register-nominee") {
      const { name, categoryId, email, phone, bio, photoDataUrl } = body;
      if (typeof name !== "string" || name.trim().length < 2 || name.length > 120 ||
        typeof categoryId !== "string" || !categories.some((category) => category.id === categoryId) ||
        typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof phone !== "string" || phone.trim().length < 7 || phone.length > 32 ||
        typeof bio !== "string" || bio.trim().length < 20 || bio.length > 5000 ||
        !validPhoto(photoDataUrl)) {
        return errorResponse("Complete each field with valid nominee details and an image no larger than 1 MB.", 400);
      }

      const nominee = await prisma.registeredNominee.create({
        data: {
          id: randomUUID(),
          sessionId,
          name: name.trim(),
          detail: "Registered nominee",
          accent: "#b5a4f5",
          categoryId,
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          bio: bio.trim(),
          photoDataUrl,
        },
      });
      return NextResponse.json({
        id: nominee.id,
        name: nominee.name,
        detail: nominee.detail,
        accent: nominee.accent,
        categoryId: nominee.categoryId,
        email: nominee.email,
        phone: nominee.phone,
        bio: nominee.bio,
        photoDataUrl: nominee.photoDataUrl,
        createdAt: nominee.createdAt.toISOString(),
      }, { status: 201 });
    }

    return errorResponse("Unknown data operation.", 400);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse("The request body must contain valid JSON.", 400);
    }
    if (error instanceof Error && error.message === "The submitted data is too large.") {
      return errorResponse(error.message, 413);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return errorResponse("This value is already in use. Please try again.", 409);
    }

    logDatabaseError("Failed to save voter data to PostgreSQL.", error);
    return errorResponse("Your changes could not be saved. Please try again.", 503);
  }
}
