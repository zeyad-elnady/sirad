import { db } from './db';
import { getCompanySetting, updateCompanySetting, ensureCompanySettingsTable } from './company-value';

export interface CompanyExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  isMonthly: boolean;
  payDay: number | null;
  dueDate: string | null;
  isPaid: boolean;
  lastPaidDate: string | null;
  paymentMethod: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyExpensesSummary {
  expenses: CompanyExpenseItem[];
  companyNetValue: number;
  totalMonthlyExpenses: number;
  totalOneTimeExpenses: number;
  paidThisMonthTotal: number;
  pendingThisMonthTotal: number;
  projectedNetValueAfterExpenses: number;
  upcomingCount: number;
}

let tableEnsured = false;

export async function ensureCompanyExpensesTable(): Promise<void> {
  if (tableEnsured) return;
  try {
    await ensureCompanySettingsTable();
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "company_expenses" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "category" TEXT NOT NULL DEFAULT 'OTHER',
        "isMonthly" BOOLEAN NOT NULL DEFAULT true,
        "payDay" INTEGER,
        "dueDate" TIMESTAMP(3),
        "isPaid" BOOLEAN NOT NULL DEFAULT false,
        "lastPaidDate" TIMESTAMP(3),
        "paymentMethod" TEXT,
        "notes" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    tableEnsured = true;
  } catch (error) {
    console.error('Error ensuring company_expenses table:', error);
  }
}

export async function getCompanyExpensesSummary(): Promise<CompanyExpensesSummary> {
  await ensureCompanyExpensesTable();

  const [companySetting, expensesRaw] = await Promise.all([
    getCompanySetting(),
    db.companyExpense.findMany({
      where: { isActive: true },
      orderBy: [{ isMonthly: 'desc' }, { payDay: 'asc' }, { createdAt: 'desc' }],
    }),
  ]);

  const expenses: CompanyExpenseItem[] = expensesRaw.map((e) => ({
    id: e.id,
    title: e.title,
    amount: e.amount,
    category: e.category,
    isMonthly: e.isMonthly,
    payDay: e.payDay,
    dueDate: e.dueDate ? e.dueDate.toISOString() : null,
    isPaid: e.isPaid,
    lastPaidDate: e.lastPaidDate ? e.lastPaidDate.toISOString() : null,
    paymentMethod: e.paymentMethod,
    notes: e.notes,
    isActive: e.isActive,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));

  const totalMonthlyExpenses = expenses
    .filter((e) => e.isMonthly)
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOneTimeExpenses = expenses
    .filter((e) => !e.isMonthly)
    .reduce((sum, e) => sum + e.amount, 0);

  const paidThisMonthTotal = expenses
    .filter((e) => e.isPaid)
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingThisMonthTotal = expenses
    .filter((e) => !e.isPaid)
    .reduce((sum, e) => sum + e.amount, 0);

  const projectedNetValueAfterExpenses = companySetting.companyNetValue - pendingThisMonthTotal;

  // Upcoming count: pending items due in the next 7 days (or based on payDay)
  const currentDay = new Date().getDate();
  const upcomingCount = expenses.filter((e) => {
    if (e.isPaid) return false;
    if (e.isMonthly && e.payDay) {
      const diff = e.payDay - currentDay;
      return diff >= 0 && diff <= 7;
    }
    return true;
  }).length;

  return {
    expenses,
    companyNetValue: companySetting.companyNetValue,
    totalMonthlyExpenses,
    totalOneTimeExpenses,
    paidThisMonthTotal,
    pendingThisMonthTotal,
    projectedNetValueAfterExpenses,
    upcomingCount,
  };
}

export async function payCompanyExpense(
  expenseId: string,
  deductFromNetValue: boolean = true,
  userEmail?: string
) {
  await ensureCompanyExpensesTable();

  const expense = await db.companyExpense.findUnique({
    where: { id: expenseId },
  });

  if (!expense) throw new Error('Expense not found');

  const now = new Date();
  const updatedExpense = await db.companyExpense.update({
    where: { id: expenseId },
    data: {
      isPaid: true,
      lastPaidDate: now,
    },
  });

  let newNetValue: number | null = null;
  if (deductFromNetValue && expense.amount > 0) {
    const currentSetting = await getCompanySetting();
    newNetValue = Math.max(0, currentSetting.companyNetValue - expense.amount);
    await updateCompanySetting(
      newNetValue,
      userEmail,
      `Deducted EGP ${expense.amount} for expense: ${expense.title}`
    );
  }

  return {
    expense: updatedExpense,
    newNetValue,
  };
}

export async function resetExpensePaidStatus(expenseId: string) {
  await ensureCompanyExpensesTable();

  return await db.companyExpense.update({
    where: { id: expenseId },
    data: {
      isPaid: false,
    },
  });
}
