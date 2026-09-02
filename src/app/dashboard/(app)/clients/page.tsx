import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import ClientsPageClient from '@/components/dashboard/clients/ClientsPageClient';

export default async function ClientsPage() {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  const clients = await db.client.findMany({
    where: { isActive: true },
    include: { _count: { select: { projects: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <ClientsPageClient
      role={session.role}
      clients={clients.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        company: c.company,
        notes: c.notes,
        projectCount: c._count.projects,
        createdAt: c.createdAt.toISOString(),
      }))}
    />
  );
}
