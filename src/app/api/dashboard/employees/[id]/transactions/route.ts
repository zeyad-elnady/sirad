import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { transactionSchema } from '@/lib/validations';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const transactions = await db.employeeTransaction.findMany({
      where: { employeeId: id },
      include: { project: true },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Transactions GET error:', error);
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

    const { id } = await params;
    const body = await request.json();
    const parsed = transactionSchema.safeParse({
      ...body,
      employeeId: id,
      amount: typeof body.amount === 'string' ? parseFloat(body.amount) : body.amount,
      projectId: body.projectId || null,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const transaction = await db.employeeTransaction.create({
      data: {
        employeeId: id,
        type: parsed.data.type,
        amount: parsed.data.amount,
        date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
        notes: parsed.data.notes,
        projectId: parsed.data.projectId || null,
      },
      include: { project: true },
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE_TRANSACTION',
        entity: 'EmployeeTransaction',
        entityId: transaction.id,
        details: { type: transaction.type, amount: transaction.amount, employeeId: id },
      },
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error('Transactions POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
