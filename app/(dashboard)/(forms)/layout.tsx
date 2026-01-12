'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';
import ProfileMenu from '@/app/components/ProfileMenu/ProfileMenu';
import { Button } from '@/app/components/Form/Button';
import { FormLayoutProvider, useFormLayout } from '@/context/FormLayoutContext';
import styles from './FormLayout.module.css';

function FormLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { title, isSubmitting, submitButtonText, onSubmit } = useFormLayout();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.page} dir="rtl">
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerRight}>
          <ProfileMenu />
          <h1 className={styles.title}>{title}</h1>
        </div>
        <button onClick={handleBack} className={styles.backButton} aria-label="חזור">
          <Icons.Back />
        </button>
      </header>

      {/* Form Area */}
      <div className={styles.formArea}>
        {children}
      </div>

      {/* Bottom Action Area */}
      <div className={styles.bottomArea}>
        <Button 
          type="button" 
          onClick={() => onSubmit?.()}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'שומר...' : submitButtonText}
        </Button>
      </div>
    </div>
  );
}

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <FormLayoutProvider>
      <FormLayoutInner>{children}</FormLayoutInner>
    </FormLayoutProvider>
  );
}
