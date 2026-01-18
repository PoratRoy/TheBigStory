import React from 'react';
import { CATEGORY_COLORS } from '@/style/colors';
import styles from './Form.module.css';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => {
  return (
    <div className={styles.colorSection}>
      <div className={styles.colorLabelRow}>
        <span className={styles.label}>{label}</span>
      </div>
      
      <div className={styles.colorGrid}>
        {CATEGORY_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`${styles.colorOption} ${value === color ? styles.selectedColor : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            title={color}
          />
        ))}
        <div 
          className={`${styles.colorOption} ${styles.customColorBtn}`}
          style={{ backgroundColor: !CATEGORY_COLORS.includes(value) ? value : '#333' }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'color';
            input.value = value;
            input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
            input.click();
          }}
          title="בחר צבע מותאם אישית"
        >
          <span style={{ fontSize: '12px', color: '#fff' }}>+</span>
        </div>
      </div>
    </div>
  );
};
