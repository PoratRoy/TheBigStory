import React, { useMemo } from 'react';
import { Category } from '@/models/interface/category';
import styles from './TimelineView.module.css';

interface TimelineViewProps {
  categories: Category[];
}

export const TimelineView = ({ categories }: TimelineViewProps) => {
  const YEAR_WIDTH = 160;

  const timelineYears = useMemo(() => {
    const currentYear = 2026;
    const minYear = categories.length > 0 ? Math.min(...categories.map(c => c.startYear || currentYear)) : 1998;
    const maxYear = 2026; // Always till current year as requested
    
    const years = [];
    for (let y = minYear; y <= maxYear; y++) {
      years.push(y);
    }
    return { years, start: minYear };
  }, [categories]);

  const rows: Category[][] = useMemo(() => {
    const sortedRows: Category[][] = [];
    const sortedCats = [...categories].sort((a, b) => (a.startYear || 0) - (b.startYear || 0));
    
    sortedCats.forEach(cat => {
      let placed = false;
      const catStart = cat.startYear || 0;
      for (let i = 0; i < sortedRows.length; i++) {
        const lastInRow = sortedRows[i][sortedRows[i].length - 1];
        if (catStart >= (lastInRow.endYear || lastInRow.startYear || 0)) {
          sortedRows[i].push(cat);
          placed = true;
          break;
        }
      }
      if (!placed) sortedRows.push([cat]);
    });
    return sortedRows;
  }, [categories]);

  if (categories.length === 0) return null;

  return (
    <div className={styles.timelineWrapper}>
      <div 
        className={styles.timelineContent} 
        style={{ width: (timelineYears.years.length - 1) * YEAR_WIDTH + 320 }}
      >
        <div className={styles.yearsScale}>
          {timelineYears.years.map(year => (
            <div key={year} className={styles.yearMarker} style={{ width: YEAR_WIDTH }}>
              <div className={styles.yearLine} />
              <span className={styles.yearLabel}>{year}</span>
            </div>
          ))}
        </div>

        <div className={styles.categoriesLayer}>
          {rows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map(category => {
                const catStart = category.startYear || timelineYears.start;
                const catEnd = Math.max(category.endYear || catStart, catStart + 1);
                
                const left = (catStart - timelineYears.start) * YEAR_WIDTH + (YEAR_WIDTH / 2);
                const width = (catEnd - catStart) * YEAR_WIDTH;
                
                return (
                  <button 
                    key={category.id}
                    className={styles.timelineCategory}
                    onClick={() => console.log('Category clicked:', category.name)}
                    style={{
                      backgroundColor: category.color || '#3b82f6',
                      left: left,
                      width: width, 
                      top: rowIndex * 50,
                    }}
                  >
                    {category.name}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
