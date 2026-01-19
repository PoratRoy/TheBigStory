'use client';

import React from 'react';
import { useTimeline } from '@/context/TimelineContext';
import { useLayout } from '@/context/LayoutContext';
import { Icons } from '@/style/icons';
import { TimelineView } from './TimelineView/TimelineView';
import { GridView } from './GridView/GridView';
import { StoryView } from './StoryView/StoryView';
import styles from './MainView.module.css';

export default function MainView() {
  const { categories, events, isLoading, error } = useTimeline();
  const { viewMode, searchQuery } = useLayout();

  const filteredCategories = categories.filter(category => 
    !category.isUnique && category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className={styles.loading}>
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

  if (filteredCategories.length === 0 && searchQuery !== '') {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>
          <Icons.Search />
        </div>
        <p>לא נמצאו תוצאות עבור "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {viewMode === 'grid' && <GridView categories={filteredCategories} />}
      {viewMode === 'timeline' && <TimelineView categories={filteredCategories} />}
      {viewMode === 'story' && <StoryView categories={filteredCategories} events={events} />}
    </div>
  );
}
