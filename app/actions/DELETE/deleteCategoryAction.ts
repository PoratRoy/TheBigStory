'use server';

import { db } from '@/db';
import { categories, timelines } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '../utils';

export async function deleteCategoryAction(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const timeline = await db.query.timelines.findFirst({
      where: eq(timelines.userId, user.id),
    });

    if (!timeline) throw new Error('לא מורשה');

    await db.delete(categories).where(
      and(eq(categories.id, id), eq(categories.timelineId, timeline.id))
    );

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'שגיאה במחיקת קטגוריה' };
  }
}
