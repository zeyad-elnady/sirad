import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, getDepartmentForRole } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: projectId } = await params;
    const body = await request.json();

    const project = await db.project.findUnique({ where: { id: projectId } });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const department = getDepartmentForRole(session.role);
    if (project.department !== department) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { employeeId, assignedRole, payAmount, notes } = body;

    if (!employeeId || !assignedRole) {
      return NextResponse.json({ error: 'Employee and assigned role are required' }, { status: 400 });
    }

    const assignment = await db.projectEmployee.upsert({
      where: {
        projectId_employeeId: {
          projectId,
          employeeId,
        },
      },
      create: {
        projectId,
        employeeId,
        assignedRole,
        payAmount: parseFloat(payAmount) || 0,
        notes: notes || null,
      },
      update: {
        assignedRole,
        payAmount: parseFloat(payAmount) || 0,
        notes: notes || null,
        isActive: true,
      },
      include: {
        employee: true,
      },
    });

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error) {
    console.error('Project employee assign error:', error);
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

    const { id: projectId } = await params;
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    const project = await db.project.findUnique({ where: { id: projectId } });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const department = getDepartmentForRole(session.role);
    if (project.department !== department) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await db.projectEmployee.delete({
      where: {
        projectId_employeeId: {
          projectId,
          employeeId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Project employee remove error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
