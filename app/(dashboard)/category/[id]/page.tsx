'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Reorder, useDragControls } from 'framer-motion';
import { useTimeline } from '@/context/TimelineContext';
import { EventBox } from '@/components/EventBox/EventBox';
import { Icons } from '@/style/icons';
import ProfileMenu from '@/components/ProfileMenu/ProfileMenu';
import { Button } from '@/components/Form/Button';
import { Event } from '@/models/interface/event';
import { EventItem } from './EventItem';
import { AddEventCard } from './AddEventCard';
import { CategoryMenu } from './CategoryMenu';
import styles from './page.module.css';

export default function CategoryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { categories, events, isLoading, error, removeEvent, editEvent, reorderEvents, removeCategory } = useTimeline();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const [categoryEvents, setCategoryEvents] = useState<Event[]>([]);
  const [prevEventsCount, setPrevEventsCount] = useState(0);

  const category = categories.find(c => c.id === id);

  useEffect(() => {
    if (events.length > 0 && id) {
      const filtered = events
        .filter(e => e.categories?.some(cat => cat.id === id))
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      setCategoryEvents(filtered);
      
      // If new event added, scroll to top
      if (filtered.length > prevEventsCount && prevEventsCount > 0) {
        setTimeout(() => {
          scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
      setPrevEventsCount(filtered.length);
    } else if (events.length === 0) {
      setCategoryEvents([]);
      setPrevEventsCount(0);
    }
  }, [events, id, prevEventsCount]);

  const handleReorder = async (newOrder: Event[]) => {
    setCategoryEvents(newOrder);
    const eventIds = newOrder.map(e => e.id);
    const result = await reorderEvents(eventIds);
    if (!result.success) {
      toast.error(result.error || 'שגיאה בשינוי סדר האירועים');
    }
  };

  const handleDelete = async (eventId: string) => {
    const result = await removeEvent(eventId);
    if (result.success) {
      toast.success('אירוע נמחק');
    } else {
      toast.error(result.error || 'שגיאה במחיקת אירוע');
    }
  };

  const handleDeleteCategory = async () => {
    const result = await removeCategory(id as string);
    if (result.success) {
      toast.success('תקופה נמחקה');
      router.push('/');
    } else {
      toast.error(result.error || 'שגיאה במחיקת תקופה');
    }
  };

  const handleEditCategory = () => {
    router.push(`/edit-category/${id}`);
  };

  const handleViewStory = () => {
    router.push(`/category/${id}/story`);
  };

  const handleToggleCollapse = async (eventId: string, state: boolean) => {
    await editEvent(eventId, { isCollapse: state });
  };

  const handleEdit = async (eventId: string, text: string) => {
    await editEvent(eventId, { text });
  };

  const handleEditFull = (eventId: string) => {
    router.push(`/edit-event/${eventId}`);
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
          <CategoryMenu 
            onEdit={handleEditCategory} 
            onDelete={handleDeleteCategory} 
            onViewStory={handleViewStory}
          />
        </div>
        <button onClick={() => router.back()} className={styles.backButton} aria-label="חזור">
          <Icons.Back />
        </button>
      </header>

      {/* Events List */}
      <main ref={scrollContainerRef} className={styles.mainContent}>
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
                onEditFull={handleEditFull}
                onEdit={handleEdit}
              />
            ))}
          </Reorder.Group>
        )}
      </main>

      {/* Add Event Card - Fixed at bottom */}
      <footer className={styles.footer}>
        <AddEventCard currentCategoryId={id as string} />
      </footer>
    </div>
  );
}
