'use server';

import { db } from '@/db';
import { timelines } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '../utils';

export async function updateTimelineAction(data: { startYear?: number; snapDefault?: number }) {
  try {
    const user = await getAuthenticatedUser();
    
    const [updatedTimeline] = await db.update(timelines)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(timelines.userId, user.id))
      .returning();

    revalidatePath('/');
    return { success: true, data: updatedTimeline };
  } catch (error: any) {
    return { error: error.message || 'שגיאה בעדכון הגדרות ציר זמן' };
  }
}
