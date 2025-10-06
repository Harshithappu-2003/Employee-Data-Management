import { createTestDb, createTestEmployee, createTestEmployees } from '@/lib/test-utils';
import { employees } from '@/db/schema';
import { eq, and, like, or } from 'drizzle-orm';

describe('Database Operations', () => {
  let testDb: ReturnType<typeof createTestDb>;

  beforeEach(async () => {
    testDb = createTestDb();
    await testDb.delete(employees);
  });

  describe('Employee CRUD Operations', () => {
    it('should insert a new employee', async () => {
      // Arrange
      const testEmployee = createTestEmployee();

      // Act
      const [inserted] = await testDb.insert(employees).values(testEmployee).returning();

      // Assert
      expect(inserted).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        position: 'Developer',
        department: 'Engineering',
        salary: 75000,
      });
      expect(inserted.id).toBeDefined();
      expect(inserted.createdAt).toBeDefined();
      expect(inserted.updatedAt).toBeDefined();
    });

    it('should select all employees', async () => {
      // Arrange
      const testEmployees = createTestEmployees(3);
      await testDb.insert(employees).values(testEmployees);

      // Act
      const allEmployees = await testDb.select().from(employees);

      // Assert
      expect(allEmployees).toHaveLength(3);
      expect(allEmployees[0]).toMatchObject({
        firstName: 'Test1',
        lastName: 'User',
        email: 'test1@test.com',
      });
    });

    it('should select employee by id', async () => {
      // Arrange
      const testEmployee = createTestEmployee();
      const [inserted] = await testDb.insert(employees).values(testEmployee).returning();

      // Act
      const [found] = await testDb
        .select()
        .from(employees)
        .where(eq(employees.id, inserted.id))
        .limit(1);

      // Assert
      expect(found).toMatchObject({
        id: inserted.id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
      });
    });

    it('should update an employee', async () => {
      // Arrange
      const testEmployee = createTestEmployee();
      const [inserted] = await testDb.insert(employees).values(testEmployee).returning();

      // Act
      const [updated] = await testDb
        .update(employees)
        .set({
          firstName: 'Jane',
          lastName: 'Smith',
          salary: 80000,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(employees.id, inserted.id))
        .returning();

      // Assert
      expect(updated.firstName).toBe('Jane');
      expect(updated.lastName).toBe('Smith');
      expect(updated.salary).toBe(80000);
      expect(updated.email).toBe(testEmployee.email); // Unchanged
      expect(updated.updatedAt).not.toBe(inserted.updatedAt);
    });

    it('should delete an employee', async () => {
      // Arrange
      const testEmployee = createTestEmployee();
      const [inserted] = await testDb.insert(employees).values(testEmployee).returning();

      // Act
      const [deleted] = await testDb
        .delete(employees)
        .where(eq(employees.id, inserted.id))
        .returning();

      // Assert
      expect(deleted.id).toBe(inserted.id);

      // Verify employee is deleted
      const remainingEmployees = await testDb.select().from(employees);
      expect(remainingEmployees).toHaveLength(0);
    });
  });

  describe('Database Queries and Filtering', () => {
    beforeEach(async () => {
      const testEmployees = [
        createTestEmployee({ firstName: 'John', lastName: 'Doe', department: 'Engineering' }),
        createTestEmployee({ firstName: 'Jane', lastName: 'Smith', department: 'Marketing', email: 'jane@test.com' }),
        createTestEmployee({ firstName: 'Bob', lastName: 'Johnson', department: 'Engineering', email: 'bob@test.com' }),
        createTestEmployee({ firstName: 'Alice', lastName: 'Brown', department: 'Sales', email: 'alice@test.com' }),
      ];
      await testDb.insert(employees).values(testEmployees);
    });

    it('should filter employees by department', async () => {
      // Act
      const engineeringEmployees = await testDb
        .select()
        .from(employees)
        .where(eq(employees.department, 'Engineering'));

      // Assert
      expect(engineeringEmployees).toHaveLength(2);
      expect(engineeringEmployees.every(emp => emp.department === 'Engineering')).toBe(true);
    });

    it('should search employees by name', async () => {
      // Act
      const johnEmployees = await testDb
        .select()
        .from(employees)
        .where(like(employees.firstName, '%John%'));

      // Assert
      expect(johnEmployees).toHaveLength(1);
      expect(johnEmployees[0].firstName).toBe('John');
    });

    it('should search employees by email', async () => {
      // Act
      const janeEmployees = await testDb
        .select()
        .from(employees)
        .where(like(employees.email, '%jane%'));

      // Assert
      expect(janeEmployees).toHaveLength(1);
      expect(janeEmployees[0].email).toBe('jane@test.com');
    });

    it('should search employees by multiple criteria', async () => {
      // Act
      const results = await testDb
        .select()
        .from(employees)
        .where(
          or(
            like(employees.firstName, '%John%'),
            like(employees.lastName, '%Smith%')
          )
        );

      // Assert
      expect(results).toHaveLength(2);
      expect(results.some(emp => emp.firstName === 'John')).toBe(true);
      expect(results.some(emp => emp.lastName === 'Smith')).toBe(true);
    });

    it('should combine department and name filters', async () => {
      // Act
      const results = await testDb
        .select()
        .from(employees)
        .where(
          and(
            eq(employees.department, 'Engineering'),
            like(employees.firstName, '%John%')
          )
        );

      // Assert
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('John');
      expect(results[0].department).toBe('Engineering');
    });

    it('should limit and offset results', async () => {
      // Act
      const firstPage = await testDb
        .select()
        .from(employees)
        .limit(2)
        .offset(0);

      const secondPage = await testDb
        .select()
        .from(employees)
        .limit(2)
        .offset(2);

      // Assert
      expect(firstPage).toHaveLength(2);
      expect(secondPage).toHaveLength(2);
      expect(firstPage[0].id).not.toBe(secondPage[0].id);
    });
  });

  describe('Database Constraints and Validation', () => {
    it('should enforce unique email constraint', async () => {
      // Arrange
      const employee1 = createTestEmployee({ email: 'duplicate@test.com' });
      const employee2 = createTestEmployee({ 
        email: 'duplicate@test.com', 
        firstName: 'Jane',
        lastName: 'Smith'
      });

      // Act & Assert
      await testDb.insert(employees).values(employee1);
      
      // This should throw an error due to unique constraint
      await expect(
        testDb.insert(employees).values(employee2)
      ).rejects.toThrow();
    });

    it('should handle null phone numbers', async () => {
      // Arrange
      const employeeWithNullPhone = createTestEmployee({ phone: null });

      // Act
      const [inserted] = await testDb.insert(employees).values(employeeWithNullPhone).returning();

      // Assert
      expect(inserted.phone).toBeNull();
    });

    it('should handle empty string phone numbers', async () => {
      // Arrange
      const employeeWithEmptyPhone = createTestEmployee({ phone: '' });

      // Act
      const [inserted] = await testDb.insert(employees).values(employeeWithEmptyPhone).returning();

      // Assert
      expect(inserted.phone).toBe('');
    });

    it('should preserve data types correctly', async () => {
      // Arrange
      const testEmployee = createTestEmployee({
        salary: 75000.50,
        hireDate: '2023-01-01T00:00:00.000Z',
      });

      // Act
      const [inserted] = await testDb.insert(employees).values(testEmployee).returning();

      // Assert
      expect(typeof inserted.salary).toBe('number');
      expect(inserted.salary).toBe(75000.50);
      expect(typeof inserted.hireDate).toBe('string');
      expect(inserted.hireDate).toBe('2023-01-01T00:00:00.000Z');
    });
  });

  describe('Database Performance and Edge Cases', () => {
    it('should handle large datasets efficiently', async () => {
      // Arrange
      const largeDataset = createTestEmployees(100);
      const startTime = Date.now();

      // Act
      await testDb.insert(employees).values(largeDataset);
      const insertTime = Date.now() - startTime;

      // Assert
      expect(insertTime).toBeLessThan(5000); // Should complete within 5 seconds
      
      const count = await testDb.select().from(employees);
      expect(count).toHaveLength(100);
    });

    it('should handle empty result sets', async () => {
      // Act
      const results = await testDb
        .select()
        .from(employees)
        .where(eq(employees.department, 'NonExistent'));

      // Assert
      expect(results).toHaveLength(0);
    });

    it('should handle case-insensitive email searches', async () => {
      // Arrange
      const testEmployee = createTestEmployee({ email: 'Test@Example.COM' });
      await testDb.insert(employees).values(testEmployee);

      // Act
      const results = await testDb
        .select()
        .from(employees)
        .where(like(employees.email, '%test@example.com%'));

      // Assert
      expect(results).toHaveLength(1);
    });

    it('should maintain referential integrity', async () => {
      // Arrange
      const testEmployee = createTestEmployee();
      const [inserted] = await testDb.insert(employees).values(testEmployee).returning();

      // Act
      const [found] = await testDb
        .select()
        .from(employees)
        .where(eq(employees.id, inserted.id))
        .limit(1);

      // Assert
      expect(found.id).toBe(inserted.id);
      expect(found.email).toBe(inserted.email);
      expect(found.createdAt).toBe(inserted.createdAt);
    });
  });
});
