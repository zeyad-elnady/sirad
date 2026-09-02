import { getSession, getDepartmentForRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import NewProjectForm from '@/components/dashboard/projects/NewProjectForm';

export default async function NewProjectPage() {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  const department = getDepartmentForRole(session.role);

  // Fetch clients and sales reps for the form dropdowns
  const [clients, salesReps] = await Promise.all([
    db.client.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    db.salesRep.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ]);

  return (
    <NewProjectForm
      role={session.role}
      department={department}
      clients={clients.map((c) => ({ id: c.id, name: c.name, company: c.company }))}
      salesReps={salesReps.map((s) => ({ id: s.id, name: s.name }))}
    />
  );
}
