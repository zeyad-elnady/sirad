import { NextResponse } from 'next/server';
import { getSession, getDepartmentForRole } from '@/lib/auth';
import { getFinanceOverview } from '@/lib/finance';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const department = getDepartmentForRole(session.role);
    const overview = await getFinanceOverview(department);

    return NextResponse.json({ overview });
  } catch (error) {
    console.error('Finance overview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
