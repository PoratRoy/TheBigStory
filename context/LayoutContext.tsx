'use client';

import React, { createContext, useContext, useState } from 'react';

type ViewMode = 'grid' | 'timeline';

interface LayoutContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'grid' ? 'timeline' : 'grid'));
  };

  return (
    <LayoutContext.Provider value={{ 
      viewMode, 
      setViewMode, 
      toggleViewMode,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
