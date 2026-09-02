import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import ProductionClient from '@/components/dashboard/marketing/ProductionClient';

export default async function ProductionPage() {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');
  if (session.role !== 'YEHIA_MARKETING') redirect('/dashboard');

  const [productionProjects, marketingProjects] = await Promise.all([
    db.project.findMany({
      where: {
        department: 'MARKETING',
        marketingProjectType: 'PRODUCTION',
      },
      include: {
        client: true,
        productionDetail: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.project.findMany({
      where: { department: 'MARKETING' },
      select: { id: true, title: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <ProductionClient
      role={session.role}
      projects={productionProjects.map((p) => ({
        id: p.id,
        title: p.title,
        clientName: p.client.name,
        status: p.status,
        equipmentType: p.productionDetail?.equipmentType || null,
        rentalCost: p.productionDetail?.rentalCost || 0,
        notes: p.productionDetail?.notes || null,
        createdAt: p.createdAt.toISOString(),
      }))}
      allMarketingProjects={marketingProjects}
    />
  );
}
