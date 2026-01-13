'use server';

import { db } from '@/db';
import { timelines } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthenticatedUser } from '../utils';
import { Timeline } from '@/models/interface/timeline';
import { unstable_noStore as noStore } from 'next/cache';

export async function getTimelineAction(): Promise<{ data?: Timeline | null; error?: string }> {
  try {
    noStore();
    const user = await getAuthenticatedUser();
    const timeline = await db.query.timelines.findFirst({
      where: eq(timelines.userId, user.id),
    });
    return { data: timeline };
  } catch (error: any) {
    return { error: error.message || 'שגיאה בטעינת ציר הזמן' };
  }
}
