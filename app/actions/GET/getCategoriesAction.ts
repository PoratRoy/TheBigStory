'use server';

import { db } from '@/db';
import { categories, timelines } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getAuthenticatedUser } from '../utils';
import { Category } from '@/models/interface/category';
import { unstable_noStore as noStore } from 'next/cache';

export async function getCategoriesAction(): Promise<{ data?: Category[]; error?: string }> {
  try {
    noStore();
    const user = await getAuthenticatedUser();
    const timeline = await db.query.timelines.findFirst({
      where: eq(timelines.userId, user.id),
    });

    if (!timeline) return { data: [] };

    const data = await db.query.categories.findMany({
      where: eq(categories.timelineId, timeline.id),
      orderBy: [asc(categories.startYear)],
    });
    return { data };
  } catch (error: any) {
    return { error: error.message || 'שגיאה בטעינת קטגוריות' };
  }
}
