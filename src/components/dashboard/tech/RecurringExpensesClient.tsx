'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '@prisma/client';
import { Plus, Server, Globe, Cpu, MoreHorizontal, X } from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseItem {
  id: string;
  category: 'HOSTING' | 'DOMAIN' | 'API_USAGE' | 'OTHER';
  description: string;
  amount: number;
  frequency: 'MONTHLY' | 'ANNUAL';
  projectId: string;
  projectTitle: string;
  startDate: string;
  endDate: string | null;
}

interface ProjectOption {
  id: string;
  title: string;
}

interface Props {
  role: UserRole;
  expenses: ExpenseItem[];
  projects: ProjectOption[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(amount);
}

const categoryIcons = {
  HOSTING: <Server size={16} className="text-[#B6FF33]" />,
  DOMAIN: <Globe size={16} className="text-blue-400" />,
  API_USAGE: <Cpu size={16} className="text-purple-400" />,
  OTHER: <MoreHorizontal size={16} className="text-zinc-400" />,
};

export default function RecurringExpensesClient({ role, expenses, projects }: Props) {
  const router = useRouter();
  const accentColor = '#B6FF33';
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    projectId: projects[0]?.id || '',
    category: 'HOSTING',
    description: '',
    amount: '',
    frequency: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
  });

  const totalMonthlyBurn = expenses.reduce((acc, curr) => {
    return acc + (curr.frequency === 'ANNUAL' ? curr.amount / 12 : curr.amount);
  }, 0);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.projectId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/dashboard/recurring-expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: form.projectId,
          category: form.category,
          description: form.description,
          amount: parseFloat(form.amount) || 0,
          frequency: form.frequency,
          startDate: new Date(form.startDate).toISOString(),
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({
          projectId: projects[0]?.id || '',
          category: 'HOSTING',
          description: '',
          amount: '',
          frequency: 'MONTHLY',
          startDate: new Date().toISOString().split('T')[0],
        });
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#E8E4E0',
    fontSize: '13px',
    fontFamily: '"Inter", sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif' }}>
            Recurring Expenses Tracker
          </h1>
          <p style={{ fontSize: '13px', color: '#6B6B70', marginTop: '4px' }}>
            Hosting, domains, cloud infrastructure, and AI/API operational costs (Tech Workspace)
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #B6FF33, #96da00)',
            color: '#121f00',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(182,255,51,0.25)',
          }}
        >
          <Plus size={16} /> Log Expense
        </button>
      </div>

      {/* Burn Rate Stat */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Estimated Monthly Burn Rate
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#B6FF33' }}>
            {formatCurrency(totalMonthlyBurn)}/mo
          </div>
        </div>
        <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Active Subscriptions
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#E8E4E0' }}>
            {expenses.length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: '14px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
        {expenses.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6B6B70' }}>
            <Server size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p>No recurring expenses logged yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Category', 'Description', 'Linked Project', 'Amount', 'Cycle', 'Started'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '14px 16px',
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: '#6B6B70',
                      textAlign: 'left',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, idx) => (
                <tr key={e.id} style={{ borderBottom: idx < expenses.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                  <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    {categoryIcons[e.category]}
                    <span>{e.category.replace(/_/g, ' ')}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#E8E4E0' }}>{e.description}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8B8B90' }}>{e.projectTitle}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: '#B6FF33' }}>
                    {formatCurrency(e.amount)}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6B6B70', textTransform: 'capitalize' }}>
                    {e.frequency.toLowerCase()}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6B6B70' }}>
                    {format(new Date(e.startDate), 'MMM d, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setShowForm(false)}
          >
            <motion.form
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleCreate}
              style={{
                background: '#121214',
                borderRadius: '16px',
                padding: '28px',
                width: '100%',
                maxWidth: '460px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}>Log Recurring Expense</h2>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#6B6B70', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', marginBottom: '6px' }}>Project</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={form.projectId}
                    onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                    required
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} style={{ background: '#121214' }}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', marginBottom: '6px' }}>Category</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="HOSTING" style={{ background: '#121214' }}>Hosting</option>
                    <option value="DOMAIN" style={{ background: '#121214' }}>Domain</option>
                    <option value="API_USAGE" style={{ background: '#121214' }}>API Usage (e.g. OpenAI/Anthropic)</option>
                    <option value="OTHER" style={{ background: '#121214' }}>Other Operational Cost</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', marginBottom: '6px' }}>Description</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g. Vercel Pro, AWS RDS, Domain Renewal"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', marginBottom: '6px' }}>Amount (EGP)</label>
                    <input
                      style={inputStyle}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', marginBottom: '6px' }}>Frequency</label>
                    <select
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      value={form.frequency}
                      onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                    >
                      <option value="MONTHLY" style={{ background: '#121214' }}>Monthly</option>
                      <option value="ANNUAL" style={{ background: '#121214' }}>Annual</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: accentColor,
                    color: '#121f00',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '8px',
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Add Expense'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
