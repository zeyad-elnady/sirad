import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import EmployeesPageClient from '@/components/dashboard/employees/EmployeesPageClient';

export default async function EmployeesPage() {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  const employees = await db.employee.findMany({
    where: { isActive: true },
    include: { _count: { select: { projectAssignments: true, transactions: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <EmployeesPageClient
      role={session.role}
      employees={employees.map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email,
        phone: e.phone,
        role: e.role,
        department: e.department,
        paymentModel: e.paymentModel,
        isFreelancer: e.isFreelancer,
        monthlyRate: e.monthlyRate,
        hourlyRate: e.hourlyRate,
        projectCount: e._count.projectAssignments,
        transactionCount: e._count.transactions,
      }))}
    />
  );
}
