"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import {
  DEMO_STORAGE_KEY,
  EMPTY_DEMO_STATE,
  isDemoState,
  type DemoState,
} from "@/lib/demo-state";

type DemoContextValue = {
  state: DemoState;
  ready: boolean;
  error: string | null;
  commit: (nextState: DemoState) => boolean;
  clearError: () => void;
};

const serverValue: DemoContextValue = {
  state: EMPTY_DEMO_STATE,
  ready: false,
  error: null,
  commit: () => false,
  clearError: () => undefined,
};

let snapshot = serverValue;
let initialized = false;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function initializeFromBrowser() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const stored = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (!isDemoState(parsed)) {
        throw new Error("Saved data has an unsupported format.");
      }
      snapshot = {
        ...serverValue,
        state: {
          codes: parsed.codes,
          votes: parsed.votes,
          registeredNominees: parsed.registeredNominees ?? [],
        },
        ready: true,
      };
    } else {
      snapshot = { ...serverValue, ready: true };
    }
  } catch (loadError) {
    snapshot = {
      ...serverValue,
      ready: true,
      error: loadError instanceof Error
        ? `Your saved demo data could not be loaded: ${loadError.message}`
        : "Your saved demo data could not be loaded.",
    };
  }
}

function getSnapshot() {
  initializeFromBrowser();
  return typeof window === "undefined" ? serverValue : snapshot;
}

function getServerSnapshot() {
  return serverValue;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function commit(nextState: DemoState) {
  initializeFromBrowser();
  try {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(nextState));
    snapshot = { ...snapshot, state: nextState, ready: true, error: null };
    notify();
    return true;
  } catch (saveError) {
    snapshot = {
      ...snapshot,
      ready: true,
      error: saveError instanceof Error
        ? `Your changes could not be saved: ${saveError.message}`
        : "Your changes could not be saved.",
    };
    notify();
    return false;
  }
}

function clearError() {
  if (!snapshot.error) return;
  snapshot = { ...snapshot, error: null };
  notify();
}

const DemoContext = createContext<DemoContextValue>(serverValue);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <DemoContext.Provider value={{ ...current, commit, clearError }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoState() {
  return useContext(DemoContext);
}
