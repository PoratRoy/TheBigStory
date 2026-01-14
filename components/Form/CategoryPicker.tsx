import React from 'react';
import { Category } from '@/models/interface/category';
import styles from './CategoryPicker.module.css';

interface CategoryPickerProps {
  label?: string;
  categories: Category[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  label = 'שיוך לקטגוריות',
  categories,
  selectedIds,
  onChange,
}) => {
  const toggleCategory = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id];
    onChange(newSelection);
  };

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.list}>
        {categories.map(cat => {
          const isSelected = selectedIds.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`${styles.categoryTag} ${isSelected ? styles.selected : ''}`}
              style={{
                backgroundColor: isSelected ? cat.color || '#3b82f6' : 'rgba(255,255,255,0.05)',
                borderColor: cat.color || '#3b82f6',
                color: isSelected ? 'white' : 'var(--text-color)'
              }}
            >
              {cat.name}
            </button>
          );
        })}
        {categories.length === 0 && (
          <p className={styles.emptyText}>אין קטגוריות זמינות.</p>
        )}
      </div>
    </div>
  );
};
