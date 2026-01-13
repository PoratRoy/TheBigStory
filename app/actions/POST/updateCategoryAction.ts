'use server';

import { db } from '@/db';
import { categories, timelines } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '../utils';
import { Category } from '@/models/interface/category';

export async function updateCategoryAction(id: string, formData: Partial<Omit<Category, 'id'>>) {
  try {
    const user = await getAuthenticatedUser();
    const timeline = await db.query.timelines.findFirst({
      where: eq(timelines.userId, user.id),
    });

    if (!timeline) throw new Error('לא מורשה');

    const [updatedCategory] = await db.update(categories)
      .set({
        name: formData.name,
        startYear: formData.startYear,
        endYear: formData.endYear,
        color: formData.color,
        isUnique: formData.isUnique,
        updatedAt: new Date(),
      })
      .where(and(eq(categories.id, id), eq(categories.timelineId, timeline.id)))
      .returning();

    revalidatePath('/');
    return { success: true, data: updatedCategory };
  } catch (error: any) {
    return { error: error.message || 'שגיאה בעדכון קטגוריה' };
  }
}
