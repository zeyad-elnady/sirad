'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '@prisma/client';
import { Plus, Search, Users, X } from 'lucide-react';

interface ClientItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  projectCount: number;
  createdAt: string;
}

interface Props {
  role: UserRole;
  clients: ClientItem[];
}

export default function ClientsPageClient({ role, clients }: Props) {
  const router = useRouter();
  const accentColor = role === 'ZEYAD_TECH' ? '#B6FF33' : '#7C3AED';
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/dashboard/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ name: '', email: '', phone: '', company: '', notes: '' });
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#E8E4E0', fontSize: '13px', fontFamily: '"Inter", sans-serif', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif' }}>Clients</h1>
        <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '10px', background: accentColor === '#B6FF33' ? 'linear-gradient(135deg, #B6FF33, #96da00)' : `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`, color: accentColor === '#B6FF33' ? '#121f00' : '#fff', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: accentColor === '#B6FF33' ? '0 0 25px rgba(182,255,51,0.25)' : `0 0 20px ${accentColor}20` }}>
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '8px 14px', marginBottom: '20px', maxWidth: '320px' }}>
        <Search size={16} style={{ color: '#6B6B70' }} />
        <input type="text" placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: '#E8E4E0', fontSize: '13px', width: '100%', fontFamily: '"Inter", sans-serif' }} />
      </div>

      {/* New Client Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={() => setShowForm(false)}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleCreate}
              style={{ background: '#121214', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '480px', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}>New Client</h2>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#6B6B70', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input style={inputStyle} placeholder="Client name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input style={inputStyle} placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input style={inputStyle} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input style={inputStyle} placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                <button type="submit" disabled={isSubmitting} style={{ padding: '12px', borderRadius: '10px', border: 'none', background: accentColor, color: accentColor === '#B6FF33' ? '#121f00' : '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                  {isSubmitting ? 'Creating...' : 'Create Client'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {filtered.map((c) => (
          <motion.div
            key={c.id}
            whileHover={{ y: -2 }}
            style={{ padding: '20px', borderRadius: '14px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onClick={() => router.push(`/dashboard/clients/${c.id}`)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${accentColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontWeight: 700, fontSize: '14px', fontFamily: '"Space Grotesk", sans-serif' }}>
                {c.name[0]}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{c.name}</div>
                {c.company && <div style={{ fontSize: '11px', color: '#6B6B70' }}>{c.company}</div>}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B6B70' }}>
              <span>{c.email || '—'}</span>
              <span>{c.projectCount} project{c.projectCount !== 1 ? 's' : ''}</span>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: '#6B6B70' }}>
            <Users size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p>No clients found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
