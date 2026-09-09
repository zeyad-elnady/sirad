import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getCompanySetting, updateCompanySetting } from '@/lib/company-value';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const setting = await getCompanySetting();
    return NextResponse.json({ setting });
  } catch (error) {
    console.error('Get company value error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    let { companyNetValue, notes } = body;

    if (typeof companyNetValue === 'string') {
      const clean = companyNetValue.replace(/,/g, '').trim();
      companyNetValue = clean === '' ? 0 : parseFloat(clean);
    }

    if (typeof companyNetValue !== 'number' || isNaN(companyNetValue)) {
      return NextResponse.json(
        { error: 'Valid numeric company net value is required' },
        { status: 400 }
      );
    }

    const previousSetting = await getCompanySetting();
    const updatedSetting = await updateCompanySetting(
      companyNetValue,
      session.email,
      typeof notes === 'string' ? notes.trim() : undefined
    );

    // Record audit log
    try {
      await db.auditLog.create({
        data: {
          userId: session.userId,
          action: 'UPDATE_COMPANY_NET_VALUE',
          entity: 'CompanySetting',
          entityId: 'default',
          details: {
            previousValue: previousSetting.companyNetValue,
            newValue: companyNetValue,
            notes: notes || null,
          },
        },
      });
    } catch (auditErr) {
      console.warn('Failed to create audit log for company value update:', auditErr);
    }

    return NextResponse.json({ success: true, setting: updatedSetting });
  } catch (error) {
    console.error('Update company value error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
