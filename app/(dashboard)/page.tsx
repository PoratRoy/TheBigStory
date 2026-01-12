import React from 'react';
import styles from './page.module.css';

const CATEGORIES = [
  { id: '1', name: 'ילדות', years: '2001-2010', color: '#e67e22' },
  { id: '2', name: 'יסודי', years: '2001-2010', color: '#f1c40f' },
  { id: '3', name: 'כיתה א', years: '2001-2010', color: '#1abc9c' },
  { id: '4', name: 'כיתה ב', years: '2001-2010', color: '#3498db' },
  { id: '5', name: 'חו"ל - רומן...', years: '2001-2010', color: '#9b59b6' },
  { id: '6', name: 'כיתה ג', years: '2001-2010', color: '#2ecc71' },
  { id: '7', name: 'טיול ארוך ע...', years: '2001-2010', color: '#e67e22' },
];

export default function DashboardPage() {
  return (
    <div className={styles.grid}>
      {CATEGORIES.map((category) => (
        <div key={category.id} className={styles.card}>
          <div 
            className={styles.cardTop} 
            style={{ backgroundColor: category.color }} 
          />
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>{category.name}</h2>
            <span className={styles.cardYears}>{category.years}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
