import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import ClientDetailClient from '@/components/dashboard/clients/ClientDetailClient';

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  const { id } = await params;
  const client = await db.client.findUnique({
    where: { id },
    include: {
      projects: {
        include: { salesRep: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!client || !client.isActive) notFound();

  return (
    <ClientDetailClient
      role={session.role}
      client={{
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        notes: client.notes,
        projects: client.projects.map((p) => ({
          id: p.id,
          title: p.title,
          status: p.status,
          totalAmount: p.totalAmount,
          salesRep: p.salesRep
            ? {
                id: p.salesRep.id,
                name: p.salesRep.name,
              }
            : null,
          createdAt: p.createdAt.toISOString(),
        })),
      }}
    />
  );
}

