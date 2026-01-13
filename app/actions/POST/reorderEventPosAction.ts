'use server';

import { db } from '@/db';
import { events } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '../utils';

export async function reorderEventPosAction(eventIds: string[]) {
  try {
    const user = await getAuthenticatedUser();

    if (eventIds.length === 0) return { success: true };

    // Use a VALUES join for batch updating positions.
    // This is more efficient and robust than a CASE statement for Postgres.
    const valuesList = eventIds.map((id, index) => sql`(${id}::uuid, ${index}::integer)`);
    
    await db.execute(sql`
      UPDATE events AS e
      SET position = v.new_pos
      FROM (VALUES ${sql.join(valuesList, sql`, `)}) AS v(id, new_pos)
      WHERE e.id = v.id AND e.user_id = ${user.id}::uuid
    `);

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Reorder Error:', error);
    return { error: error.message || 'שגיאה בסידור מחדש של האירועים' };
  }
}
