export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export type EmployeeFormData = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;