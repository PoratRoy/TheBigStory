import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

const createDb = () => {
  if (!databaseUrl) {
    // During build time, DATABASE_URL might be missing.
    // We return a proxy that only throws when someone actually tries to use the database.
    return new Proxy({} as any, {
      get(_, prop) {
        if (prop === 'then') return undefined; // Handle potential promise-like behavior
        return () => {
          throw new Error(
            'DATABASE_URL is not set. Database operations cannot be performed. ' +
            'Ensure the environment variable is configured in your deployment settings.'
          );
        };

      }
    });
  }

  try {
    const sql = neon(databaseUrl);
    return drizzle(sql, { schema });
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    return new Proxy({} as any, {
      get() {
        throw new Error('Database connection failed to initialize.');
      }
    });
  }
};

export const db = createDb();
