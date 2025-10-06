import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { employees } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single employee by ID
    if (id) {
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
    }

    // List employees with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const department = searchParams.get('department');

    let query = db.select().from(employees);

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(employees.firstName, `%${search}%`),
          like(employees.lastName, `%${search}%`),
          like(employees.email, `%${search}%`),
          like(employees.position, `%${search}%`),
          like(employees.department, `%${search}%`)
        )
      );
    }

    if (department) {
      conditions.push(eq(employees.department, department));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, position, department, salary, hireDate, phone } = body;

    // Validation: Required fields
    if (!firstName || firstName.trim() === '') {
      return NextResponse.json(
        { error: 'First name is required', code: 'MISSING_FIRST_NAME' },
        { status: 400 }
      );
    }

    if (!lastName || lastName.trim() === '') {
      return NextResponse.json(
        { error: 'Last name is required', code: 'MISSING_LAST_NAME' },
        { status: 400 }
      );
    }

    if (!email || email.trim() === '') {
      return NextResponse.json(
        { error: 'Email is required', code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    // Validation: Email format
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL_FORMAT' },
        { status: 400 }
      );
    }

    if (!position || position.trim() === '') {
      return NextResponse.json(
        { error: 'Position is required', code: 'MISSING_POSITION' },
        { status: 400 }
      );
    }

    if (!department || department.trim() === '') {
      return NextResponse.json(
        { error: 'Department is required', code: 'MISSING_DEPARTMENT' },
        { status: 400 }
      );
    }

    if (salary === undefined || salary === null) {
      return NextResponse.json(
        { error: 'Salary is required', code: 'MISSING_SALARY' },
        { status: 400 }
      );
    }

    // Validation: Salary must be positive
    if (typeof salary !== 'number' || salary <= 0) {
      return NextResponse.json(
        { error: 'Salary must be a positive number', code: 'INVALID_SALARY' },
        { status: 400 }
      );
    }

    if (!hireDate || hireDate.trim() === '') {
      return NextResponse.json(
        { error: 'Hire date is required', code: 'MISSING_HIRE_DATE' },
        { status: 400 }
      );
    }

    // Validation: ISO date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    if (!dateRegex.test(hireDate)) {
      return NextResponse.json(
        { error: 'Hire date must be in ISO format', code: 'INVALID_HIRE_DATE_FORMAT' },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existingEmployee = await db
      .select()
      .from(employees)
      .where(eq(employees.email, email.toLowerCase().trim()))
      .limit(1);

    if (existingEmployee.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists', code: 'EMAIL_EXISTS' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      position: position.trim(),
      department: department.trim(),
      salary,
      hireDate,
      phone: phone ? phone.trim() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newEmployee = await db
      .insert(employees)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newEmployee[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if employee exists
    const existingEmployee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, parseInt(id)))
      .limit(1);

    if (existingEmployee.length === 0) {
      return NextResponse.json(
        { error: 'Employee not found', code: 'EMPLOYEE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, position, department, salary, hireDate, phone } = body;

    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    // Validate and add fields if provided
    if (firstName !== undefined) {
      if (firstName.trim() === '') {
        return NextResponse.json(
          { error: 'First name cannot be empty', code: 'INVALID_FIRST_NAME' },
          { status: 400 }
        );
      }
      updates.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      if (lastName.trim() === '') {
        return NextResponse.json(
          { error: 'Last name cannot be empty', code: 'INVALID_LAST_NAME' },
          { status: 400 }
        );
      }
      updates.lastName = lastName.trim();
    }

    if (email !== undefined) {
      if (email.trim() === '') {
        return NextResponse.json(
          { error: 'Email cannot be empty', code: 'INVALID_EMAIL' },
          { status: 400 }
        );
      }

      if (!email.includes('@')) {
        return NextResponse.json(
          { error: 'Invalid email format', code: 'INVALID_EMAIL_FORMAT' },
          { status: 400 }
        );
      }

      // Check email uniqueness (excluding current employee)
      const emailCheck = await db
        .select()
        .from(employees)
        .where(eq(employees.email, email.toLowerCase().trim()))
        .limit(1);

      if (emailCheck.length > 0 && emailCheck[0].id !== parseInt(id)) {
        return NextResponse.json(
          { error: 'Email already exists', code: 'EMAIL_EXISTS' },
          { status: 400 }
        );
      }

      updates.email = email.toLowerCase().trim();
    }

    if (position !== undefined) {
      if (position.trim() === '') {
        return NextResponse.json(
          { error: 'Position cannot be empty', code: 'INVALID_POSITION' },
          { status: 400 }
        );
      }
      updates.position = position.trim();
    }

    if (department !== undefined) {
      if (department.trim() === '') {
        return NextResponse.json(
          { error: 'Department cannot be empty', code: 'INVALID_DEPARTMENT' },
          { status: 400 }
        );
      }
      updates.department = department.trim();
    }

    if (salary !== undefined) {
      if (typeof salary !== 'number' || salary <= 0) {
        return NextResponse.json(
          { error: 'Salary must be a positive number', code: 'INVALID_SALARY' },
          { status: 400 }
        );
      }
      updates.salary = salary;
    }

    if (hireDate !== undefined) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
      if (!dateRegex.test(hireDate)) {
        return NextResponse.json(
          { error: 'Hire date must be in ISO format', code: 'INVALID_HIRE_DATE_FORMAT' },
          { status: 400 }
        );
      }
      updates.hireDate = hireDate;
    }

    if (phone !== undefined) {
      updates.phone = phone ? phone.trim() : null;
    }

    const updatedEmployee = await db
      .update(employees)
      .set(updates)
      .where(eq(employees.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedEmployee[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if employee exists
    const existingEmployee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, parseInt(id)))
      .limit(1);

    if (existingEmployee.length === 0) {
      return NextResponse.json(
        { error: 'Employee not found', code: 'EMPLOYEE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedEmployee = await db
      .delete(employees)
      .where(eq(employees.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Employee deleted successfully',
        employee: deletedEmployee[0],
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