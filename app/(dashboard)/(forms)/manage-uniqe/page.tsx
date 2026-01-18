'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useTimeline } from '@/context/TimelineContext';
import { useFormLayout } from '@/context/FormLayoutContext';
import { Input } from '@/components/Form/Input';
import { Button } from '@/components/Form/Button';
import { ColorPicker } from '@/components/Form/ColorPicker';
import { Icons } from '@/style/icons';
import { getRandomColor } from '@/style/colors';
import styles from './page.module.css';

export default function ManageCategoriesPage() {
  const router = useRouter();
  const { categories, usedColors, addNewCategory, editCategory, removeCategory } = useTimeline();
  const { setTitle } = useFormLayout();

  // Unique categories state
  const [isAddingUnique, setIsAddingUnique] = useState(false);
  const [newUniqueName, setNewUniqueName] = useState('');
  const [newUniqueColor, setNewUniqueColor] = useState('#3b82f6');
  
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState('#3b82f6');

  useEffect(() => {
    setTitle('ניהול קטגוריות');
    if (!isAddingUnique) {
      setNewUniqueColor(getRandomColor(usedColors));
    }
  }, [setTitle, usedColors, isAddingUnique]);

  const handleStartEditing = (cat: any) => {
    setEditingCategoryId(cat.id);
    setEditingName(cat.name);
    setEditingColor(cat.color || '#3b82f6');
  };

  const handleAddUnique = async () => {
    if (!newUniqueName) return;
    const res = await addNewCategory({
      name: newUniqueName,
      color: newUniqueColor,
      isUnique: true
    });
    if (res.success) {
      toast.success('קטגוריה נוספה');
      setNewUniqueName('');
      setIsAddingUnique(false);
    } else {
      toast.error(res.error || 'שגיאה בהוספת קטגוריה');
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
      toast.success('קטגוריה עודכנה');
      setEditingCategoryId(null);
    } else {
      toast.error(res.error || 'שגיאה בעדכון קטגוריה');
    }
  };

  const handleDeleteUnique = async (id: string) => {
    const res = await removeCategory(id);
    if (res.success) {
      toast.success('קטגוריה נמחקה');
    } else {
      toast.error(res.error || 'שגיאה במחיקת קטגוריה');
    }
  };

  const uniqueCategories = categories.filter(cat => cat.isUnique);

  return (
    <div className={styles.card}>
      <section className={styles.section}>
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
