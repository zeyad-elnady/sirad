import { db } from './db';

export interface ClientRecurringFeeItem {
  id: string;
  projectId: string;
  clientId: string | null;
  feeType: string;
  name: string;
  amount: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  payDay: number | null;
  renewalDate: string | null;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

let tableEnsured = false;

export async function ensureClientRecurringFeesTable(): Promise<void> {
  if (tableEnsured) return;
  try {
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "client_recurring_fees" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "feeType" TEXT NOT NULL DEFAULT 'OTHER',
        "name" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "billingCycle" TEXT NOT NULL DEFAULT 'MONTHLY',
        "payDay" INTEGER,
        "renewalDate" TIMESTAMP(3),
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "projectId" TEXT NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
        "clientId" TEXT REFERENCES "clients"("id") ON DELETE SET NULL
      );
    `);
    tableEnsured = true;
  } catch (error) {
    console.error('Error ensuring client_recurring_fees table:', error);
  }
}
