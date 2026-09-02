import { db } from './db';

// ─── Project Profit Calculation ───

export interface ProjectProfitResult {
  totalRevenue: number;
  employeeCosts: number;
  recurringExpenseCosts: number;
  productionCosts: number;
  totalCosts: number;
  grossProfit: number;
  salesCommission: number;
  netProfit: number;
}

export async function calculateProjectProfit(projectId: string): Promise<ProjectProfitResult> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      employees: true,
      recurringExpenses: { where: { isActive: true } },
      productionDetail: true,
      salesRep: true,
    },
  });

  if (!project) throw new Error('Project not found');

  const totalRevenue = project.totalAmount;

  // Sum employee costs
  const employeeCosts = project.employees.reduce((sum, pe) => sum + pe.payAmount, 0);

  // Sum recurring expenses (normalized to monthly for comparison)
  const recurringExpenseCosts = project.recurringExpenses.reduce((sum, exp) => {
    return sum + (exp.frequency === 'ANNUAL' ? exp.amount / 12 : exp.amount);
  }, 0);

  // Production costs (Marketing only)
  const productionCosts = project.productionDetail?.rentalCost || 0;

  const totalCosts = employeeCosts + recurringExpenseCosts + productionCosts;
  const grossProfit = totalRevenue - totalCosts;

  // Sales commission calculation
  let salesCommission = 0;
  if (project.hasSalesRep && project.salesCommissionPercent) {
    salesCommission = (grossProfit * project.salesCommissionPercent) / 100;
  }

  const netProfit = grossProfit - salesCommission;

  return {
    totalRevenue,
    employeeCosts,
    recurringExpenseCosts,
    productionCosts,
    totalCosts,
    grossProfit,
    salesCommission,
    netProfit,
  };
}

// ─── Installment Schedule Generation ───

export interface GeneratedInstallment {
  amount: number;
  dueDate: Date;
}

export function generateInstallments(
  totalAmount: number,
  depositPaid: number,
  numberOfInstallments: number,
  startDate: Date
): GeneratedInstallment[] {
  const remaining = totalAmount - depositPaid;
  if (remaining <= 0 || numberOfInstallments <= 0) return [];

  const installmentAmount = Math.floor((remaining / numberOfInstallments) * 100) / 100;
  const lastInstallmentAdjustment = remaining - installmentAmount * numberOfInstallments;

  const installments: GeneratedInstallment[] = [];
  for (let i = 0; i < numberOfInstallments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i + 1);

    const amount = i === numberOfInstallments - 1
      ? installmentAmount + lastInstallmentAdjustment
      : installmentAmount;

    installments.push({ amount: Math.round(amount * 100) / 100, dueDate });
  }

  return installments;
}

// ─── Employee Balance Calculation ───

export interface EmployeeBalance {
  totalEarned: number;        // Sum of all project assignments
  totalPaid: number;          // Sum of SALARY + PARTIAL_PAYMENT + TASK_PAYMENT
  totalAdvances: number;      // Sum of ADVANCE + DEPOSIT
  totalLoans: number;         // Sum of LOAN
  totalBonuses: number;       // Sum of BONUS
  totalDeductions: number;    // Sum of DEDUCTION
  outstandingBalance: number; // What is still owed to the employee
}

export async function calculateEmployeeBalance(employeeId: string): Promise<EmployeeBalance> {
  const [assignments, transactions] = await Promise.all([
    db.projectEmployee.findMany({
      where: { employeeId },
    }),
    db.employeeTransaction.findMany({
      where: { employeeId },
    }),
  ]);

  const totalEarned = assignments.reduce((sum, a) => sum + a.payAmount, 0);

  const totalPaid = transactions
    .filter((t) => ['SALARY', 'PARTIAL_PAYMENT', 'TASK_PAYMENT'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalAdvances = transactions
    .filter((t) => ['ADVANCE', 'DEPOSIT'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalLoans = transactions
    .filter((t) => t.type === 'LOAN')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBonuses = transactions
    .filter((t) => t.type === 'BONUS')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDeductions = transactions
    .filter((t) => t.type === 'DEDUCTION')
    .reduce((sum, t) => sum + t.amount, 0);

  // Outstanding = what's earned - what's been paid out (payments + advances reduce what's owed)
  const outstandingBalance = totalEarned - totalPaid - totalAdvances + totalBonuses - totalDeductions;

  return {
    totalEarned,
    totalPaid,
    totalAdvances,
    totalLoans,
    totalBonuses,
    totalDeductions,
    outstandingBalance,
  };
}

// ─── Finance Overview ───

export interface FinanceOverview {
  totalRevenue: number;
  totalCollected: number;
  totalOutstanding: number;
  totalExpenses: number;
  totalEmployeeCosts: number;
  totalSalesCommissions: number;
  netProfit: number;
  activeProjects: number;
  completedProjects: number;
  overdueInstallments: number;
}

export async function getFinanceOverview(department?: 'TECH' | 'MARKETING'): Promise<FinanceOverview> {
  const where = department ? { department } : {};

  const [projects, installments, employeeAssignments, transactions] = await Promise.all([
    db.project.findMany({
      where,
      include: {
        recurringExpenses: true,
        productionDetail: true,
      },
    }),
    db.installment.findMany({
      include: { contract: { include: { project: true } } },
    }),
    db.projectEmployee.findMany({
      include: { project: true },
    }),
    db.employeeTransaction.findMany(),
  ]);

  // Filter installments/assignments by department if needed
  const filteredInstallments = department
    ? installments.filter((i) => i.contract.project.department === department)
    : installments;
  const filteredAssignments = department
    ? employeeAssignments.filter((a) => a.project.department === department)
    : employeeAssignments;

  const totalRevenue = projects.reduce((sum, p) => sum + p.totalAmount, 0);

  const totalCollected = projects.reduce((sum, p) => sum + p.depositPaid, 0)
    + filteredInstallments
        .filter((i) => i.status === 'PAID')
        .reduce((sum, i) => sum + i.amount, 0);

  const totalOutstanding = filteredInstallments
    .filter((i) => i.status !== 'PAID')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalEmployeeCosts = filteredAssignments.reduce((sum, a) => sum + a.payAmount, 0);

  const totalExpenses = projects.reduce((sum, p) => {
    const recurring = p.recurringExpenses.reduce((s, e) => s + e.amount, 0);
    const production = p.productionDetail?.rentalCost || 0;
    return sum + recurring + production;
  }, 0);

  let totalSalesCommissions = 0;
  for (const p of projects) {
    if (p.hasSalesRep && p.salesCommissionPercent) {
      const pEmployeeCosts = filteredAssignments
        .filter((a) => a.projectId === p.id)
        .reduce((sum, a) => sum + a.payAmount, 0);
      const gross = Math.max(0, p.totalAmount - pEmployeeCosts);
      totalSalesCommissions += (gross * p.salesCommissionPercent) / 100;
    }
  }

  const netProfit = totalRevenue - totalEmployeeCosts - totalExpenses - totalSalesCommissions;

  const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length;
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED').length;
  const overdueInstallments = filteredInstallments.filter((i) => i.status === 'OVERDUE').length;

  return {
    totalRevenue,
    totalCollected,
    totalOutstanding,
    totalExpenses,
    totalEmployeeCosts,
    totalSalesCommissions,
    netProfit,
    activeProjects,
    completedProjects,
    overdueInstallments,
  };
}

// ─── Format Helpers ───

export function formatCurrency(amount: number, currency = 'EGP'): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
