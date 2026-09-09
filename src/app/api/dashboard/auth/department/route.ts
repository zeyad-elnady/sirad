import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession, DEPARTMENT_COOKIE } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admin accounts can switch departments' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { department } = body;

    if (department !== 'TECH' && department !== 'MARKETING') {
      return NextResponse.json(
        { error: 'Invalid department. Must be TECH or MARKETING' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(DEPARTMENT_COOKIE, department, {
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({
      success: true,
      department,
    });
  } catch (error) {
    console.error('Switch department error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
