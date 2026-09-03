'use client';

import { motion } from 'framer-motion';
import type { UserRole } from '@prisma/client';
import {
  FolderKanban,
  Zap,
  Users,
  UserCheck,
  TrendingUp,
  Wallet,
  AlertCircle,
  ArrowRight,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { useDashboardLang } from '@/context/DashboardLanguageContext';

interface StatsData {
  totalProjects: number;
  activeProjects: number;
  totalClients: number;
  totalEmployees: number;
  totalRevenue: number;
  totalCollected: number;
  outstandingBalance: number;
}

interface RecentProject {
  id: string;
  title: string;
  status: string;
  clientName: string;
  totalAmount: number;
  createdAt: string;
  techProjectType: string | null;
  marketingProjectType: string | null;
}

interface Props {
  role: UserRole;
  userName: string;
  stats: StatsData;
  recentProjects: RecentProject[];
}

function getGreeting(locale: string): string {
  const hour = new Date().getHours();
  if (locale === 'ar') {
    if (hour < 12) return 'صباح الخير';
    return 'مساء الخير';
  }
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const statusBadgeStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  ACTIVE: {
    bg: 'bg-[#B6FF33]/10',
    text: 'text-[#B6FF33]',
    border: 'border-[#B6FF33]/30',
    dot: 'bg-[#B6FF33]',
  },
  COMPLETED: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  ON_HOLD: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
  },
  DRAFT: {
    bg: 'bg-white/[0.04]',
    text: 'text-[#e5e2e1]/60',
    border: 'border-white/[0.08]',
    dot: 'bg-[#e5e2e1]/40',
  },
  CANCELLED: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function DashboardOverviewClient({
  role,
  userName,
  stats,
  recentProjects,
}: Props) {
  const isTech = role === 'ZEYAD_TECH';
  const { t, isRtl, formatCurrency, locale } = useDashboardLang();
  const greeting = getGreeting(locale);

  const statCards = [
    {
      label: isRtl ? 'إجمالي المشاريع' : 'Total Projects',
      value: stats.totalProjects.toString(),
      icon: <FolderKanban size={18} />,
      highlight: false,
    },
    {
      label: isRtl ? 'المشاريع النشطة' : 'Active Projects',
      value: stats.activeProjects.toString(),
      icon: <Zap size={18} />,
      highlight: true,
    },
    {
      label: isRtl ? 'العملاء' : 'Total Clients',
      value: stats.totalClients.toString(),
      icon: <Users size={18} />,
      highlight: false,
    },
    {
      label: t('employees'),
      value: stats.totalEmployees.toString(),
      icon: <UserCheck size={18} />,
      highlight: false,
    },
    {
      label: t('totalRevenue'),
      value: formatCurrency(stats.totalRevenue),
      icon: <TrendingUp size={18} />,
      highlight: true,
    },
    {
      label: isRtl ? 'المتحصل' : 'Collected',
      value: formatCurrency(stats.totalCollected),
      icon: <Wallet size={18} />,
      highlight: false,
    },
    {
      label: isRtl ? 'المستحق' : 'Outstanding',
      value: formatCurrency(stats.outstandingBalance),
      icon: <AlertCircle size={18} />,
      highlight: stats.outstandingBalance > 0,
      isWarning: stats.outstandingBalance > 0,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Header Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2"
      >
        <div>
          {/* Pulsing Brand Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B6FF33]/20 bg-[#B6FF33]/5 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#B6FF33] animate-pulse" />
            <span className="font-headline text-[10px] uppercase tracking-[0.16em] text-[#B6FF33] font-bold">
              Sirad Digital Command • {isTech ? t('techCommand') : t('marketingHub')}
            </span>
          </div>

          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#e5e2e1]">
            {greeting},{' '}
            <span className="text-[#B6FF33] glow-text font-bold">{userName}</span>
          </h1>

          <p className="text-[#e5e2e1]/60 text-sm md:text-base font-light max-w-2xl mt-2 font-body">
            {isRtl
              ? 'العمليات الفورية، مشاريع العملاء، والبيانات المالية لوكالة سيراد.'
              : 'Real-time operations, client engagements, and financial intelligence for Sirad.'}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B6FF33] text-[#121f00] font-headline text-xs uppercase tracking-wider font-bold hover:shadow-[0_0_25px_rgba(182,255,51,0.4)] transition-all duration-300 active:scale-95"
          >
            <Plus size={16} />
            <span>{t('newProject')}</span>
          </Link>
          <Link
            href="/dashboard/finance"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.1] bg-white/[0.04] text-[#e5e2e1] font-headline text-xs font-semibold hover:border-[#B6FF33]/40 hover:bg-[#B6FF33]/5 hover:text-[#B6FF33] transition-all duration-300"
          >
            <span>{t('finance')}</span>
            <ArrowUpRight size={14} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </Link>
        </div>
      </motion.div>

      {/* Stat Cards Grid — Styled like Website Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4"
      >
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`rounded-2xl p-5 backdrop-blur-xl border transition-all duration-300 relative overflow-hidden group ${
              card.highlight
                ? 'bg-[#18181a]/90 border-[#B6FF33]/30 shadow-[0_0_30px_rgba(182,255,51,0.08)]'
                : 'bg-[#18181a]/60 border-white/[0.06] hover:border-white/[0.15]'
            }`}
          >
            {/* Ambient neon radial glow in corner */}
            <div
              className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-xl pointer-events-none transition-opacity ${
                card.highlight
                  ? 'bg-[#B6FF33]/20 opacity-100'
                  : 'bg-white/[0.03] group-hover:bg-[#B6FF33]/15 opacity-60'
              }`}
            />

            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-headline text-[10px] uppercase tracking-[0.14em] text-[#e5e2e1]/60 font-semibold truncate">
                {card.label}
              </span>
              <span
                className={`p-1.5 rounded-lg border transition-colors ${
                  card.highlight
                    ? 'bg-[#B6FF33]/10 border-[#B6FF33]/30 text-[#B6FF33]'
                    : 'bg-white/[0.03] border-white/[0.06] text-[#e5e2e1]/60 group-hover:text-[#B6FF33]'
                }`}
              >
                {card.icon}
              </span>
            </div>

            {/* Value */}
            <div
              className={`font-headline text-2xl font-bold tracking-tight ${
                card.highlight
                  ? 'text-[#B6FF33]'
                  : 'text-[#e5e2e1] group-hover:text-[#B6FF33] transition-colors'
              }`}
            >
              {card.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Projects Table Section */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-[#18181a]/70 backdrop-blur-2xl border border-white/[0.08] p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(182,255,51,0.04)_0%,transparent_70%)] pointer-events-none" />

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="font-headline text-lg font-bold text-[#e5e2e1] tracking-tight">
              {isRtl ? 'أحدث المشاريع' : 'Recent Projects'}
            </h2>
            <p className="text-xs text-[#e5e2e1]/50 mt-0.5 font-body">
              {isRtl ? 'آخر المشاريع والتعاقدات المضافة للوكالة' : 'Latest client deliverables and production status'}
            </p>
          </div>

          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#B6FF33]/30 bg-[#B6FF33]/10 text-[#B6FF33] hover:bg-[#B6FF33] hover:text-[#121f00] font-headline text-xs font-bold transition-all duration-300"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight size={13} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </Link>
        </div>

        {/* Projects List */}
        {recentProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-[#e5e2e1]/40 font-body">
              {isRtl ? 'لا توجد مشاريع مضافة بعد.' : 'No projects found.'}
            </p>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#B6FF33] text-[#121f00] font-headline text-xs font-bold"
            >
              <Plus size={14} /> {isRtl ? 'إنشاء مشروعك الأول' : 'Create your first project'}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
              <thead>
                <tr className="border-b border-white/[0.04] text-[11px] font-headline uppercase tracking-[0.14em] text-[#e5e2e1]/40">
                  <th className="pb-3 font-semibold">{t('projectTitle')}</th>
                  <th className="pb-3 font-semibold">{t('client')}</th>
                  <th className="pb-3 font-semibold">{t('projectType')}</th>
                  <th className="pb-3 font-semibold">{t('totalAmount')}</th>
                  <th className={`pb-3 font-semibold ${isRtl ? 'text-left' : 'text-right'}`}>{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {recentProjects.map((project) => {
                  const statusStyle =
                    statusBadgeStyles[project.status] || statusBadgeStyles.DRAFT;
                  const projectType =
                    project.techProjectType || project.marketingProjectType || 'General';

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    >
                      {/* Project Title */}
                      <td className="py-4 pr-4">
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="font-headline text-sm font-bold text-[#e5e2e1] group-hover:text-[#B6FF33] transition-colors inline-flex items-center gap-2"
                        >
                          <span>{project.title}</span>
                          <ArrowUpRight
                            size={13}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#B6FF33]"
                          />
                        </Link>
                        <div className="text-[11px] text-[#e5e2e1]/40 font-body mt-0.5">
                          Created {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Client Name */}
                      <td className="py-4 pr-4">
                        <span className="text-xs font-medium text-[#e5e2e1]/80 font-body">
                          {project.clientName}
                        </span>
                      </td>

                      {/* Project Type Badge */}
                      <td className="py-4 pr-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] font-headline uppercase tracking-wider text-[#e5e2e1]/70">
                          {projectType.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Contract Value */}
                      <td className="py-4 pr-4">
                        <span className="font-headline text-sm font-bold text-[#e5e2e1]">
                          {formatCurrency(project.totalAmount)}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className={`py-4 ${isRtl ? 'text-left' : 'text-right'}`}>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-headline font-bold uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} ${
                              project.status === 'ACTIVE' ? 'animate-pulse' : ''
                            }`}
                          />
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
