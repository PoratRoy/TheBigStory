import React from 'react';
import styles from './Form.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ children, variant = 'primary', ...props }: ButtonProps) => {
  return (
    <button 
      className={`${styles.button} ${variant === 'primary' ? styles.primary : styles.secondary}`} 
      {...props}
    >
      {children}
    </button>
  );
};
