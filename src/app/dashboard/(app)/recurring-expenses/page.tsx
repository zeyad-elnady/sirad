import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import RecurringExpensesClient from '@/components/dashboard/tech/RecurringExpensesClient';

export default async function RecurringExpensesPage() {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');
  if (session.role !== 'ZEYAD_TECH') redirect('/dashboard');

  const [expenses, projects] = await Promise.all([
    db.recurringExpense.findMany({
      where: { isActive: true },
      include: { project: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    db.project.findMany({
      where: { department: 'TECH' },
      select: { id: true, title: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <RecurringExpensesClient
      role={session.role}
      expenses={expenses.map((e) => ({
        id: e.id,
        category: e.category,
        description: e.description,
        amount: e.amount,
        frequency: e.frequency,
        projectId: e.projectId,
        projectTitle: e.project.title,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate ? e.endDate.toISOString() : null,
      }))}
      projects={projects}
    />
  );
}
