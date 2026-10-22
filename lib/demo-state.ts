export type VotingCode = {
  id: string;
  value: string;
  total: number;
  remaining: number;
  createdAt: string;
};

export type DemoVote = {
  id: string;
  codeId: string;
  nomineeId: string;
  categoryId: string;
  createdAt: string;
};

export type RegisteredNominee = Nominee & {
  categoryId: string;
  email: string;
  phone: string;
  bio: string;
  photoDataUrl: string;
  createdAt: string;
};

type Nominee = {
  id: string;
  name: string;
  detail: string;
  accent: string;
};

export type DemoState = {
  codes: VotingCode[];
  votes: DemoVote[];
  registeredNominees: RegisteredNominee[];
};

export const EMPTY_DEMO_STATE: DemoState = {
  codes: [],
  votes: [],
  registeredNominees: [],
};

export const DEMO_STORAGE_KEY = "lhea-demo-v1";

export function isDemoState(value: unknown): value is DemoState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.voter === undefined || candidate.voter === null || isLegacyVoter(candidate.voter)) &&
    Array.isArray(candidate.codes) &&
    candidate.codes.every(isVotingCode) &&
    Array.isArray(candidate.votes) &&
    candidate.votes.every(isDemoVote) &&
    (candidate.registeredNominees === undefined ||
      (Array.isArray(candidate.registeredNominees) && candidate.registeredNominees.every(isRegisteredNominee)))
  );
}

function isLegacyVoter(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  const voter = value as Record<string, unknown>;
  return [voter.id, voter.name, voter.email, voter.phone].every((item) => typeof item === "string");
}

function isVotingCode(value: unknown): value is VotingCode {
  if (!value || typeof value !== "object") return false;
  const code = value as Record<string, unknown>;
  return (
    typeof code.id === "string" &&
    typeof code.value === "string" &&
    typeof code.total === "number" &&
    typeof code.remaining === "number" &&
    typeof code.createdAt === "string"
  );
}

function isDemoVote(value: unknown): value is DemoVote {
  if (!value || typeof value !== "object") return false;
  const vote = value as Record<string, unknown>;
  return (
    typeof vote.id === "string" &&
    typeof vote.codeId === "string" &&
    typeof vote.nomineeId === "string" &&
    typeof vote.categoryId === "string" &&
    typeof vote.createdAt === "string"
  );
}

export function isRegisteredNominee(value: unknown): value is RegisteredNominee {
  if (!value || typeof value !== "object") return false;
  const nominee = value as Record<string, unknown>;
  return [
    nominee.id,
    nominee.name,
    nominee.detail,
    nominee.accent,
    nominee.categoryId,
    nominee.email,
    nominee.phone,
    nominee.bio,
    nominee.photoDataUrl,
    nominee.createdAt,
  ].every((item) => typeof item === "string");
}
