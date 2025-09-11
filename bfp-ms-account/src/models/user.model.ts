import { pgTable, varchar, text, json } from 'drizzle-orm/pg-core';

const userSchema = pgTable('users', {
  id: text('id').primaryKey(),
  username: varchar('username').notNull(),
  firstName: varchar('first_name'),
  surname: varchar('surname'),
  email: varchar('email').notNull(),
  password: varchar('password').notNull(),
  accounts: json('accounts').notNull()
});

export default userSchema;
