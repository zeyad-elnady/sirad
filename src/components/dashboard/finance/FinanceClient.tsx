'use client';

import { motion } from 'framer-motion';
import type { UserRole } from '@prisma/client';
import type { FinanceOverview } from '@/lib/finance';
import {
  TrendingUp,
  Wallet,
  AlertCircle,
  Users,
  FolderKanban,
  DollarSign,
  Receipt,
  Percent,
  Sparkles,
} from 'lucide-react';

interface Props {
  role: UserRole;
  overview: FinanceOverview;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function FinanceClient({ role, overview }: Props) {
  const isTech = role === 'ZEYAD_TECH';

  const cards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(overview.totalRevenue),
      icon: <TrendingUp size={20} />,
      color: '#B6FF33',
      highlight: true,
    },
    {
      label: 'Collected',
      value: formatCurrency(overview.totalCollected),
      icon: <Wallet size={20} />,
      color: '#B6FF33',
      highlight: false,
    },
    {
      label: 'Outstanding',
      value: formatCurrency(overview.totalOutstanding),
      icon: <AlertCircle size={20} />,
      color: overview.totalOutstanding > 0 ? '#F59E0B' : '#B6FF33',
      highlight: false,
    },
    {
      label: 'Employee Costs',
      value: formatCurrency(overview.totalEmployeeCosts),
      icon: <Users size={20} />,
      color: '#e5e2e1',
      highlight: false,
    },
    {
      label: 'Expenses',
      value: formatCurrency(overview.totalExpenses),
      icon: <Receipt size={20} />,
      color: '#e5e2e1',
      highlight: false,
    },
    {
      label: 'Sales Commissions',
      value: formatCurrency(overview.totalSalesCommissions),
      icon: <Percent size={20} />,
      color: '#c6bfff',
      highlight: false,
    },
    {
      label: 'Net Profit',
      value: formatCurrency(overview.netProfit),
      icon: <DollarSign size={20} />,
      color: '#B6FF33',
      highlight: true,
    },
  ];

  const projectStats = [
    {
      label: 'Active Projects',
      value: overview.activeProjects.toString(),
      icon: <FolderKanban size={18} />,
      color: '#B6FF33',
    },
    {
      label: 'Completed Projects',
      value: overview.completedProjects.toString(),
      icon: <FolderKanban size={18} />,
      color: '#e5e2e1',
    },
    {
      label: 'Overdue Installments',
      value: overview.overdueInstallments.toString(),
      icon: <AlertCircle size={18} />,
      color: overview.overdueInstallments > 0 ? '#EF4444' : '#B6FF33',
    },
  ];

  const profitMargin =
    overview.totalRevenue > 0
      ? ((overview.netProfit / overview.totalRevenue) * 100).toFixed(1)
      : '0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B6FF33]/20 bg-[#B6FF33]/5 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#B6FF33] animate-pulse" />
          <span className="font-headline text-[10px] uppercase tracking-[0.16em] text-[#B6FF33] font-bold">
            Financial Intelligence • {isTech ? 'Tech Systems' : 'Marketing'}
          </span>
        </div>
        <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-[#e5e2e1]">
          Financial Overview
        </h1>
        <p className="text-sm text-[#e5e2e1]/60 font-body mt-1">
          Complete cashflow, collected retainers, milestone installments, and profit analytics.
        </p>
      </div>

      {/* Main Financial Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`rounded-2xl p-5 backdrop-blur-xl border transition-all duration-300 relative overflow-hidden group ${
              card.highlight
                ? 'bg-[#18181a]/90 border-[#B6FF33]/35 shadow-[0_0_30px_rgba(182,255,51,0.1)]'
                : 'bg-[#18181a]/60 border-white/[0.06] hover:border-white/[0.15]'
            }`}
          >
            {/* Corner glow */}
            <div
              className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-xl pointer-events-none ${
                card.highlight
                  ? 'bg-[#B6FF33]/20 opacity-100'
                  : 'bg-white/[0.03] group-hover:bg-[#B6FF33]/15 opacity-60'
              }`}
            />

            <div className="flex justify-between items-center mb-3">
              <span className="font-headline text-[10px] font-semibold text-[#e5e2e1]/60 uppercase tracking-[0.12em] truncate">
                {card.label}
              </span>
              <span
                className={`p-1.5 rounded-lg border ${
                  card.highlight
                    ? 'bg-[#B6FF33]/10 border-[#B6FF33]/30 text-[#B6FF33]'
                    : 'bg-white/[0.03] border-white/[0.06] text-[#e5e2e1]/60 group-hover:text-[#B6FF33]'
                }`}
              >
                {card.icon}
              </span>
            </div>

            <div
              className={`font-headline text-xl font-bold tracking-tight ${
                card.highlight
                  ? 'text-[#B6FF33]'
                  : 'text-[#e5e2e1] group-hover:text-[#B6FF33] transition-colors'
              }`}
            >
              {card.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Profit Margin Card */}
      {overview.totalRevenue > 0 && (
        <div className="rounded-2xl bg-[#18181a]/70 backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="font-headline text-base font-bold text-[#e5e2e1] tracking-tight flex items-center gap-2">
                <span>Profit Margin Realization</span>
                <span className="px-2 py-0.5 rounded-full bg-[#B6FF33]/10 border border-[#B6FF33]/25 text-[#B6FF33] text-[10px] font-headline font-bold">
                  {profitMargin}% NET
                </span>
              </h3>
              <p className="text-xs text-[#e5e2e1]/50 font-body mt-0.5">
                Net profit after all employee allocations, subscriptions, and commissions
              </p>
            </div>
            <div className="font-headline text-2xl font-bold text-[#B6FF33]">
              {formatCurrency(overview.netProfit)}
            </div>
          </div>

          <div className="relative h-3 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.max(
                  0,
                  Math.min(100, (overview.netProfit / overview.totalRevenue) * 100)
                )}%`,
              }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-[#86d600] to-[#B6FF33] shadow-[0_0_20px_rgba(182,255,51,0.4)]"
            />
          </div>

          <div className="flex justify-between mt-3 text-xs text-[#e5e2e1]/40 font-headline">
            <span>0% Margin</span>
            <span className="text-[#B6FF33] font-bold">{profitMargin}% Realized</span>
            <span>100% Margin</span>
          </div>
        </div>
      )}

      {/* Project Volume Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {projectStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-[#18181a]/60 backdrop-blur-xl border border-white/[0.06] p-5 flex items-center gap-4 hover:border-white/[0.12] transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-[#B6FF33]/10 border border-[#B6FF33]/20 flex items-center justify-center text-[#B6FF33] shrink-0">
              {stat.icon}
            </div>
            <div>
              <div className="font-headline text-2xl font-bold text-[#e5e2e1]">
                {stat.value}
              </div>
              <div className="text-[11px] font-headline uppercase tracking-[0.12em] text-[#e5e2e1]/50 font-semibold">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
