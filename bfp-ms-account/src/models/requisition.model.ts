import { pgTable, varchar, text } from 'drizzle-orm/pg-core';

const requisition = pgTable('requisition', {
  id: text('id').primaryKey(),
});

export default requisition;
