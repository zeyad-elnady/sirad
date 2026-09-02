import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  const { id } = await params;
  const client = await db.client.findUnique({
    where: { id },
    include: { projects: { include: { salesRep: true }, orderBy: { createdAt: 'desc' } } },
  });

  if (!client) notFound();

  const totalRevenue = client.projects.reduce((s, p) => s + p.totalAmount, 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <a href="/dashboard/clients" style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', color: '#6B6B70', display: 'flex', textDecoration: 'none' }}>←</a>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif' }}>{client.name}</h1>
          <p style={{ fontSize: '13px', color: '#6B6B70' }}>{client.company || 'No company'} • {client.projects.length} projects • Total: EGP {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Email', value: client.email || '—' },
          { label: 'Phone', value: client.phone || '—' },
          { label: 'Company', value: client.company || '—' },
        ].map((item) => (
          <div key={item.label} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{item.label}</div>
            <div style={{ fontSize: '13px' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '16px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', marginBottom: '16px' }}>Projects</h2>
      <div style={{ borderRadius: '14px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
        {client.projects.length === 0 ? (
          <p style={{ padding: '32px', textAlign: 'center', color: '#6B6B70', fontSize: '13px' }}>No projects yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Project', 'Status', 'Amount'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B70', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {client.projects.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 16px' }}><a href={`/dashboard/projects/${p.id}`} style={{ color: '#E8E4E0', textDecoration: 'none', fontWeight: 500, fontSize: '13px' }}>{p.title}</a></td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B6B70', textTransform: 'capitalize' }}>{p.status.replace(/_/g, ' ').toLowerCase()}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}>EGP {p.totalAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
