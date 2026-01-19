'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/style/icons';
import { useLayout } from '@/context/LayoutContext';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import Search from '../Search/Search';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { viewMode, setViewMode } = useLayout();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Define paths that should hide the global TopBar and BottomBar
  const isFormPage = 
    pathname === '/add-event' || 
    pathname === '/add-category' || 
    pathname === '/settings' ||
    pathname === '/manage-uniqe' ||
    pathname.startsWith('/edit-category/') ||
    pathname.startsWith('/edit-event/');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (isFormPage) {
    return <div className={styles.layout} dir="rtl">{children}</div>;
  }

  const viewOptions = [
    { mode: 'grid', label: 'גריד', icon: <Icons.ViewGrid /> },
    { mode: 'timeline', label: 'ציר זמן', icon: <Icons.ViewTimeline /> },
    { mode: 'story', label: 'סיפור', icon: <Icons.Book /> },
  ] as const;

  return (
    <div className={styles.layout} dir="rtl">
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarRight}>
          <ProfileMenu />
          <h1 className={styles.appName}>הסיפור הגדול</h1>
        </div>

        {/* Center: Desktop Search */}
        <div className={styles.topBarCenter}>
          <Search isAlwaysOpen />
        </div>

        <div className={styles.topBarLeft}>
          {/* Mobile Search */}
          <div className={styles.mobileSearch}>
          <Search />
          </div>
          
          {/* Desktop View Toggle */}
          <div className={styles.viewToggleDesktop}>
            {viewOptions.map((opt) => (
              <button
                key={opt.mode}
                className={`${styles.viewToggleButton} ${viewMode === opt.mode ? styles.viewToggleButtonActive : ''}`}
                onClick={() => setViewMode(opt.mode)}
                title={opt.label}
              >
                {opt.icon}
              </button>
            ))}
          </div>

          {/* Mobile View Toggle (Eye icon + Dropdown) */}
          <div className={styles.mobileViewToggle} ref={dropdownRef}>
            <button 
              className={styles.iconButton} 
              aria-label="החלף תצוגה" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Icons.Eye />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  className={styles.viewDropdown}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  {viewOptions.map((opt) => (
                    <button
                      key={opt.mode}
                      className={`${styles.dropdownItem} ${viewMode === opt.mode ? styles.dropdownItemActive : ''}`}
                      onClick={() => {
                        setViewMode(opt.mode);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Actions */}
          <div className={styles.topBarActions}>
            <Link href="/add-category" className={styles.topBarButton}>
              <Icons.AddCategory />
              <span>הוספת תקופה</span>
            </Link>
            <Link href="/add-event" className={styles.topBarButton}>
              <Icons.AddEvent />
              <span>הוספת אירוע</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>

      {/* Bottom Bar */}
      <nav className={styles.bottomBar}>
        <Link href="/add-category" className={styles.bottomButton}>
          <div className={styles.iconWrapper}>
            <Icons.AddCategory />
          </div>
          <span className={styles.btnText}>הוספת תקופה</span>
        </Link>
        <Link href="/add-event" className={styles.bottomButton}>
          <div className={styles.iconWrapper}>
            <Icons.AddEvent />
          </div>
          <span className={styles.btnText}>הוספת אירוע</span>
        </Link>
      </nav>
    </div>
  );
}
