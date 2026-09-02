import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { recurringExpenseSchema } from '@/lib/validations';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Only Tech department can manage recurring expenses
    if (session.role !== 'ZEYAD_TECH') {
      return NextResponse.json({ error: 'Access denied — Tech only' }, { status: 403 });
    }

    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');

    const where: Record<string, unknown> = { isActive: true };
    if (projectId) where.projectId = projectId;

    const expenses = await db.recurringExpense.findMany({
      where,
      include: { project: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error('RecurringExpenses GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (session.role !== 'ZEYAD_TECH') {
      return NextResponse.json({ error: 'Access denied — Tech only' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = recurringExpenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const expense = await db.recurringExpense.create({
      data: {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      },
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error('RecurringExpenses POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
