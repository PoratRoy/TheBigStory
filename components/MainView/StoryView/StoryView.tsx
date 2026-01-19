import React, { useMemo, useRef } from 'react';
import { Event } from '@/models/interface/event';
import { Category } from '@/models/interface/category';
import styles from './StoryView.module.css';

interface StoryViewProps {
  categories: Category[];
  events: Event[];
}

export const StoryView = ({ categories, events }: StoryViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Group events by category
  const groupedStory = useMemo(() => {
    return categories.map(category => {
      const categoryEvents = events
        .filter(e => e.categories?.some(cat => cat.id === category.id))
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      
      return {
        ...category,
        events: categoryEvents
      };
    }).filter(group => group.events.length > 0); // Only show categories with events
  }, [categories, events]);

  const scrollToCategory = (id: string) => {
    const element = document.getElementById(`story-cat-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* Navigation - Desktop Only */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <h4 className={styles.navTitle}>תקופות</h4>
          <ul className={styles.navList}>
            {groupedStory.map(cat => (
              <li key={cat.id}>
                <button 
                  className={styles.navItem} 
                  onClick={() => scrollToCategory(cat.id)}
                >
                  <span 
                    className={styles.navColor} 
                    style={{ backgroundColor: cat.color || '#3b82f6' }} 
                  />
                  <span className={styles.navText}>{cat.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Story Content */}
      <div className={styles.content} ref={containerRef}>
        <div className={styles.storyList}>
          {groupedStory.map(group => (
            <section 
              key={group.id} 
              id={`story-cat-${group.id}`} 
              className={styles.categorySection}
            >
              <div className={styles.storyCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.categoryTitle}>
                    {group.name}
                  </h2>
                  <span className={styles.categoryYears}>
                    {group.startYear} - {group.endYear || 'היום'}
                  </span>
                </div>
                
                <div className={styles.storyText}>
                  {group.events.map(event => (
                    <p key={event.id} className={styles.eventParagraph}>
                      {event.text}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          ))}
          
          {groupedStory.length === 0 && (
            <div className={styles.empty}>
              <p>אין אירועים להצגה בסיפור.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
