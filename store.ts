
import { 
  User, UserRole, ExpenseRecord, IncomeRecord, 
  BillRecord, AssetRecord, EmployeeRecord, PersonalGoal, ExpenseStatus 
} from './types';

// GLOBAL SOVEREIGN REGISTRY
export const GOD_USERS = ['shaoncmd@gmail.com', 'shaoncmd@hotmail.com', 'hasan@yeaf.tech'];
export const GOD_PASSWORD = 'BadSoul@1989';

export const currentUser: User = {
  id: 'u-sovereign-001',
  username: 'shaoncmd',
  fullName: 'Mohammad Maynul Hasan',
  employeeId: 'CEO-MASTER-NODE',
  role: UserRole.ADMIN,
  department: 'Executive Board'
};

export const mockDb = {
  expenses: [
    {
      id: 'TRX-942-ALPHA',
      submitterId: 'u-sovereign-001',
      submitterName: 'M. Maynul Hasan',
      employeeId: 'CEO-MASTER-NODE',
      date: new Date().toISOString().split('T')[0],
      time: '14:30',
      items: [{ id: 'i1', name: 'Quantum Core Infrastructure', category: 'Infrastructure', amount: 500000, quantity: 1 }],
      totalAmount: 500000,
      status: ExpenseStatus.APPROVED,
      isLocked: true
    }
  ],
  income: [
    { id: 'inc1', source: 'Yeaf Neural Licensing', amount: 1500000, category: 'Licensing', date: '2024-05-01', isRecurring: true }
  ],
  bills: [
    { id: 'b1', name: 'Global Node Maintenance', amount: 45000, dueDate: '2024-06-01', status: 'pending' }
  ],
  assets: [
    { id: 'a1', name: 'Yeaf Neural Core', type: 'IP', purchaseValue: 1000000, currentValue: 15000000, purchaseDate: '2024-01-10' }
  ],
  employees: [
    { id: 'e1', fullName: 'Alice Johnson', department: 'Quantum Engineering', salary: 18500, status: 'active' },
    { id: 'e2', fullName: 'Bob Smith', department: 'Strategic Growth', salary: 16000, status: 'active' }
  ],
  personalGoals: [
    { id: 'g1', name: 'Billionaire Milestone', target: 1000000000, current: 25000000 }
  ]
};
