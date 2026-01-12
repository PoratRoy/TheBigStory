'use server';

import { db } from '@/db';
import { events, eventCategories, categories } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getAuthenticatedUser } from '../utils';
import { Event } from '@/models/interface/event';

export async function getEventsAction(): Promise<{ data?: Event[]; error?: string }> {
  try {
    const user = await getAuthenticatedUser();
    const data = await db.query.events.findMany({
      where: eq(events.userId, user.id),
      orderBy: [asc(events.position)],
    });
    
    const eventsWithCategories = await Promise.all(data.map(async (event) => {
      const cats = await db.select({
        id: categories.id,
        name: categories.name,
        color: categories.color
      })
      .from(eventCategories)
      .innerJoin(categories, eq(eventCategories.categoryId, categories.id))
      .where(eq(eventCategories.eventId, event.id));
      
      return { ...event, categories: cats };
    }));

    return { data: eventsWithCategories };
  } catch (error: any) {
    return { error: error.message || 'שגיאה בטעינת אירועים' };
  }
}
