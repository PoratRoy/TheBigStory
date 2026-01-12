'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTimelineAction } from '@/app/actions/GET/getTimelineAction';
import { getCategoriesAction } from '@/app/actions/GET/getCategoriesAction';
import { getEventsAction } from '@/app/actions/GET/getEventsAction';
import { createCategoryAction } from '@/app/actions/POST/createCategoryAction';
import { updateCategoryAction } from '@/app/actions/POST/updateCategoryAction';
import { deleteCategoryAction } from '@/app/actions/DELETE/deleteCategoryAction';
import { createEventAction } from '@/app/actions/POST/createEventAction';
import { updateEventAction } from '@/app/actions/POST/updateEventAction';
import { deleteEventAction } from '@/app/actions/DELETE/deleteEventAction';
import { reorderEventPosAction } from '@/app/actions/POST/reorderEventPosAction';
import { Timeline } from '@/models/interface/timeline';
import { Category } from '@/models/interface/category';
import { Event } from '@/models/interface/event';

interface TimelineContextType {
  timeline: Timeline | null;
  categories: Category[];
  events: Event[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addNewCategory: (data: any) => Promise<{ success?: boolean; error?: string }>;
  editCategory: (id: string, data: any) => Promise<{ success?: boolean; error?: string }>;
  removeCategory: (id: string) => Promise<{ success?: boolean; error?: string }>;
  addNewEvent: (data: any) => Promise<{ success?: boolean; error?: string }>;
  editEvent: (id: string, data: any) => Promise<{ success?: boolean; error?: string }>;
  removeEvent: (id: string) => Promise<{ success?: boolean; error?: string }>;
  reorderEvents: (eventIds: string[]) => Promise<{ success?: boolean; error?: string }>;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [timelineRes, catsRes, eventsRes] = await Promise.all([
        getTimelineAction(),
        getCategoriesAction(),
        getEventsAction()
      ]);

      if (timelineRes.error) throw new Error(timelineRes.error);
      if (catsRes.error) throw new Error(catsRes.error);
      if (eventsRes.error) throw new Error(eventsRes.error);

      setTimeline(timelineRes.data || null);
      setCategories(catsRes.data || []);
      setEvents(eventsRes.data || []);
    } catch (err: any) {
      setError(err.message || 'שגיאה בטעינת הנתונים');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addNewCategory = async (data: any) => {
    const res = await createCategoryAction(data);
    if (res.success) await refreshData();
    return res;
  };

  const editCategory = async (id: string, data: any) => {
    const res = await updateCategoryAction(id, data);
    if (res.success) await refreshData();
    return res;
  };

  const removeCategory = async (id: string) => {
    const res = await deleteCategoryAction(id);
    if (res.success) await refreshData();
    return res;
  };

  const addNewEvent = async (data: any) => {
    const res = await createEventAction(data);
    if (res.success) await refreshData();
    return res;
  };

  const editEvent = async (id: string, data: any) => {
    const res = await updateEventAction(id, data);
    if (res.success) await refreshData();
    return res;
  };

  const removeEvent = async (id: string) => {
    const res = await deleteEventAction(id);
    if (res.success) await refreshData();
    return res;
  };

  const reorderEvents = async (eventIds: string[]) => {
    const res = await reorderEventPosAction(eventIds);
    if (res.success) await refreshData();
    return res;
  };

  return (
    <TimelineContext.Provider value={{
      timeline,
      categories,
      events,
      isLoading,
      error,
      refreshData,
      addNewCategory,
      editCategory,
      removeCategory,
      addNewEvent,
      editEvent,
      removeEvent,
      reorderEvents
    }}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
}
