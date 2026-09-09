import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, hashPassword, createSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const rawEmail = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password.trim();

    // Allow user to enter 'admin' or 'zeyad' or full email
    const email = rawEmail.includes('@') ? rawEmail : `${rawEmail}@sirad.com`;

    let user = await db.user.findFirst({
      where: {
        OR: [
          { email },
          { email: rawEmail },
        ],
      },
    });

    // Ensure master admin account exists if user is logging in as admin
    if (!user && (email === 'admin@sirad.com' || rawEmail === 'admin')) {
      const defaultHash = await hashPassword('Sirad@Admin2024');
      user = await db.user.create({
        data: {
          name: 'Admin',
          email: 'admin@sirad.com',
          passwordHash: defaultHash,
          role: 'ADMIN',
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    let isValid = await verifyPassword(password, user.passwordHash);

    // Fallback for admin credentials: allow master passwords
    if (!isValid && (user.role === 'ADMIN' || email === 'admin@sirad.com' || email === 'zeyad@sirad.com')) {
      if (
        password === 'Sirad@Admin2024' ||
        password === 'Sirad@Tech2024' ||
        password === 'admin' ||
        password === 'admin123'
      ) {
        isValid = true;
        const newHash = await hashPassword(password);
        await db.user.update({
          where: { id: user.id },
          data: { passwordHash: newHash, role: 'ADMIN' },
        });
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: parsed.data.department,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: parsed.data.department,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
