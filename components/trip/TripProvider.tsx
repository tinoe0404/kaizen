"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  TripState,
  DerivedTrip,
  initialTrip,
  tripReducer,
  sanitizeTrip,
  derive,
} from "@/lib/trip";
import { Currency } from "@/content/currency";

const STORAGE_KEY = "kaizen-trip-v1";

interface TripContextValue {
  state: TripState;
  derived: DerivedTrip;
  isReady: boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  setDates: (arrival: string, departure: string) => void;
  setGuests: (n: number) => void;
  setCurrency: (c: Currency) => void;
  clear: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tripReducer, initialTrip);
  const [isReady, setIsReady] = useState(false);
  const initialLoadDoneRef = useRef(false);

  // Read from storage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const sanitized = sanitizeTrip(parsed);
        dispatch({ type: "HYDRATE", state: sanitized });
      }
    } catch {
      // Storage access blocked or invalid, proceed with default
    } finally {
      setIsReady(true);
      initialLoadDoneRef.current = true;
    }
  }, []);

  // Save to storage on every state change after initial load
  useEffect(() => {
    if (!initialLoadDoneRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable / quota exceeded
    }
  }, [state]);

  const add = useCallback((id: string) => dispatch({ type: "ADD", id }), []);
  const remove = useCallback(
    (id: string) => dispatch({ type: "REMOVE", id }),
    []
  );
  const toggle = useCallback(
    (id: string) => dispatch({ type: "TOGGLE", id }),
    []
  );
  const setDates = useCallback(
    (arrival: string, departure: string) =>
      dispatch({ type: "SET_DATES", arrival, departure }),
    []
  );
  const setGuests = useCallback(
    (guests: number) => dispatch({ type: "SET_GUESTS", guests }),
    []
  );
  const setCurrency = useCallback(
    (currency: Currency) => dispatch({ type: "SET_CURRENCY", currency }),
    []
  );
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const derived = useMemo(() => derive(state), [state]);

  const value = useMemo(
    () => ({
      state,
      derived,
      isReady,
      add,
      remove,
      toggle,
      setDates,
      setGuests,
      setCurrency,
      clear,
    }),
    [
      state,
      derived,
      isReady,
      add,
      remove,
      toggle,
      setDates,
      setGuests,
      setCurrency,
      clear,
    ]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip(): TripContextValue {
  const ctx = useContext(TripContext);
  if (!ctx) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return ctx;
}

