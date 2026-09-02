import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect('/dashboard/login');

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', marginBottom: '8px' }}>Settings</h1>
      <p style={{ fontSize: '13px', color: '#6B6B70', marginBottom: '28px' }}>Account and dashboard preferences</p>

      <div style={{ borderRadius: '14px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', marginBottom: '20px' }}>Account Information</h2>

        <div style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B70', marginBottom: '6px' }}>Name</label>
            <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#E8E4E0', fontSize: '13px' }}>{session.name}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B70', marginBottom: '6px' }}>Email</label>
            <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#E8E4E0', fontSize: '13px' }}>{session.email}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B70', marginBottom: '6px' }}>Role</label>
            <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#E8E4E0', fontSize: '13px' }}>
              {session.role === 'ZEYAD_TECH' ? 'Tech Department Lead' : 'Marketing Department Lead'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
