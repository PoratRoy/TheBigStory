import React, { useRef, useEffect } from 'react';
import styles from './TextArea.module.css';

interface TextAreaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  placeholder?: string;
  isSmall?: boolean;
  required?: boolean;
  fullHeight?: boolean;
  autoResize?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  isSmall,
  required,
  fullHeight,
  autoResize = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (autoResize && textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value, autoResize]);

  return (
    <div className={`${styles.container} ${fullHeight ? styles.fullHeightContainer : ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        ref={textareaRef}
        className={`${styles.textarea} ${isSmall ? styles.small : ''} ${fullHeight ? styles.fullHeight : ''} ${autoResize ? styles.autoResize : ''}`}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          adjustHeight();
        }}
        onBlur={(e) => onBlur?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={autoResize ? 3 : undefined}
      />
    </div>
  );
};
