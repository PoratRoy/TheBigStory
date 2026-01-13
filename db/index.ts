import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

const createDb = () => {
  if (!databaseUrl) {
    // During build time or if env var is missing, return a proxy that throws a clear error
    const handler: ProxyHandler<any> = {
      get(_, prop) {
        if (prop === 'then') return undefined;
        return new Proxy(() => {}, handler);
      },
      apply() {
        throw new Error(
          'DATABASE_URL is not set. Database operations cannot be performed. ' +
          'Ensure the environment variable is configured in your Vercel/deployment settings.'
        );
      }
    };
    return new Proxy({} as any, handler);
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
