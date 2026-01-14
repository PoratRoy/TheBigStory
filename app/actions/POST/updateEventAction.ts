'use server';

import { db } from '@/db';
import { events, eventCategories } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '../utils';
import { Event } from '@/models/interface/event';

export async function updateEventAction(id: string, formData: Partial<Omit<Event, 'id' | 'categories'>> & { categoryIds?: string[] }) {
  try {
    const user = await getAuthenticatedUser();

    // No longer using sanitize-html for plain text.
    const text = formData.text?.trim();

    const [updatedEvent] = await db.update(events)
      .set({
        text: text,
        position: formData.position,
        isCollapse: formData.isCollapse,
        updatedAt: new Date(),
      })
      .where(and(eq(events.id, id), eq(events.userId, user.id)))
      .returning();

    if (formData.categoryIds) {
      // Refresh event categories
      await db.delete(eventCategories).where(eq(eventCategories.eventId, id));
      if (formData.categoryIds.length > 0) {
        await db.insert(eventCategories).values(
          formData.categoryIds.map(catId => ({
            eventId: id,
            categoryId: catId,
          }))
        );
      }
    }

    revalidatePath('/');
    return { success: true, data: updatedEvent };
  } catch (error: any) {
    return { error: error.message || 'שגיאה בעדכון אירוע' };
  }
}
