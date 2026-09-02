import { getSession, getDepartmentForRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import DashboardOverviewClient from '@/components/dashboard/DashboardOverviewClient';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  const department = getDepartmentForRole(session.role);

  // Fetch aggregated stats
  const [
    totalProjects,
    activeProjects,
    totalClients,
    totalEmployees,
    recentProjects,
  ] = await Promise.all([
    db.project.count({ where: { department } }),
    db.project.count({ where: { department, status: 'ACTIVE' } }),
    db.client.count({ where: { isActive: true } }),
    db.employee.count({ where: { department, isActive: true } }),
    db.project.findMany({
      where: { department },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { client: true },
    }),
  ]);

  // Calculate financial sums
  const projects = await db.project.findMany({
    where: { department },
    select: { totalAmount: true, depositPaid: true },
  });

  const totalRevenue = projects.reduce((s, p) => s + p.totalAmount, 0);
  const totalCollected = projects.reduce((s, p) => s + p.depositPaid, 0);

  return (
    <DashboardOverviewClient
      role={session.role}
      userName={session.name}
      stats={{
        totalProjects,
        activeProjects,
        totalClients,
        totalEmployees,
        totalRevenue,
        totalCollected,
        outstandingBalance: totalRevenue - totalCollected,
      }}
      recentProjects={recentProjects.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        clientName: p.client.name,
        totalAmount: p.totalAmount,
        createdAt: p.createdAt.toISOString(),
        techProjectType: p.techProjectType,
        marketingProjectType: p.marketingProjectType,
      }))}
    />
  );
}
