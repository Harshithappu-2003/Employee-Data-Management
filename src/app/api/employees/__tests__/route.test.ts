import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '../route';
import { createTestDb, createTestEmployee } from '@/lib/test-utils';
import { employees } from '@/db/schema';

// Mock the database
jest.mock('@/db', () => ({
  db: createTestDb(),
}));

describe('/api/employees', () => {
  let testDb: ReturnType<typeof createTestDb>;

  beforeEach(async () => {
    testDb = createTestDb();
    // Clear the test database before each test
    await testDb.delete(employees);
  });

  describe('GET /api/employees', () => {
    it('should return all employees when no query parameters', async () => {
      // Arrange
      const testEmployees = [
        createTestEmployee({ firstName: 'John', lastName: 'Doe' }),
        createTestEmployee({ firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com' }),
      ];
      await testDb.insert(employees).values(testEmployees);

      const request = new NextRequest('http://localhost:3000/api/employees');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0]).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
      });
    });

    it('should return single employee when id parameter is provided', async () => {
      // Arrange
      const testEmployee = createTestEmployee();
      const [inserted] = await testDb.insert(employees).values(testEmployee).returning();

      const request = new NextRequest(`http://localhost:3000/api/employees?id=${inserted.id}`);

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        id: inserted.id,
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('should return 404 when employee with id not found', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/employees?id=999');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe('Employee not found');
    });

    it('should return 400 when invalid id is provided', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/employees?id=invalid');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Valid ID is required');
    });

    it('should filter employees by search term', async () => {
      // Arrange
      const testEmployees = [
        createTestEmployee({ firstName: 'John', lastName: 'Doe' }),
        createTestEmployee({ firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com' }),
        createTestEmployee({ firstName: 'Bob', lastName: 'Johnson', email: 'bob@test.com' }),
      ];
      await testDb.insert(employees).values(testEmployees);

      const request = new NextRequest('http://localhost:3000/api/employees?search=John');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toHaveLength(2); // John Doe and Bob Johnson
    });

    it('should filter employees by department', async () => {
      // Arrange
      const testEmployees = [
        createTestEmployee({ department: 'Engineering' }),
        createTestEmployee({ department: 'Marketing', email: 'marketing@test.com' }),
        createTestEmployee({ department: 'Engineering', email: 'eng2@test.com' }),
      ];
      await testDb.insert(employees).values(testEmployees);

      const request = new NextRequest('http://localhost:3000/api/employees?department=Engineering');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data.every((emp: any) => emp.department === 'Engineering')).toBe(true);
    });

    it('should respect limit parameter', async () => {
      // Arrange
      const testEmployees = createTestEmployees(5);
      await testDb.insert(employees).values(testEmployees);

      const request = new NextRequest('http://localhost:3000/api/employees?limit=3');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toHaveLength(3);
    });
  });

  describe('POST /api/employees', () => {
    it('should create a new employee with valid data', async () => {
      // Arrange
      const employeeData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        position: 'Developer',
        department: 'Engineering',
        salary: 75000,
        hireDate: new Date('2023-01-01').toISOString(),
        phone: '+1-555-0123',
      };

      const request = new NextRequest('http://localhost:3000/api/employees', {
        method: 'POST',
        body: JSON.stringify(employeeData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        position: 'Developer',
        salary: 75000,
      });
      expect(data.id).toBeDefined();
      expect(data.createdAt).toBeDefined();
      expect(data.updatedAt).toBeDefined();
    });

    it('should return 400 when required fields are missing', async () => {
      // Arrange
      const incompleteData = {
        firstName: 'John',
        // Missing lastName, email, etc.
      };

      const request = new NextRequest('http://localhost:3000/api/employees', {
        method: 'POST',
        body: JSON.stringify(incompleteData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Last name is required');
    });

    it('should return 400 when email format is invalid', async () => {
      // Arrange
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        position: 'Developer',
        department: 'Engineering',
        salary: 75000,
        hireDate: new Date('2023-01-01').toISOString(),
      };

      const request = new NextRequest('http://localhost:3000/api/employees', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid email format');
    });

    it('should return 400 when salary is not positive', async () => {
      // Arrange
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        position: 'Developer',
        department: 'Engineering',
        salary: -1000,
        hireDate: new Date('2023-01-01').toISOString(),
      };

      const request = new NextRequest('http://localhost:3000/api/employees', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Salary must be a positive number');
    });

    it('should return 400 when email already exists', async () => {
      // Arrange
      const existingEmployee = createTestEmployee();
      await testDb.insert(employees).values(existingEmployee);

      const duplicateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'john.doe@test.com', // Same email as existing
        position: 'Manager',
        department: 'Marketing',
        salary: 80000,
        hireDate: new Date('2023-01-01').toISOString(),
      };

      const request = new NextRequest('http://localhost:3000/api/employees', {
        method: 'POST',
        body: JSON.stringify(duplicateData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Email already exists');
    });

    it('should sanitize input data', async () => {
      // Arrange
      const dataWithWhitespace = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: '  JOHN.DOE@TEST.COM  ',
        position: '  Developer  ',
        department: '  Engineering  ',
        salary: 75000,
        hireDate: new Date('2023-01-01').toISOString(),
      };

      const request = new NextRequest('http://localhost:3000/api/employees', {
        method: 'POST',
        body: JSON.stringify(dataWithWhitespace),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.firstName).toBe('John');
      expect(data.lastName).toBe('Doe');
      expect(data.email).toBe('john.doe@test.com');
      expect(data.position).toBe('Developer');
      expect(data.department).toBe('Engineering');
    });
  });

  describe('PUT /api/employees', () => {
    it('should update an existing employee', async () => {
      // Arrange
      const testEmployee = createTestEmployee();
      const [inserted] = await testDb.insert(employees).values(testEmployee).returning();

      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        salary: 80000,
      };

      const request = new NextRequest(`http://localhost:3000/api/employees?id=${inserted.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await PUT(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.firstName).toBe('Jane');
      expect(data.lastName).toBe('Smith');
      expect(data.salary).toBe(80000);
      expect(data.email).toBe(testEmployee.email); // Unchanged
    });

    it('should return 404 when employee not found', async () => {
      // Arrange
      const updateData = { firstName: 'Jane' };
      const request = new NextRequest('http://localhost:3000/api/employees?id=999', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await PUT(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe('Employee not found');
    });

    it('should validate email uniqueness on update', async () => {
      // Arrange
      const employee1 = createTestEmployee({ email: 'employee1@test.com' });
      const employee2 = createTestEmployee({ email: 'employee2@test.com' });
      const [emp1] = await testDb.insert(employees).values(employee1).returning();
      const [emp2] = await testDb.insert(employees).values(employee2).returning();

      const updateData = { email: 'employee1@test.com' }; // Try to use emp1's email for emp2

      const request = new NextRequest(`http://localhost:3000/api/employees?id=${emp2.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await PUT(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Email already exists');
    });
  });

  describe('DELETE /api/employees', () => {
    it('should delete an existing employee', async () => {
      // Arrange
      const testEmployee = createTestEmployee();
      const [inserted] = await testDb.insert(employees).values(testEmployee).returning();

      const request = new NextRequest(`http://localhost:3000/api/employees?id=${inserted.id}`, {
        method: 'DELETE',
      });

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.message).toBe('Employee deleted successfully');
      expect(data.employee.id).toBe(inserted.id);

      // Verify employee is actually deleted
      const remainingEmployees = await testDb.select().from(employees);
      expect(remainingEmployees).toHaveLength(0);
    });

    it('should return 404 when employee not found', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/employees?id=999', {
        method: 'DELETE',
      });

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe('Employee not found');
    });

    it('should return 400 when invalid id is provided', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/employees?id=invalid', {
        method: 'DELETE',
      });

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Valid ID is required');
    });
  });
});
