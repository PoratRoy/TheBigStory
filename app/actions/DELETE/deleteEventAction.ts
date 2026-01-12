'use server';

import { db } from '@/db';
import { events } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '../utils';

export async function deleteEventAction(id: string) {
  try {
    const user = await getAuthenticatedUser();
    await db.delete(events).where(
      and(eq(events.id, id), eq(events.userId, user.id))
    );

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'שגיאה במחיקת אירוע' };
  }
}
