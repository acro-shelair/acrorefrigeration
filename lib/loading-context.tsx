"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

interface LoadingCtx {
  markReady: () => void;
  isReady:   boolean;
}

const LoadingContext = createContext<LoadingCtx>({ markReady: () => {}, isReady: false });

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [dataReady,      setDataReady]      = useState(false);
  const [minTimePassed,  setMinTimePassed]  = useState(false);

  // Minimum display time — ensures the screen shows even on fast connections
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const markReady = useCallback(() => setDataReady(true), []);

  // Both the data AND the minimum time must be satisfied
  const isReady = dataReady && minTimePassed;

  return (
    <LoadingContext.Provider value={{ markReady, isReady }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
