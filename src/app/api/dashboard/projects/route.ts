import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, getDepartmentForRole } from '@/lib/auth';
import { projectSchema } from '@/lib/validations';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const department = getDepartmentForRole(session.role);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    const where: Record<string, unknown> = { department };
    if (status && status !== 'ALL') where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const projects = await db.project.findMany({
      where,
      include: {
        client: true,
        salesRep: true,
        _count: { select: { employees: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const department = getDepartmentForRole(session.role);

    // Enforce department matches
    if (data.department !== department) {
      return NextResponse.json({ error: 'Cannot create project in other department' }, { status: 403 });
    }

    const assignedEmployees = Array.isArray(body.assignedEmployees)
      ? body.assignedEmployees.filter((ae: any) => ae.employeeId && ae.assignedRole)
      : [];

    const project = await db.project.create({
      data: {
        title: data.title,
        description: data.description,
        department: data.department,
        status: data.status,
        techProjectType: data.techProjectType,
        marketingProjectType: data.marketingProjectType,
        totalAmount: data.totalAmount,
        depositPaid: data.depositPaid,
        hasSalesRep: data.hasSalesRep,
        salesRepId: data.salesRepId,
        salesCommissionPercent: data.salesCommissionPercent,
        clientId: data.clientId,
        createdById: session.userId,
        ...(assignedEmployees.length > 0
          ? {
              employees: {
                create: assignedEmployees.map((ae: any) => ({
                  employeeId: ae.employeeId,
                  assignedRole: ae.assignedRole,
                  payAmount: parseFloat(ae.payAmount) || 0,
                  notes: ae.notes || null,
                })),
              },
            }
          : {}),
      },
      include: { client: true, salesRep: true, employees: { include: { employee: true } } },
    });

    // Log audit
    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE_PROJECT',
        entity: 'Project',
        entityId: project.id,
        details: { title: project.title },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
