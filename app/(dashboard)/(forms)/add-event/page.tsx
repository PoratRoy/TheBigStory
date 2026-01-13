'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTimeline } from '@/context/TimelineContext';
import { createEventAction } from '@/app/actions/POST/createEventAction';
import RichTextEditor from '@/components/Form/RichTextEditor/RichTextEditor';
import { useFormLayout } from '@/context/FormLayoutContext';
import styles from './page.module.css';

export default function AddEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories } = useTimeline();
  const { setTitle, setOnSubmit, setIsSubmitting } = useFormLayout();
  
  const [content, setContent] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTitle('אירוע חדש');
    
    // Pre-select category from search params if provided
    const categoryId = searchParams.get('categoryId');
    if (categoryId) {
      setSelectedCategoryIds([categoryId]);
    }
  }, [setTitle, searchParams]);

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    const strippedContent = content.replace(/<[^>]*>?/gm, '').trim();
    if (!strippedContent) {
      setError('אנא הכנס טקסט לאירוע');
      return;
    }
    if (selectedCategoryIds.length === 0) {
      setError('אנא בחר לפחות תקופה אחת');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await createEventAction({
      text: content,
      categoryIds: selectedCategoryIds,
    });

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'שגיאה בשמירת האירוע');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setOnSubmit(() => handleSubmit);
    return () => setOnSubmit(null);
  }, [content, selectedCategoryIds]);

  if (!mounted) return null;

  return (
    <div className={styles.form}>
      {/* Rich Text Editor */}
      <div className={styles.editorContainer}>
        <RichTextEditor 
          value={content} 
          onChange={setContent} 
          placeholder="ספר את הסיפור שלך..."
        />
      </div>

      {/* Category Selection */}
      <div className={styles.categorySection}>
        <h2 className={styles.sectionTitle}>בחירת תקופה</h2>
        <div className={styles.categoryList}>
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`${styles.categoryTag} ${selectedCategoryIds.includes(category.id) ? styles.selected : ''}`}
              style={{ 
                backgroundColor: selectedCategoryIds.includes(category.id) ? category.color || '#3b82f6' : 'transparent',
                borderColor: category.color || '#3b82f6',
                color: selectedCategoryIds.includes(category.id) ? 'white' : 'var(--text-color)'
              }}
            >
              {category.name}
            </button>
          ))}
          {categories.length === 0 && (
            <p className={styles.emptyText}>אין תקופות זמינות. הוסף תקופה תחילה.</p>
          )}
        </div>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
