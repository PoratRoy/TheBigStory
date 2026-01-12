'use client';

import React from 'react';
import { useTimeline } from '@/context/TimelineContext';
import styles from './page.module.css';

export default function DashboardPage() {
  const { categories, isLoading, error } = useTimeline();

  if (isLoading) {
    return <div className={styles.loading}>טוען...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (categories.length === 0) {
    return (
      <div className={styles.empty}>
        <p>אין קטגוריות להצגה. לחץ על הוספת תקופה כדי להתחיל.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {categories.map((category) => (
        <div key={category.id} className={styles.card}>
          <div 
            className={styles.cardTop} 
            style={{ backgroundColor: category.color || '#3b82f6' }} 
          />
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>{category.name}</h2>
            <span className={styles.cardYears}>
              {category.startYear && category.endYear 
                ? `${category.startYear}-${category.endYear}`
                : 'שנים לא הוגדרו'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
