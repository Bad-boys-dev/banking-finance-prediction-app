import { pgTable, varchar, text } from 'drizzle-orm/pg-core';

const userSchema = pgTable('users', {
  id: text('id').primaryKey(),
  username: varchar('username').notNull(),
  firstName: varchar('firstName'),
  surname: varchar('surname'),
  email: varchar('email').notNull(),
  password: varchar('password').notNull(),
});

export default userSchema;
