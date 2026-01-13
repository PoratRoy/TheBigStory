'use server';

import { db } from '@/db';
import { events } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '../utils';

export async function reorderEventPosAction(eventIds: string[]) {
  try {
    const user = await getAuthenticatedUser();

    // Neon HTTP driver doesn't support transactions. 
    // We update each event position sequentially or in parallel.
    for (let i = 0; i < eventIds.length; i++) {
      await db.update(events)
        .set({ position: i })
        .where(and(eq(events.id, eventIds[i]), eq(events.userId, user.id)));
    }

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'שגיאה בסידור מחדש של האירועים' };
  }
}
