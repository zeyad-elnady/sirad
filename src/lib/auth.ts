import { SignJWT, jwtVerify } from 'jose';
import { compare, hash } from 'bcryptjs';
import { cookies } from 'next/headers';
import type { UserRole } from '@prisma/client';

const SESSION_COOKIE = 'sirad-session';
export const DEPARTMENT_COOKIE = 'sirad_department';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return new TextEncoder().encode(secret);
}

// ─── Password Utilities ───

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

// ─── Session Types ───

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  department: 'TECH' | 'MARKETING';
  canSwitchDepartment: boolean;
  expiresAt: Date;
}

// ─── Role Helpers ───

export function isAdmin(role: UserRole): boolean {
  return role === 'ADMIN';
}

export function isTechLead(role: UserRole): boolean {
  return role === 'ZEYAD_TECH' || role === 'ADMIN';
}

export function isMarketingLead(role: UserRole): boolean {
  return role === 'YEHIA_MARKETING' || role === 'ADMIN';
}

export function getActiveDepartment(role: UserRole, departmentCookie?: string | null): 'TECH' | 'MARKETING' {
  if (role === 'ADMIN') {
    return departmentCookie === 'MARKETING' ? 'MARKETING' : 'TECH';
  }
  return role === 'ZEYAD_TECH' ? 'TECH' : 'MARKETING';
}

export function getDepartmentForRole(role: UserRole, cookieDept?: string | null): 'TECH' | 'MARKETING' {
  return getActiveDepartment(role, cookieDept);
}

// ─── Session Management ───

export async function createSession(user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: 'TECH' | 'MARKETING';
}): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000);

  const token = await new SignJWT({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getJwtSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  if (user.department) {
    cookieStore.set(DEPARTMENT_COOKIE, user.department, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getJwtSecret());
    const role = payload.role as UserRole;
    const deptCookie = cookieStore.get(DEPARTMENT_COOKIE)?.value;
    const department = getActiveDepartment(role, deptCookie);

    return {
      userId: payload.userId as string,
      name: payload.name as string,
      email: payload.email as string,
      role,
      department,
      canSwitchDepartment: role === 'ADMIN',
      expiresAt: new Date((payload.exp as number) * 1000),
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(DEPARTMENT_COOKIE);
}
