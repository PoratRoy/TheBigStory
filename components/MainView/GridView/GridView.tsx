'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/models/interface/category';
import styles from './GridView.module.css';

interface GridViewProps {
  categories: Category[];
}

export const GridView = ({ categories }: GridViewProps) => {
  const router = useRouter();

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
