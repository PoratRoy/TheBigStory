'use client';

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { Icons } from '@/app/components/Icons';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useUser();

  return (
    <div className={styles.layout} dir="rtl">
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarRight}>
          {user?.picture ? (
            <img src={user.picture} alt={user.name || 'User'} className={styles.profileImage} />
          ) : (
            <div className={styles.profileImage} />
          )}
          <h1 className={styles.appName}>הסיפור הגדול</h1>
        </div>
        <div className={styles.topBarLeft}>
          <button className={styles.iconButton} aria-label="חיפוש">
            <Icons.Search />
          </button>
          <button className={styles.iconButton} aria-label="החלף תצוגה">
            <Icons.ViewGrid />
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
