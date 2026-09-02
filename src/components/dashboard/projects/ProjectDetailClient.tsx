'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { UserRole } from '@prisma/client';
import type { ProjectProfitResult } from '@/lib/finance';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Server,
  Clapperboard,
  Plus,
  X,
  Trash2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';

interface AvailableEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  monthlyRate: number | null;
  hourlyRate: number | null;
  isFreelancer: boolean;
}

interface Props {
  role: UserRole;
  project: Record<string, unknown>;
  profit: ProjectProfitResult | null;
  availableEmployees?: AvailableEmployee[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(amount);
}

const statusColors: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: 'rgba(107,107,112,0.15)', text: '#6B6B70' },
  ACTIVE: { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  ON_HOLD: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  COMPLETED: { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' },
  CANCELLED: { bg: 'rgba(220,38,38,0.15)', text: '#DC2626' },
};

const installmentStatusColors: Record<string, string> = {
  PENDING: '#F59E0B',
  PAID: '#22C55E',
  OVERDUE: '#DC2626',
};

export default function ProjectDetailClient({ role, project, profit, availableEmployees = [] }: Props) {
  const router = useRouter();
  const accentColor = role === 'ZEYAD_TECH' ? '#B6FF33' : '#7C3AED';
  const p = project as Record<string, any>;
  const st = statusColors[p.status as string] || statusColors.DRAFT;

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({
    employeeId: '',
    assignedRole: '',
    payAmount: '',
    notes: '',
  });
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleAssignEmployee(e: React.FormEvent) {
    e.preventDefault();
    if (!assignForm.employeeId || !assignForm.assignedRole) return;

    setIsAssigning(true);
    setAssignError('');
    try {
      const res = await fetch(`/api/dashboard/projects/${p.id}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setAssignError(data.error || 'Failed to assign team member');
        return;
      }
      setShowAssignModal(false);
      setAssignForm({ employeeId: '', assignedRole: '', payAmount: '', notes: '' });
      router.refresh();
    } catch {
      setAssignError('Something went wrong. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  }

  async function handleRemoveEmployee(employeeId: string, employeeName: string) {
    if (!confirm(`Are you sure you want to remove ${employeeName} from this project?`)) return;
    setRemovingId(employeeId);
    try {
      const res = await fetch(`/api/dashboard/projects/${p.id}/employees?employeeId=${employeeId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      }
    } catch { /* ignore */ }
    finally {
      setRemovingId(null);
    }
  }

  const cardStyle: React.CSSProperties = {
    borderRadius: '14px',
    background: 'rgba(18,18,20,0.6)',
    border: '1px solid rgba(255,255,255,0.04)',
    padding: '24px',
    marginBottom: '20px',
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: '"Space Grotesk", sans-serif',
    color: accentColor,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <Link href="/dashboard/projects" style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', color: '#6B6B70', display: 'flex', textDecoration: 'none', marginTop: '4px' }}>
          <ArrowLeft size={18} />
        </Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '-0.02em' }}>
              {p.title}
            </h1>
            <span style={{ fontSize: '11px', fontWeight: 500, padding: '4px 12px', borderRadius: '20px', background: st.bg, color: st.text }}>
              {(p.status as string).replace(/_/g, ' ')}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#6B6B70', marginTop: '4px' }}>
            {(p.client as any)?.name} • Created {format(new Date(p.createdAt as string), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Financial Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total', value: formatCurrency(p.totalAmount), color: '#E8E4E0' },
          { label: 'Deposit', value: formatCurrency(p.depositPaid), color: '#22C55E' },
          { label: 'Remaining', value: formatCurrency(p.totalAmount - p.depositPaid), color: '#F59E0B' },
          ...(profit ? [
            { label: 'Net Profit', value: formatCurrency(profit.netProfit), color: profit.netProfit >= 0 ? '#22C55E' : '#DC2626' },
          ] : []),
          ...(p.hasSalesRep && profit ? [
            { label: 'Sales Commission', value: formatCurrency(profit.salesCommission), color: '#7C3AED' },
          ] : []),
        ].map((card) => (
          <div key={card.label} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{card.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Contract & Installments */}
      {p.contract && (
        <div style={cardStyle}>
          <h3 style={sectionTitle}><FileText size={16} /> Contract & Installments</h3>
          <div style={{ fontSize: '13px', color: '#8B8B90', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
            {(p.contract as any).agreementTerms?.substring(0, 300)}
            {(p.contract as any).agreementTerms?.length > 300 && '...'}
          </div>

          {(p.contract as any).installments?.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['#', 'Due Date', 'Amount', 'Status', 'Paid Date'].map((h) => (
                      <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B70', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(p.contract as any).installments.map((inst: any, i: number) => (
                    <tr key={inst.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: '#6B6B70' }}>{i + 1}</td>
                      <td style={{ padding: '10px 14px', fontSize: '12px' }}>{format(new Date(inst.dueDate), 'MMM d, yyyy')}</td>
                      <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}>{formatCurrency(inst.amount)}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: `${installmentStatusColors[inst.status]}15`, color: installmentStatusColors[inst.status], fontWeight: 500 }}>
                          {inst.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: '#6B6B70' }}>
                        {inst.paidDate ? format(new Date(inst.paidDate), 'MMM d, yyyy') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Team Members */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ ...sectionTitle, marginBottom: 0 }}>
            <Users size={16} /> Team ({(p.employees as any[])?.length || 0})
          </h3>
          <button
            type="button"
            onClick={() => {
              setAssignError('');
              setShowAssignModal(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: `1px solid ${accentColor}40`,
              background: `${accentColor}10`,
              color: accentColor,
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Plus size={14} /> Assign Member
          </button>
        </div>

        {(p.employees as any[])?.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {(p.employees as any[]).map((pe: any) => (
              <div
                key={pe.id}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <Link
                      href={`/dashboard/employees/${pe.employeeId}`}
                      style={{
                        textDecoration: 'none',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '14px',
                      }}
                    >
                      {pe.employee.name}
                    </Link>
                    <button
                      type="button"
                      title="Remove from project"
                      disabled={removingId === pe.employeeId}
                      onClick={() => handleRemoveEmployee(pe.employeeId, pe.employee.name)}
                      style={{
                        padding: '5px',
                        borderRadius: '6px',
                        border: '1px solid rgba(239,68,68,0.2)',
                        background: 'rgba(239,68,68,0.05)',
                        color: '#ef4444',
                        cursor: removingId === pe.employeeId ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {removingId === pe.employeeId ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  </div>
                  <div style={{ fontSize: '12px', color: '#8E8E93', marginTop: '4px' }}>
                    {pe.assignedRole}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#6B6B70' }}>Project Pay</span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      fontFamily: '"Space Grotesk", sans-serif',
                      color: accentColor === '#B6FF33' ? '#B6FF33' : '#a78bfa',
                    }}
                  >
                    {formatCurrency(pe.payAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '20px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.01)',
              border: '1px dashed rgba(255,255,255,0.06)',
              textAlign: 'center',
              color: '#6B6B70',
              fontSize: '13px',
            }}
          >
            No team members assigned yet. Click "+ Assign Member" above to assign employees to this project.
          </div>
        )}
      </div>

      {/* Assign Member Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => !isAssigning && setShowAssignModal(false)}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleAssignEmployee}
              style={{
                background: '#121214',
                borderRadius: '16px',
                padding: '28px',
                width: '100%',
                maxWidth: '460px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#FFFFFF', margin: 0 }}>
                  Assign Team Member
                </h2>
                <button
                  type="button"
                  onClick={() => !isAssigning && setShowAssignModal(false)}
                  style={{ background: 'none', border: 'none', color: '#6B6B70', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>

              {assignError && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#EF4444',
                    fontSize: '13px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertTriangle size={16} />
                  {assignError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                    Select Employee *
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      color: '#E8E4E0',
                      fontSize: '13px',
                      fontFamily: '"Inter", sans-serif',
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                    value={assignForm.employeeId}
                    onChange={(e) => {
                      const empId = e.target.value;
                      const emp = availableEmployees.find((x) => x.id === empId);
                      setAssignForm((prev) => ({
                        ...prev,
                        employeeId: empId,
                        assignedRole: prev.assignedRole || (emp ? emp.role : ''),
                        payAmount: prev.payAmount || (emp && (emp.hourlyRate || emp.monthlyRate) ? String(emp.hourlyRate || emp.monthlyRate) : ''),
                      }));
                    }}
                    required
                  >
                    <option value="" style={{ background: '#121214' }}>Choose an employee...</option>
                    {availableEmployees.map((emp) => (
                      <option key={emp.id} value={emp.id} style={{ background: '#121214' }}>
                        {emp.name} — {emp.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                    Assigned Role on Project *
                  </label>
                  <input
                    style={{
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
                    }}
                    placeholder="e.g. Frontend Developer, Video Editor"
                    value={assignForm.assignedRole}
                    onChange={(e) => setAssignForm({ ...assignForm, assignedRole: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                    Project Pay Amount (EGP)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    style={{
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
                    }}
                    placeholder="0.00"
                    value={assignForm.payAmount}
                    onChange={(e) => setAssignForm({ ...assignForm, payAmount: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                    Notes (Optional)
                  </label>
                  <textarea
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      color: '#E8E4E0',
                      fontSize: '13px',
                      fontFamily: '"Inter", sans-serif',
                      outline: 'none',
                      minHeight: '60px',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Specific deliverables or timeline notes..."
                    value={assignForm.notes}
                    onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    disabled={isAssigning}
                    onClick={() => setShowAssignModal(false)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      color: '#E8E4E0',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAssigning}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 22px',
                      borderRadius: '10px',
                      border: 'none',
                      background: accentColor === '#B6FF33' ? 'linear-gradient(135deg, #B6FF33, #96da00)' : `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
                      color: accentColor === '#B6FF33' ? '#121f00' : '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: isAssigning ? 'not-allowed' : 'pointer',
                      opacity: isAssigning ? 0.7 : 1,
                    }}
                  >
                    {isAssigning && <Loader2 size={15} className="animate-spin" />}
                    {isAssigning ? 'Assigning...' : 'Assign to Project'}
                  </button>
                </div>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recurring Expenses (Tech) */}
      {p.department === 'TECH' && (p.recurringExpenses as any[])?.length > 0 && (
        <div style={cardStyle}>
          <h3 style={sectionTitle}><Server size={16} /> Recurring Expenses</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Category', 'Description', 'Amount', 'Frequency'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B70', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(p.recurringExpenses as any[]).map((e: any) => (
                  <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', color: '#8B8B90', textTransform: 'capitalize' }}>
                        {e.category.replace(/_/g, ' ').toLowerCase()}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '13px' }}>{e.description}</td>
                    <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}>{formatCurrency(e.amount)}</td>
                    <td style={{ padding: '10px 14px', fontSize: '12px', color: '#6B6B70', textTransform: 'capitalize' }}>{e.frequency.toLowerCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Production Details (Marketing) */}
      {p.department === 'MARKETING' && p.productionDetail && (
        <div style={cardStyle}>
          <h3 style={sectionTitle}><Clapperboard size={16} /> Production Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Equipment Type</div>
              <div style={{ fontSize: '14px' }}>{(p.productionDetail as any).equipmentType}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Rental Cost</div>
              <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: '#F59E0B' }}>{formatCurrency((p.productionDetail as any).rentalCost)}</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
