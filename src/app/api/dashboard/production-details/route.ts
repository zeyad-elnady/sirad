import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { productionDetailSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (session.role !== 'YEHIA_MARKETING') {
      return NextResponse.json({ error: 'Access denied — Marketing only' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = productionDetailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const detail = await db.productionDetail.upsert({
      where: { projectId: parsed.data.projectId },
      update: {
        equipmentType: parsed.data.equipmentType,
        rentalCost: parsed.data.rentalCost,
        notes: parsed.data.notes,
      },
      create: parsed.data,
    });

    return NextResponse.json({ detail }, { status: 201 });
  } catch (error) {
    console.error('ProductionDetail POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
