'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCategoryAction } from '@/app/actions/POST/createCategoryAction';
import { Input } from '@/components/Form/Input';
import { ColorPicker } from '@/components/Form/ColorPicker';
import { useFormLayout } from '@/context/FormLayoutContext';
import styles from './page.module.css';

export default function AddCategoryPage() {
  const router = useRouter();
  const { setTitle, setOnSubmit, setIsSubmitting, isSubmitting } = useFormLayout();

  const [name, setName] = useState('');
  const [startYear, setStartYear] = useState('1998');
  const [endYear, setEndYear] = useState('2024');
  const [color, setColor] = useState('#3b82f6');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle('תקופה חדשה');
  }, [setTitle]);

  const handleRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
    setColor(randomColor);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('אנא הכנס שם לתקופה');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await createCategoryAction({
      name,
      startYear: parseInt(startYear),
      endYear: parseInt(endYear),
      color,
    });

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'שגיאה בשמירת הקטגוריה');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setOnSubmit(() => handleSubmit);
    return () => setOnSubmit(null);
  }, [name, startYear, endYear, color]);

  return (
    <div className={styles.form}>
      <Input 
        label="שם התקופה"
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        placeholder="הכנס שם..."
        required
      />

      <div className={styles.row}>
        <Input 
          label="שנת התחלה"
          type="number" 
          value={startYear} 
          onChange={(e) => setStartYear(e.target.value)}
          required
        />
        <Input 
          label="שנת סיום"
          type="number" 
          value={endYear} 
          onChange={(e) => setEndYear(e.target.value)}
          required
        />
      </div>

      <ColorPicker 
        label="צבע"
        value={color}
        onChange={setColor}
        onRandom={handleRandomColor}
      />

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
