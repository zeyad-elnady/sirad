import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, getDepartmentForRole } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const project = await db.project.findUnique({
      where: { id },
      include: {
        client: true,
        salesRep: true,
        contract: { include: { installments: { orderBy: { dueDate: 'asc' } } } },
        employees: { include: { employee: true } },
        recurringExpenses: { orderBy: { createdAt: 'desc' } },
        productionDetail: true,
        createdBy: { select: { name: true, email: true } },
      },
    });

    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const department = getDepartmentForRole(session.role);
    if (project.department !== department) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Project GET error:', error);
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

    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const department = getDepartmentForRole(session.role);
    if (existing.department !== department) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const updateData: Record<string, any> = {};

    if (body.title !== undefined) updateData.title = String(body.title);
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.startDate !== undefined) {
      updateData.startDate = body.startDate ? new Date(body.startDate) : null;
    }
    if (body.deadline !== undefined) {
      updateData.deadline = body.deadline ? new Date(body.deadline) : null;
    }
    if (body.totalAmount !== undefined) updateData.totalAmount = parseFloat(body.totalAmount) || 0;
    if (body.depositPaid !== undefined) updateData.depositPaid = parseFloat(body.depositPaid) || 0;
    if (body.techProjectType !== undefined) updateData.techProjectType = body.techProjectType || null;
    if (body.marketingProjectType !== undefined) updateData.marketingProjectType = body.marketingProjectType || null;
    if (body.clientId !== undefined) updateData.clientId = body.clientId;
    if (body.hasSalesRep !== undefined) updateData.hasSalesRep = Boolean(body.hasSalesRep);
    if (body.salesRepId !== undefined) updateData.salesRepId = body.salesRepId || null;
    if (body.salesCommissionPercent !== undefined) {
      updateData.salesCommissionPercent =
        body.salesCommissionPercent !== null && body.salesCommissionPercent !== ''
          ? parseFloat(body.salesCommissionPercent)
          : null;
    }

    const project = await db.project.update({
      where: { id },
      data: updateData,
      include: { client: true, salesRep: true, employees: { include: { employee: true } } },
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPDATE_PROJECT',
        entity: 'Project',
        entityId: project.id,
        details: { changes: body },
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Project PUT error:', error);
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
    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const department = getDepartmentForRole(session.role);
    if (existing.department !== department) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Soft delete by changing status
    await db.project.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DELETE_PROJECT',
        entity: 'Project',
        entityId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Project DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
