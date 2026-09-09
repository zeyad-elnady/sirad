import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ensureCompanyExpensesTable } from '@/lib/company-expenses';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await ensureCompanyExpensesTable();
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, any> = {};
    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.amount !== undefined) {
      updateData.amount =
        typeof body.amount === 'string'
          ? parseFloat(body.amount.replace(/,/g, '').trim()) || 0
          : Number(body.amount) || 0;
    }
    if (body.category !== undefined) updateData.category = body.category;
    if (body.isMonthly !== undefined) updateData.isMonthly = Boolean(body.isMonthly);
    if (body.payDay !== undefined) {
      updateData.payDay =
        body.payDay !== null && body.payDay !== ''
          ? Math.min(31, Math.max(1, parseInt(String(body.payDay), 10)))
          : null;
    }
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }
    if (body.isPaid !== undefined) {
      updateData.isPaid = Boolean(body.isPaid);
      if (updateData.isPaid) updateData.lastPaidDate = new Date();
    }
    if (body.paymentMethod !== undefined) updateData.paymentMethod = body.paymentMethod;
    if (body.notes !== undefined) updateData.notes = body.notes ? String(body.notes).trim() : null;

    const expense = await db.companyExpense.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ expense });
  } catch (error) {
    console.error('Update company expense error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await ensureCompanyExpensesTable();
    const { id } = await params;

    await db.companyExpense.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete company expense error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
