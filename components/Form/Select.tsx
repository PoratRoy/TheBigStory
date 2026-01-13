import React from 'react';
import styles from './Form.module.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string | number; label: string | number }[];
}

export const Select = ({ label, options, ...props }: SelectProps) => {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <select className={styles.input} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
