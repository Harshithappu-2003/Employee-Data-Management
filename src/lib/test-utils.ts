import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';
import { migrate } from 'drizzle-orm/libsql/migrator';

// Create a test database client
export function createTestDb() {
  const client = createClient({
    url: ':memory:', // Use in-memory database for tests
  });
  
  const db = drizzle(client, { schema });
  
  // Create the table for testing
  client.execute(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      position TEXT NOT NULL,
      department TEXT NOT NULL,
      salary REAL NOT NULL,
      hire_date TEXT NOT NULL,
      phone TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  
  return db;
}

// Test data factory
export const createTestEmployee = (overrides = {}) => ({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@test.com',
  position: 'Developer',
  department: 'Engineering',
  salary: 75000,
  hireDate: new Date('2023-01-01').toISOString(),
  phone: '+1-555-0123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Helper to create multiple test employees
export const createTestEmployees = (count: number) => {
  return Array.from({ length: count }, (_, i) => 
    createTestEmployee({
      firstName: `Test${i + 1}`,
      lastName: 'User',
      email: `test${i + 1}@test.com`,
    })
  );
};
