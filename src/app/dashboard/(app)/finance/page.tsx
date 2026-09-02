import { getSession, getDepartmentForRole } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getFinanceOverview } from '@/lib/finance';
import FinanceClient from '@/components/dashboard/finance/FinanceClient';

export default async function FinancePage() {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  const department = getDepartmentForRole(session.role);
  const overview = await getFinanceOverview(department);

  return <FinanceClient role={session.role} overview={overview} />;
}
