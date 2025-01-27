import { pgTable, text, varchar, integer } from 'drizzle-orm/pg-core';

const details = pgTable('details', {
  id: text('id').primaryKey(),
  resourceId: varchar('resourceId'),
  iban: varchar('iban'),
  scan: varchar('scan'),
  currency: varchar('currency').notNull(),
  ownerName: varchar('ownerName'),
});
export default details;
