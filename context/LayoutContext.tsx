'use client';

import React, { createContext, useContext, useState } from 'react';

type ViewMode = 'grid' | 'timeline' | 'story';

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
    setViewMode((prev) => {
      if (prev === 'grid') return 'timeline';
      if (prev === 'timeline') return 'story';
      return 'grid';
    });
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
