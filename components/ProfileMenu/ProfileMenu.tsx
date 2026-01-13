'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Icons } from '@/style/icons';
import styles from './ProfileMenu.module.css';

export default function ProfileMenu() {
  const { data: session } = useSession();
  const user = session?.user;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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

            <nav>
              <ul className={styles.menuList}>
                <li className={styles.menuItem}>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/sign-in' })} 
                    className={styles.menuLink}
                    style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'right' }}
                  >
                    <span className={styles.logoutIcon}>
                      <Icons.Logout />
                    </span>
                    <span>יציאה</span>
                  </button>
                </li>
              </ul>
            </nav>
      </aside>
    </div>
  );
}
