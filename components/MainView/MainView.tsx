'use client';

import React from 'react';
import { useTimeline } from '@/context/TimelineContext';
import { useLayout } from '@/context/LayoutContext';
import { Icons } from '@/components/Icons';
import { TimelineView } from './TimelineView/TimelineView';
import { GridView } from './GridView/GridView';
import styles from './MainView.module.css';

export default function MainView() {
  const { categories, isLoading, error } = useTimeline();
  const { viewMode } = useLayout();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Icons.Reorder />
        <p>טוען את הסיפור שלך...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <Icons.AddEvent />
        <p>{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>
          <Icons.AddCategory />
        </div>
        <p>עדיין אין תקופות. הגיע הזמן להוסיף את הראשונה!</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {viewMode === 'grid' ? (
        <GridView categories={categories} />
      ) : (
        <TimelineView categories={categories} />
      )}
    </div>
  );
}
