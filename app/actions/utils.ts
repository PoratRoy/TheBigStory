import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { User } from '@/models/interface/user';

export async function getAuthenticatedUser(): Promise<User> {
  const session = await auth();
  if (!session?.user) throw new Error('משתמש לא מחובר');

  const user = await db.query.users.findFirst({
    where: eq(users.googleId, session.user.id!),
  });

  if (!user) {
    console.error(`User not found for googleId: ${session.user.id}`);
    throw new Error('משתמש לא נמצא במערכת');
  }
  
  return {
    id: user.id,
    googleId: user.googleId,
    name: user.name,
    role: user.role as 'user' | 'admin' | null,
    googleImage: user.googleImage,
  };
}
