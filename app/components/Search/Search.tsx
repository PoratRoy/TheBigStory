'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '@/app/components/Icons';
import styles from './Search.module.css';

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className={styles.searchWrapper}>
      <button 
        className={styles.searchIconBtn} 
        onClick={toggleSearch} 
        aria-label="חיפוש"
        style={{ opacity: isOpen ? 0 : 1 }}
      >
        <Icons.Search />
      </button>

      <div className={`${styles.searchOverlay} ${isOpen ? styles.searchOverlayVisible : ''}`}>
        <button className={styles.closeSearchBtn} onClick={toggleSearch} aria-label="סגור חיפוש">
          <Icons.Close />
        </button>
        <input 
          ref={inputRef}
          type="text" 
          placeholder="חפש אירוע או תקופה..." 
          className={styles.searchInput}
          onBlur={() => {
            // Optional: close on blur if empty
            // if (!inputRef.current?.value) setIsOpen(false);
          }}
        />
        <div className={styles.searchIconInside}>
          <Icons.Search />
        </div>
      </div>
    </div>
  );
}
