'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/style/icons';
import { useLayout } from '@/context/LayoutContext';
import styles from './Search.module.css';

interface SearchProps {
  isAlwaysOpen?: boolean;
}

export default function Search({ isAlwaysOpen = false }: SearchProps) {
  const { searchQuery, setSearchQuery } = useLayout();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = isAlwaysOpen || isOpen;

  const toggleSearch = () => {
    if (!isAlwaysOpen) {
      if (isOpen) {
        setSearchQuery(''); // Clear search when closing
      }
    setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    if (active && inputRef.current && !isAlwaysOpen) {
      inputRef.current.focus();
    }
  }, [active, isAlwaysOpen]);

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
    <div className={`${styles.searchWrapper} ${isAlwaysOpen ? styles.alwaysOpen : ''}`}>
      {!isAlwaysOpen && (
      <button 
        className={styles.searchIconBtn} 
        onClick={toggleSearch} 
        aria-label="חיפוש"
          style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
        >
          <motion.div
            animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.8 : 1 }}
            transition={{ duration: 0.2 }}
      >
        <Icons.Search />
          </motion.div>
      </button>
      )}

      <AnimatePresence>
        {active && (
          <motion.div 
            className={`${styles.searchOverlay} ${isAlwaysOpen ? styles.desktopSearch : ''}`}
            initial={isAlwaysOpen ? false : { opacity: 0, scaleX: 0.9, x: -10 }}
            animate={{ opacity: 1, scaleX: 1, x: 0 }}
            exit={isAlwaysOpen ? { opacity: 1 } : { opacity: 0, scaleX: 0.9, x: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {!isAlwaysOpen && (
        <button className={styles.closeSearchBtn} onClick={toggleSearch} aria-label="סגור חיפוש">
          <Icons.Close />
        </button>
            )}
        <input 
          ref={inputRef}
          type="text" 
          placeholder="חפש אירוע או תקופה..." 
          className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className={styles.searchIconInside}>
          <Icons.Search />
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
