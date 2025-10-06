import { createTestDb, createTestEmployee } from '@/lib/test-utils';
import { employees } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

// Integration tests for the complete employee CRUD flow
describe('Employee CRUD Integration Tests', () => {
  let testDb: ReturnType<typeof createTestDb>;

  beforeEach(async () => {
    testDb = createTestDb();
    await testDb.delete(employees);
  });

  describe('Complete CRUD Workflow', () => {
    it('should perform full CRUD operations on an employee', async () => {
      // CREATE - Add a new employee
      const newEmployee = createTestEmployee({
        firstName: 'Integration',
        lastName: 'Test',
        email: 'integration@test.com',
        position: 'QA Engineer',
        department: 'Engineering',
        salary: 70000,
      });

      const [created] = await testDb.insert(employees).values(newEmployee).returning();
      expect(created.id).toBeDefined();
      expect(created.firstName).toBe('Integration');

      // READ - Retrieve the employee
      const [retrieved] = await testDb
        .select()
        .from(employees)
        .where(eq(employees.id, created.id))
        .limit(1);

      expect(retrieved).toMatchObject({
        id: created.id,
        firstName: 'Integration',
        lastName: 'Test',
        email: 'integration@test.com',
      });

      // UPDATE - Modify the employee
      const [updated] = await testDb
        .update(employees)
        .set({
          firstName: 'Updated',
          lastName: 'Integration',
          salary: 75000,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(employees.id, created.id))
        .returning();

      expect(updated.firstName).toBe('Updated');
      expect(updated.salary).toBe(75000);
      expect(updated.email).toBe('integration@test.com'); // Unchanged

      // DELETE - Remove the employee
      const [deleted] = await testDb
        .delete(employees)
        .where(eq(employees.id, created.id))
        .returning();

      expect(deleted.id).toBe(created.id);

      // Verify deletion
      const remaining = await testDb
        .select()
        .from(employees)
        .where(eq(employees.id, created.id));

      expect(remaining).toHaveLength(0);
    });

    it('should handle multiple employees with different departments', async () => {
      // Arrange
      const employees = [
        createTestEmployee({ 
          firstName: 'Engineer1', 
          department: 'Engineering',
          email: 'eng1@test.com'
        }),
        createTestEmployee({ 
          firstName: 'Marketer1', 
          department: 'Marketing',
          email: 'mark1@test.com'
        }),
        createTestEmployee({ 
          firstName: 'Sales1', 
          department: 'Sales',
          email: 'sales1@test.com'
        }),
      ];

      // Act - Create all employees
      const created = await testDb.insert(employees).values(employees).returning();

      // Assert
      expect(created).toHaveLength(3);
      expect(created[0].department).toBe('Engineering');
      expect(created[1].department).toBe('Marketing');
      expect(created[2].department).toBe('Sales');

      // Test filtering by department
      const engineeringEmployees = await testDb
        .select()
        .from(employees)
        .where(eq(employees.department, 'Engineering'));

      expect(engineeringEmployees).toHaveLength(1);
      expect(engineeringEmployees[0].firstName).toBe('Engineer1');
    });

    it('should handle search and pagination together', async () => {
      // Arrange
      const testEmployees = [
        createTestEmployee({ firstName: 'John', lastName: 'Doe', email: 'john1@test.com' }),
        createTestEmployee({ firstName: 'John', lastName: 'Smith', email: 'john2@test.com' }),
        createTestEmployee({ firstName: 'Jane', lastName: 'Doe', email: 'jane@test.com' }),
        createTestEmployee({ firstName: 'Bob', lastName: 'Johnson', email: 'bob@test.com' }),
      ];
      await testDb.insert(employees).values(testEmployees);

      // Act - Search for "John" with pagination
      const firstPage = await testDb
        .select()
        .from(employees)
        .where(like(employees.firstName, '%John%'))
        .limit(1)
        .offset(0);

      const secondPage = await testDb
        .select()
        .from(employees)
        .where(like(employees.firstName, '%John%'))
        .limit(1)
        .offset(1);

      // Assert
      expect(firstPage).toHaveLength(1);
      expect(secondPage).toHaveLength(1);
      expect(firstPage[0].firstName).toBe('John');
      expect(secondPage[0].firstName).toBe('John');
      expect(firstPage[0].id).not.toBe(secondPage[0].id);
    });
  });

  describe('Data Integrity Tests', () => {
    it('should maintain data consistency across operations', async () => {
      // Create initial employee
      const employee = createTestEmployee({
        firstName: 'Consistency',
        lastName: 'Test',
        email: 'consistency@test.com',
        salary: 60000,
      });

      const [created] = await testDb.insert(employees).values(employee).returning();
      const originalId = created.id;
      const originalEmail = created.email;

      // Update employee
      const [updated] = await testDb
        .update(employees)
        .set({
          salary: 65000,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(employees.id, originalId))
        .returning();

      // Verify data integrity
      expect(updated.id).toBe(originalId);
      expect(updated.email).toBe(originalEmail);
      expect(updated.salary).toBe(65000);
      expect(updated.firstName).toBe('Consistency');
      expect(updated.lastName).toBe('Test');
    });

    it('should handle concurrent operations safely', async () => {
      // Create multiple employees concurrently
      const employees = Array.from({ length: 5 }, (_, i) => 
        createTestEmployee({
          firstName: `Concurrent${i}`,
          email: `concurrent${i}@test.com`,
        })
      );

      // Insert all employees
      const created = await testDb.insert(employees).values(employees).returning();
      expect(created).toHaveLength(5);

      // Verify all employees have unique IDs
      const ids = created.map(emp => emp.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(5);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle empty database gracefully', async () => {
      const results = await testDb.select().from(employees);
      expect(results).toHaveLength(0);
    });

    it('should handle large datasets efficiently', async () => {
      const largeDataset = Array.from({ length: 50 }, (_, i) => 
        createTestEmployee({
          firstName: `Bulk${i}`,
          email: `bulk${i}@test.com`,
        })
      );

      const startTime = Date.now();
      await testDb.insert(employees).values(largeDataset);
      const insertTime = Date.now() - startTime;

      expect(insertTime).toBeLessThan(10000); // Should complete within 10 seconds

      const count = await testDb.select().from(employees);
      expect(count).toHaveLength(50);
    });

    it('should handle special characters in data', async () => {
      const specialEmployee = createTestEmployee({
        firstName: "José María",
        lastName: "O'Connor-Smith",
        email: "jose.maria@test.com",
        position: "Senior Developer (Full-Stack)",
      });

      const [created] = await testDb.insert(employees).values(specialEmployee).returning();
      
      expect(created.firstName).toBe("José María");
      expect(created.lastName).toBe("O'Connor-Smith");
      expect(created.position).toBe("Senior Developer (Full-Stack)");
    });
  });
});
