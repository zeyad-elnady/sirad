'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '@prisma/client';
import { Plus, Search, UserCheck, X, Briefcase, Clock } from 'lucide-react';

interface EmployeeItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  department: string;
  paymentModel: string;
  isFreelancer: boolean;
  monthlyRate: number | null;
  hourlyRate: number | null;
  projectCount: number;
  transactionCount: number;
}

interface Props {
  role: UserRole;
  employees: EmployeeItem[];
}

export default function EmployeesPageClient({ role, employees }: Props) {
  const router = useRouter();
  const accentColor = role === 'ZEYAD_TECH' ? '#DC2626' : '#7C3AED';
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', role: '', department: role === 'ZEYAD_TECH' ? 'TECH' : 'MARKETING',
    paymentModel: 'PER_TASK', isFreelancer: false, monthlyRate: '', hourlyRate: '', bankDetails: '', notes: '',
  });

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/dashboard/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          monthlyRate: form.monthlyRate ? parseFloat(form.monthlyRate) : null,
          hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : null,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', color: '#E8E4E0', fontSize: '13px', fontFamily: '"Inter", sans-serif', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif' }}>Employees</h1>
        <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '10px', background: `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`, color: '#fff', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: `0 0 20px ${accentColor}20` }}>
          <Plus size={16} /> Register Employee
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '8px 14px', marginBottom: '20px', maxWidth: '320px' }}>
        <Search size={16} style={{ color: '#6B6B70' }} />
        <input type="text" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: '#E8E4E0', fontSize: '13px', width: '100%', fontFamily: '"Inter", sans-serif' }} />
      </div>

      {/* New Employee Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={() => setShowForm(false)}
          >
            <motion.form initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} onSubmit={handleCreate}
              style={{ background: '#121214', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '520px', border: '1px solid rgba(255,255,255,0.06)', maxHeight: '80vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}>Register Employee</h2>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#6B6B70', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input style={{ ...inputStyle, gridColumn: '1 / -1' }} placeholder="Full name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input style={inputStyle} placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input style={inputStyle} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input style={inputStyle} placeholder="Role (e.g., Developer)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                  <option value="TECH" style={{ background: '#121214' }}>Tech</option>
                  <option value="MARKETING" style={{ background: '#121214' }}>Marketing</option>
                </select>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.paymentModel} onChange={(e) => setForm({ ...form, paymentModel: e.target.value })}>
                  <option value="PER_TASK" style={{ background: '#121214' }}>Per Task</option>
                  <option value="MONTHLY" style={{ background: '#121214' }}>Monthly Retainer</option>
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#8B8B90' }}>
                  <input type="checkbox" checked={form.isFreelancer} onChange={(e) => setForm({ ...form, isFreelancer: e.target.checked })} />
                  Freelancer
                </label>
                <input style={inputStyle} type="number" step="0.01" placeholder="Monthly Rate (EGP)" value={form.monthlyRate} onChange={(e) => setForm({ ...form, monthlyRate: e.target.value })} />
                <input style={inputStyle} type="number" step="0.01" placeholder="Hourly Rate (EGP)" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} />
                <input style={{ ...inputStyle, gridColumn: '1 / -1' }} placeholder="Bank Details" value={form.bankDetails} onChange={(e) => setForm({ ...form, bankDetails: e.target.value })} />
                <textarea style={{ ...inputStyle, gridColumn: '1 / -1', minHeight: '60px', resize: 'vertical' }} placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                <button type="submit" disabled={isSubmitting} style={{ gridColumn: '1 / -1', padding: '12px', borderRadius: '10px', border: 'none', background: accentColor, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  {isSubmitting ? 'Creating...' : 'Register Employee'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employee Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {filtered.map((emp) => (
          <motion.div key={emp.id} whileHover={{ y: -2 }}
            style={{ padding: '20px', borderRadius: '14px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
            onClick={() => router.push(`/dashboard/employees/${emp.id}`)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${accentColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontWeight: 700, fontSize: '15px', fontFamily: '"Space Grotesk", sans-serif' }}>
                {emp.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {emp.name}
                  {emp.isFreelancer && <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(124,58,237,0.15)', color: '#7C3AED', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Freelancer</span>}
                </div>
                <div style={{ fontSize: '12px', color: '#6B6B70', marginTop: '2px' }}>{emp.role}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B6B70' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={12} /> {emp.projectCount} projects</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {emp.paymentModel === 'MONTHLY' ? 'Monthly' : 'Per Task'}</span>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: '#6B6B70' }}>
            <UserCheck size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p>No employees found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
