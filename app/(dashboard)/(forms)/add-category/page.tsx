'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/Form/Input';
import { ColorPicker } from '@/components/Form/ColorPicker';
import { Button } from '@/components/Form/Button';
import { Select } from '@/components/Form/Select';
import { useFormLayout } from '@/context/FormLayoutContext';
import { useTimeline } from '@/context/TimelineContext';
import { getRandomColor } from '@/style/colors';
import styles from './page.module.css';
import formStyles from '@/components/Form/Form.module.css';

export default function AddCategoryPage() {
  const router = useRouter();
  const { setTitle } = useFormLayout();
  const { timeline, yearOptions, addNewCategory, usedColors } = useTimeline();

  const currentYear = new Date().getFullYear();
  const timelineStartYear = timeline?.startYear || 1998;

  const [name, setName] = useState('');
  const [startYear, setStartYear] = useState(timelineStartYear);
  const [endYear, setEndYear] = useState(currentYear);
  const [color, setColor] = useState('#3b82f6');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!name && !isSubmitting) {
      setColor(getRandomColor(usedColors));
    }
  }, [usedColors, name, isSubmitting]);

  useEffect(() => {
    if (timeline?.startYear) {
      setStartYear(timeline.startYear);
    }
  }, [timeline]);

  useEffect(() => {
    setTitle('תקופה חדשה');
  }, [setTitle]);

  const handleStartYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStart = parseInt(e.target.value);
    setStartYear(newStart);
    // Sync end year if it becomes invalid
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

    const result = await addNewCategory({
      name,
      startYear,
      endYear,
      color,
    });

    if (result.success) {
      toast.success('תקופה נשמרה');
      router.push('/');
    } else {
      toast.error(result.error || 'שגיאה בשמירת הקטגוריה');
      setIsSubmitting(false);
    }
  };

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
          {isSubmitting ? 'שומר...' : 'שמור תקופה'}
        </Button>
      </div>
    </form>
  );
}
