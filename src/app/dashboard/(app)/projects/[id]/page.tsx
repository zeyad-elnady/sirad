import { getSession, getDepartmentForRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import { calculateProjectProfit } from '@/lib/finance';
import ProjectDetailClient from '@/components/dashboard/projects/ProjectDetailClient';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  const { id } = await params;
  const department = getDepartmentForRole(session.role);

  const [project, availableEmployees, clients, salesReps] = await Promise.all([
    db.project.findUnique({
      where: { id },
      include: {
        client: true,
        salesRep: true,
        contract: { include: { installments: { orderBy: { dueDate: 'asc' } } } },
        employees: { include: { employee: true } },
        recurringExpenses: { orderBy: { createdAt: 'desc' } },
        productionDetail: true,
        createdBy: { select: { name: true } },
      },
    }),
    db.employee.findMany({
      where: { isActive: true, department },
      orderBy: { name: 'asc' },
    }),
    db.client.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    db.salesRep.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ]);

  if (!project || project.department !== department) notFound();

  let profit = null;
  try {
    profit = await calculateProjectProfit(id);
  } catch { /* if no data yet */ }

  // Serialize dates for client component
  const serialized = {
    ...project,
    startDate: project.startDate?.toISOString() || null,
    deadline: project.deadline?.toISOString() || null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    contract: project.contract
      ? {
          ...project.contract,
          signedAt: project.contract.signedAt?.toISOString() || null,
          createdAt: project.contract.createdAt.toISOString(),
          updatedAt: project.contract.updatedAt.toISOString(),
          installments: project.contract.installments.map((i) => ({
            ...i,
            dueDate: i.dueDate.toISOString(),
            paidDate: i.paidDate?.toISOString() || null,
            createdAt: i.createdAt.toISOString(),
            updatedAt: i.updatedAt.toISOString(),
          })),
        }
      : null,
    employees: project.employees.map((pe) => ({
      ...pe,
      startDate: pe.startDate?.toISOString() || null,
      endDate: pe.endDate?.toISOString() || null,
      createdAt: pe.createdAt.toISOString(),
      updatedAt: pe.updatedAt.toISOString(),
      employee: {
        ...pe.employee,
        createdAt: pe.employee.createdAt.toISOString(),
        updatedAt: pe.employee.updatedAt.toISOString(),
      },
    })),
    recurringExpenses: project.recurringExpenses.map((e) => ({
      ...e,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate?.toISOString() || null,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    })),
    productionDetail: project.productionDetail
      ? {
          ...project.productionDetail,
          createdAt: project.productionDetail.createdAt.toISOString(),
          updatedAt: project.productionDetail.updatedAt.toISOString(),
        }
      : null,
  };

  return (
    <ProjectDetailClient
      role={session.role}
      project={serialized}
      profit={profit}
      clients={clients.map((c) => ({ id: c.id, name: c.name, company: c.company }))}
      salesReps={salesReps.map((s) => ({ id: s.id, name: s.name }))}
      availableEmployees={availableEmployees.map((e) => ({
        id: e.id,
        name: e.name,
        role: e.role,
        department: e.department,
        monthlyRate: e.monthlyRate,
        hourlyRate: e.hourlyRate,
        isFreelancer: e.isFreelancer,
      }))}
    />
  );
}
