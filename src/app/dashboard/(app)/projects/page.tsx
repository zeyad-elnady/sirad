import { getSession, getDepartmentForRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import ProjectsListClient from '@/components/dashboard/projects/ProjectsListClient';

export default async function ProjectsPage() {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  const department = getDepartmentForRole(session.role);

  const projects = await db.project.findMany({
    where: { department },
    include: {
      client: true,
      salesRep: true,
      _count: { select: { employees: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <ProjectsListClient
      role={session.role}
      projects={projects.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        department: p.department,
        clientName: p.client.name,
        totalAmount: p.totalAmount,
        depositPaid: p.depositPaid,
        techProjectType: p.techProjectType,
        marketingProjectType: p.marketingProjectType,
        hasSalesRep: p.hasSalesRep,
        salesRepName: p.salesRep?.name || null,
        employeeCount: p._count.employees,
        createdAt: p.createdAt.toISOString(),
      }))}
    />
  );
}
