
import { db } from './db';
import { users } from './db/schema';

async function checkUsers() {
  const allUsers = await db.select().from(users);
  console.log('Users in DB:', JSON.stringify(allUsers, null, 2));
}

checkUsers().catch(console.error);
