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

    const updateData: Record<string, any> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email ? body.email.trim() : null;
    if (body.phone !== undefined) updateData.phone = body.phone ? body.phone.trim() : null;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.department !== undefined) updateData.department = body.department;
    if (body.paymentModel !== undefined) updateData.paymentModel = body.paymentModel;
    if (body.isFreelancer !== undefined) updateData.isFreelancer = Boolean(body.isFreelancer);
    if (body.monthlyRate !== undefined) {
      updateData.monthlyRate = body.monthlyRate !== null && body.monthlyRate !== '' ? parseFloat(body.monthlyRate) : null;
    }
    if (body.hourlyRate !== undefined) {
      updateData.hourlyRate = body.hourlyRate !== null && body.hourlyRate !== '' ? parseFloat(body.hourlyRate) : null;
    }
    if (body.bankDetails !== undefined) updateData.bankDetails = body.bankDetails ? body.bankDetails.trim() : null;
    if (body.notes !== undefined) updateData.notes = body.notes ? body.notes.trim() : null;

    const employee = await db.employee.update({
      where: { id },
      data: updateData,
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
