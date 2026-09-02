import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { clientSchema } from '@/lib/validations';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(request.url);
    const search = url.searchParams.get('search');

    const where: Record<string, unknown> = { isActive: true };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const clients = await db.client.findMany({
      where,
      include: { _count: { select: { projects: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Clients GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parsed = clientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const client = await db.client.create({ data: parsed.data });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE_CLIENT',
        entity: 'Client',
        entityId: client.id,
        details: { name: client.name },
      },
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error('Clients POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
