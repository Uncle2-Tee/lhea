"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  DEMO_STORAGE_KEY,
  EMPTY_DEMO_STATE,
  isDemoState,
  type DemoState,
  type RegisteredNominee,
  type VotingCode,
} from "@/lib/demo-state";

type DemoContextValue = {
  state: DemoState;
  ready: boolean;
  error: string | null;
  createCode: (votes: number) => Promise<boolean>;
  castVote: (codeId: string, nomineeId: string, categoryId: string) => Promise<boolean>;
  registerNominee: (nominee: Omit<RegisteredNominee, "id" | "createdAt" | "detail" | "accent">) => Promise<string | null>;
};

const serverValue: DemoContextValue = {
  state: EMPTY_DEMO_STATE,
  ready: false,
  error: null,
  createCode: async () => false,
  castVote: async () => false,
  registerNominee: async () => null,
};

const DemoContext = createContext<DemoContextValue>(serverValue);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(EMPTY_DEMO_STATE);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postAction = useCallback(async (action: string, data: Record<string, unknown>) => {
    setError(null);
    try {
      const response = await fetch("/api/demo-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const message = result && typeof result === "object" &&
          "error" in result && typeof result.error === "string"
          ? result.error
          : "Your changes could not be saved. Please try again.";
        setError(message);
        return null;
      }
      return result;
    } catch (requestError) {
      setError(requestError instanceof Error
        ? `Your changes could not be saved: ${requestError.message}`
        : "Your changes could not be saved. Please try again.");
      return null;
    }
  }, []);

  const createCode = useCallback(async (votes: number) => {
    const result = await postAction("create-code", { votes });
    if (!result || typeof result !== "object" || !("id" in result) ||
      !("value" in result) || !("total" in result) || !("remaining" in result) ||
      !("createdAt" in result)) return false;

    const code = result as VotingCode;
    setState((current) => ({ ...current, codes: [code, ...current.codes] }));
    return true;
  }, [postAction]);

  const castVote = useCallback(async (codeId: string, nomineeId: string, categoryId: string) => {
    const result = await postAction("cast-vote", { codeId, nomineeId, categoryId });
    if (!result || typeof result !== "object" || !("id" in result) ||
      !("createdAt" in result)) return false;

    const vote = result as DemoState["votes"][number];
    setState((current) => ({
      ...current,
      codes: current.codes.map((code) =>
        code.id === codeId ? { ...code, remaining: code.remaining - 1 } : code,
      ),
      votes: [vote, ...current.votes],
    }));
    return true;
  }, [postAction]);

  const registerNominee = useCallback(async (
    nominee: Omit<RegisteredNominee, "id" | "createdAt" | "detail" | "accent">,
  ) => {
    const result = await postAction("register-nominee", nominee);
    if (!result || typeof result !== "object" || !("id" in result) ||
      !("createdAt" in result)) return null;

    const registeredNominee = result as RegisteredNominee;
    setState((current) => ({
      ...current,
      registeredNominees: [registeredNominee, ...current.registeredNominees],
    }));
    return registeredNominee.id;
  }, [postAction]);

  useEffect(() => {
    let cancelled = false;

    async function loadState() {
      try {
        const response = await fetch("/api/demo-state", { cache: "no-store" });
        const loaded: unknown = await response.json();
        if (!response.ok || !isDemoState(loaded)) {
          const message = loaded && typeof loaded === "object" &&
            "error" in loaded && typeof loaded.error === "string"
            ? loaded.error
            : "Your voting data could not be loaded. Please try again.";
          throw new Error(message);
        }

        let nextState = loaded;
        if (!loaded.codes.length && !loaded.votes.length && !loaded.registeredNominees.length) {
          const saved = window.localStorage.getItem(DEMO_STORAGE_KEY);
          if (saved) {
            const localState: unknown = JSON.parse(saved);
            if (!isDemoState(localState)) {
              throw new Error("Saved browser data has an unsupported format.");
            }
            if (localState.codes.length || localState.votes.length || localState.registeredNominees?.length) {
              const imported = await postAction("import-local-state", { state: localState });
              if (!imported || !isDemoState(imported)) {
                throw new Error("Saved browser data could not be imported; it remains in this browser.");
              }
              nextState = imported;
              window.localStorage.removeItem(DEMO_STORAGE_KEY);
            }
          }
        }

        if (!cancelled) {
          setState(nextState);
          setReady(true);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error
            ? loadError.message
            : "Your voting data could not be loaded. Please try again.");
        }
      }
    }

    void loadState();
    return () => {
      cancelled = true;
    };
  }, [postAction]);

  return (
    <DemoContext.Provider value={{ state, ready, error, createCode, castVote, registerNominee }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoState() {
  return useContext(DemoContext);
}
