'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/Form/Input';
import { ColorPicker } from '@/components/Form/ColorPicker';
import { Button } from '@/components/Form/Button';
import { Select } from '@/components/Form/Select';
import { useFormLayout } from '@/context/FormLayoutContext';
import { useTimeline } from '@/context/TimelineContext';
import { getRandomColor } from '@/style/colors';
import styles from '../../add-category/page.module.css';
import formStyles from '@/components/Form/Form.module.css';

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const { setTitle } = useFormLayout();
  const { categories, usedColors, yearOptions, editCategory, isLoading } = useTimeline();

  const [name, setName] = useState('');
  const [startYear, setStartYear] = useState(1998);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [color, setColor] = useState('#3b82f6');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTitle('עריכת תקופה');
  }, [setTitle]);

  useEffect(() => {
    if (!isLoading && categories.length > 0 && id && !isLoaded) {
      const category = categories.find(cat => cat.id === id);
      if (category) {
        setName(category.name);
        setStartYear(category.startYear || 1998);
        setEndYear(category.endYear || new Date().getFullYear());
        setColor(category.color || '#3b82f6');
        setIsLoaded(true);
      }
    }
  }, [categories, id, isLoading, isLoaded]);

  const handleStartYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStart = parseInt(e.target.value);
    setStartYear(newStart);
    if (endYear < newStart) {
      setEndYear(newStart);
    }
  };

  const handleEndYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndYear(parseInt(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('אנא הכנס שם לתקופה');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await editCategory(id as string, {
      name,
      startYear,
      endYear,
      color,
    });

    if (result.success) {
      toast.success('תקופה עודכנה');
      router.push(`/category/${id}`);
    } else {
      toast.error(result.error || 'שגיאה בעדכון הקטגוריה');
      setIsSubmitting(false);
    }
  };

  if (isLoading && !isLoaded) {
    return <div className={formStyles.formCard}>טוען...</div>;
  }

  if (!isLoaded && !isLoading) {
    return <div className={formStyles.formCard}>תקופה לא נמצאה</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={formStyles.formCard}>
      <Input 
        label="שם התקופה"
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        placeholder="הכנס שם..."
        required
      />

      <div className={styles.row}>
        <Select 
          label="שנת התחלה"
          value={startYear}
          onChange={handleStartYearChange}
          options={yearOptions}
          required
        />
        <Select 
          label="שנת סיום"
          value={endYear}
          onChange={handleEndYearChange}
          options={yearOptions.filter(opt => (opt.value as number) >= startYear)}
          required
        />
      </div>

      <ColorPicker 
        label="צבע"
        value={color}
        onChange={setColor}
      />

      {error && <p className={styles.errorText}>{error}</p>}

      <div className={formStyles.formActions}>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'מעדכן...' : 'עדכן תקופה'}
        </Button>
      </div>
    </form>
  );
}
