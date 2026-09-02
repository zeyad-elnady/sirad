import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { installmentSchema } from '@/lib/validations';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const installments = await db.installment.findMany({
      where: { contractId: id },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json({ installments });
  } catch (error) {
    console.error('Installments GET error:', error);
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

    // Support batch creation
    if (Array.isArray(body)) {
      const installments = await db.installment.createMany({
        data: body.map((item: { amount: number; dueDate: string; notes?: string }) => ({
          contractId: id,
          amount: item.amount,
          dueDate: new Date(item.dueDate),
          notes: item.notes,
        })),
      });
      return NextResponse.json({ count: installments.count }, { status: 201 });
    }

    const parsed = installmentSchema.safeParse({ ...body, contractId: id });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const installment = await db.installment.create({
      data: {
        contractId: id,
        amount: parsed.data.amount,
        dueDate: new Date(parsed.data.dueDate),
        notes: parsed.data.notes,
      },
    });

    return NextResponse.json({ installment }, { status: 201 });
  } catch (error) {
    console.error('Installments POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { installmentId, ...data } = body;

    if (!installmentId) {
      return NextResponse.json({ error: 'installmentId required' }, { status: 400 });
    }

    const installment = await db.installment.update({
      where: { id: installmentId },
      data: {
        ...data,
        paidDate: data.status === 'PAID' ? new Date() : data.paidDate ? new Date(data.paidDate) : undefined,
      },
    });

    return NextResponse.json({ installment });
  } catch (error) {
    console.error('Installments PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
