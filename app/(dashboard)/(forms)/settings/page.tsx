'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useTimeline } from '@/context/TimelineContext';
import { useFormLayout } from '@/context/FormLayoutContext';
import { Input } from '@/components/Form/Input';
import { Select } from '@/components/Form/Select';
import { Button } from '@/components/Form/Button';
import { ColorPicker } from '@/components/Form/ColorPicker';
import { Icons } from '@/style/icons';
import styles from './page.module.css';

export default function SettingsPage() {
  const router = useRouter();
  const { timeline, updateTimelineSettings } = useTimeline();
  const { setTitle } = useFormLayout();

  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(1998);
  const [snapDefault, setSnapDefault] = useState(1998);
  const [isUpdatingTimeline, setIsUpdatingTimeline] = useState(false);

  const startYearOptions = useMemo(() => {
    return Array.from({ length: currentYear - 1940 + 1 }, (_, i) => 1940 + i)
      .reverse()
      .map(y => ({ value: y, label: y }));
  }, [currentYear]);

  const snapOptions = useMemo(() => {
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)
      .reverse()
      .map(y => ({ value: y, label: y }));
  }, [currentYear, startYear]);

  useEffect(() => {
    setTitle('הגדרות');
    if (timeline) {
      setStartYear(timeline.startYear || 1998);
      setSnapDefault(timeline.snapDefault || 1998);
    }
  }, [timeline, setTitle]);

  const handleUpdateTimeline = async () => {
    setIsUpdatingTimeline(true);
    const res = await updateTimelineSettings({
      startYear,
      snapDefault
    });
    if (res.success) {
      toast.success('הגדרות ציר הזמן עודכנו');
      router.push('/');
    } else {
      toast.error(res.error || 'שגיאה בעדכון ההגדרות');
    }
    setIsUpdatingTimeline(false);
  };

  return (
    <div className={styles.card}>
      {/* Timeline Settings Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>הגדרות ציר זמן</h2>
        <div className={styles.row}>
          <Select 
            label="שנת התחלה" 
            value={startYear} 
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setStartYear(val);
              if (snapDefault < val) {
                setSnapDefault(val);
              }
            }}
            options={startYearOptions}
          />
          <Select 
            label="נקודת הצמדה ברירת מחדל" 
            value={snapDefault} 
            onChange={(e) => setSnapDefault(parseInt(e.target.value))}
            options={snapOptions}
          />
        </div>
        <div className={styles.formActions}>
          <Button onClick={handleUpdateTimeline} disabled={isUpdatingTimeline}>
            {isUpdatingTimeline ? 'מעדכן...' : 'עדכן הגדרות'}
          </Button>
        </div>
      </section>
    </div>
  );
}
