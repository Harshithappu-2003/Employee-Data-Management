import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { employees } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const employee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, parseInt(id)))
      .limit(1);

    if (employee.length === 0) {
      return NextResponse.json(
        { error: 'Employee not found', code: 'EMPLOYEE_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(employee[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const employeeId = parseInt(id);

    const existingEmployee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, employeeId))
      .limit(1);

    if (existingEmployee.length === 0) {
      return NextResponse.json(
        { error: 'Employee not found', code: 'EMPLOYEE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      position,
      department,
      salary,
      hireDate,
      phone,
    } = body;

    if (email !== undefined) {
      const trimmedEmail = email.trim().toLowerCase();
      
      if (!trimmedEmail.includes('@')) {
        return NextResponse.json(
          { error: 'Invalid email format', code: 'INVALID_EMAIL' },
          { status: 400 }
        );
      }

      const emailExists = await db
        .select()
        .from(employees)
        .where(and(eq(employees.email, trimmedEmail), ne(employees.id, employeeId)))
        .limit(1);

      if (emailExists.length > 0) {
        return NextResponse.json(
          { error: 'Email already exists', code: 'EMAIL_EXISTS' },
          { status: 400 }
        );
      }
    }

    if (salary !== undefined) {
      if (typeof salary !== 'number' || salary <= 0) {
        return NextResponse.json(
          { error: 'Salary must be a positive number', code: 'INVALID_SALARY' },
          { status: 400 }
        );
      }
    }

    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (firstName !== undefined) updates.firstName = firstName.trim();
    if (lastName !== undefined) updates.lastName = lastName.trim();
    if (email !== undefined) updates.email = email.trim().toLowerCase();
    if (position !== undefined) updates.position = position.trim();
    if (department !== undefined) updates.department = department.trim();
    if (salary !== undefined) updates.salary = salary;
    if (hireDate !== undefined) updates.hireDate = hireDate;
    if (phone !== undefined) updates.phone = phone ? phone.trim() : null;

    const updated = await db
      .update(employees)
      .set(updates)
      .where(eq(employees.id, employeeId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update employee', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const employeeId = parseInt(id);

    const existingEmployee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, employeeId))
      .limit(1);

    if (existingEmployee.length === 0) {
      return NextResponse.json(
        { error: 'Employee not found', code: 'EMPLOYEE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(employees)
      .where(eq(employees.id, employeeId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete employee', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Employee deleted successfully',
        employee: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}