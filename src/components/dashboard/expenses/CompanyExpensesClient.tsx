'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '@prisma/client';
import {
  ReceiptText,
  Plus,
  Search,
  Check,
  X,
  Calendar,
  Clock,
  Landmark,
  Building2,
  Laptop,
  Zap,
  CreditCard,
  Pencil,
  Trash2,
  AlertTriangle,
  ArrowDownRight,
  TrendingDown,
  ShieldCheck,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import FormattedNumberInput from '@/components/ui/FormattedNumberInput';
import { useDashboardLang } from '@/context/DashboardLanguageContext';
import { useDashboardDepartment } from '@/context/DashboardDepartmentContext';
import CompanyNetValueCard from '../CompanyNetValueCard';
import type { CompanyExpenseItem, CompanyExpensesSummary } from '@/lib/company-expenses';

interface Props {
  role: UserRole;
  initialSummary: CompanyExpensesSummary;
}

const CATEGORIES: Record<
  string,
  { labelEn: string; labelAr: string; icon: React.ReactNode; color: string }
> = {
  OFFICE_RENT: {
    labelEn: 'Office & Rent',
    labelAr: 'المكتب والإيجار',
    icon: <Building2 size={15} />,
    color: '#3B82F6',
  },
  SOFTWARE: {
    labelEn: 'Software & Tools',
    labelAr: 'البرمجيات والاشتراكات',
    icon: <Laptop size={15} />,
    color: '#8B5CF6',
  },
  UTILITIES: {
    labelEn: 'Utilities & Internet',
    labelAr: 'المرافق والإنترنت',
    icon: <Zap size={15} />,
    color: '#F59E0B',
  },
  SALARIES: {
    labelEn: 'Salaries & Retainers',
    labelAr: 'الرواتب والمكافآت',
    icon: <Wallet size={15} />,
    color: '#10B981',
  },
  MARKETING: {
    labelEn: 'Marketing & Ads',
    labelAr: 'التسويق والإعلانات',
    icon: <TrendingDown size={15} />,
    color: '#EC4899',
  },
  LEGAL: {
    labelEn: 'Legal & Accounting',
    labelAr: 'الشؤون القانونية والمحاسبة',
    icon: <Landmark size={15} />,
    color: '#6366F1',
  },
  OTHER: {
    labelEn: 'Operational / Other',
    labelAr: 'مصاريف تشغيلية أخرى',
    icon: <ReceiptText size={15} />,
    color: '#9CA3AF',
  },
};

export default function CompanyExpensesClient({ role, initialSummary }: Props) {
  const router = useRouter();
  const { t, isRtl, formatCurrency } = useDashboardLang();
  const { department } = useDashboardDepartment();
  const isTech = department === 'TECH';
  const accentColor = isTech ? '#B6FF33' : '#a78bfa';

  const [expenses, setExpenses] = useState<CompanyExpenseItem[]>(initialSummary.expenses);
  const [companyNetValue, setCompanyNetValue] = useState<number>(initialSummary.companyNetValue);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'MONTHLY' | 'ONE_TIME'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PAID'>('ALL');

  // Modal State for New / Edit Expense
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<CompanyExpenseItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'SOFTWARE',
    isMonthly: true,
    payDay: '1',
    dueDate: '',
    isPaid: false,
    paymentMethod: 'BANK_TRANSFER',
    notes: '',
    deductFromNetValue: true,
  });

  // Pay & Deduct Modal State
  const [expenseToPay, setExpenseToPay] = useState<CompanyExpenseItem | null>(null);
  const [deductChecked, setDeductChecked] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  // Delete State
  const [expenseToDelete, setExpenseToDelete] = useState<CompanyExpenseItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = categoryFilter === 'ALL' || e.category === categoryFilter;
    const matchesType =
      typeFilter === 'ALL' ||
      (typeFilter === 'MONTHLY' && e.isMonthly) ||
      (typeFilter === 'ONE_TIME' && !e.isMonthly);
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PAID' && e.isPaid) ||
      (statusFilter === 'PENDING' && !e.isPaid);

    return matchesSearch && matchesCat && matchesType && matchesStatus;
  });

  // Calculate dynamic stats
  const totalMonthlyExpenses = expenses
    .filter((e) => e.isMonthly)
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingTotal = expenses
    .filter((e) => !e.isPaid)
    .reduce((sum, e) => sum + e.amount, 0);

  const paidTotal = expenses
    .filter((e) => e.isPaid)
    .reduce((sum, e) => sum + e.amount, 0);

  const projectedBalance = companyNetValue - pendingTotal;

  // Open create modal
  const handleOpenCreate = () => {
    setEditingExpense(null);
    setForm({
      title: '',
      amount: '',
      category: 'SOFTWARE',
      isMonthly: true,
      payDay: '1',
      dueDate: '',
      isPaid: false,
      paymentMethod: 'BANK_TRANSFER',
      notes: '',
      deductFromNetValue: true,
    });
    setFormError('');
    setShowModal(true);
  };

  // Open edit modal
  const handleOpenEdit = (exp: CompanyExpenseItem) => {
    setEditingExpense(exp);
    setForm({
      title: exp.title,
      amount: exp.amount.toString(),
      category: exp.category,
      isMonthly: exp.isMonthly,
      payDay: exp.payDay ? exp.payDay.toString() : '1',
      dueDate: exp.dueDate ? exp.dueDate.split('T')[0] : '',
      isPaid: exp.isPaid,
      paymentMethod: exp.paymentMethod || 'BANK_TRANSFER',
      notes: exp.notes || '',
      deductFromNetValue: false,
    });
    setFormError('');
    setShowModal(true);
  };

  // Save Expense (Create or Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      const cleanAmount = parseFloat(form.amount.replace(/,/g, '').trim()) || 0;
      if (cleanAmount <= 0) {
        setFormError('Please enter a valid amount');
        setIsSubmitting(false);
        return;
      }

      if (editingExpense) {
        // Update
        const res = await fetch(`/api/dashboard/company-expenses/${editingExpense.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            amount: cleanAmount,
            category: form.category,
            isMonthly: form.isMonthly,
            payDay: form.isMonthly ? parseInt(form.payDay, 10) : null,
            dueDate: !form.isMonthly && form.dueDate ? form.dueDate : null,
            isPaid: form.isPaid,
            paymentMethod: form.paymentMethod,
            notes: form.notes,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setFormError(data.error || 'Failed to update expense');
          return;
        }

        setExpenses((prev) =>
          prev.map((item) =>
            item.id === editingExpense.id
              ? {
                  ...item,
                  ...data.expense,
                  createdAt: item.createdAt,
                  updatedAt: new Date().toISOString(),
                }
              : item
          )
        );
      } else {
        // Create
        const res = await fetch('/api/dashboard/company-expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            amount: cleanAmount,
            category: form.category,
            isMonthly: form.isMonthly,
            payDay: form.isMonthly ? parseInt(form.payDay, 10) : null,
            dueDate: !form.isMonthly && form.dueDate ? form.dueDate : null,
            isPaid: form.isPaid,
            paymentMethod: form.paymentMethod,
            notes: form.notes,
            deductFromNetValue: form.deductFromNetValue,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setFormError(data.error || 'Failed to create expense');
          return;
        }

        const newExp: CompanyExpenseItem = {
          ...data.expense,
          dueDate: data.expense.dueDate ? data.expense.dueDate.toString() : null,
          lastPaidDate: data.expense.lastPaidDate ? data.expense.lastPaidDate.toString() : null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setExpenses((prev) => [newExp, ...prev]);

        if (form.isPaid && form.deductFromNetValue && cleanAmount > 0) {
          setCompanyNetValue((prev) => Math.max(0, prev - cleanAmount));
        }
      }

      setShowModal(false);
      router.refresh();
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pay & Deduct
  const handleConfirmPay = async () => {
    if (!expenseToPay) return;
    setIsPaying(true);

    try {
      const res = await fetch(`/api/dashboard/company-expenses/${expenseToPay.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deductFromNetValue: deductChecked }),
      });
      const data = await res.json();
      if (res.ok) {
        setExpenses((prev) =>
          prev.map((e) =>
            e.id === expenseToPay.id
              ? { ...e, isPaid: true, lastPaidDate: new Date().toISOString() }
              : e
          )
        );
        if (data.newNetValue !== null && data.newNetValue !== undefined) {
          setCompanyNetValue(data.newNetValue);
        }
        setExpenseToPay(null);
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to pay expense:', err);
    } finally {
      setIsPaying(false);
    }
  };

  // Reset Paid status
  const handleResetPaid = async (exp: CompanyExpenseItem) => {
    try {
      const res = await fetch(`/api/dashboard/company-expenses/${exp.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true }),
      });
      if (res.ok) {
        setExpenses((prev) =>
          prev.map((e) => (e.id === exp.id ? { ...e, isPaid: false } : e))
        );
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to reset status:', err);
    }
  };

  // Delete Expense
  const handleDelete = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/dashboard/company-expenses/${expenseToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setExpenses((prev) => prev.filter((e) => e.id !== expenseToDelete.id));
        setExpenseToDelete(null);
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to delete expense:', err);
    } finally {
      setIsDeleting(false);
    }
  };

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
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B6FF33]/20 bg-[#B6FF33]/5 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#B6FF33] animate-pulse" />
            <span className="font-headline text-[10px] uppercase tracking-[0.16em] text-[#B6FF33] font-bold">
              {isRtl ? 'إدارة الخزينة ومصاريف الشركة' : 'Company Treasury & Operational Expenses'}
            </span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-[#e5e2e1]">
            {isRtl ? 'مصاريف الشركة ورصيد البنك' : 'Company Expenses'}
          </h1>
          <p className="text-sm text-[#e5e2e1]/60 font-body mt-1">
            {isRtl
              ? 'تتبع المصاريف الشهرية الثابتة، أيام الاستحقاق، والربط المباشر مع رصيد البنك وصافي قيمة الشركة.'
              : 'Manage recurring monthly fees, payment schedules, and direct deductions from company bank net value.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all active:scale-95 cursor-pointer shadow-lg shrink-0 self-start sm:self-auto"
          style={{
            background: isTech
              ? 'linear-gradient(135deg, #B6FF33, #96da00)'
              : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
            color: isTech ? '#121f00' : '#ffffff',
            boxShadow: isTech ? '0 0 25px rgba(182,255,51,0.25)' : '0 0 25px rgba(124,58,237,0.25)',
          }}
        >
          <Plus size={16} />
          <span>{isRtl ? 'إضافة مصروف جديد' : 'Add Company Expense'}</span>
        </button>
      </div>

      {/* Connected Company Net Value Banner */}
      <CompanyNetValueCard
        initialValue={companyNetValue}
        canEdit={role === 'ADMIN'}
        variant="banner"
      />

      {/* Key Treasury & Expense Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Bank Net Value */}
        <div className="p-5 rounded-2xl bg-[#18181a]/80 backdrop-blur-xl border border-[#B6FF33]/30 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="font-headline text-[10px] uppercase tracking-[0.14em] text-[#B6FF33] font-bold">
              {isRtl ? 'رصيد البنك الحالي' : 'Company Net Value'}
            </span>
            <span className="p-1.5 rounded-lg bg-[#B6FF33]/10 text-[#B6FF33] border border-[#B6FF33]/20">
              <Landmark size={16} />
            </span>
          </div>
          <div className="font-headline text-2xl font-bold text-[#B6FF33]">
            {formatCurrency(companyNetValue)}
          </div>
          <div className="text-[11px] text-[#e5e2e1]/50 mt-1">
            {isRtl ? 'السيولة الحالية المتاحة' : 'Live liquid treasury reserve'}
          </div>
        </div>

        {/* Card 2: Total Monthly Fees */}
        <div className="p-5 rounded-2xl bg-[#18181a]/80 backdrop-blur-xl border border-white/[0.08] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="font-headline text-[10px] uppercase tracking-[0.14em] text-[#e5e2e1]/70 font-semibold">
              {isRtl ? 'إجمالي المصاريف الشهرية' : 'Monthly Recurring Fees'}
            </span>
            <span className="p-1.5 rounded-lg bg-white/[0.04] text-[#e5e2e1]/70 border border-white/[0.08]">
              <RefreshCw size={16} />
            </span>
          </div>
          <div className="font-headline text-2xl font-bold text-[#e5e2e1]">
            {formatCurrency(totalMonthlyExpenses)}
          </div>
          <div className="text-[11px] text-[#e5e2e1]/50 mt-1">
            {expenses.filter((e) => e.isMonthly).length} {isRtl ? 'مصاريف شهرية ثابتة' : 'active monthly commitments'}
          </div>
        </div>

        {/* Card 3: Pending / Upcoming Bills */}
        <div className="p-5 rounded-2xl bg-[#18181a]/80 backdrop-blur-xl border border-amber-500/20 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="font-headline text-[10px] uppercase tracking-[0.14em] text-amber-400 font-semibold">
              {isRtl ? 'مستحق الدفع هذا الشهر' : 'Pending This Month'}
            </span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock size={16} />
            </span>
          </div>
          <div className="font-headline text-2xl font-bold text-amber-400">
            {formatCurrency(pendingTotal)}
          </div>
          <div className="text-[11px] text-[#e5e2e1]/50 mt-1">
            {expenses.filter((e) => !e.isPaid).length} {isRtl ? 'فواتير قيد الانتظار' : 'bills waiting payment'}
          </div>
        </div>

        {/* Card 4: Projected Net Value After Bills */}
        <div className="p-5 rounded-2xl bg-[#18181a]/80 backdrop-blur-xl border border-white/[0.08] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="font-headline text-[10px] uppercase tracking-[0.14em] text-[#e5e2e1]/70 font-semibold">
              {isRtl ? 'الرصيد بعد سداد الفواتير' : 'Projected Post-Bills'}
            </span>
            <span className="p-1.5 rounded-lg bg-white/[0.04] text-[#e5e2e1]/70 border border-white/[0.08]">
              <ShieldCheck size={16} />
            </span>
          </div>
          <div
            className={`font-headline text-2xl font-bold ${
              projectedBalance >= 0 ? 'text-[#B6FF33]' : 'text-red-400'
            }`}
          >
            {formatCurrency(projectedBalance)}
          </div>
          <div className="text-[11px] text-[#e5e2e1]/50 mt-1">
            {isRtl ? 'الرصيد الصافي المتبقي' : 'Net balance after pending dues'}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#18181a]/60 border border-white/[0.06]">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] w-full sm:w-64">
          <Search size={15} className="text-[#e5e2e1]/40" />
          <input
            type="text"
            placeholder={isRtl ? 'بحث في المصاريف...' : 'Search expenses...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-[#e5e2e1] w-full"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'MONTHLY', 'ONE_TIME'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                typeFilter === type
                  ? 'bg-white/[0.12] text-white border border-white/[0.2]'
                  : 'text-[#e5e2e1]/50 hover:text-white bg-transparent'
              }`}
            >
              {type === 'ALL'
                ? isRtl ? 'الكل' : 'All'
                : type === 'MONTHLY'
                ? isRtl ? 'شهرية ثابتة' : 'Monthly Fees'
                : isRtl ? 'مرة واحدة' : 'One-Time'}
            </button>
          ))}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'PENDING', 'PAID'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? 'bg-white/[0.12] text-white border border-white/[0.2]'
                  : 'text-[#e5e2e1]/50 hover:text-white bg-transparent'
              }`}
            >
              {status === 'ALL'
                ? isRtl ? 'الكل' : 'All'
                : status === 'PENDING'
                ? isRtl ? 'قيد الانتظار' : 'Pending'
                : isRtl ? 'مدفوع' : 'Paid'}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-[#e5e2e1] outline-none cursor-pointer"
        >
          <option value="ALL" style={{ background: '#121214' }}>
            {isRtl ? 'جميع التصنيفات' : 'All Categories'}
          </option>
          {Object.entries(CATEGORIES).map(([catKey, cat]) => (
            <option key={catKey} value={catKey} style={{ background: '#121214' }}>
              {isRtl ? cat.labelAr : cat.labelEn}
            </option>
          ))}
        </select>
      </div>

      {/* Expenses Table / Cards */}
      <div className="rounded-2xl bg-[#18181a]/70 backdrop-blur-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#e5e2e1]" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-[#e5e2e1]/50 font-headline">
              <tr>
                <th className="py-4 px-5">{isRtl ? 'المصروف والتصنيف' : 'Expense & Category'}</th>
                <th className="py-4 px-5">{isRtl ? 'النوع ويوم الدفع' : 'Type & Day of Pay'}</th>
                <th className="py-4 px-5">{isRtl ? 'المبلغ' : 'Amount'}</th>
                <th className="py-4 px-5">{isRtl ? 'الحالة' : 'Status'}</th>
                <th className="py-4 px-5 text-right">{isRtl ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredExpenses.map((exp) => {
                const cat = CATEGORIES[exp.category] || CATEGORIES.OTHER;
                return (
                  <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Expense & Category */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                          style={{
                            background: `${cat.color}15`,
                            borderColor: `${cat.color}30`,
                            color: cat.color,
                          }}
                        >
                          {cat.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#e5e2e1] group-hover:text-white transition-colors">
                            {exp.title}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md"
                              style={{
                                background: `${cat.color}12`,
                                color: cat.color,
                              }}
                            >
                              {isRtl ? cat.labelAr : cat.labelEn}
                            </span>
                            {exp.notes && (
                              <span className="text-[11px] text-[#e5e2e1]/40 truncate max-w-xs">
                                • {exp.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type & Day of Pay */}
                    <td className="py-4 px-5">
                      {exp.isMonthly ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold text-[11px]">
                            <RefreshCw size={11} />
                            <span>{isRtl ? 'شهري ثابت' : 'Monthly Fee'}</span>
                          </span>
                          {exp.payDay && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#B6FF33]/10 text-[#B6FF33] border border-[#B6FF33]/25 font-bold text-[11px]">
                              <Calendar size={11} />
                              <span>
                                {isRtl ? `يوم ${exp.payDay} من كل شهر` : `Pay Day: ${exp.payDay}th`}
                              </span>
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-[11px] text-[#e5e2e1]/70">
                          <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08]">
                            {isRtl ? 'دفعة واحدة' : 'One-Time'}
                          </span>
                          {exp.dueDate && (
                            <span>{new Date(exp.dueDate).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}</span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-5">
                      <span className="font-headline font-bold text-sm text-[#e5e2e1]">
                        {formatCurrency(exp.amount)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      {exp.isPaid ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold tracking-wide">
                          <Check size={11} />
                          <span>{isRtl ? 'مدفوع' : 'PAID'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold tracking-wide">
                          <Clock size={11} />
                          <span>{isRtl ? 'مستحق' : 'PENDING'}</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!exp.isPaid ? (
                          <button
                            onClick={() => {
                              setExpenseToPay(exp);
                              setDeductChecked(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
                            title="Pay & optionally deduct from bank net value"
                          >
                            <CreditCard size={12} />
                            <span>{isRtl ? 'دفع / خصم' : 'Pay & Deduct'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleResetPaid(exp)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#e5e2e1]/60 hover:text-[#e5e2e1] border border-white/[0.08] text-[11px] transition-colors cursor-pointer"
                            title="Reset status to pending"
                          >
                            <RefreshCw size={11} />
                            <span>{isRtl ? 'إعادة التعيين' : 'Reset'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#e5e2e1]/70 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>

                        <button
                          onClick={() => setExpenseToDelete(exp)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#e5e2e1]/40">
                    <ReceiptText size={36} className="mx-auto mb-2 opacity-30" />
                    <p>{isRtl ? 'لا توجد مصاريف مطابقة' : 'No company expenses found'}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL: Create / Edit Expense ─── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.form
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmitForm}
              className="bg-[#141416] border border-white/[0.12] rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <ReceiptText size={18} style={{ color: accentColor }} />
                  <h3 className="font-headline text-base font-bold text-[#e5e2e1]">
                    {editingExpense
                      ? isRtl ? 'تعديل المصروف' : 'Edit Company Expense'
                      : isRtl ? 'إضافة مصروف شركة جديد' : 'Add Company Expense'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-[#e5e2e1]/40 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {formError && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                  {formError}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#e5e2e1]/70 mb-1">
                  {isRtl ? 'اسم المصروف / البند *' : 'Expense Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'مثال: إيجار المكتب، اشتراك أدوبي، خوادم Vercel' : 'e.g. Office Rent, Vercel Hosting, Adobe CC'}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Amount & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#e5e2e1]/70 mb-1">
                    {isRtl ? 'المبلغ (جنيه مصري) *' : 'Amount (EGP) *'}
                  </label>
                  <FormattedNumberInput
                    value={form.amount}
                    onChangeValue={(val) => setForm({ ...form, amount: val })}
                    placeholder="0"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#e5e2e1]/70 mb-1">
                    {isRtl ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {Object.entries(CATEGORIES).map(([k, v]) => (
                      <option key={k} value={k} style={{ background: '#121214' }}>
                        {isRtl ? v.labelAr : v.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recurring Monthly Fee vs One-Time */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#e5e2e1]">
                      {isRtl ? 'مصروف شهري متكرر' : 'Recurring Monthly Fee'}
                    </div>
                    <div className="text-[10px] text-[#e5e2e1]/50">
                      {isRtl
                        ? 'يتم تكرار استحقاق هذا البند شهرياً وتحديد يوم الدفع'
                        : 'Repeats monthly on a scheduled day of payment'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isMonthly}
                    onChange={(e) => setForm({ ...form, isMonthly: e.target.checked })}
                    className="w-4 h-4 accent-[#B6FF33] cursor-pointer"
                  />
                </div>

                {form.isMonthly ? (
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#B6FF33] mb-1">
                      {isRtl ? 'تحديد يوم الدفع من كل شهر (Day of Pay) *' : 'Day of Pay (1 - 31) *'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={form.payDay}
                        onChange={(e) => setForm({ ...form, payDay: e.target.value })}
                        style={{ ...inputStyle, width: '90px' }}
                      />
                      <span className="text-xs text-[#e5e2e1]/60">
                        {isRtl ? `يُدفع في اليوم ${form.payDay || 1} من كل شهر` : `Paid on the ${form.payDay || 1}th of each month`}
                      </span>
                    </div>

                    {/* Quick Pick Days */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] text-[#e5e2e1]/40">{isRtl ? 'أيام شائعة:' : 'Quick set:'}</span>
                      {[1, 5, 10, 15, 20, 25, 30].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setForm({ ...form, payDay: d.toString() })}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            form.payDay === d.toString()
                              ? 'bg-[#B6FF33] text-[#121f00]'
                              : 'bg-white/[0.04] text-[#e5e2e1]/70 hover:bg-white/[0.08]'
                          }`}
                        >
                          {d}th
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#e5e2e1]/70 mb-1">
                      {isRtl ? 'تاريخ الاستحقاق' : 'Specific Due Date'}
                    </label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                )}
              </div>

              {/* Status & Net Value Deduction (For new expenses) */}
              {!editingExpense && (
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#e5e2e1]">
                    <input
                      type="checkbox"
                      checked={form.isPaid}
                      onChange={(e) => setForm({ ...form, isPaid: e.target.checked })}
                      className="w-4 h-4 accent-[#B6FF33]"
                    />
                    <span>{isRtl ? 'تم سداد هذا المصروف بالفعل الآن' : 'Mark as paid right now'}</span>
                  </label>

                  {form.isPaid && (
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#B6FF33] pl-6">
                      <input
                        type="checkbox"
                        checked={form.deductFromNetValue}
                        onChange={(e) => setForm({ ...form, deductFromNetValue: e.target.checked })}
                        className="w-4 h-4 accent-[#B6FF33]"
                      />
                      <span>
                        {isRtl
                          ? 'خصم المبلغ فوراً من رصيد البنك (صافي القيمة)'
                          : 'Deduct immediately from Company Bank Net Value'}
                      </span>
                    </label>
                  )}
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#e5e2e1]/70 mb-1">
                  {isRtl ? 'ملاحظات إضافية' : 'Notes'}
                </label>
                <textarea
                  rows={2}
                  placeholder={isRtl ? 'أرقام الحسابات، تفاصيل الفاتورة...' : 'Billing portal info, account numbers...'}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#e5e2e1]/70 hover:text-white bg-white/[0.04]"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-lg disabled:opacity-50"
                  style={{
                    background: isTech
                      ? 'linear-gradient(135deg, #B6FF33, #96da00)'
                      : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                    color: isTech ? '#121f00' : '#ffffff',
                  }}
                >
                  <Check size={14} />
                  <span>
                    {isSubmitting
                      ? isRtl ? 'جاري الحفظ...' : 'Saving...'
                      : editingExpense
                      ? isRtl ? 'تحديث المصروف' : 'Update Expense'
                      : isRtl ? 'تسجيل المصروف' : 'Save Expense'}
                  </span>
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: Pay & Deduct Confirmation ─── */}
      <AnimatePresence>
        {expenseToPay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setExpenseToPay(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#141416] border border-white/[0.12] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-headline text-base font-bold text-[#e5e2e1]">
                    {isRtl ? 'تسجيل سداد المصروف' : 'Confirm Expense Payment'}
                  </h3>
                  <p className="text-xs text-[#e5e2e1]/60">{expenseToPay.title}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#e5e2e1]/60">{isRtl ? 'مبلغ المصروف:' : 'Expense Amount:'}</span>
                  <span className="font-bold text-[#e5e2e1]">{formatCurrency(expenseToPay.amount)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#e5e2e1]/60">{isRtl ? 'رصيد البنك الحالي:' : 'Current Bank Balance:'}</span>
                  <span className="font-bold text-[#B6FF33]">{formatCurrency(companyNetValue)}</span>
                </div>
                {deductChecked && (
                  <div className="flex justify-between text-xs pt-2 border-t border-white/[0.06]">
                    <span className="text-[#e5e2e1]/60">{isRtl ? 'الرصيد بعد الخصم:' : 'Post-Deduction Balance:'}</span>
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(Math.max(0, companyNetValue - expenseToPay.amount))}
                    </span>
                  </div>
                )}
              </div>

              {/* Deduct Checkbox */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deductChecked}
                  onChange={(e) => setDeductChecked(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
                <span className="text-xs text-emerald-300 font-medium">
                  {isRtl
                    ? 'خصم المبلغ مباشرة من صافي قيمة الشركة (الحساب البنكي)'
                    : 'Deduct from Company Bank Net Value automatically'}
                </span>
              </label>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setExpenseToPay(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#e5e2e1]/70 hover:text-white bg-white/[0.04]"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  disabled={isPaying}
                  onClick={handleConfirmPay}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  <Check size={14} />
                  <span>{isPaying ? (isRtl ? 'جاري السداد...' : 'Processing...') : (isRtl ? 'تأكيد السداد والخصم' : 'Confirm & Deduct')}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: Delete Confirmation ─── */}
      <AnimatePresence>
        {expenseToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setExpenseToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#141416] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="font-headline text-base font-bold text-[#e5e2e1]">
                    {isRtl ? 'حذف المصروف' : 'Delete Expense'}
                  </h3>
                  <p className="text-xs text-[#e5e2e1]/60">{expenseToDelete.title}</p>
                </div>
              </div>

              <p className="text-xs text-[#e5e2e1]/70">
                {isRtl
                  ? 'هل أنت متأكد من رغبتك في إزالة هذا المصروف من السجلات؟'
                  : 'Are you sure you want to delete this company expense?'}
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setExpenseToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#e5e2e1]/70 bg-white/[0.04]"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-400 text-white shadow-lg disabled:opacity-50"
                >
                  {isDeleting ? (isRtl ? 'جاري الحذف...' : 'Deleting...') : (isRtl ? 'تأكيد الحذف' : 'Delete')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
