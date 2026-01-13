import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { db } from './db';
import { users, timelines } from './db/schema';
import { eq } from 'drizzle-orm';

const authSecret = process.env.AUTH_SECRET;

if (!authSecret) {
  if (process.env.NODE_ENV === 'production') {
    console.error('CRITICAL: AUTH_SECRET is not set in production!');
  } else {
    console.warn('AUTH_SECRET is not set, using development fallback.');
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  secret: authSecret || 'development_secret_fallback_for_build',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours (refresh session every day)
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const { name, image, email } = user;
        const googleId = account.providerAccountId;

        try {
          // Check if user exists
          const existingUser = await db.query.users.findFirst({
            where: eq(users.googleId, googleId),
          });

          if (!existingUser) {
            // Create new user
            const [newUser] = await db
              .insert(users)
              .values({
                googleId: googleId,
                name: name || 'משתמש',
                googleImage: image,
                email: email,
              })
              .returning();

            // Create default timeline
            await db.insert(timelines).values({
              userId: newUser.id,
              startYear: 1998,
              interval: 1,
              snapDefault: 1998,
            });
          }
          return true;
        } catch (error) {
          console.error('Error syncing user during sign in:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.googleId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.googleId) {
        session.user.id = token.googleId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
});
