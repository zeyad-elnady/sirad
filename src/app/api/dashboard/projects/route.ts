import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { projectSchema } from '@/lib/validations';
import { ensureClientRecurringFeesTable } from '@/lib/client-recurring-fees';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const department = session.department;
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

    await ensureClientRecurringFeesTable();

    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Enforce department matches for non-admin users
    if (session.role !== 'ADMIN' && data.department !== session.department) {
      return NextResponse.json({ error: 'Cannot create project in other department' }, { status: 403 });
    }

    const assignedEmployees = Array.isArray(body.assignedEmployees)
      ? body.assignedEmployees.filter((ae: any) => ae.employeeId && ae.assignedRole)
      : [];

    const clientRecurringFees = Array.isArray(body.clientRecurringFees)
      ? body.clientRecurringFees.filter((rf: any) => rf && rf.name)
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
        startDate: data.startDate ? new Date(data.startDate) : null,
        deadline: data.deadline ? new Date(data.deadline) : null,
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
        ...(clientRecurringFees.length > 0
          ? {
              clientRecurringFees: {
                create: clientRecurringFees.map((rf: any) => ({
                  feeType: rf.feeType || 'OTHER',
                  name: rf.name,
                  amount: parseFloat(rf.amount) || 0,
                  billingCycle: rf.billingCycle === 'YEARLY' ? 'YEARLY' : 'MONTHLY',
                  payDay: rf.payDay ? parseInt(rf.payDay, 10) : null,
                  renewalDate: rf.renewalDate ? new Date(rf.renewalDate) : null,
                  notes: rf.notes || null,
                  clientId: data.clientId,
                })),
              },
            }
          : {}),
      },
      include: {
        client: true,
        salesRep: true,
        employees: { include: { employee: true } },
        clientRecurringFees: true,
      },
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
