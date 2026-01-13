'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTimeline } from '@/context/TimelineContext';
import { useFormLayout } from '@/context/FormLayoutContext';
import RichTextEditor from '@/components/Form/RichTextEditor/RichTextEditor';
import { Button } from '@/components/Form/Button';
import styles from './page.module.css';
import formStyles from '@/components/Form/Form.module.css';

export default function AddEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, addNewEvent } = useTimeline();
  const { setTitle } = useFormLayout();
  
  const [text, setText] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle('אירוע חדש');
    
    // Set initial category from query param if available
    const categoryId = searchParams.get('categoryId');
    if (categoryId) {
      setSelectedCategoryIds([categoryId]);
    } else if (categories.length > 0) {
      // Default to first category if none provided
      setSelectedCategoryIds([categories[0].id]);
    }
  }, [setTitle, searchParams, categories]);

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const strippedContent = text.replace(/<[^>]*>?/gm, '').trim();
    if (!strippedContent) {
      setError('אנא הכנס טקסט לאירוע');
      return;
    }

    if (selectedCategoryIds.length === 0) {
      setError('אנא בחר לפחות קטגוריה אחת');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await addNewEvent({
      text,
      categoryIds: selectedCategoryIds,
      position: 0, // Default to top for new events
    });

    if (result.success) {
      // Navigate back to the first selected category's page or home
      const returnId = selectedCategoryIds[0];
      router.push(`/category/${returnId}`);
    } else {
      setError(result.error || 'שגיאה בשמירת האירוע');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={formStyles.formCard}>
      <div className={styles.form}>
        <div className={styles.editorContainer}>
          <RichTextEditor 
            value={text} 
            onChange={setText} 
            placeholder="מה קרה הפעם? ספר את הסיפור..."
          />
        </div>

        <div className={styles.categorySection}>
          <h3 className={styles.sectionTitle}>שיוך לקטגוריות</h3>
          <div className={styles.categoryList}>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`${styles.categoryTag} ${selectedCategoryIds.includes(cat.id) ? styles.selected : ''}`}
                style={{ 
                  backgroundColor: selectedCategoryIds.includes(cat.id) ? cat.color || '#3b82f6' : 'rgba(255,255,255,0.05)',
                  borderColor: cat.color || '#3b82f6',
                  color: selectedCategoryIds.includes(cat.id) ? 'white' : 'var(--text-color)'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {categories.length === 0 && (
            <p className={styles.emptyText}>אין קטגוריות זמינות. אנא צור קטגוריה תחילה.</p>
          )}
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <div className={formStyles.formActions}>
          <Button 
            type="submit" 
            disabled={isSubmitting || categories.length === 0}
          >
            {isSubmitting ? 'שומר...' : 'שמור אירוע'}
          </Button>
        </div>
      </div>
    </form>
  );
}
