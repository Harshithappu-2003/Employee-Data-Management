import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const employees = sqliteTable('employees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  position: text('position').notNull(),
  department: text('department').notNull(),
  salary: real('salary').notNull(),
  hireDate: text('hire_date').notNull(),
  phone: text('phone'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});