'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Reorder, useDragControls } from 'framer-motion';
import { useTimeline } from '@/context/TimelineContext';
import { EventBox } from '@/components/EventBox/EventBox';
import { Icons } from '@/style/icons';
import ProfileMenu from '@/components/ProfileMenu/ProfileMenu';
import { Button } from '@/components/Form/Button';
import { Event } from '@/models/interface/event';
import styles from './page.module.css';

export default function CategoryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { categories, events, isLoading, error, removeEvent, editEvent, reorderEvents } = useTimeline();

  const [categoryEvents, setCategoryEvents] = useState<Event[]>([]);

  const category = categories.find(c => c.id === id);

  useEffect(() => {
    if (events.length > 0 && id) {
      const filtered = events
        .filter(e => e.categories?.some(cat => cat.id === id))
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      setCategoryEvents(filtered);
    }
  }, [events, id]);

  const handleReorder = async (newOrder: Event[]) => {
    setCategoryEvents(newOrder);
    const eventIds = newOrder.map(e => e.id);
    const result = await reorderEvents(eventIds);
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק אירוע זה?')) {
      const result = await removeEvent(eventId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleToggleCollapse = async (eventId: string, state: boolean) => {
    await editEvent(eventId, { isCollapse: state });
  };

  const handleMove = (eventId: string) => {
    console.log('Move event:', eventId);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>טוען...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className={styles.loading}>
        <p>קטגוריה לא נמצאה</p>
        <Button onClick={() => router.push('/')}>חזור למסך הראשי</Button>
      </div>
    );
  }

  return (
    <div className={styles.page} dir="rtl">
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerRight}>
          <ProfileMenu />
          <h1 className={styles.title}>
            {category.name} | {category.startYear}-{category.endYear || 'היום'}
          </h1>
        </div>
        <button onClick={() => router.back()} className={styles.backButton} aria-label="חזור">
          <Icons.Back />
        </button>
      </header>

      {/* Events List */}
      <main className={styles.mainContent}>
        {error ? (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        ) : categoryEvents.length === 0 ? (
          <div className={styles.empty}>
            <p>אין אירועים בתקופה זו עדיין.</p>
          </div>
        ) : (
          <Reorder.Group 
            axis="y" 
            values={categoryEvents} 
            onReorder={handleReorder}
            className={styles.eventsList}
          >
            {categoryEvents.map(event => (
              <EventItem
                key={event.id}
                event={event}
                onDelete={handleDelete}
                onToggleCollapse={handleToggleCollapse}
                onMove={handleMove}
              />
            ))}
          </Reorder.Group>
        )}
      </main>

      {/* Bottom Bar / Add Event Button */}
      <footer className={styles.bottomBar}>
        <button 
          className={styles.addEventBtn} 
          onClick={() => router.push(`/add-event?categoryId=${id}`)}
        >
          <Icons.AddEvent />
          <span>הוספת אירוע</span>
        </button>
      </footer>
    </div>
  );
}

function EventItem({ 
  event, 
  onDelete, 
  onToggleCollapse, 
  onMove 
}: { 
  event: Event, 
  onDelete: (id: string) => void,
  onToggleCollapse: (id: string, state: boolean) => void,
  onMove: (id: string) => void
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item 
      value={event}
      dragListener={false}
      dragControls={dragControls}
      style={{ listStyle: 'none' }}
    >
      <EventBox
        id={event.id}
        text={event.text}
        isCollapse={!!event.isCollapse}
        categories={event.categories || []}
        dragControls={dragControls}
        onDelete={onDelete}
        onToggleCollapse={onToggleCollapse}
        onMove={onMove}
      />
    </Reorder.Item>
  );
}
