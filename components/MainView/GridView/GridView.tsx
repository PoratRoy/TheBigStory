'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/models/interface/category';
import { useTimeline } from '@/context/TimelineContext';
import styles from './GridView.module.css';

interface GridViewProps {
  categories: Category[];
}

export const GridView = ({ categories }: GridViewProps) => {
  const router = useRouter();
  const { events } = useTimeline();

  const getEventCount = (categoryId: string) => {
    const count = events.filter(e => e.categories?.some(cat => cat.id === categoryId)).length;
    return count > 99 ? '99+' : count;
  };

  return (
    <div className={styles.grid}>
      {categories.map((category) => (
        <button 
          key={category.id} 
          className={styles.gridCard}
          onClick={() => router.push(`/category/${category.id}`)}
        >
          <div 
            className={styles.cardTop} 
            style={{ backgroundColor: category.color || '#3b82f6' }} 
          />
          <div className={styles.cardContent}>
            <div className={styles.eventCount} style={{ color: category.color || '#3b82f6' }}>
              {getEventCount(category.id)}
            </div>
            <div className={styles.cardInfo}>
              <h2 className={styles.cardTitle}>{category.name}</h2>
              <span className={styles.cardYears}>
                {category.startYear}-{category.endYear || 'היום'}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
