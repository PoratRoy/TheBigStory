'use client';

import React, { createContext, useContext, useState } from 'react';

interface FormLayoutContextType {
  title: string;
  setTitle: (title: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  submitButtonText: string;
  setSubmitButtonText: (text: string) => void;
  onSubmit: (() => void) | null;
  setOnSubmit: (fn: (() => void) | null) => void;
}

const FormLayoutContext = createContext<FormLayoutContextType | undefined>(undefined);

export function FormLayoutProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState('שמירה');
  const [onSubmit, setOnSubmit] = useState<(() => void) | null>(null);

  return (
    <FormLayoutContext.Provider value={{
      title,
      setTitle,
      isSubmitting,
      setIsSubmitting,
      submitButtonText,
      setSubmitButtonText,
      onSubmit,
      setOnSubmit
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
