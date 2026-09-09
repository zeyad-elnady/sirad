import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ensureClientRecurringFeesTable } from '@/lib/client-recurring-fees';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await ensureClientRecurringFeesTable();
    const { id } = await params;

    const fees = await db.clientRecurringFee.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ fees });
  } catch (error) {
    console.error('Get project recurring fees error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await ensureClientRecurringFeesTable();
    const { id } = await params;

    const project = await db.project.findUnique({
      where: { id },
      select: { id: true, clientId: true },
    });

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const body = await request.json();
    const { feeType, name, amount, billingCycle, payDay, renewalDate, notes } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Fee name is required' }, { status: 400 });
    }

    const numericAmount =
      typeof amount === 'string'
        ? parseFloat(amount.replace(/,/g, '').trim()) || 0
        : Number(amount) || 0;

    const fee = await db.clientRecurringFee.create({
      data: {
        projectId: id,
        clientId: project.clientId,
        feeType: feeType || 'OTHER',
        name: name.trim(),
        amount: numericAmount,
        billingCycle: billingCycle === 'YEARLY' ? 'YEARLY' : 'MONTHLY',
        payDay: payDay ? parseInt(String(payDay), 10) : null,
        renewalDate: renewalDate ? new Date(renewalDate) : null,
        notes: notes ? String(notes).trim() : null,
      },
    });

    return NextResponse.json({ fee }, { status: 201 });
  } catch (error) {
    console.error('Create project recurring fee error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await ensureClientRecurringFeesTable();
    const { id } = await params;
    const url = new URL(request.url);
    const feeId = url.searchParams.get('feeId');

    if (!feeId) return NextResponse.json({ error: 'feeId is required' }, { status: 400 });

    await db.clientRecurringFee.delete({
      where: { id: feeId, projectId: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project recurring fee error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
