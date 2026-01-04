
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer'
}

export enum ExpenseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  employeeId: string;
  role: UserRole;
  department: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  quantity: number;
  photoUri?: string;
}

export interface ExpenseRecord {
  id: string;
  submitterId: string;
  submitterName: string;
  employeeId: string;
  date: string;
  time: string;
  items: ExpenseItem[];
  totalAmount: number;
  status: ExpenseStatus;
  isLocked: boolean;
}

export interface IncomeRecord {
  id: string;
  source: string;
  amount: number;
  category: string;
  date: string;
  isRecurring: boolean;
}

export interface BillRecord {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface AssetRecord {
  id: string;
  name: string;
  type: string;
  purchaseValue: number;
  currentValue: number;
  purchaseDate: string;
}

export interface EmployeeRecord {
  id: string;
  fullName: string;
  department: string;
  salary: number;
  status: 'active' | 'inactive';
}

export interface PersonalGoal {
  id: string;
  name: string;
  target: number;
  current: number;
}
