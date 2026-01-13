'use server';

import { db } from '@/db';
import { categories, timelines, eventCategories, events } from '@/db/schema';
import { eq, and, inArray, notExists } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '../utils';

export async function deleteCategoryAction(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const timeline = await db.query.timelines.findFirst({
      where: eq(timelines.userId, user.id),
    });

    if (!timeline) throw new Error('לא מורשה');

    // 1. Find all events associated with this category before we delete it
    const associatedEvents = await db.select({ eventId: eventCategories.eventId })
      .from(eventCategories)
      .where(eq(eventCategories.categoryId, id));

    const eventIds = associatedEvents.map((ae: { eventId: string }) => ae.eventId);

    // 2. Delete the category
    // This will automatically delete entries in event_categories due to ON DELETE CASCADE
    await db.delete(categories).where(
      and(eq(categories.id, id), eq(categories.timelineId, timeline.id))
    );

    // 3. Clean up orphaned events
    // If an event was only in this category, it now has 0 categories and should be deleted.
    // If it was in other categories, those associations still exist, so we keep the event.
    if (eventIds.length > 0) {
      await db.delete(events).where(
        and(
          eq(events.userId, user.id),
          inArray(events.id, eventIds),
          notExists(
            db.select().from(eventCategories).where(eq(eventCategories.eventId, events.id))
          )
        )
      );
    }

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'שגיאה במחיקת קטגוריה' };
  }
}
