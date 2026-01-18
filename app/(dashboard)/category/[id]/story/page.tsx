'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTimeline } from '@/context/TimelineContext';
import { Icons } from '@/style/icons';
import ProfileMenu from '@/components/ProfileMenu/ProfileMenu';
import styles from './story.module.css';

export default function CategoryStoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const { categories, events, isLoading } = useTimeline();

  const category = categories.find(c => c.id === id);
  
  const categoryEvents = useMemo(() => {
    if (!events.length || !id) return [];
    return events
      .filter(e => e.categories?.some(cat => cat.id === id))
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }, [events, id]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>טוען...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className={styles.loading}>
        <p>קטגוריה לא נמצאה</p>
        <button className={styles.backLink} onClick={() => router.push('/')}>חזור למסך הראשי</button>
      </div>
    );
  }

  return (
    <div className={styles.page} dir="rtl">
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerRight}>
          <ProfileMenu />
          <h1 className={styles.title}>
            {category.name} - הסיפור
          </h1>
        </div>
        <button onClick={() => router.back()} className={styles.backButton} aria-label="חזור">
          <Icons.Back />
        </button>
      </header>

      {/* Story Content */}
      <main className={styles.mainContent}>
        <div className={styles.storyCard}>
          {categoryEvents.length === 0 ? (
            <p className={styles.empty}>אין אירועים בתקופה זו עדיין.</p>
          ) : (
            <div className={styles.storyText}>
              {categoryEvents.map((event, index) => (
                <p key={event.id} className={styles.eventParagraph}>
                  {event.text}
                </p>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
