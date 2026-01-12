'use client';

import React, { useMemo } from 'react';
import { useTimeline } from '@/context/TimelineContext';
import { useLayout } from '@/context/LayoutContext';
import { Icons } from '@/app/components/Icons';
import styles from './MainView.module.css';
import { Category } from '@/models/interface/category';

export default function MainView() {
  const { categories, isLoading, error } = useTimeline();
  const { viewMode } = useLayout();

  // For demonstration when no data exists, we'll use some mock data matching the vision
  const displayCategories = useMemo(() => {
    if (categories.length > 0) return categories;
    
    // Mock data based on the provided images
    return [
      { id: '1', name: 'ילדות', startYear: 1998, endYear: 2001, color: '#c0634d' },
      { id: '2', name: 'יסודי', startYear: 2001, endYear: 2010, color: '#b7b43f' },
      { id: '3', name: 'כיתה א', startYear: 2001, endYear: 2003, color: '#4db68d' },
      { id: '4', name: 'כיתה ב', startYear: 2003, endYear: 2005, color: '#4d75c0' },
      { id: '5', name: 'חו"ל - רומן...', startYear: 2003, endYear: 2004, color: '#914dc0' },
      { id: '6', name: 'כיתה ג', startYear: 2005, endYear: 2007, color: '#6bc04d' },
      { id: '7', name: 'טיול ארוך ע...', startYear: 1998, endYear: 2001, color: '#c0854d' },
    ] as Category[];
  }, [categories]);

  const timelineYears = useMemo(() => {
    const start = Math.min(...displayCategories.map(c => c.startYear || 1998));
    const end = Math.max(...displayCategories.map(c => c.endYear || 2026), 2004);
    const years = [];
    for (let y = start; y <= end; y++) {
      years.push(y);
    }
    return { years, start };
  }, [displayCategories]);

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

  const renderGridView = () => (
    <div className={styles.grid}>
      {displayCategories.map((category) => (
        <div key={category.id} className={styles.gridCard}>
          <div 
            className={styles.cardTop} 
            style={{ backgroundColor: category.color || '#3b82f6' }} 
          />
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>{category.name}</h2>
            <div className={styles.cardYears}>
              <span>{category.startYear}</span>
              <div className={styles.separator} />
              <span>{category.endYear || 'היום'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTimelineView = () => {
    const YEAR_WIDTH = 100;
    
    // Sort categories into rows to prevent overlap
    const rows: Category[][] = [];
    displayCategories.forEach(cat => {
      let placed = false;
      for (let i = 0; i < rows.length; i++) {
        const lastInRow = rows[i][rows[i].length - 1];
        if ((cat.startYear || 0) >= (lastInRow.endYear || 0)) {
          rows[i].push(cat);
          placed = true;
          break;
        }
      }
      if (!placed) rows.push([cat]);
    });

    return (
      <div className={styles.timelineWrapper}>
        <div 
          className={styles.timelineContent} 
          style={{ width: timelineYears.years.length * YEAR_WIDTH + 100 }}
        >
          {/* Years Scale */}
          <div className={styles.yearsScale}>
            {timelineYears.years.map(year => (
              <div key={year} className={styles.yearMarker} style={{ width: YEAR_WIDTH }}>
                <div className={styles.yearLine} />
                <span className={styles.yearLabel}>{year}</span>
              </div>
            ))}
          </div>

          {/* Categories Bars */}
          <div className={styles.categoriesLayer}>
            {rows.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map(category => {
                  const left = ((category.startYear || timelineYears.start) - timelineYears.start) * YEAR_WIDTH;
                  const width = ((category.endYear || category.startYear || timelineYears.start) - (category.startYear || timelineYears.start)) * YEAR_WIDTH;
                  
                  return (
                    <div 
                      key={category.id}
                      className={styles.timelineCategory}
                      style={{
                        backgroundColor: category.color || '#3b82f6',
                        left: left,
                        width: Math.max(width, 80), // Min width to show text
                        top: rowIndex * 45, // Vertical spacing
                      }}
                    >
                      {category.name}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {viewMode === 'grid' ? renderGridView() : renderTimelineView()}
    </div>
  );
}
