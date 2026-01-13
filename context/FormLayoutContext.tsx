'use client';

import React, { createContext, useContext, useState } from 'react';

interface FormLayoutContextType {
  title: string;
  setTitle: (title: string) => void;
}

const FormLayoutContext = createContext<FormLayoutContextType | undefined>(undefined);

export function FormLayoutProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState('');

  return (
    <FormLayoutContext.Provider value={{
      title,
      setTitle
    }}>
      {children}
    </FormLayoutContext.Provider>
  );
}

export function useFormLayout() {
  const context = useContext(FormLayoutContext);
  if (context === undefined) {
    throw new Error('useFormLayout must be used within a FormLayoutProvider');
  }
  return context;
}
