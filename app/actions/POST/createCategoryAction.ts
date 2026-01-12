'use server';

import { db } from '@/db';
import { categories, timelines } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '../utils';
import { Category } from '@/models/interface/category';

export async function createCategoryAction(formData: Partial<Omit<Category, 'id'>>) {
  try {
    if (!formData.name) throw new Error('שם הקטגוריה הוא חובה');

    const user = await getAuthenticatedUser();
    const timeline = await db.query.timelines.findFirst({
      where: eq(timelines.userId, user.id),
    });

    if (!timeline) throw new Error('ציר זמן לא נמצא');

    await db.insert(categories).values({
      timelineId: timeline.id,
      name: formData.name,
      startYear: formData.startYear,
      endYear: formData.endYear,
      color: formData.color,
      isUnique: formData.isUnique ?? false,
    });

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'שגיאה בהוספת קטגוריה' };
  }
}
