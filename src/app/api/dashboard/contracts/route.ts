import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { contractSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parsed = contractSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const contract = await db.contract.create({
      data: {
        projectId: parsed.data.projectId,
        agreementTerms: parsed.data.agreementTerms,
        totalAmount: parsed.data.totalAmount,
        depositPaid: parsed.data.depositPaid,
        contractImages: parsed.data.contractImages,
        signedAt: parsed.data.signedAt ? new Date(parsed.data.signedAt) : null,
      },
      include: { installments: true },
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE_CONTRACT',
        entity: 'Contract',
        entityId: contract.id,
        details: { projectId: contract.projectId },
      },
    });

    return NextResponse.json({ contract }, { status: 201 });
  } catch (error) {
    console.error('Contract POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
