'use server';

import { db } from '@/db';
import { users, timelines } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function syncUser(userData: {
  sub: string;
  name: string;
  picture?: string;
}) {
  try {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.auth0Id, userData.sub),
    });

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const [newUser] = await db.insert(users).values({
      auth0Id: userData.sub,
      name: userData.name,
      googleImage: userData.picture,
    }).returning();

    // Create default timeline
    await db.insert(timelines).values({
      userId: newUser.id,
      startYear: 1998,
      interval: 1,
      snapDefault: 1998,
    });

    return newUser;
  } catch (error) {
    console.error('Error syncing user:', error);
    throw new Error('Failed to sync user');
  }
}
