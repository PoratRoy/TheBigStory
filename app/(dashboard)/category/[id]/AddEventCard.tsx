'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimeline } from '@/context/TimelineContext';
import { TextArea } from '@/components/Form/TextArea';
import { Icons } from '@/style/icons';
import styles from './AddEventCard.module.css';

interface AddEventCardProps {
  currentCategoryId: string;
}

export function AddEventCard({ currentCategoryId }: AddEventCardProps) {
  const { categories, addNewEvent } = useTimeline();
  const [text, setText] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([currentCategoryId]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Ensure current category is always selected
  useEffect(() => {
    if (!selectedCategoryIds.includes(currentCategoryId)) {
      setSelectedCategoryIds(prev => [currentCategoryId, ...prev]);
    }
  }, [currentCategoryId, selectedCategoryIds]);

  // Sort categories: current one first, then the rest
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.id === currentCategoryId) return -1;
    if (b.id === currentCategoryId) return 1;
    return 0;
  });

  const toggleCategory = (id: string) => {
    // Cannot deselect the current category
    if (id === currentCategoryId) return;
    
    setSelectedCategoryIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleSave = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!text.trim()) {
      setError('אנא הכנס טקסט לאירוע');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await addNewEvent({
      text,
      categoryIds: selectedCategoryIds,
      position: 0, // Always at top
    });

    if (result.success) {
      setText('');
      // Reset selected categories to just the current one
      setSelectedCategoryIds([currentCategoryId]);
    } else {
      setError(result.error || 'שגיאה בשמירת האירוע');
    }
    setIsSubmitting(false);
  };

  return (
    <div className={`${styles.card} ${!isExpanded ? styles.collapsedCard : ''}`}>
      {/* 1. Categories Row + Add Button (Top) */}
      <div className={styles.topRow} onClick={() => !isExpanded && setIsExpanded(true)}>
        <button 
          className={styles.addBtn} 
          onClick={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className={styles.spinner}></div>
          ) : (
            'הוספה'
          )}
        </button>

        <div className={styles.categoryScroll}>
          {sortedCategories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(cat.id);
              }}
              className={`${styles.categoryTag} ${selectedCategoryIds.includes(cat.id) ? styles.selected : ''}`}
              style={{ 
                backgroundColor: selectedCategoryIds.includes(cat.id) ? cat.color || '#3b82f6' : 'rgba(255,255,255,0.05)',
                borderColor: selectedCategoryIds.includes(cat.id) ? cat.color || '#3b82f6' : 'transparent',
                color: selectedCategoryIds.includes(cat.id) ? 'white' : 'var(--text-color)'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <button 
          className={styles.collapseBtn} 
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <Icons.ChevronDown /> : <Icons.ChevronUp />}
        </button>
      </div>

      {/* 2. Animated Content Area */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={styles.animatedContent}
          >
            <div className={styles.editorWrapper}>
              <TextArea 
                value={text} 
                onChange={setText} 
                placeholder="מה קרה הפעם? ספר את הסיפור..."
                isSmall
                autoResize
              />
            </div>
            
            {error && (
              <div className={styles.errorContainer}>
                <p className={styles.errorText}>{error}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
