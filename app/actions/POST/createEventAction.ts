'use server';

import { db } from '@/db';
import { events, eventCategories } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '../utils';
import { Event } from '@/models/interface/event';

export async function createEventAction(formData: Partial<Omit<Event, 'id' | 'categories'>> & { categoryIds?: string[] }) {
  try {
    if (!formData.text) throw new Error('תוכן האירוע הוא חובה');

    const user = await getAuthenticatedUser();
    
    // No longer using sanitize-html since we switched to plain text TextArea.
    // The text will be rendered using white-space: pre-wrap for safety and layout.
    const text = formData.text.trim();

    // Shift all existing events for this user to make room for the new one at position 0
    await db.update(events)
      .set({ position: sql`${events.position} + 1` })
      .where(eq(events.userId, user.id));

    const [newEvent] = await db.insert(events).values({
      userId: user.id,
      text: text,
      position: 0, // Always start at the top
    }).returning();

    if (formData.categoryIds && formData.categoryIds.length > 0) {
      await db.insert(eventCategories).values(
        formData.categoryIds.map(catId => ({
          eventId: newEvent.id,
          categoryId: catId,
        }))
      );
    }

    revalidatePath('/');
    return { success: true, data: newEvent };
  } catch (error: any) {
    return { error: error.message || 'שגיאה בהוספת אירוע' };
  }
}
