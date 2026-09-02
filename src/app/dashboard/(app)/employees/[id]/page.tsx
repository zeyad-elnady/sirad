import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import { calculateEmployeeBalance } from '@/lib/finance';
import EmployeeProfileClient from '@/components/dashboard/employees/EmployeeProfileClient';

export default async function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  const { id } = await params;
  const employee = await db.employee.findUnique({
    where: { id },
    include: {
      projectAssignments: {
        include: { project: { include: { client: true } } },
        orderBy: { createdAt: 'desc' },
      },
      transactions: { orderBy: { date: 'desc' } },
    },
  });

  if (!employee) notFound();

  const balance = await calculateEmployeeBalance(id);

  return (
    <EmployeeProfileClient
      role={session.role}
      employee={{
        ...employee,
        createdAt: employee.createdAt.toISOString(),
        updatedAt: employee.updatedAt.toISOString(),
        projectAssignments: employee.projectAssignments.map((pa) => ({
          ...pa,
          startDate: pa.startDate?.toISOString() || null,
          endDate: pa.endDate?.toISOString() || null,
          createdAt: pa.createdAt.toISOString(),
          updatedAt: pa.updatedAt.toISOString(),
          project: {
            ...pa.project,
            createdAt: pa.project.createdAt.toISOString(),
            updatedAt: pa.project.updatedAt.toISOString(),
            client: {
              ...pa.project.client,
              createdAt: pa.project.client.createdAt.toISOString(),
              updatedAt: pa.project.client.updatedAt.toISOString(),
            },
          },
        })),
        transactions: employee.transactions.map((t) => ({
          ...t,
          date: t.date.toISOString(),
          createdAt: t.createdAt.toISOString(),
        })),
      }}
      balance={balance}
    />
  );
}
