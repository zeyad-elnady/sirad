'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '@prisma/client';
import type { EmployeeBalance } from '@/lib/finance';
import { ArrowLeft, Plus, X, Wallet, Briefcase, TrendingUp, TrendingDown, AlertCircle, Pencil } from 'lucide-react';
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
  const accentColor = role === 'ZEYAD_TECH' ? '#B6FF33' : '#7C3AED';
  const [showTxForm, setShowTxForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [txForm, setTxForm] = useState({ type: 'PARTIAL_PAYMENT', amount: '', notes: '' });

  const [editForm, setEditForm] = useState({
    name: employee.name || '',
    email: employee.email || '',
    phone: employee.phone || '',
    role: employee.role || '',
    department: employee.department || 'TECH',
    paymentModel: employee.paymentModel || 'PER_TASK',
    isFreelancer: !!employee.isFreelancer,
    monthlyRate: employee.monthlyRate !== null && employee.monthlyRate !== undefined ? String(employee.monthlyRate) : '',
    hourlyRate: employee.hourlyRate !== null && employee.hourlyRate !== undefined ? String(employee.hourlyRate) : '',
    bankDetails: employee.bankDetails || '',
    notes: employee.notes || '',
  });

  function openEditModal() {
    setEditForm({
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      role: employee.role || '',
      department: employee.department || 'TECH',
      paymentModel: employee.paymentModel || 'PER_TASK',
      isFreelancer: !!employee.isFreelancer,
      monthlyRate: employee.monthlyRate !== null && employee.monthlyRate !== undefined ? String(employee.monthlyRate) : '',
      hourlyRate: employee.hourlyRate !== null && employee.hourlyRate !== undefined ? String(employee.hourlyRate) : '',
      bankDetails: employee.bankDetails || '',
      notes: employee.notes || '',
    });
    setEditError('');
    setShowEditModal(true);
  }

  async function handleUpdateEmployee(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setEditError('');

    try {
      const res = await fetch(`/api/dashboard/employees/${employee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || 'Failed to update employee');
        return;
      }

      setShowEditModal(false);
      router.refresh();
    } catch {
      setEditError('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

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
      <div style={{ display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <Link href="/dashboard/employees" style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', color: '#6B6B70', display: 'flex', textDecoration: 'none', marginTop: '4px' }}>
          <ArrowLeft size={18} />
        </Link>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {employee.name}
            {employee.isFreelancer && <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(124,58,237,0.15)', color: '#7C3AED', fontWeight: 600 }}>Freelancer</span>}
          </h1>
          <p style={{ fontSize: '13px', color: '#6B6B70', marginTop: '2px' }}>
            {employee.role} • {employee.department} • {employee.paymentModel === 'MONTHLY' ? 'Monthly' : 'Per Task'}
            {employee.email && ` • ${employee.email}`}
            {employee.phone && ` • ${employee.phone}`}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={openEditModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#e5e2e1',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(182,255,51,0.4)';
              e.currentTarget.style.color = '#B6FF33';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(182,255,51,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#e5e2e1';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Pencil size={15} /> Edit Data
          </button>
          <button onClick={() => setShowTxForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '10px', background: accentColor === '#B6FF33' ? 'linear-gradient(135deg, #B6FF33, #96da00)' : `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`, color: accentColor === '#B6FF33' ? '#121f00' : '#fff', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: accentColor === '#B6FF33' ? '0 0 25px rgba(182,255,51,0.25)' : 'none' }}>
            <Plus size={16} /> New Payment
          </button>
        </div>
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

      {/* Employee Details Summary Card */}
      <div style={{ borderRadius: '14px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)', padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: accentColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Pencil size={16} /> Employee Information
          </h3>
          <button
            onClick={openEditModal}
            style={{
              fontSize: '12px',
              color: '#B6FF33',
              background: 'rgba(182,255,51,0.06)',
              border: '1px solid rgba(182,255,51,0.2)',
              padding: '4px 12px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Edit Information
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Full Name</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8E4E0' }}>{employee.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Role / Position</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8E4E0' }}>{employee.role}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Department</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8E4E0' }}>{employee.department}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Email</div>
            <div style={{ fontSize: '14px', color: employee.email ? '#E8E4E0' : '#6B6B70' }}>{employee.email || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Phone</div>
            <div style={{ fontSize: '14px', color: employee.phone ? '#E8E4E0' : '#6B6B70' }}>{employee.phone || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Payment Model</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8E4E0' }}>
              {employee.paymentModel === 'MONTHLY' ? 'Monthly Retainer' : 'Per Task'}
              {employee.isFreelancer && ' (Freelancer)'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Compensation Rate</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#B6FF33' }}>
              {employee.monthlyRate ? `${formatCurrency(employee.monthlyRate)}/mo` : employee.hourlyRate ? `${formatCurrency(employee.hourlyRate)}/hr` : 'Task-based'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Bank / Instapay</div>
            <div style={{ fontSize: '14px', color: employee.bankDetails ? '#E8E4E0' : '#6B6B70' }}>{employee.bankDetails || '—'}</div>
          </div>
          {employee.notes && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Notes</div>
              <div style={{ fontSize: '13px', color: '#E8E4E0', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>{employee.notes}</div>
            </div>
          )}
        </div>
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

      {/* Edit Employee Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setShowEditModal(false)}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleUpdateEmployee}
              style={{
                background: '#121214',
                borderRadius: '18px',
                padding: '28px',
                width: '100%',
                maxWidth: '540px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(182,255,51,0.05)',
                maxHeight: '85vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#e5e2e1' }}>
                    Edit Employee Details
                  </h2>
                  <p style={{ fontSize: '12px', color: '#6B6B70', marginTop: '2px' }}>
                    Update profile, contact, department, and compensation
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#6B6B70',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {editError && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#EF4444', fontSize: '13px', marginBottom: '16px' }}>
                  {editError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Full Name *</label>
                  <input
                    style={inputStyle}
                    placeholder="Full name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Email</label>
                  <input
                    style={inputStyle}
                    placeholder="Email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Phone</label>
                  <input
                    style={inputStyle}
                    placeholder="Phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Role / Position *</label>
                  <input
                    style={inputStyle}
                    placeholder="Role (e.g., Developer)"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Department</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  >
                    <option value="TECH" style={{ background: '#121214' }}>Tech</option>
                    <option value="MARKETING" style={{ background: '#121214' }}>Marketing</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Payment Model</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={editForm.paymentModel}
                    onChange={(e) => setEditForm({ ...editForm, paymentModel: e.target.value })}
                  >
                    <option value="PER_TASK" style={{ background: '#121214' }}>Per Task</option>
                    <option value="MONTHLY" style={{ background: '#121214' }}>Monthly Retainer</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '22px' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#e5e2e1' }}>
                    <input
                      type="checkbox"
                      checked={editForm.isFreelancer}
                      onChange={(e) => setEditForm({ ...editForm, isFreelancer: e.target.checked })}
                      style={{ accentColor: '#B6FF33', width: '16px', height: '16px' }}
                    />
                    Freelancer
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Monthly Rate (EGP)</label>
                  <input
                    style={inputStyle}
                    type="number"
                    step="0.01"
                    placeholder="Monthly Rate"
                    value={editForm.monthlyRate}
                    onChange={(e) => setEditForm({ ...editForm, monthlyRate: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Hourly Rate (EGP)</label>
                  <input
                    style={inputStyle}
                    type="number"
                    step="0.01"
                    placeholder="Hourly Rate"
                    value={editForm.hourlyRate}
                    onChange={(e) => setEditForm({ ...editForm, hourlyRate: e.target.value })}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Bank Details / Instapay / Wallet</label>
                  <input
                    style={inputStyle}
                    placeholder="IBAN, Account Number, or Instapay handle"
                    value={editForm.bankDetails}
                    onChange={(e) => setEditForm({ ...editForm, bankDetails: e.target.value })}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Notes</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                    placeholder="Additional notes about this team member..."
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      color: '#8B8B90',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '10px',
                      border: 'none',
                      background: accentColor === '#B6FF33' ? 'linear-gradient(135deg, #B6FF33, #96da00)' : `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
                      color: accentColor === '#B6FF33' ? '#121f00' : '#fff',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      boxShadow: accentColor === '#B6FF33' ? '0 0 25px rgba(182,255,51,0.25)' : 'none',
                      opacity: isSaving ? 0.7 : 1,
                    }}
                  >
                    {isSaving ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

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
                <button type="submit" disabled={isSubmitting} style={{ padding: '12px', borderRadius: '10px', border: 'none', background: accentColor, color: accentColor === '#B6FF33' ? '#121f00' : '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
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
