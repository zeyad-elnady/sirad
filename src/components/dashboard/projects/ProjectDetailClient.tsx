'use client';

import { useState, useMemo } from 'react';
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
  Pencil,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import FormattedNumberInput from '@/components/ui/FormattedNumberInput';
import { useDashboardLang } from '@/context/DashboardLanguageContext';

const techTypes = [
  { value: 'LANDING_PAGE', label: 'Landing Page' },
  { value: 'SYSTEM', label: 'System' },
  { value: 'ECOMMERCE', label: 'E-commerce' },
  { value: 'WEBSITE_WITH_DASHBOARD', label: 'Website with Dashboard' },
];

const marketingTypes = [
  { value: 'PRODUCTION', label: 'Production' },
  { value: 'VISUAL_IDENTITY', label: 'Visual Identity' },
  { value: 'SOCIAL_MEDIA_SPECIALIST', label: 'Social Media Specialist' },
  { value: 'PERFORMANCE_MARKETING', label: 'Performance Marketing' },
];

interface AvailableEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  monthlyRate: number | null;
  hourlyRate: number | null;
  isFreelancer: boolean;
}

interface ProjectTransaction {
  id: string;
  type: string;
  amount: number;
  employeeId: string;
  date: string;
  notes?: string | null;
}

interface Props {
  role: UserRole;
  project: Record<string, unknown>;
  profit: ProjectProfitResult | null;
  availableEmployees?: AvailableEmployee[];
  clients?: { id: string; name: string; company: string | null }[];
  salesReps?: { id: string; name: string }[];
  projectTransactions?: ProjectTransaction[];
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

const txTypeColors: Record<string, string> = {
  SALARY: '#22C55E',
  PARTIAL_PAYMENT: '#3B82F6',
  DEPOSIT: '#7C3AED',
  LOAN: '#F59E0B',
  ADVANCE: '#F59E0B',
  TASK_PAYMENT: '#22C55E',
  BONUS: '#10B981',
  DEDUCTION: '#DC2626',
};

export default function ProjectDetailClient({
  role,
  project,
  profit,
  availableEmployees = [],
  clients = [],
  salesReps = [],
  projectTransactions = [],
}: Props) {
  const router = useRouter();
  const { t, isRtl, formatCurrency } = useDashboardLang();
  const accentColor = role === 'ZEYAD_TECH' ? '#B6FF33' : '#7C3AED';
  const p = project as Record<string, any>;
  const st = statusColors[p.status as string] || statusColors.DRAFT;
  const projectTypes = p.department === 'TECH' ? techTypes : marketingTypes;

  // Edit Project State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: p.title || '',
    description: p.description || '',
    status: p.status || 'DRAFT',
    startDate: p.startDate ? p.startDate.split('T')[0] : '',
    deadline: p.deadline ? p.deadline.split('T')[0] : '',
    totalAmount: String(p.totalAmount ?? 0),
    depositPaid: String(p.depositPaid ?? 0),
    clientId: p.clientId || '',
    projectType: p.techProjectType || p.marketingProjectType || '',
    hasSalesRep: Boolean(p.hasSalesRep),
    salesRepId: p.salesRepId || '',
    salesCommissionPercent: p.salesCommissionPercent ? String(p.salesCommissionPercent) : '',
  });
  const [salesRepList, setSalesRepList] = useState<{ id: string; name: string }[]>(salesReps);
  const [showNewSalesRepInEdit, setShowNewSalesRepInEdit] = useState(false);
  const [newSalesRepNameInEdit, setNewSalesRepNameInEdit] = useState('');
  const [isCreatingSalesRepInEdit, setIsCreatingSalesRepInEdit] = useState(false);
  const [salesRepErrorInEdit, setSalesRepErrorInEdit] = useState('');

  async function createNewSalesRepInEdit() {
    if (!newSalesRepNameInEdit.trim()) return;
    setIsCreatingSalesRepInEdit(true);
    setSalesRepErrorInEdit('');
    try {
      const res = await fetch('/api/dashboard/sales-reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSalesRepNameInEdit.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSalesRepErrorInEdit(data.error || 'Failed to add sales rep');
        return;
      }
      if (data.salesRep) {
        setSalesRepList((prev) => [...prev, data.salesRep]);
        setEditForm((prev) => ({
          ...prev,
          hasSalesRep: true,
          salesRepId: data.salesRep.id,
        }));
        setShowNewSalesRepInEdit(false);
        setNewSalesRepNameInEdit('');
        router.refresh();
      }
    } catch {
      setSalesRepErrorInEdit('Network error. Please try again.');
    } finally {
      setIsCreatingSalesRepInEdit(false);
    }
  }

  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Breakdown & Quick Payment State
  const [breakdownEmployee, setBreakdownEmployee] = useState<any | null>(null);
  const [showQuickPayment, setShowQuickPayment] = useState(false);
  const [quickPaymentForm, setQuickPaymentForm] = useState({
    type: 'SALARY',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [quickPaymentLoading, setQuickPaymentLoading] = useState(false);
  const [quickPaymentError, setQuickPaymentError] = useState('');

  async function handleQuickPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!breakdownEmployee) return;
    setQuickPaymentLoading(true);
    setQuickPaymentError('');
    try {
      const res = await fetch(`/api/dashboard/employees/${breakdownEmployee.employeeId}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: quickPaymentForm.type,
          amount: parseFloat(quickPaymentForm.amount),
          projectId: p.id,
          date: quickPaymentForm.date ? new Date(quickPaymentForm.date).toISOString() : new Date().toISOString(),
          notes: quickPaymentForm.notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setQuickPaymentError(data.error || 'Failed to record payment');
        return;
      }
      setShowQuickPayment(false);
      setQuickPaymentForm({
        type: 'SALARY',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      router.refresh();
    } catch {
      setQuickPaymentError('Something went wrong. Please try again.');
    } finally {
      setQuickPaymentLoading(false);
    }
  }

  function openEditModal() {
    setEditForm({
      title: p.title || '',
      description: p.description || '',
      status: p.status || 'DRAFT',
      startDate: p.startDate ? p.startDate.split('T')[0] : '',
      deadline: p.deadline ? p.deadline.split('T')[0] : '',
      totalAmount: String(p.totalAmount ?? 0),
      depositPaid: String(p.depositPaid ?? 0),
      clientId: p.clientId || '',
      projectType: p.techProjectType || p.marketingProjectType || '',
      hasSalesRep: Boolean(p.hasSalesRep),
      salesRepId: p.salesRepId || '',
      salesCommissionPercent: p.salesCommissionPercent ? String(p.salesCommissionPercent) : '',
    });
    setEditError('');
    setShowEditModal(true);
  }

  async function handleUpdateProject(e: React.FormEvent) {
    e.preventDefault();
    setIsUpdating(true);
    setEditError('');
    try {
      const res = await fetch(`/api/dashboard/projects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description || null,
          status: editForm.status,
          startDate: editForm.startDate ? new Date(editForm.startDate).toISOString() : null,
          deadline: editForm.deadline ? new Date(editForm.deadline).toISOString() : null,
          totalAmount: parseFloat(editForm.totalAmount) || 0,
          depositPaid: parseFloat(editForm.depositPaid) || 0,
          clientId: editForm.clientId || undefined,
          techProjectType: p.department === 'TECH' ? editForm.projectType || null : null,
          marketingProjectType: p.department === 'MARKETING' ? editForm.projectType || null : null,
          hasSalesRep: editForm.hasSalesRep,
          salesRepId: editForm.hasSalesRep ? editForm.salesRepId || null : null,
          salesCommissionPercent:
            editForm.hasSalesRep && editForm.salesCommissionPercent
              ? parseFloat(editForm.salesCommissionPercent)
              : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || 'Failed to update project');
        return;
      }
      setShowEditModal(false);
      router.refresh();
    } catch {
      setEditError('Something went wrong. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleQuickStatusChange(newStatus: string) {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/dashboard/projects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch { /* ignore */ }
    finally {
      setIsUpdatingStatus(false);
    }
  }

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

  function openEditEmployee(pe: any) {
    setAssignForm({
      employeeId: pe.employeeId,
      assignedRole: pe.assignedRole,
      payAmount: String(pe.payAmount ?? 0),
      notes: pe.notes || '',
    });
    setAssignError('');
    setShowAssignModal(true);
  }

  // Real-time financial calculations subtracting employee salaries
  const totalEmployeesCost =
    (p.employees as any[])?.reduce(
      (sum: number, pe: any) => sum + (Number(pe.payAmount) || 0),
      0
    ) ?? (profit?.employeeCosts ?? 0);

  const recurringCosts =
    (p.recurringExpenses as any[])?.reduce((sum: number, exp: any) => {
      return sum + (exp.frequency === 'ANNUAL' ? (Number(exp.amount) || 0) / 12 : (Number(exp.amount) || 0));
    }, 0) ?? (profit?.recurringExpenseCosts ?? 0);

  const productionCosts = Number(p.productionDetail?.rentalCost) || (profit?.productionCosts ?? 0);

  const totalCosts = totalEmployeesCost + recurringCosts + productionCosts;
  const grossProfit = Number(p.totalAmount || 0) - totalCosts;

  let salesCommission = 0;
  if (p.hasSalesRep && p.salesCommissionPercent) {
    salesCommission = Math.max(0, (grossProfit * Number(p.salesCommissionPercent)) / 100);
  } else if (profit?.salesCommission) {
    salesCommission = profit.salesCommission;
  }

  const computedNetProfit = grossProfit - salesCommission;
  const profitMargin =
    p.totalAmount > 0
      ? ((computedNetProfit / p.totalAmount) * 100).toFixed(1)
      : '0.0';

  // Map employeeId -> { paid: number, remaining: number, payAmount: number, loans: number, directPaid: number }
  const employeePaymentsMap = useMemo(() => {
    const map: Record<
      string,
      { paid: number; remaining: number; payAmount: number; loans: number; directPaid: number }
    > = {};
    const employees = (p.employees as any[]) || [];
    employees.forEach((pe) => {
      const empTx = projectTransactions.filter((tx) => tx.employeeId === pe.employeeId);

      const directPaid = empTx
        .filter((tx) =>
          ['SALARY', 'PARTIAL_PAYMENT', 'DEPOSIT', 'TASK_PAYMENT', 'ADVANCE'].includes(tx.type)
        )
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

      const loans = empTx
        .filter((tx) => tx.type === 'LOAN')
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

      const deductions = empTx
        .filter((tx) => tx.type === 'DEDUCTION')
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

      const bonus = empTx
        .filter((tx) => tx.type === 'BONUS')
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

      const totalDrawn = directPaid + loans + deductions;
      const payAmount = (Number(pe.payAmount) || 0) + bonus;
      const remaining = Math.max(0, payAmount - totalDrawn);

      map[pe.employeeId] = {
        paid: totalDrawn,
        remaining,
        payAmount,
        loans,
        directPaid,
      };
    });
    return map;
  }, [p.employees, projectTransactions]);

  const totalSalariesPaid = useMemo(() => {
    return Object.values(employeePaymentsMap).reduce((sum, item) => sum + item.paid, 0);
  }, [employeePaymentsMap]);

  const totalSalariesRemaining = useMemo(() => {
    return Object.values(employeePaymentsMap).reduce((sum, item) => sum + item.remaining, 0);
  }, [employeePaymentsMap]);

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/dashboard/projects"
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              color: '#6B6B70',
              display: 'flex',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  fontFamily: '"Space Grotesk", sans-serif',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  margin: 0,
                }}
              >
                {p.title}
              </h1>

              {/* Status Selector Dropdown */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <select
                  value={p.status}
                  disabled={isUpdatingStatus}
                  onChange={(e) => handleQuickStatusChange(e.target.value)}
                  style={{
                    appearance: 'none',
                    padding: '4px 28px 4px 12px',
                    borderRadius: '20px',
                    background: st.bg,
                    color: st.text,
                    border: `1px solid ${st.text}40`,
                    fontSize: '11px',
                    fontWeight: 600,
                    fontFamily: '"Space Grotesk", sans-serif',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="DRAFT" style={{ background: '#121214', color: '#6B6B70' }}>● Draft</option>
                  <option value="ACTIVE" style={{ background: '#121214', color: '#22C55E' }}>● Active</option>
                  <option value="ON_HOLD" style={{ background: '#121214', color: '#F59E0B' }}>● On Hold</option>
                  <option value="COMPLETED" style={{ background: '#121214', color: '#3B82F6' }}>● Completed</option>
                  <option value="CANCELLED" style={{ background: '#121214', color: '#DC2626' }}>● Cancelled</option>
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    fontSize: '8px',
                    color: st.text,
                  }}
                >
                  ▼
                </div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#6B6B70', marginTop: '4px', margin: 0 }}>
              {(p.client as any)?.name} • Created {format(new Date(p.createdAt as string), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={openEditModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: `1px solid ${accentColor}50`,
              background:
                accentColor === '#B6FF33'
                  ? 'linear-gradient(135deg, #B6FF33, #96da00)'
                  : `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
              color: accentColor === '#B6FF33' ? '#121f00' : '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: '"Space Grotesk", sans-serif',
              cursor: 'pointer',
              boxShadow:
                accentColor === '#B6FF33'
                  ? '0 0 20px rgba(182,255,51,0.2)'
                  : `0 0 20px ${accentColor}20`,
              transition: 'all 0.2s',
            }}
          >
            <Pencil size={15} /> {t('editProject')}
          </button>
        </div>
      </div>

      {/* Financial & Timeline Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: t('totalRevenue'), value: formatCurrency(p.totalAmount), color: '#E8E4E0' },
          { label: t('deposit'), value: formatCurrency(p.depositPaid), color: '#22C55E' },
          { label: t('remainingBalance'), value: formatCurrency(p.totalAmount - p.depositPaid), color: '#F59E0B' },
          {
            label: t('salaries'),
            value: totalEmployeesCost > 0 ? `-${formatCurrency(totalEmployeesCost)}` : formatCurrency(0),
            color: totalEmployeesCost > 0 ? '#EF4444' : '#6B6B70',
            sublabel: totalSalariesPaid > 0
              ? `${isRtl ? 'المدفوع' : 'Paid'}: ${formatCurrency(totalSalariesPaid)} • ${isRtl ? 'المتبقي' : 'Remaining'}: ${formatCurrency(totalSalariesRemaining)}`
              : `${((p.employees as any[]) || []).length} ${isRtl ? 'أعضاء في الفريق' : 'team members'}`,
          },
          {
            label: t('netProfit'),
            value: formatCurrency(computedNetProfit),
            color: computedNetProfit >= 0 ? '#22C55E' : '#DC2626',
            sublabel: `${profitMargin}% ${isRtl ? 'هامش ربح' : 'margin'} (${isRtl ? 'الإيرادات − الرواتب' : 'Revenue − Salaries'})`,
          },
          {
            label: t('startDate'),
            value: p.startDate ? format(new Date(p.startDate), 'MMM d, yyyy') : (isRtl ? 'غير محدد' : 'Not set'),
            color: p.startDate ? '#E8E4E0' : '#6B6B70',
            isDate: true,
          },
          {
            label: t('deadline'),
            value: p.deadline ? format(new Date(p.deadline), 'MMM d, yyyy') : (isRtl ? 'بدون موعد تسليم' : 'No deadline'),
            color: p.deadline
              ? new Date(p.deadline) < new Date() && p.status !== 'COMPLETED'
                ? '#EF4444'
                : accentColor
              : '#6B6B70',
            isDate: true,
          },
          ...(p.hasSalesRep ? [
            {
              label: isRtl ? 'عمولة المبيعات' : 'Sales Commission',
              value: formatCurrency(salesCommission),
              color: '#7C3AED',
              sublabel: `${p.salesCommissionPercent || 0}% ${isRtl ? 'بعد التكاليف' : 'after costs'}`,
            },
          ] : []),
        ].map((card) => (
          <div key={card.label} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{card.label}</div>
            <div style={{ fontSize: (card as any).isDate ? '16px' : '20px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: card.color }}>{card.value}</div>
            {(card as any).sublabel && (
              <div style={{ fontSize: '11px', color: '#8E8E93', marginTop: '4px' }}>
                {(card as any).sublabel}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Net Profit Calculation Formula Banner */}
      <div
        style={{
          borderRadius: '12px',
          background: 'rgba(18,18,20,0.7)',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '16px 20px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: accentColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Profit Calculation Formula
            </span>
            <span style={{ fontSize: '12px', color: '#6B6B70' }}>•</span>
            <span style={{ fontSize: '12px', color: '#8E8E93' }}>
              Net Profit = Total Revenue − Subtracted Employee Salaries
            </span>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '12px',
              background: computedNetProfit >= 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
              color: computedNetProfit >= 0 ? '#22C55E' : '#EF4444',
            }}
          >
            {profitMargin}% Profit Margin
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.03)',
          }}
        >
          <div>
            <div style={{ fontSize: '10px', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue</div>
            <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#FFFFFF' }}>
              {formatCurrency(p.totalAmount)}
            </div>
          </div>

          <span style={{ fontSize: '18px', fontWeight: 700, color: '#EF4444' }}>−</span>

          <div>
            <div style={{ fontSize: '10px', color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Employee Salaries ({((p.employees as any[]) || []).length} assigned)
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#EF4444' }}>
              {formatCurrency(totalEmployeesCost)}
            </div>
          </div>

          {recurringCosts > 0 && (
            <>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#F59E0B' }}>−</span>
              <div>
                <div style={{ fontSize: '10px', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recurring Expenses</div>
                <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#F59E0B' }}>
                  {formatCurrency(recurringCosts)}
                </div>
              </div>
            </>
          )}

          {productionCosts > 0 && (
            <>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#F59E0B' }}>−</span>
              <div>
                <div style={{ fontSize: '10px', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Production Costs</div>
                <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#F59E0B' }}>
                  {formatCurrency(productionCosts)}
                </div>
              </div>
            </>
          )}

          {salesCommission > 0 && (
            <>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#7C3AED' }}>−</span>
              <div>
                <div style={{ fontSize: '10px', color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sales Commission</div>
                <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#7C3AED' }}>
                  {formatCurrency(salesCommission)}
                </div>
              </div>
            </>
          )}

          <span style={{ fontSize: '18px', fontWeight: 700, color: '#6B6B70' }}>=</span>

          <div>
            <div style={{ fontSize: '10px', color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Profit</div>
            <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: computedNetProfit >= 0 ? '#22C55E' : '#DC2626' }}>
              {formatCurrency(computedNetProfit)}
            </div>
          </div>
        </div>
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
          <div>
            <h3 style={{ ...sectionTitle, marginBottom: '2px' }}>
              <Users size={16} /> Team ({((p.employees as any[]) || []).length})
            </h3>
            <span style={{ fontSize: '11px', color: '#8E8E93' }}>
              Total Salaries Subtracted: <strong style={{ color: '#EF4444' }}>{formatCurrency(totalEmployeesCost)}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setAssignForm({ employeeId: '', assignedRole: '', payAmount: '', notes: '' });
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
            <Plus size={14} /> {t('assignTeamMember')}
          </button>
        </div>

        {((p.employees as any[]) || []).length > 0 ? (
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        title="Edit pay / role"
                        onClick={() => openEditEmployee(pe)}
                        style={{
                          padding: '5px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(255,255,255,0.03)',
                          color: '#8E8E93',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#FFFFFF';
                          e.currentTarget.style.borderColor = accentColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#8E8E93';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }}
                      >
                        <Pencil size={12} />
                      </button>
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
                  </div>
                  <div style={{ fontSize: '12px', color: '#8E8E93', marginTop: '4px' }}>
                    {pe.assignedRole}
                  </div>
                </div>

                {(() => {
                  const empStats = employeePaymentsMap[pe.employeeId] || {
                    paid: 0,
                    remaining: Number(pe.payAmount || 0),
                    payAmount: Number(pe.payAmount || 0),
                    loans: 0,
                    directPaid: 0,
                  };
                  const percent =
                    empStats.payAmount > 0
                      ? Math.min(100, Math.round((empStats.paid / empStats.payAmount) * 100))
                      : 0;
                  return (
                    <div
                      onClick={() => {
                        setBreakdownEmployee(pe);
                        setShowQuickPayment(false);
                        setQuickPaymentError('');
                        setQuickPaymentForm({
                          type: 'SALARY',
                          amount: empStats.remaining > 0 ? String(empStats.remaining) : '',
                          date: new Date().toISOString().split('T')[0],
                          notes: '',
                        });
                      }}
                      title="Tap to see breakdown by dates"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        paddingTop: '10px',
                        marginTop: '4px',
                        borderTop: '1px solid rgba(255,255,255,0.04)',
                        cursor: 'pointer',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.borderColor = `${accentColor}50`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#8E8E93' }}>{t('agreedSalary')}</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF', fontFamily: '"Space Grotesk", sans-serif' }}>
                          {formatCurrency(pe.payAmount)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: '#22C55E' }}>{t('paidToDate')}</span>
                          {empStats.loans > 0 && (
                            <span style={{ fontSize: '10px', color: '#F59E0B', display: 'block' }}>
                              ({isRtl ? 'شامل' : 'incl.'} {formatCurrency(empStats.loans)} {isRtl ? 'سلفة' : 'loan'})
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#22C55E', fontFamily: '"Space Grotesk", sans-serif' }}>
                          {formatCurrency(empStats.paid)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: empStats.remaining > 0 ? '#F59E0B' : '#22C55E', fontWeight: 600 }}>
                          {t('remainingOwed')}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: empStats.remaining > 0 ? '#F59E0B' : '#22C55E', fontFamily: '"Space Grotesk", sans-serif' }}>
                          {empStats.remaining > 0 ? formatCurrency(empStats.remaining) : (isRtl ? 'مدفوع بالكامل ✓' : 'Fully Paid ✓')}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div style={{ width: '100%', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginTop: '2px' }}>
                        <div
                          style={{
                            width: `${percent}%`,
                            height: '100%',
                            background: empStats.remaining === 0 ? '#22C55E' : accentColor,
                            borderRadius: '2px',
                            transition: 'width 0.3s',
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <span style={{ fontSize: '10px', color: accentColor, fontWeight: 600 }}>
                          🔍 {t('tapForBreakdown')}
                        </span>
                        <span style={{ fontSize: '10px', color: '#8E8E93' }}>{percent}%</span>
                      </div>
                    </div>
                  );
                })()}
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
                  {assignForm.employeeId && ((p.employees as any[]) || []).some((e: any) => e.employeeId === assignForm.employeeId)
                    ? 'Edit Team Member Pay & Role'
                    : 'Assign Team Member'}
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
                    Project Salary / Pay Amount (EGP)
                  </label>
                  <FormattedNumberInput
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
                    placeholder="e.g. 5000"
                    value={assignForm.payAmount}
                    onChangeValue={(val) => setAssignForm({ ...assignForm, payAmount: val })}
                  />
                  <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                    * This salary is automatically subtracted from project revenue to calculate Net Profit.
                  </span>
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

      {/* Edit Project Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => !isUpdating && setShowEditModal(false)}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleUpdateProject}
              style={{
                background: '#121214',
                borderRadius: '16px',
                padding: '28px',
                width: '100%',
                maxWidth: '560px',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    fontFamily: '"Space Grotesk", sans-serif',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  Edit Project Details
                </h2>
                <button
                  type="button"
                  onClick={() => !isUpdating && setShowEditModal(false)}
                  style={{ background: 'none', border: 'none', color: '#6B6B70', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>

              {editError && (
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
                  {editError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                    Project Title *
                  </label>
                  <input
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      color: '#E8E4E0',
                      fontSize: '13px',
                      fontFamily: '"Inter", sans-serif',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Status
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '11px 14px',
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
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    >
                      <option value="DRAFT" style={{ background: '#121214' }}>Draft</option>
                      <option value="ACTIVE" style={{ background: '#121214' }}>Active</option>
                      <option value="ON_HOLD" style={{ background: '#121214' }}>On Hold</option>
                      <option value="COMPLETED" style={{ background: '#121214' }}>Completed</option>
                      <option value="CANCELLED" style={{ background: '#121214' }}>Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Project Type
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '11px 14px',
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
                      value={editForm.projectType}
                      onChange={(e) => setEditForm({ ...editForm, projectType: e.target.value })}
                    >
                      <option value="" style={{ background: '#121214' }}>Select type...</option>
                      {projectTypes.map((t) => (
                        <option key={t.value} value={t.value} style={{ background: '#121214' }}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dates: Start Date & Deadline */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Date of Start
                    </label>
                    <input
                      type="date"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        color: '#E8E4E0',
                        fontSize: '13px',
                        fontFamily: '"Inter", sans-serif',
                        outline: 'none',
                        colorScheme: 'dark',
                        boxSizing: 'border-box',
                      }}
                      value={editForm.startDate}
                      onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Project Deadline
                    </label>
                    <input
                      type="date"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        color: '#E8E4E0',
                        fontSize: '13px',
                        fontFamily: '"Inter", sans-serif',
                        outline: 'none',
                        colorScheme: 'dark',
                        boxSizing: 'border-box',
                      }}
                      value={editForm.deadline}
                      onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                    />
                  </div>
                </div>

                {/* Financial: Total & Deposit */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Total Amount (EGP)
                    </label>
                    <FormattedNumberInput
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        color: '#E8E4E0',
                        fontSize: '13px',
                        fontFamily: '"Inter", sans-serif',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      placeholder="0"
                      value={editForm.totalAmount}
                      onChangeValue={(val) => setEditForm({ ...editForm, totalAmount: val })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Deposit Paid (EGP)
                    </label>
                    <FormattedNumberInput
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        color: '#E8E4E0',
                        fontSize: '13px',
                        fontFamily: '"Inter", sans-serif',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      placeholder="0"
                      value={editForm.depositPaid}
                      onChangeValue={(val) => setEditForm({ ...editForm, depositPaid: val })}
                    />
                  </div>
                </div>

                {/* Client Selection */}
                {clients.length > 0 && (
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Client
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '11px 14px',
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
                      value={editForm.clientId}
                      onChange={(e) => setEditForm({ ...editForm, clientId: e.target.value })}
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id} style={{ background: '#121214' }}>
                          {c.name} {c.company ? `(${c.company})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sales Representative */}
                <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0 }}>
                      <div
                        style={{
                          width: '36px',
                          height: '20px',
                          borderRadius: '10px',
                          background: editForm.hasSalesRep ? accentColor : 'rgba(255,255,255,0.1)',
                          position: 'relative',
                          transition: 'background 0.2s',
                          cursor: 'pointer',
                        }}
                        onClick={() => setEditForm((prev) => ({ ...prev, hasSalesRep: !prev.hasSalesRep }))}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '2px',
                            left: editForm.hasSalesRep ? '18px' : '2px',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: '#fff',
                            transition: 'left 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '12px', color: '#E8E4E0', fontWeight: 600 }}>Closed by a Sales Rep</span>
                    </label>

                    {!showNewSalesRepInEdit ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm((prev) => ({ ...prev, hasSalesRep: true }));
                          setShowNewSalesRepInEdit(true);
                        }}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'rgba(255,255,255,0.03)',
                          color: '#E8E4E0',
                          fontSize: '11px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Plus size={12} /> New Sales Rep
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          style={{
                            width: '150px',
                            padding: '6px 10px',
                            fontSize: '12px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '8px',
                            color: '#E8E4E0',
                            outline: 'none',
                          }}
                          placeholder="Sales rep name"
                          value={newSalesRepNameInEdit}
                          onChange={(e) => setNewSalesRepNameInEdit(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), createNewSalesRepInEdit())}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={createNewSalesRepInEdit}
                          disabled={isCreatingSalesRepInEdit}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            background: accentColor,
                            border: 'none',
                            color: accentColor === '#B6FF33' ? '#121f00' : '#fff',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '11px',
                          }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewSalesRepInEdit(false)}
                          style={{
                            padding: '6px 8px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#6B6B70',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {editForm.hasSalesRep && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                          Select Sales Rep
                        </label>
                        <select
                          style={{
                            width: '100%',
                            padding: '11px 14px',
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
                          value={editForm.salesRepId}
                          onChange={(e) => setEditForm({ ...editForm, salesRepId: e.target.value })}
                        >
                          <option value="" style={{ background: '#121214' }}>Select sales rep...</option>
                          {salesRepList.map((s) => (
                            <option key={s.id} value={s.id} style={{ background: '#121214' }}>{s.name}</option>
                          ))}
                        </select>
                        {salesRepErrorInEdit && (
                          <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                            {salesRepErrorInEdit}
                          </span>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                          Commission (% of Profit)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="100"
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            color: '#E8E4E0',
                            fontSize: '13px',
                            fontFamily: '"Inter", sans-serif',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                          value={editForm.salesCommissionPercent}
                          onChange={(e) => setEditForm({ ...editForm, salesCommissionPercent: e.target.value })}
                          placeholder="e.g. 10"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                    Description
                  </label>
                  <textarea
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      color: '#E8E4E0',
                      fontSize: '13px',
                      fontFamily: '"Inter", sans-serif',
                      outline: 'none',
                      minHeight: '75px',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => setShowEditModal(false)}
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
                    disabled={isUpdating}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 22px',
                      borderRadius: '10px',
                      border: 'none',
                      background:
                        accentColor === '#B6FF33'
                          ? 'linear-gradient(135deg, #B6FF33, #96da00)'
                          : `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
                      color: accentColor === '#B6FF33' ? '#121f00' : '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: isUpdating ? 'not-allowed' : 'pointer',
                      opacity: isUpdating ? 0.7 : 1,
                    }}
                  >
                    {isUpdating && <Loader2 size={15} className="animate-spin" />}
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Employee Payment Breakdown Modal */}
      <AnimatePresence>
        {breakdownEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setBreakdownEmployee(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#121214',
                borderRadius: '16px',
                padding: '28px',
                width: '100%',
                maxWidth: '520px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#FFFFFF', margin: 0 }}>
                    Payment & Loan Breakdown
                  </h2>
                  <p style={{ fontSize: '12px', color: '#8E8E93', marginTop: '4px', margin: 0 }}>
                    <strong style={{ color: '#FFFFFF' }}>{breakdownEmployee.employee.name}</strong> • {breakdownEmployee.assignedRole}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBreakdownEmployee(null)}
                  style={{ background: 'none', border: 'none', color: '#8E8E93', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>

              {(() => {
                const empStats = employeePaymentsMap[breakdownEmployee.employeeId] || {
                  paid: 0,
                  remaining: Number(breakdownEmployee.payAmount || 0),
                  payAmount: Number(breakdownEmployee.payAmount || 0),
                  loans: 0,
                };
                const empTxs = projectTransactions.filter(
                  (tx) => tx.employeeId === breakdownEmployee.employeeId
                );

                return (
                  <div>
                    {/* Top 3 summary chips */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                      <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ fontSize: '10px', color: '#8E8E93', textTransform: 'uppercase' }}>{t('agreedSalary')}</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', fontFamily: '"Space Grotesk", sans-serif', marginTop: '4px' }}>
                          {formatCurrency(empStats.payAmount)}
                        </div>
                      </div>
                      <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ fontSize: '10px', color: '#22C55E', textTransform: 'uppercase' }}>{t('paidToDate')}</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#22C55E', fontFamily: '"Space Grotesk", sans-serif', marginTop: '4px' }}>
                          {formatCurrency(empStats.paid)}
                        </div>
                        {empStats.loans > 0 && (
                          <div style={{ fontSize: '10px', color: '#F59E0B', marginTop: '2px' }}>
                            ({isRtl ? 'شامل' : 'incl.'} {formatCurrency(empStats.loans)} {isRtl ? 'سلفة' : 'loan'})
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ fontSize: '10px', color: empStats.remaining > 0 ? '#F59E0B' : '#22C55E', textTransform: 'uppercase' }}>{t('remainingOwed')}</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: empStats.remaining > 0 ? '#F59E0B' : '#22C55E', fontFamily: '"Space Grotesk", sans-serif', marginTop: '4px' }}>
                          {empStats.remaining > 0 ? formatCurrency(empStats.remaining) : '0 ✓'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                        {isRtl ? `سجل المعاملات والتواريخ (${empTxs.length})` : `Transactions by Date (${empTxs.length})`}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowQuickPayment(!showQuickPayment)}
                        style={{
                          background: 'none',
                          border: `1px solid ${accentColor}40`,
                          borderRadius: '6px',
                          padding: '4px 10px',
                          color: accentColor,
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {showQuickPayment ? (isRtl ? 'إخفاء النموذج' : 'Hide Form') : `+ ${t('recordPayment')}`}
                      </button>
                    </div>

                    {/* Quick payment form */}
                    {showQuickPayment && (
                      <form onSubmit={handleQuickPayment} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
                        {quickPaymentError && (
                          <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '12px', marginBottom: '12px' }}>
                            {quickPaymentError}
                          </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '4px' }}>Type</label>
                            <select
                              style={{ width: '100%', padding: '8px 12px', background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFFFFF', fontSize: '12px' }}
                              value={quickPaymentForm.type}
                              onChange={(e) => setQuickPaymentForm({ ...quickPaymentForm, type: e.target.value })}
                            >
                              {['SALARY', 'PARTIAL_PAYMENT', 'DEPOSIT', 'LOAN', 'ADVANCE', 'TASK_PAYMENT', 'BONUS', 'DEDUCTION'].map((t) => (
                                <option key={t} value={t} style={{ background: '#18181B' }}>{t.replace(/_/g, ' ')}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '4px' }}>Date *</label>
                            <input
                              type="date"
                              required
                              style={{ width: '100%', padding: '8px 12px', background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFFFFF', fontSize: '12px' }}
                              value={quickPaymentForm.date}
                              onChange={(e) => setQuickPaymentForm({ ...quickPaymentForm, date: e.target.value })}
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '4px' }}>Amount (EGP) *</label>
                          <FormattedNumberInput
                            required
                            placeholder="Amount in EGP"
                            style={{ width: '100%', padding: '8px 12px', background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFFFFF', fontSize: '12px', boxSizing: 'border-box' }}
                            value={quickPaymentForm.amount}
                            onChangeValue={(val) => setQuickPaymentForm({ ...quickPaymentForm, amount: val })}
                          />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '4px' }}>Notes (optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Deposit for production week"
                            style={{ width: '100%', padding: '8px 12px', background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFFFFF', fontSize: '12px' }}
                            value={quickPaymentForm.notes}
                            onChange={(e) => setQuickPaymentForm({ ...quickPaymentForm, notes: e.target.value })}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={quickPaymentLoading}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: accentColor,
                            color: accentColor === '#B6FF33' ? '#121f00' : '#FFFFFF',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {quickPaymentLoading ? 'Saving...' : 'Save Payment with Date'}
                        </button>
                      </form>
                    )}

                    {/* Transactions list */}
                    {empTxs.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                        {empTxs.map((tx) => (
                          <div
                            key={tx.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.04)',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: `${txTypeColors[tx.type] || '#6B6B70'}20`, color: txTypeColors[tx.type] || '#6B6B70', fontWeight: 600 }}>
                                  {tx.type.replace(/_/g, ' ')}
                                </span>
                                <span style={{ fontSize: '12px', color: '#8E8E93' }}>
                                  {format(new Date(tx.date), 'MMM d, yyyy')}
                                </span>
                              </div>
                              {tx.notes && <div style={{ fontSize: '11px', color: '#6B6B70', marginTop: '4px' }}>{tx.notes}</div>}
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: txTypeColors[tx.type] || '#FFFFFF' }}>
                              {formatCurrency(tx.amount)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '13px', color: '#6B6B70', margin: 0 }}>No payments or loans recorded yet for this project.</p>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
