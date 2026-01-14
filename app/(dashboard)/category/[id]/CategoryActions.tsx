'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/style/icons';
import styles from './CategoryActions.module.css';

interface CategoryActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const CategoryActions: React.FC<CategoryActionsProps> = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button 
        className={`${styles.dotsButton} ${isOpen ? styles.dotsButtonActive : ''}`}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="פעולות קטגוריה"
      >
        <Icons.Dots />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="menu"
          >
            <button 
              className={styles.menuItem} 
              onClick={() => handleAction(onEdit)}
              role="menuitem"
            >
              <span className={styles.icon}><Icons.Update /></span>
              <span>ערוך תקופה</span>
            </button>
            <button 
              className={`${styles.menuItem} ${styles.deleteItem}`} 
              onClick={() => handleAction(onDelete)}
              role="menuitem"
            >
              <span className={styles.icon}><Icons.Delete /></span>
              <span>מחק תקופה</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
