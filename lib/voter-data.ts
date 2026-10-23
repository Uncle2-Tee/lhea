import "server-only";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { DemoState } from "@/lib/demo-state";

const SESSION_COOKIE = "lhea-voter-session";
const SESSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getVoterSessionId() {
  const cookieStore = await cookies();
  const savedId = cookieStore.get(SESSION_COOKIE)?.value;
  const id = savedId && SESSION_ID_PATTERN.test(savedId) ? savedId : randomUUID();

  await prisma.browserSession.upsert({
    where: { id },
    update: { lastSeenAt: new Date() },
    create: { id },
  });

  if (id !== savedId) {
    cookieStore.set(SESSION_COOKIE, id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return id;
}

export async function readVoterState(sessionId: string): Promise<DemoState> {
  const [codes, votes, registeredNominees] = await Promise.all([
    prisma.votingCode.findMany({ where: { sessionId }, orderBy: { createdAt: "desc" } }),
    prisma.demoVote.findMany({ where: { sessionId }, orderBy: { createdAt: "desc" } }),
    prisma.registeredNominee.findMany({ where: { sessionId }, orderBy: { createdAt: "desc" } }),
  ]);

  return {
    codes: codes.map((code) => ({
      id: code.id,
      value: code.value,
      total: code.total,
      remaining: code.remaining,
      createdAt: code.createdAt.toISOString(),
    })),
    votes: votes.map((vote) => ({
      id: vote.id,
      codeId: vote.codeId,
      nomineeId: vote.nomineeId,
      categoryId: vote.categoryId,
      createdAt: vote.createdAt.toISOString(),
    })),
    registeredNominees: registeredNominees.map((nominee) => ({
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
    })),
  };
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
