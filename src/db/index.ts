import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

// Create Turso client (works with local file or cloud)
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

console.log('✅ Database connected (Turso/SQLite)');

export const db = drizzle(client);