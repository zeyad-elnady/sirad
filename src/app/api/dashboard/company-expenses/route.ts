import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  getCompanyExpensesSummary,
  ensureCompanyExpensesTable,
} from '@/lib/company-expenses';
import { updateCompanySetting, getCompanySetting } from '@/lib/company-value';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const summary = await getCompanyExpensesSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Get company expenses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await ensureCompanyExpensesTable();

    const body = await request.json();
    const {
      title,
      amount,
      category,
      isMonthly,
      payDay,
      dueDate,
      isPaid,
      paymentMethod,
      notes,
      deductFromNetValue,
    } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const numericAmount =
      typeof amount === 'string'
        ? parseFloat(amount.replace(/,/g, '').trim()) || 0
        : Number(amount) || 0;

    const parsedPayDay =
      isMonthly && payDay !== undefined && payDay !== null && payDay !== ''
        ? Math.min(31, Math.max(1, parseInt(String(payDay), 10)))
        : null;

    const expense = await db.companyExpense.create({
      data: {
        title: title.trim(),
        amount: numericAmount,
        category: category || 'OTHER',
        isMonthly: isMonthly ?? true,
        payDay: parsedPayDay,
        dueDate: dueDate ? new Date(dueDate) : null,
        isPaid: Boolean(isPaid),
        lastPaidDate: isPaid ? new Date() : null,
        paymentMethod: paymentMethod || 'BANK_TRANSFER',
        notes: notes ? notes.trim() : null,
      },
    });

    // If marked as paid upon creation and deduct requested:
    if (isPaid && deductFromNetValue && numericAmount > 0) {
      const currentSetting = await getCompanySetting();
      const newNetValue = Math.max(0, currentSetting.companyNetValue - numericAmount);
      await updateCompanySetting(
        newNetValue,
        session.email,
        `Deducted EGP ${numericAmount} for expense: ${expense.title}`
      );
    }

    // Audit log
    try {
      await db.auditLog.create({
        data: {
          userId: session.userId,
          action: 'CREATE_COMPANY_EXPENSE',
          entity: 'CompanyExpense',
          entityId: expense.id,
          details: {
            title: expense.title,
            amount: numericAmount,
            isMonthly: expense.isMonthly,
            payDay: expense.payDay,
          },
        },
      });
    } catch (auditErr) {
      console.warn('Failed to create audit log for expense creation:', auditErr);
    }

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error('Create company expense error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
