// Business logic validation tests

describe('Employee Validation Logic', () => {
  describe('Email Validation', () => {
    const validEmails = [
      'user@example.com',
      'test.email@domain.co.uk',
      'user+tag@example.org',
      'user123@test-domain.com',
    ];

    const invalidEmails = [
      'invalid-email',
      '@domain.com',
      'user@',
      'user@domain',
      'user..name@domain.com',
      '',
      'user@domain..com',
    ];

    it('should accept valid email formats', () => {
      validEmails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        expect(isValid).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      invalidEmails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Salary Validation', () => {
    it('should accept positive numbers', () => {
      const validSalaries = [1, 1000, 50000, 100000, 999999];
      validSalaries.forEach(salary => {
        expect(typeof salary === 'number' && salary > 0).toBe(true);
      });
    });

    it('should reject non-positive numbers', () => {
      const invalidSalaries = [0, -1000, -1, 'not-a-number', null, undefined];
      invalidSalaries.forEach(salary => {
        const isValid = typeof salary === 'number' && salary > 0;
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Required Field Validation', () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'position', 'department', 'salary', 'hireDate'];

    it('should identify missing required fields', () => {
      const incompleteData = {
        firstName: 'John',
        // Missing other required fields
      };

      requiredFields.forEach(field => {
        if (field === 'salary') {
          const isValid = incompleteData[field as keyof typeof incompleteData] !== undefined && 
                         incompleteData[field as keyof typeof incompleteData] !== null;
          expect(isValid).toBe(false);
        } else {
          const value = incompleteData[field as keyof typeof incompleteData];
          const isValid = value !== undefined && value !== null && value !== '';
          expect(isValid).toBe(false);
        }
      });
    });

    it('should accept all required fields', () => {
      const completeData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        position: 'Developer',
        department: 'Engineering',
        salary: 75000,
        hireDate: new Date().toISOString(),
      };

      requiredFields.forEach(field => {
        if (field === 'salary') {
          const isValid = typeof completeData[field as keyof typeof completeData] === 'number' && 
                         (completeData[field as keyof typeof completeData] as number) > 0;
          expect(isValid).toBe(true);
        } else {
          const value = completeData[field as keyof typeof completeData];
          const isValid = value !== undefined && value !== null && value !== '';
          expect(isValid).toBe(true);
        }
      });
    });
  });

  describe('Date Validation', () => {
    it('should accept valid ISO date strings', () => {
      const validDates = [
        '2023-01-01T00:00:00.000Z',
        '2023-12-31T23:59:59.999Z',
        new Date().toISOString(),
      ];

      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
      
      validDates.forEach(date => {
        expect(dateRegex.test(date)).toBe(true);
      });
    });

    it('should reject invalid date formats', () => {
      const invalidDates = [
        '2023-01-01',
        '01/01/2023',
        '2023-13-01T00:00:00.000Z',
        '2023-01-32T00:00:00.000Z',
        'not-a-date',
        '',
      ];

      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
      
      invalidDates.forEach(date => {
        expect(dateRegex.test(date)).toBe(false);
      });
    });
  });

  describe('Input Sanitization', () => {
    it('should trim whitespace from string fields', () => {
      const inputData = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: '  JOHN@TEST.COM  ',
        position: '  Developer  ',
        department: '  Engineering  ',
      };

      const sanitized = {
        firstName: inputData.firstName.trim(),
        lastName: inputData.lastName.trim(),
        email: inputData.email.trim().toLowerCase(),
        position: inputData.position.trim(),
        department: inputData.department.trim(),
      };

      expect(sanitized.firstName).toBe('John');
      expect(sanitized.lastName).toBe('Doe');
      expect(sanitized.email).toBe('john@test.com');
      expect(sanitized.position).toBe('Developer');
      expect(sanitized.department).toBe('Engineering');
    });

    it('should handle null/undefined phone numbers', () => {
      const phoneValues = [null, undefined, '', '  ', '+1-555-0123'];
      
      phoneValues.forEach(phone => {
        const sanitized = phone ? phone.trim() : null;
        if (phone === null || phone === undefined || phone === '' || phone === '  ') {
          expect(sanitized).toBe(null);
        } else {
          expect(sanitized).toBe('+1-555-0123');
        }
      });
    });
  });

  describe('Department Validation', () => {
    const validDepartments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
    const invalidDepartments = ['InvalidDept', '', null, undefined];

    it('should accept valid departments', () => {
      validDepartments.forEach(dept => {
        expect(validDepartments.includes(dept)).toBe(true);
      });
    });

    it('should reject invalid departments', () => {
      invalidDepartments.forEach(dept => {
        if (typeof dept === 'string') {
          expect(validDepartments.includes(dept)).toBe(false);
        } else {
          expect(validDepartments.includes(dept as string)).toBe(false);
        }
      });
    });
  });

  describe('Data Type Validation', () => {
    it('should validate correct data types', () => {
      const validEmployee = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        position: 'Developer',
        department: 'Engineering',
        salary: 75000,
        hireDate: '2023-01-01T00:00:00.000Z',
        phone: '+1-555-0123',
      };

      expect(typeof validEmployee.firstName).toBe('string');
      expect(typeof validEmployee.lastName).toBe('string');
      expect(typeof validEmployee.email).toBe('string');
      expect(typeof validEmployee.position).toBe('string');
      expect(typeof validEmployee.department).toBe('string');
      expect(typeof validEmployee.salary).toBe('number');
      expect(typeof validEmployee.hireDate).toBe('string');
      expect(typeof validEmployee.phone).toBe('string');
    });

    it('should reject incorrect data types', () => {
      const invalidEmployee = {
        firstName: 123,
        lastName: null,
        email: undefined,
        salary: 'not-a-number',
        hireDate: 1234567890,
      };

      expect(typeof invalidEmployee.firstName).not.toBe('string');
      expect(typeof invalidEmployee.lastName).not.toBe('string');
      expect(typeof invalidEmployee.email).not.toBe('string');
      expect(typeof invalidEmployee.salary).not.toBe('number');
      expect(typeof invalidEmployee.hireDate).not.toBe('string');
    });
  });
});
