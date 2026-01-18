'use client';

import React, { useState } from 'react';
import { DragControls } from 'framer-motion';
import { Icons } from '@/style/icons';
import { TextArea } from '@/components/Form/TextArea';
import styles from './EventBox.module.css';

interface CategoryPill {
  id: string;
  name: string;
  color: string | null;
}

interface EventBoxProps {
  id: string;
  text: string;
  isCollapse: boolean;
  categories: CategoryPill[];
  dragControls?: DragControls;
  onDelete: (id: string) => void;
  onToggleCollapse: (id: string, state: boolean) => void;
  onEditFull: (id: string) => void;
  onEdit?: (id: string, text: string) => void;
}

export const EventBox = ({
  id,
  text,
  isCollapse: initialCollapse,
  categories,
  dragControls,
  onDelete,
  onToggleCollapse,
  onEditFull,
  onEdit
}: EventBoxProps) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapse);

  // Helper to strip HTML tags for older events if they still have HTML
  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return html;
    // Check if it's likely HTML
    if (!html.includes('<') || !html.includes('>')) return html;
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const [localText, setLocalText] = useState(() => stripHtml(text));

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggleCollapse(id, newState);
  };

  const handleBlur = (newText: string) => {
    if (newText !== stripHtml(text) && onEdit) {
      onEdit(id, newText);
    }
  };

  const handleTextChange = (newText: string) => {
    setLocalText(newText);
  };

  return (
    <div className={`${styles.container} ${isCollapsed ? styles.collapsed : ''}`}>
      {isCollapsed ? (
        <div className={styles.collapsedRow}>
          <div 
            className={styles.reorderHandle}
            onPointerDown={(e) => dragControls?.start(e)}
            style={{ touchAction: 'none' }}
          >
            <Icons.Reorder />
          </div>
          <div className={styles.collapsedContent} onClick={toggleCollapse}>
            <p className={styles.collapsedText}>{stripHtml(localText)}</p>
          </div>
          <button className={styles.iconButton} onClick={toggleCollapse} aria-label="Expand">
            <Icons.Back />
          </button>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.headerRight}>
              <div 
                className={styles.reorderHandle}
                onPointerDown={(e) => dragControls?.start(e)}
                style={{ touchAction: 'none' }}
              >
                <Icons.Reorder />
              </div>
              <div className={styles.categoryPills}>
                {categories.map(cat => (
                  <span 
                    key={cat.id} 
                    className={styles.pill} 
                    style={{ backgroundColor: cat.color || '#3b82f6' }}
                    title={cat.name}
                  >
                    <span className={styles.pillText}>{cat.name}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.actionsLeft}>
              <button className={styles.iconButton} onClick={() => onEditFull(id)} aria-label="Edit details">
                <Icons.Update />
              </button>
              <button className={styles.iconButton} onClick={() => onDelete(id)} aria-label="Delete">
                <Icons.Delete />
              </button>
              <button className={styles.iconButton} onClick={toggleCollapse} aria-label="Collapse">
                <Icons.ChevronDown />
              </button>
            </div>
          </div>

          <div className={styles.content}>
            {onEdit ? (
              <TextArea 
                value={localText} 
                onChange={handleTextChange} 
                onBlur={handleBlur}
                isSmall
                autoResize
                placeholder="ספר את הסיפור שלך..."
              />
            ) : (
              <p className={styles.eventText}>{localText}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
