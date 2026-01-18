'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useTimeline } from '@/context/TimelineContext';
import { useFormLayout } from '@/context/FormLayoutContext';
import { TextArea } from '@/components/Form/TextArea';
import { Button } from '@/components/Form/Button';
import { CategoryPicker } from '@/components/Form/CategoryPicker';
import styles from '../../add-event/page.module.css';
import formStyles from '@/components/Form/Form.module.css';

function EditEventForm() {
  const router = useRouter();
  const { id } = useParams();
  const { categories, events, editEvent, isLoading } = useTimeline();
  const { setTitle } = useFormLayout();
  
  const [text, setText] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTitle('עריכת אירוע');
  }, [setTitle]);

  useEffect(() => {
    if (!isLoading && events.length > 0 && id && !isLoaded) {
      const event = events.find(e => e.id === id);
      if (event) {
        setText(event.text);
        setSelectedCategoryIds(event.categories?.map(c => c.id) || []);
        setIsLoaded(true);
      }
    }
  }, [events, id, isLoading, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error('אנא הכנס טקסט לאירוע');
      return;
    }

    if (selectedCategoryIds.length === 0) {
      toast.error('אנא בחר לפחות קטגוריה אחת');
      return;
    }

    setIsSubmitting(true);

    const result = await editEvent(id as string, {
      text,
      categoryIds: selectedCategoryIds,
    });

    if (result.success) {
      toast.success('האירוע עודכן');
      router.back();
    } else {
      toast.error(result.error || 'שגיאה בעדכון האירוע');
      setIsSubmitting(false);
    }
  };

  if (isLoading && !isLoaded) {
    return <div className={formStyles.formCard}>טוען...</div>;
  }

  if (!isLoaded && !isLoading) {
    return (
      <div className={formStyles.formCard}>
        <p>אירוע לא נמצא</p>
        <Button onClick={() => router.push('/')}>חזור לדף הבית</Button>
      </div>
    );
  }

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

        <div className={formStyles.formActions}>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'מעדכן...' : 'עדכן אירוע'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default function EditEventPage() {
  return (
    <Suspense fallback={<div className={formStyles.formCard}>טוען...</div>}>
      <EditEventForm />
    </Suspense>
  );
}
