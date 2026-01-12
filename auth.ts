import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { users, timelines } from "./db/schema";
import { eq } from "drizzle-orm";

if (!process.env.AUTH_SECRET) {
  throw new Error("Missing AUTH_SECRET environment variable. Please add it to your .env.local file.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { name, image, email } = user;
        const googleId = account.providerAccountId;
        
        try {
          // Check if user exists
          const existingUser = await db.query.users.findFirst({
            where: eq(users.googleId, googleId),
          });

          if (!existingUser) {
            // Create new user
            const [newUser] = await db.insert(users).values({
              googleId: googleId,
              name: name || "משתמש",
              googleImage: image,
              email: email,
            }).returning();

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
          console.error("Error syncing user during sign in:", error);
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
    signIn: "/sign-in",
  },
});
