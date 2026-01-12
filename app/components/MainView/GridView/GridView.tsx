import React from 'react';
import { Category } from '@/models/interface/category';
import styles from './GridView.module.css';

interface GridViewProps {
  categories: Category[];
}

export const GridView = ({ categories }: GridViewProps) => {
  return (
    <div className={styles.grid}>
      {categories.map((category) => (
        <div key={category.id} className={styles.gridCard}>
          <div 
            className={styles.cardTop} 
            style={{ backgroundColor: category.color || '#3b82f6' }} 
          />
          <div className={styles.cardContent}>
            <div className={styles.cardInfo}>
              <span className={styles.cardYears}>
                {category.startYear}-{category.endYear || 'היום'}
              </span>
              <div className={styles.separator} />
              <h2 className={styles.cardTitle}>{category.name}</h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
