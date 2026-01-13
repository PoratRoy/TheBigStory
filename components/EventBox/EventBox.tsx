'use client';

import React, { useState } from 'react';
import { DragControls } from 'framer-motion';
import { Icons } from '@/style/icons';
import RichTextEditor from '@/components/Form/RichTextEditor/RichTextEditor';
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
  dragControls?: DragControls; // Add dragControls prop
  onDelete: (id: string) => void;
  onToggleCollapse: (id: string, state: boolean) => void;
  onMove: (id: string) => void;
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
  onMove,
  onEdit
}: EventBoxProps) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapse);
  const [localText, setLocalText] = useState(text);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggleCollapse(id, newState);
  };

  const handleBlur = (newText: string) => {
    if (newText !== text && onEdit) {
      onEdit(id, newText);
    }
  };

  const handleTextChange = (newText: string) => {
    setLocalText(newText);
  };

  // Helper to strip HTML tags for collapsed view
  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return html;
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
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
            <Icons.Dots />
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
                <Icons.Dots />
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
              <button className={styles.iconButton} onClick={() => onMove(id)} aria-label="Move to category">
                <Icons.Move />
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
            <RichTextEditor 
              value={localText} 
              onChange={handleTextChange} 
              onBlur={handleBlur}
              isSmall
              placeholder="ספר את הסיפור שלך..."
            />
          </div>
        </>
      )}
    </div>
  );
};
