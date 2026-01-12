import { pgTable, uuid, text, integer, boolean, pgEnum, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role_type', ['user', 'admin']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  googleId: text('google_id').unique(),
  email: text('email').unique(),
  name: text('name').notNull(),
  role: roleEnum('role').default('user'),
  googleImage: text('google_image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const timelines = pgTable('timelines', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  startYear: integer('start_year').default(1998),
  interval: integer('interval').default(1),
  snapDefault: integer('snap_default').default(1998),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  timelineId: uuid('timeline_id').references(() => timelines.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  isUnique: boolean('is_unique').default(false),
  startYear: integer('start_year'),
  endYear: integer('end_year'),
  color: text('color').default('#3b82f6'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  text: text('text').notNull(),
  position: integer('position').default(0),
  isCollapse: boolean('is_collapse').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const eventCategories = pgTable('event_categories', {
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.eventId, t.categoryId] }),
}));
