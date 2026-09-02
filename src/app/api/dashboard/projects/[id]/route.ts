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

    const project = await db.project.update({
      where: { id },
      data: body,
      include: { client: true, salesRep: true },
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
