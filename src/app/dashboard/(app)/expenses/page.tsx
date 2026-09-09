import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getCompanyExpensesSummary } from '@/lib/company-expenses';
import CompanyExpensesClient from '@/components/dashboard/expenses/CompanyExpensesClient';

export default async function CompanyExpensesPage() {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  const summary = await getCompanyExpensesSummary();

  return <CompanyExpensesClient role={session.role} initialSummary={summary} />;
}
