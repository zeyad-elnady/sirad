import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { payCompanyExpense, resetExpensePaidStatus } from '@/lib/company-expenses';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { deductFromNetValue = true, reset = false } = body;

    if (reset) {
      const expense = await resetExpensePaidStatus(id);
      return NextResponse.json({ success: true, expense });
    }

    const result = await payCompanyExpense(id, deductFromNetValue, session.email);

    // Audit log
    try {
      await db.auditLog.create({
        data: {
          userId: session.userId,
          action: 'PAY_COMPANY_EXPENSE',
          entity: 'CompanyExpense',
          entityId: id,
          details: {
            title: result.expense.title,
            amount: result.expense.amount,
            deducted: deductFromNetValue,
            newNetValue: result.newNetValue,
          },
        },
      });
    } catch (auditErr) {
      console.warn('Failed to create audit log for pay expense:', auditErr);
    }

    return NextResponse.json({
      success: true,
      expense: result.expense,
      newNetValue: result.newNetValue,
    });
  } catch (error) {
    console.error('Pay company expense error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
