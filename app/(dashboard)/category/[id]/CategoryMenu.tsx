import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/style/icons';
import styles from './CategoryMenu.module.css';

interface CategoryMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onViewStory: () => void;
}

export const CategoryMenu: React.FC<CategoryMenuProps> = ({ onEdit, onDelete, onViewStory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={menuRef} onKeyDown={handleKeyDown}>
      <button
        className={styles.menuButton}
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="אפשרויות קטגוריה"
      >
        <div className={styles.mobileIcon}>
          <Icons.Eye />
        </div>
        <div className={styles.desktopIcon}>
          <Icons.DotsVert />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="menu"
            aria-orientation="vertical"
          >
            <button
              className={styles.dropdownItem}
              onClick={() => handleAction(onViewStory)}
              role="menuitem"
            >
              <Icons.Book />
              <span>קרא כסיפור</span>
            </button>
            <button
              className={styles.dropdownItem}
              onClick={() => handleAction(onEdit)}
              role="menuitem"
            >
              <Icons.Update />
              <span>ערוך תקופה</span>
            </button>
            <button
              className={`${styles.dropdownItem} ${styles.delete}`}
              onClick={() => handleAction(onDelete)}
              role="menuitem"
            >
              <Icons.Delete />
              <span>מחק תקופה</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
