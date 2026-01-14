'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTimeline } from '@/context/TimelineContext';
import { useFormLayout } from '@/context/FormLayoutContext';
import { TextArea } from '@/components/Form/TextArea';
import { Button } from '@/components/Form/Button';
import { CategoryPicker } from '@/components/Form/CategoryPicker';
import styles from './page.module.css';
import formStyles from '@/components/Form/Form.module.css';

function AddEventForm() {
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
    } else if (categories.length > 0 && selectedCategoryIds.length === 0) {
      // Default to first category if none provided and none selected yet
      setSelectedCategoryIds([categories[0].id]);
    }
  }, [setTitle, searchParams, categories, selectedCategoryIds.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!text.trim()) {
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
    <form onSubmit={handleSubmit} className={`${formStyles.formCard} ${styles.fullHeightCard}`}>
      <div className={styles.form}>
        <div className={styles.editorContainer}>
          <TextArea 
            value={text} 
            onChange={setText} 
            placeholder="מה קרה הפעם? ספר את הסיפור..."
            fullHeight
          />
        </div>

        <CategoryPicker 
          categories={categories}
          selectedIds={selectedCategoryIds}
          onChange={setSelectedCategoryIds}
        />

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

export default function AddEventPage() {
  return (
    <Suspense fallback={<div className={formStyles.formCard}>טוען...</div>}>
      <AddEventForm />
    </Suspense>
  );
}
