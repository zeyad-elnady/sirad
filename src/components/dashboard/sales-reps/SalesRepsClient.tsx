'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '@prisma/client';
import { Plus, Edit2, Trash2, X, Handshake } from 'lucide-react';

interface SalesRepItem {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  projectCount: number;
}

interface Props {
  role: UserRole;
  salesReps: SalesRepItem[];
}

export default function SalesRepsClient({ role, salesReps }: Props) {
  const router = useRouter();
  const accentColor = role === 'ZEYAD_TECH' ? '#DC2626' : '#7C3AED';
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openEdit(rep: SalesRepItem) {
    setEditingId(rep.id);
    setForm({ name: rep.name, phone: rep.phone || '', email: rep.email || '' });
    setShowForm(true);
  }

  function openNew() {
    setEditingId(null);
    setForm({ name: '', phone: '', email: '' });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/dashboard/sales-reps/${editingId}` : '/api/dashboard/sales-reps';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setShowForm(false); router.refresh(); }
    } finally { setIsSubmitting(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this sales rep?')) return;
    await fetch(`/api/dashboard/sales-reps/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', color: '#E8E4E0', fontSize: '13px', fontFamily: '"Inter", sans-serif', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif' }}>Sales Representatives</h1>
        <button onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '10px', background: `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`, color: '#fff', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Add Sales Rep
        </button>
      </div>

      {/* Table */}
      <div style={{ borderRadius: '14px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
        {salesReps.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6B6B70' }}>
            <Handshake size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p>No sales reps yet</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Name', 'Email', 'Phone', 'Projects', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '14px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B70', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salesReps.map((rep, i) => (
                <tr key={rep.id} style={{ borderBottom: i < salesReps.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500, fontSize: '13px' }}>{rep.name}</td>
                  <td style={{ padding: '14px 16px', color: '#6B6B70', fontSize: '13px' }}>{rep.email || '—'}</td>
                  <td style={{ padding: '14px 16px', color: '#6B6B70', fontSize: '13px' }}>{rep.phone || '—'}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px' }}>{rep.projectCount}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEdit(rep)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: '#6B6B70', cursor: 'pointer' }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(rep.id)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.05)', color: '#DC2626', cursor: 'pointer' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={() => setShowForm(false)}
          >
            <motion.form initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}
              style={{ background: '#121214', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '420px', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}>{editingId ? 'Edit' : 'Add'} Sales Rep</h2>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#6B6B70', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input style={inputStyle} placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input style={inputStyle} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input style={inputStyle} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <button type="submit" disabled={isSubmitting} style={{ padding: '12px', borderRadius: '10px', border: 'none', background: accentColor, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Add Sales Rep'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
