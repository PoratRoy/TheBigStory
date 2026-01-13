'use server';

import { db } from '@/db';
import { events, eventCategories, categories } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { getAuthenticatedUser } from '../utils';

export async function getEventsByCategoryAction(categoryId: string) {
  try {
    const user = await getAuthenticatedUser();

    const results = await db.select({
      event: events,
    })
    .from(events)
    .innerJoin(eventCategories, eq(events.id, eventCategories.eventId))
    .where(
      and(
        eq(events.userId, user.id),
        eq(eventCategories.categoryId, categoryId)
      )
    )
    .orderBy(asc(events.position));

    // Map to include categories for each event (to show pills)
    const eventsWithCategories = await Promise.all(
      results.map(async (r) => {
        const cats = await db.select({
          id: categories.id,
          name: categories.name,
          color: categories.color
        })
        .from(categories)
        .innerJoin(eventCategories, eq(categories.id, eventCategories.categoryId))
        .where(eq(eventCategories.eventId, r.event.id));

        return {
          ...r.event,
          categories: cats
        };
      })
    );

    return { success: true, data: eventsWithCategories };
  } catch (error: any) {
    console.error('Error fetching events by category:', error);
    return { error: error.message || 'שגיאה בטעינת אירועים' };
  }
}
