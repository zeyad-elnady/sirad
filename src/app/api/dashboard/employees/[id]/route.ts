import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { calculateEmployeeBalance } from '@/lib/finance';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const employee = await db.employee.findUnique({
      where: { id },
      include: {
        projectAssignments: {
          include: { project: { include: { client: true } } },
          orderBy: { createdAt: 'desc' },
        },
        transactions: { orderBy: { date: 'desc' } },
      },
    });

    if (!employee) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const balance = await calculateEmployeeBalance(id);

    return NextResponse.json({ employee, balance });
  } catch (error) {
    console.error('Employee GET error:', error);
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

    const { id } = await params;
    const body = await request.json();

    const employee = await db.employee.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ employee });
  } catch (error) {
    console.error('Employee PUT error:', error);
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

    const { id } = await params;
    await db.employee.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Employee DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
