import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { clientSchema } from '@/lib/validations';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const client = await db.client.findUnique({
      where: { id },
      include: {
        projects: {
          include: { salesRep: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ client });
  } catch (error) {
    console.error('Client GET error:', error);
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

    const parsed = clientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await db.client.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    const client = await db.client.update({
      where: { id },
      data: {
        name: parsed.data.name.trim(),
        email: parsed.data.email?.trim() ? parsed.data.email.trim() : null,
        phone: parsed.data.phone?.trim() ? parsed.data.phone.trim() : null,
        company: parsed.data.company?.trim() ? parsed.data.company.trim() : null,
        notes: parsed.data.notes?.trim() ? parsed.data.notes.trim() : null,
      },
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPDATE_CLIENT',
        entity: 'Client',
        entityId: client.id,
        details: { name: client.name },
      },
    });

    return NextResponse.json({ client });
  } catch (error) {
    console.error('Client PUT error:', error);
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
    const existing = await db.client.findUnique({
      where: { id },
      include: { _count: { select: { projects: true } } },
    });

    if (!existing) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    const hadProjects = existing._count.projects > 0;

    if (hadProjects) {
      // Archive / soft delete so projects foreign key remains intact
      await db.client.update({
        where: { id },
        data: { isActive: false },
      });
    } else {
      // Hard delete cleanly if no projects exist
      await db.client.delete({
        where: { id },
      });
    }

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'DELETE_CLIENT',
        entity: 'Client',
        entityId: id,
        details: { name: existing.name, hadProjects: existing._count.projects },
      },
    });

    return NextResponse.json({ success: true, archived: hadProjects });
  } catch (error) {
    console.error('Client DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
