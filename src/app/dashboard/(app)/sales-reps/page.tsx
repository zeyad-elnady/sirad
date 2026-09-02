import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import SalesRepsClient from '@/components/dashboard/sales-reps/SalesRepsClient';

export default async function SalesRepsPage() {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  const salesReps = await db.salesRep.findMany({
    where: { isActive: true },
    include: { _count: { select: { projects: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <SalesRepsClient
      role={session.role}
      salesReps={salesReps.map((s) => ({
        id: s.id,
        name: s.name,
        phone: s.phone,
        email: s.email,
        projectCount: s._count.projects,
      }))}
    />
  );
}
