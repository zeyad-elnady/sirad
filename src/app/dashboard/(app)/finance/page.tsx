import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getFinanceOverview } from '@/lib/finance';
import FinanceClient from '@/components/dashboard/finance/FinanceClient';
import { getCompanySetting } from '@/lib/company-value';

export default async function FinancePage() {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  const department = session.department;
  const [overview, companySetting] = await Promise.all([
    getFinanceOverview(department),
    getCompanySetting(),
  ]);

  return <FinanceClient role={session.role} overview={overview} companySetting={companySetting} />;
}
