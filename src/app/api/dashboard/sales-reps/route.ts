import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { salesRepSchema } from '@/lib/validations';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const salesReps = await db.salesRep.findMany({
      where: { isActive: true },
      include: { _count: { select: { projects: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ salesReps });
  } catch (error) {
    console.error('SalesReps GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parsed = salesRepSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const salesRep = await db.salesRep.create({ data: parsed.data });

    return NextResponse.json({ salesRep }, { status: 201 });
  } catch (error) {
    console.error('SalesReps POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
