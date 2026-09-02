import { z } from 'zod';

// ─── Auth ───

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ─── Client ───

export const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Sales Rep ───

export const salesRepSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
});

// ─── Employee ───

export const employeeSchema = z.object({
  name: z.string().min(1, 'Employee name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
  department: z.enum(['TECH', 'MARKETING']),
  hourlyRate: z.number().min(0).optional().nullable(),
  monthlyRate: z.number().min(0).optional().nullable(),
  paymentModel: z.enum(['MONTHLY', 'PER_TASK']).default('PER_TASK'),
  isFreelancer: z.boolean().default(false),
  bankDetails: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Project ───

export const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().optional(),
  department: z.enum(['TECH', 'MARKETING']),
  status: z.enum(['DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).default('DRAFT'),
  techProjectType: z.enum(['LANDING_PAGE', 'SYSTEM', 'ECOMMERCE', 'WEBSITE_WITH_DASHBOARD']).optional().nullable(),
  marketingProjectType: z.enum(['PRODUCTION', 'VISUAL_IDENTITY', 'SOCIAL_MEDIA_SPECIALIST', 'PERFORMANCE_MARKETING']).optional().nullable(),
  totalAmount: z.number().min(0, 'Amount must be positive').default(0),
  depositPaid: z.number().min(0).default(0),
  hasSalesRep: z.boolean().default(false),
  salesRepId: z.string().optional().nullable(),
  salesCommissionPercent: z.number().min(0).max(100).optional().nullable(),
  clientId: z.string().min(1, 'Client is required'),
});

// ─── Contract ───

export const contractSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  agreementTerms: z.string().min(1, 'Agreement terms are required'),
  totalAmount: z.number().min(0),
  depositPaid: z.number().min(0).default(0),
  contractImages: z.array(z.string()).default([]),
  signedAt: z.string().datetime().optional().nullable(),
});

// ─── Installment ───

export const installmentSchema = z.object({
  contractId: z.string().min(1),
  amount: z.number().min(0, 'Amount must be positive'),
  dueDate: z.string().datetime(),
  notes: z.string().optional(),
});

export const installmentUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'OVERDUE']).optional(),
  paidDate: z.string().datetime().optional().nullable(),
  amount: z.number().min(0).optional(),
  dueDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

// ─── Project Employee Assignment ───

export const projectEmployeeSchema = z.object({
  projectId: z.string().min(1),
  employeeId: z.string().min(1),
  assignedRole: z.string().min(1, 'Role assignment is required'),
  payAmount: z.number().min(0, 'Pay amount must be positive'),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  notes: z.string().optional(),
});

// ─── Employee Transaction ───

export const transactionSchema = z.object({
  employeeId: z.string().min(1),
  type: z.enum(['SALARY', 'PARTIAL_PAYMENT', 'DEPOSIT', 'LOAN', 'ADVANCE', 'TASK_PAYMENT', 'BONUS', 'DEDUCTION']),
  amount: z.number().min(0, 'Amount must be positive'),
  date: z.string().datetime().optional(),
  projectId: z.string().optional().nullable(),
  notes: z.string().optional(),
});

// ─── Recurring Expense ───

export const recurringExpenseSchema = z.object({
  projectId: z.string().min(1),
  category: z.enum(['HOSTING', 'DOMAIN', 'API_USAGE', 'OTHER']),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0),
  frequency: z.enum(['MONTHLY', 'ANNUAL']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
});

// ─── Production Detail ───

export const productionDetailSchema = z.object({
  projectId: z.string().min(1),
  equipmentType: z.string().min(1, 'Equipment type is required'),
  rentalCost: z.number().min(0),
  notes: z.string().optional(),
});

// ─── Payroll ───

export const payrollSchema = z.object({
  employeeId: z.string().min(1),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  basePay: z.number().min(0),
  deductions: z.number().min(0).default(0),
  bonuses: z.number().min(0).default(0),
  notes: z.string().optional(),
});
