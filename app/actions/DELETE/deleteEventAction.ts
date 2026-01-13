'use server';

import { db } from '@/db';
import { events } from '@/db/schema';
import { eq, and, gt, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '../utils';

export async function deleteEventAction(id: string) {
  try {
    const user = await getAuthenticatedUser();
    
    // 1. Get the position of the event to be deleted
    const eventToDelete = await db.query.events.findFirst({
      where: and(eq(events.id, id), eq(events.userId, user.id)),
      columns: { position: true }
    });

    if (!eventToDelete) {
      return { success: true }; // Already deleted
    }

    const deletedPos = eventToDelete.position || 0;

    // 2. Delete the event
    await db.delete(events).where(
      and(eq(events.id, id), eq(events.userId, user.id))
    );

    // 3. Shift all subsequent events down by 1
    await db.update(events)
      .set({ position: sql`${events.position} - 1` })
      .where(and(
        eq(events.userId, user.id),
        gt(events.position, deletedPos)
      ));

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'שגיאה במחיקת אירוע' };
  }
}
