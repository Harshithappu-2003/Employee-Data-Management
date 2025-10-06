import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from '../route';
import { createTestDb, createTestEmployee } from '@/lib/test-utils';
import { employees } from '@/db/schema';

// Mock the database
jest.mock('@/db', () => ({
  db: createTestDb(),
}));

describe('/api/employees/[id]', () => {
  let testDb: ReturnType<typeof createTestDb>;

  beforeEach(async () => {
    testDb = createTestDb();
    await testDb.delete(employees);
  });

  describe('GET /api/employees/[id]', () => {
    it('should return employee by id', async () => {
      // Arrange
      const testEmployee = createTestEmployee();
      const [inserted] = await testDb.insert(employees).values(testEmployee).returning();

      const request = new NextRequest(`http://localhost:3000/api/employees/${inserted.id}`);

      // Act
      const response = await GET(request, { params: { id: inserted.id.toString() } });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        id: inserted.id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
      });
    });

    it('should return 404 when employee not found', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/employees/999');

      // Act
      const response = await GET(request, { params: { id: '999' } });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe('Employee not found');
    });

    it('should return 400 when invalid id is provided', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/employees/invalid');

      // Act
      const response = await GET(request, { params: { id: 'invalid' } });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Valid ID is required');
    });
  });

  describe('PUT /api/employees/[id]', () => {
    it('should update employee by id', async () => {
      // Arrange
      const testEmployee = createTestEmployee();
      const [inserted] = await testDb.insert(employees).values(testEmployee).returning();

      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        salary: 85000,
      };

      const request = new NextRequest(`http://localhost:3000/api/employees/${inserted.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await PUT(request, { params: { id: inserted.id.toString() } });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.firstName).toBe('Jane');
      expect(data.lastName).toBe('Smith');
      expect(data.salary).toBe(85000);
      expect(data.updatedAt).not.toBe(inserted.updatedAt);
    });

    it('should validate email uniqueness on update', async () => {
      // Arrange
      const employee1 = createTestEmployee({ email: 'employee1@test.com' });
      const employee2 = createTestEmployee({ email: 'employee2@test.com' });
      const [emp1] = await testDb.insert(employees).values(employee1).returning();
      const [emp2] = await testDb.insert(employees).values(employee2).returning();

      const updateData = { email: 'employee1@test.com' };

      const request = new NextRequest(`http://localhost:3000/api/employees/${emp2.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await PUT(request, { params: { id: emp2.id.toString() } });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Email already exists');
    });

    it('should validate salary is positive', async () => {
      // Arrange
      const testEmployee = createTestEmployee();
      const [inserted] = await testDb.insert(employees).values(testEmployee).returning();

      const updateData = { salary: -1000 };

      const request = new NextRequest(`http://localhost:3000/api/employees/${inserted.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await PUT(request, { params: { id: inserted.id.toString() } });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Salary must be a positive number');
    });

    it('should return 404 when employee not found', async () => {
      // Arrange
      const updateData = { firstName: 'Jane' };
      const request = new NextRequest('http://localhost:3000/api/employees/999', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await PUT(request, { params: { id: '999' } });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe('Employee not found');
    });
  });

  describe('DELETE /api/employees/[id]', () => {
    it('should delete employee by id', async () => {
      // Arrange
      const testEmployee = createTestEmployee();
      const [inserted] = await testDb.insert(employees).values(testEmployee).returning();

      const request = new NextRequest(`http://localhost:3000/api/employees/${inserted.id}`, {
        method: 'DELETE',
      });

      // Act
      const response = await DELETE(request, { params: { id: inserted.id.toString() } });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.message).toBe('Employee deleted successfully');
      expect(data.employee.id).toBe(inserted.id);

      // Verify employee is deleted
      const remainingEmployees = await testDb.select().from(employees);
      expect(remainingEmployees).toHaveLength(0);
    });

    it('should return 404 when employee not found', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/employees/999', {
        method: 'DELETE',
      });

      // Act
      const response = await DELETE(request, { params: { id: '999' } });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe('Employee not found');
    });

    it('should return 400 when invalid id is provided', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/employees/invalid', {
        method: 'DELETE',
      });

      // Act
      const response = await DELETE(request, { params: { id: 'invalid' } });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Valid ID is required');
    });
  });
});
