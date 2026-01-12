'use client';

import React from 'react';
import { Icons } from '@/app/components/Icons';
import { useLayout } from '@/context/LayoutContext';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import Search from '../Search/Search';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { viewMode, toggleViewMode } = useLayout();

  return (
    <div className={styles.layout} dir="rtl">
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarRight}>
          <ProfileMenu />
          <h1 className={styles.appName}>הסיפור הגדול</h1>
        </div>
        <div className={styles.topBarLeft}>
          <Search />
          <button className={styles.iconButton} aria-label="החלף תצוגה" onClick={toggleViewMode}>
            {viewMode === 'grid' ? <Icons.ViewTimeline /> : <Icons.ViewGrid />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>

      {/* Bottom Bar */}
      <nav className={styles.bottomBar}>
        <button className={styles.bottomButton}>
          <div className={styles.iconWrapper}>
            <Icons.AddCategory />
          </div>
          <span className={styles.btnText}>הוספת תקופה</span>
        </button>
        <button className={styles.bottomButton}>
          <div className={styles.iconWrapper}>
            <Icons.AddEvent />
          </div>
          <span className={styles.btnText}>הוספת אירוע</span>
        </button>
      </nav>
    </div>
  );
}
