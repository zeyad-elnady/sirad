import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const contract = await db.contract.findUnique({
      where: { id },
      include: {
        installments: { orderBy: { dueDate: 'asc' } },
        project: { include: { client: true } },
      },
    });

    if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ contract });
  } catch (error) {
    console.error('Contract GET error:', error);
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

    const contract = await db.contract.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ contract });
  } catch (error) {
    console.error('Contract PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
