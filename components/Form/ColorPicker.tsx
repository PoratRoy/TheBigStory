import React from 'react';
import styles from './Form.module.css';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  onRandom: () => void;
}

export const ColorPicker = ({ label, value, onChange, onRandom }: ColorPickerProps) => {
  return (
    <div className={styles.colorSection}>
      <div className={styles.colorLabelRow}>
        <span className={styles.label}>{label}</span>
        <button 
          type="button" 
          onClick={onRandom}
          className={styles.randomColorBtn}
        >
          בחר צבע אחר
        </button>
      </div>
      <div 
        className={styles.colorPreview} 
        style={{ backgroundColor: value }}
        onClick={() => {
          // Fallback to native color picker if clicked
          const input = document.createElement('input');
          input.type = 'color';
          input.value = value;
          input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
          input.click();
        }}
      />
    </div>
  );
};
