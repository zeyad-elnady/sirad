'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '@prisma/client';
import type { EmployeeBalance } from '@/lib/finance';
import { ArrowLeft, Plus, X, Wallet, Briefcase, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface Props {
  role: UserRole;
  employee: Record<string, any>;
  balance: EmployeeBalance;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(amount);
}

const txTypeColors: Record<string, string> = {
  SALARY: '#22C55E', PARTIAL_PAYMENT: '#3B82F6', DEPOSIT: '#7C3AED', LOAN: '#F59E0B',
  ADVANCE: '#F59E0B', TASK_PAYMENT: '#22C55E', BONUS: '#10B981', DEDUCTION: '#DC2626',
};

export default function EmployeeProfileClient({ role, employee, balance }: Props) {
  const router = useRouter();
  const accentColor = role === 'ZEYAD_TECH' ? '#DC2626' : '#7C3AED';
  const [showTxForm, setShowTxForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txForm, setTxForm] = useState({ type: 'PARTIAL_PAYMENT', amount: '', notes: '' });

  async function handleTransaction(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/dashboard/employees/${employee.id}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...txForm, amount: parseFloat(txForm.amount) }),
      });
      if (res.ok) {
        setShowTxForm(false);
        setTxForm({ type: 'PARTIAL_PAYMENT', amount: '', notes: '' });
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '28px' }}>
        <Link href="/dashboard/employees" style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', color: '#6B6B70', display: 'flex', textDecoration: 'none', marginTop: '4px' }}>
          <ArrowLeft size={18} />
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {employee.name}
            {employee.isFreelancer && <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(124,58,237,0.15)', color: '#7C3AED' }}>Freelancer</span>}
          </h1>
          <p style={{ fontSize: '13px', color: '#6B6B70', marginTop: '2px' }}>
            {employee.role} • {employee.department} • {employee.paymentModel === 'MONTHLY' ? 'Monthly' : 'Per Task'}
          </p>
        </div>
        <button onClick={() => setShowTxForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '10px', background: `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`, color: '#fff', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <Plus size={16} /> New Payment
        </button>
      </div>

      {/* Balance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Earned', value: formatCurrency(balance.totalEarned), icon: <TrendingUp size={18} />, color: '#22C55E' },
          { label: 'Total Paid', value: formatCurrency(balance.totalPaid), icon: <Wallet size={18} />, color: '#3B82F6' },
          { label: 'Advances', value: formatCurrency(balance.totalAdvances), icon: <TrendingDown size={18} />, color: '#F59E0B' },
          { label: 'Loans', value: formatCurrency(balance.totalLoans), icon: <AlertCircle size={18} />, color: '#DC2626' },
          { label: 'Outstanding', value: formatCurrency(balance.outstandingBalance), icon: <Wallet size={18} />, color: balance.outstandingBalance >= 0 ? '#22C55E' : '#DC2626' },
        ].map((card) => (
          <div key={card.label} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{card.label}</span>
              <span style={{ color: card.color, opacity: 0.6 }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div style={{ borderRadius: '14px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: accentColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={16} /> Assigned Projects ({employee.projectAssignments?.length || 0})
        </h3>
        {employee.projectAssignments?.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Project', 'Client', 'Role', 'Pay', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B70', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employee.projectAssignments.map((pa: any) => (
                  <tr key={pa.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '10px 14px' }}><Link href={`/dashboard/projects/${pa.projectId}`} style={{ color: '#E8E4E0', textDecoration: 'none', fontWeight: 500, fontSize: '13px' }}>{pa.project.title}</Link></td>
                    <td style={{ padding: '10px 14px', color: '#6B6B70', fontSize: '12px' }}>{pa.project.client?.name}</td>
                    <td style={{ padding: '10px 14px', fontSize: '12px' }}>{pa.assignedRole}</td>
                    <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: '#22C55E' }}>{formatCurrency(pa.payAmount)}</td>
                    <td style={{ padding: '10px 14px', fontSize: '11px', color: pa.isActive ? '#22C55E' : '#6B6B70' }}>{pa.isActive ? 'Active' : 'Completed'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: '#6B6B70' }}>No project assignments yet.</p>
        )}
      </div>

      {/* Transaction History */}
      <div style={{ borderRadius: '14px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)', padding: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: accentColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wallet size={16} /> Transaction History ({employee.transactions?.length || 0})
        </h3>
        {employee.transactions?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {employee.transactions.map((tx: any) => (
              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: `${txTypeColors[tx.type] || '#6B6B70'}15`, color: txTypeColors[tx.type] || '#6B6B70', fontWeight: 500, textTransform: 'capitalize' }}>
                    {tx.type.replace(/_/g, ' ').toLowerCase()}
                  </span>
                  {tx.notes && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#6B6B70' }}>{tx.notes}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: txTypeColors[tx.type] || '#E8E4E0' }}>
                    {formatCurrency(tx.amount)}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6B6B70' }}>{format(new Date(tx.date), 'MMM d, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: '#6B6B70' }}>No transactions yet.</p>
        )}
      </div>

      {/* Transaction Modal */}
      <AnimatePresence>
        {showTxForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={() => setShowTxForm(false)}
          >
            <motion.form initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} onSubmit={handleTransaction}
              style={{ background: '#121214', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '420px', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}>New Payment</h2>
                <button type="button" onClick={() => setShowTxForm(false)} style={{ background: 'none', border: 'none', color: '#6B6B70', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={txForm.type} onChange={(e) => setTxForm({ ...txForm, type: e.target.value })}>
                  {['SALARY', 'PARTIAL_PAYMENT', 'DEPOSIT', 'LOAN', 'ADVANCE', 'TASK_PAYMENT', 'BONUS', 'DEDUCTION'].map((t) => (
                    <option key={t} value={t} style={{ background: '#121214' }}>{t.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <input style={inputStyle} type="number" step="0.01" placeholder="Amount (EGP)" value={txForm.amount} onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })} required />
                <textarea style={{ ...inputStyle, minHeight: '60px' }} placeholder="Notes (optional)" value={txForm.notes} onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })} />
                <button type="submit" disabled={isSubmitting} style={{ padding: '12px', borderRadius: '10px', border: 'none', background: accentColor, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  {isSubmitting ? 'Processing...' : 'Record Payment'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
