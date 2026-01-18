'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/style/icons';
import { useLayout } from '@/context/LayoutContext';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import Search from '../Search/Search';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { viewMode, toggleViewMode } = useLayout();
  const pathname = usePathname();

  // Define paths that should hide the global TopBar and BottomBar
  const isFormPage = 
    pathname === '/add-event' || 
    pathname === '/add-category' || 
    pathname === '/settings' ||
    pathname === '/manage-uniqe' ||
    pathname.startsWith('/edit-category/');

  if (isFormPage) {
    return <div className={styles.layout} dir="rtl">{children}</div>;
  }

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
          
          <button className={styles.iconButton} aria-label="החלף תצוגה" onClick={toggleViewMode}>
            {viewMode === 'grid' ? <Icons.ViewTimeline /> : <Icons.ViewGrid />}
          </button>

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
