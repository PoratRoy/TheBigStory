import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth0 } from '@/lib/auth0';
import { User } from '@/models/interface/user';

export async function getAuthenticatedUser(): Promise<User> {
  const session = await auth0.getSession();
  if (!session?.user) throw new Error('משתמש לא מחובר');

  const user = await db.query.users.findFirst({
    where: eq(users.auth0Id, session.user.sub),
  });

  if (!user) throw new Error('משתמש לא נמצא במערכת');
  
  // Mapping the database result to the User interface
  return {
    id: user.id,
    auth0Id: user.auth0Id,
    name: user.name,
    role: user.role as 'user' | 'admin' | null,
    googleImage: user.googleImage,
  };
}
