import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === 'production') {
  // During build time on some platforms, DATABASE_URL might be missing.
  // We only want to throw if we're actually trying to use the DB in production.
  console.warn('DATABASE_URL is not set. Database operations will fail.');
}

const sql = neon(databaseUrl || '');
export const db = drizzle(sql, { schema });
