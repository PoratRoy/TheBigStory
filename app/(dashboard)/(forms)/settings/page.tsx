'use client';

import React, { useState, useEffect } from 'react';
import { useTimeline } from '@/context/TimelineContext';
import { useFormLayout } from '@/context/FormLayoutContext';
import { Input } from '@/components/Form/Input';
import { Button } from '@/components/Form/Button';
import { ColorPicker } from '@/components/Form/ColorPicker';
import { Icons } from '@/style/icons';
import styles from './page.module.css';

export default function SettingsPage() {
  const { timeline, categories, usedColors, addNewCategory, editCategory, removeCategory, updateTimelineSettings, refreshData } = useTimeline();
  const { setTitle } = useFormLayout();

  // ... state ...
  const [startYear, setStartYear] = useState(1998);
  const [snapDefault, setSnapDefault] = useState(1998);
  const [isUpdatingTimeline, setIsUpdatingTimeline] = useState(false);

  // Unique categories state
  const [isAddingUnique, setIsAddingUnique] = useState(false);
  const [newUniqueName, setNewUniqueName] = useState('');
  const [newUniqueColor, setNewUniqueColor] = useState('#3b82f6');
  
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState('#3b82f6');

  const generateRandomColor = () => {
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
      '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#0ea5e9'
    ];
    const availableColors = colors.filter(c => !usedColors.includes(c));
    const pool = availableColors.length > 0 ? availableColors : colors;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const handleRandomColor = (isEditing: boolean) => {
    const color = generateRandomColor();
    if (isEditing) setEditingColor(color);
    else setNewUniqueColor(color);
  };

  useEffect(() => {
    setTitle('הגדרות');
    if (timeline) {
      setStartYear(timeline.startYear || 1998);
      setSnapDefault(timeline.snapDefault || 1998);
    }
  }, [timeline, setTitle]);

  const handleStartEditing = (cat: any) => {
    setEditingCategoryId(cat.id);
    setEditingName(cat.name);
    setEditingColor(cat.color || '#3b82f6');
  };

  const handleUpdateTimeline = async () => {
    setIsUpdatingTimeline(true);
    const res = await updateTimelineSettings({
      startYear,
      snapDefault
    });
    if (res.success) {
      alert('הגדרות ציר הזמן עודכנו בהצלחה');
    } else {
      alert(res.error);
    }
    setIsUpdatingTimeline(false);
  };

  const handleAddUnique = async () => {
    if (!newUniqueName) return;
    const res = await addNewCategory({
      name: newUniqueName,
      color: newUniqueColor,
      isUnique: true
    });
    if (res.success) {
      setNewUniqueName('');
      setIsAddingUnique(false);
    } else {
      alert(res.error);
    }
  };

  const handleUpdateUnique = async () => {
    if (!editingCategoryId || !editingName) return;
    const res = await editCategory(editingCategoryId, { 
      name: editingName, 
      color: editingColor, 
      isUnique: true 
    });
    if (res.success) {
      setEditingCategoryId(null);
    } else {
      alert(res.error);
    }
  };

  const handleDeleteUnique = async (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק קטגוריה ייחודית זו?')) {
      const res = await removeCategory(id);
      if (!res.success) {
        alert(res.error);
      }
    }
  };

  const uniqueCategories = categories.filter(cat => cat.isUnique);

  return (
    <div className={styles.card}>
      {/* Timeline Settings Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>הגדרות ציר זמן</h2>
        <div className={styles.row}>
          <Input 
            label="שנת התחלה" 
            type="number" 
            value={startYear} 
            onChange={(e) => setStartYear(parseInt(e.target.value))}
          />
          <Input 
            label="נקודת הצמדה ברירת מחדל" 
            type="number" 
            value={snapDefault} 
            onChange={(e) => setSnapDefault(parseInt(e.target.value))}
          />
        </div>
        <div className={styles.formActions}>
          <Button onClick={handleUpdateTimeline} disabled={isUpdatingTimeline}>
            {isUpdatingTimeline ? 'מעדכן...' : 'עדכן הגדרות'}
          </Button>
        </div>
      </section>

      {/* Unique Categories Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>קטגוריות ייחודיות</h2>
        
        <div className={styles.uniqueList}>
          {uniqueCategories.map(cat => (
            <div key={cat.id} className={styles.uniqueItem}>
              {editingCategoryId === cat.id ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Input 
                    label="שם הקטגוריה" 
                    value={editingName} 
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <ColorPicker 
                    label="צבע" 
                    value={editingColor} 
                    onChange={setEditingColor}
                    onRandom={() => handleRandomColor(true)}
                  />
                  <div className={styles.formActions}>
                    <Button variant="secondary" onClick={() => setEditingCategoryId(null)}>ביטול</Button>
                    <Button onClick={handleUpdateUnique}>שמור</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.uniqueItemInfo}>
                    <div 
                      className={styles.colorCircle} 
                      style={{ backgroundColor: cat.color || '#3b82f6' }} 
                    />
                    <span>{cat.name}</span>
                  </div>
                  <div className={styles.uniqueItemActions}>
                    <button className={styles.iconBtn} onClick={() => handleStartEditing(cat)}>
                      <Icons.Update />
                    </button>
                    <button className={styles.iconBtn} onClick={() => handleDeleteUnique(cat.id)}>
                      <Icons.Delete />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {isAddingUnique ? (
          <div className={styles.addUniqueForm}>
            <Input 
              label="שם הקטגוריה" 
              value={newUniqueName} 
              onChange={(e) => setNewUniqueName(e.target.value)}
              placeholder="למשל: אירוע אישי, עבודה..."
            />
            <ColorPicker 
              label="צבע" 
              value={newUniqueColor} 
              onChange={setNewUniqueColor}
              onRandom={() => handleRandomColor(false)}
            />
            <div className={styles.formActions}>
              <Button variant="secondary" onClick={() => setIsAddingUnique(false)}>ביטול</Button>
              <Button onClick={handleAddUnique}>הוסף</Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setIsAddingUnique(true)}>
            <Icons.AddCategory />
            <span style={{ marginRight: '8px' }}>הוסף קטגוריה ייחודית</span>
          </Button>
        )}
      </section>
    </div>
  );
}
