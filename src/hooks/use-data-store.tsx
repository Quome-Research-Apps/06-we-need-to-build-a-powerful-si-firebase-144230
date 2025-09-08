"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import type { AdherenceRecord } from '@/types';

type DataContextType = {
  data: AdherenceRecord[] | null;
  setData: (data: AdherenceRecord[] | null) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AdherenceRecord[] | null>(null);

  const value = useMemo(() => ({ data, setData }), [data]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataStore() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataStore must be used within a DataProvider');
  }
  return context;
}
