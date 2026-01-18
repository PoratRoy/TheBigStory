'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Icons } from '@/style/icons';
import { useTimeline } from '@/context/TimelineContext';
import styles from './ProfileMenu.module.css';

export default function ProfileMenu() {
  const { data: session } = useSession();
  const user = session?.user;
  const { categories } = useTimeline();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const uniqueCategories = categories.filter(cat => cat.isUnique);

  return (
    <div className={styles.profileWrapper}>
      {/* Profile Button */}
      <button className={styles.profileButton} onClick={toggleMenu} aria-label="תפריט פרופיל">
        {user?.image ? (
          <img src={user.image} alt={user.name || 'User'} className={styles.profileImage} />
        ) : (
          <div className={styles.profileImage} />
        )}
      </button>

      {/* Overlay / Blur */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`} 
        onClick={toggleMenu}
      />

      {/* Side Panel */}
      <aside className={`${styles.sidePanel} ${isOpen ? styles.sidePanelOpen : ''}`}>
            <div className={styles.panelHeader}>
              <span className={styles.userName}>{user?.name || 'משתמש'}</span>
              <button className={styles.closeButton} onClick={toggleMenu} aria-label="סגור">
                <Icons.Close />
              </button>
            </div>

            <nav className={styles.sideNav}>
              <ul className={styles.menuList}>
                <li className={styles.menuItem}>
                  <Link href="/" className={styles.menuLink} onClick={() => setIsOpen(false)}>
                    <span className={styles.menuIcon}>
                      <Icons.ViewGrid />
                    </span>
                    <span>דף הבית</span>
                  </Link>
                </li>

                {uniqueCategories.length > 0 && (
                  <>
                    <li className={styles.menuDivider}>
                      <span>קטגוריות</span>
                    </li>
                    {uniqueCategories.map(cat => (
                      <li key={cat.id} className={styles.menuItem}>
                        <Link 
                          href={`/category/${cat.id}`} 
                          className={styles.menuLink} 
                          onClick={() => setIsOpen(false)}
                        >
                          <span 
                            className={styles.categoryCircle} 
                            style={{ backgroundColor: cat.color || '#3b82f6' }} 
                          />
                          <span>{cat.name}</span>
                        </Link>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </nav>

            <div className={styles.panelFooter}>
              <Link href="/manage-uniqe" className={styles.menuLink} onClick={() => setIsOpen(false)}>
                <span className={styles.menuIcon}>
                  <Icons.List />
                </span>
                <span>ניהול קטגוריות</span>
              </Link>
              <Link href="/settings" className={styles.menuLink} onClick={() => setIsOpen(false)}>
                <span className={styles.menuIcon}>
                  <Icons.Update />
                </span>
                <span>הגדרות</span>
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/sign-in' })} 
                className={`${styles.menuLink} ${styles.logoutBtn}`}
              >
                <span className={styles.logoutIcon}>
                  <Icons.Logout />
                </span>
                <span>יציאה</span>
              </button>
            </div>
      </aside>
    </div>
  );
}
