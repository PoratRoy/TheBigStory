import React, { useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/models/interface/category';
import { useTimeline } from '@/context/TimelineContext';
import { useLayout } from '@/context/LayoutContext';
import styles from './TimelineView.module.css';

interface TimelineViewProps {
  categories: Category[];
}

export const TimelineView = ({ categories }: TimelineViewProps) => {
  const router = useRouter();
  const { timeline } = useTimeline();
  const { searchQuery } = useLayout();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasInitialScrolled = useRef(false);
  const YEAR_WIDTH = 160;

  const timelineYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const minYear = timeline?.startYear || 1998;
    const maxYear = currentYear;
    
    const years = [];
    for (let y = minYear; y <= maxYear; y++) {
      years.push(y);
    }
    return { years, start: minYear };
  }, [timeline?.startYear]);

  // Jump to snapDefault on mount
  useEffect(() => {
    if (timeline?.snapDefault && wrapperRef.current && !hasInitialScrolled.current) {
      const snapYear = timeline.snapDefault;
      const startYear = timelineYears.start;
      
      const scrollPosition = (snapYear - startYear) * YEAR_WIDTH;
      const containerWidth = wrapperRef.current.offsetWidth;
      
      const timer = setTimeout(() => {
        if (wrapperRef.current) {
          wrapperRef.current.scrollTo({
            left: Math.max(0, scrollPosition - (containerWidth / 2) + (YEAR_WIDTH / 2)),
            behavior: 'auto'
          });
          hasInitialScrolled.current = true;
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [timeline?.snapDefault, timelineYears.start]);

  // Jump to first filtered category when searching
  useEffect(() => {
    if (searchQuery && categories.length > 0 && wrapperRef.current) {
      const firstCat = categories[0];
      const catStart = firstCat.startYear || timelineYears.start;
      const scrollPosition = (catStart - timelineYears.start) * YEAR_WIDTH;
      
      wrapperRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [searchQuery, categories, timelineYears.start]);

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
    <div className={styles.timelineWrapper} ref={wrapperRef}>
      <div 
        className={styles.timelineContent} 
        style={{ width: (timelineYears.years.length * YEAR_WIDTH) + 20 }}
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
                
                // 10 is the side padding from CSS. YEAR_WIDTH / 2 centers it on the line.
                const left = (catStart - timelineYears.start) * YEAR_WIDTH + 10 + (YEAR_WIDTH / 2);
                const width = Math.max(0, (catEnd - catStart) * YEAR_WIDTH - 4); // 4px gap
                
                return (
                  <button 
                    key={category.id}
                    className={styles.timelineCategory}
                    onClick={() => router.push(`/category/${category.id}`)}
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
