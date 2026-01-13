'use client';

import React, { useState } from 'react';
import { DragControls } from 'framer-motion';
import { Icons } from '@/style/icons';
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
}

export const EventBox = ({
  id,
  text,
  isCollapse: initialCollapse,
  categories,
  dragControls,
  onDelete,
  onToggleCollapse,
  onMove
}: EventBoxProps) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapse);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggleCollapse(id, newState);
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
      <div className={styles.header}>
        <div className={styles.actionsLeft}>
          <button className={styles.iconButton} onClick={toggleCollapse} aria-label={isCollapsed ? 'Expand' : 'Collapse'}>
            {isCollapsed ? <Icons.ChevronDown /> : <Icons.ChevronUp />}
          </button>
          <button className={styles.iconButton} onClick={() => onDelete(id)} aria-label="Delete">
            <Icons.Delete />
          </button>
          <button className={styles.iconButton} onClick={() => onMove(id)} aria-label="Move to category">
            <Icons.Move />
          </button>
        </div>

        <div className={styles.pillsRight}>
          <div className={styles.categoryPills}>
            {categories.map(cat => (
              <span 
                key={cat.id} 
                className={styles.pill} 
                style={{ backgroundColor: cat.color || '#3b82f6' }}
              >
                {cat.name}
              </span>
            ))}
          </div>
          <div 
            className={styles.reorderHandle}
            onPointerDown={(e) => dragControls?.start(e)} // Trigger drag manually
            style={{ touchAction: 'none' }}
          >
            <Icons.Reorder />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {isCollapsed ? (
          <p className={styles.collapsedText}>{stripHtml(text)}</p>
        ) : (
          <div 
            className={styles.richText} 
            dangerouslySetInnerHTML={{ __html: text }} 
          />
        )}
      </div>
    </div>
  );
};
