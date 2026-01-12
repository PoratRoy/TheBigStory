'use server';

import { db } from '@/db';
import { events, eventCategories } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '../utils';
import { Event } from '@/models/interface/event';

export async function createEventAction(formData: Partial<Omit<Event, 'id' | 'categories'>> & { categoryIds?: string[] }) {
  try {
    if (!formData.text) throw new Error('תוכן האירוע הוא חובה');

    const user = await getAuthenticatedUser();

    const [newEvent] = await db.insert(events).values({
      userId: user.id,
      text: formData.text,
      position: formData.position ?? 0,
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
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'שגיאה בהוספת אירוע' };
  }
}
