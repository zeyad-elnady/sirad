'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { UserRole } from '@prisma/client';
import { Plus, Search, Filter, FolderKanban, Pencil, Calendar, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { useDashboardLang } from '@/context/DashboardLanguageContext';

interface ProjectItem {
  id: string;
  title: string;
  status: string;
  department: string;
  clientName: string;
  totalAmount: number;
  depositPaid: number;
  techProjectType: string | null;
  marketingProjectType: string | null;
  hasSalesRep: boolean;
  salesRepName: string | null;
  employeeCount: number;
  employeeSalaries?: number;
  netProfit?: number;
  startDate?: string | null;
  deadline?: string | null;
  createdAt: string;
}

interface Props {
  role: UserRole;
  projects: ProjectItem[];
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  DRAFT: { bg: 'rgba(107,107,112,0.1)', text: '#6B6B70', dot: '#6B6B70' },
  ACTIVE: { bg: 'rgba(34,197,94,0.1)', text: '#22C55E', dot: '#22C55E' },
  ON_HOLD: { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', dot: '#F59E0B' },
  COMPLETED: { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6', dot: '#3B82F6' },
  CANCELLED: { bg: 'rgba(220,38,38,0.1)', text: '#DC2626', dot: '#DC2626' },
};

const statuses = ['ALL', 'DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];

export default function ProjectsListClient({ role, projects }: Props) {
  const router = useRouter();
  const { t, isRtl, formatCurrency } = useDashboardLang();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const accentColor = role === 'ZEYAD_TECH' ? '#B6FF33' : '#7C3AED';

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              fontFamily: '"Space Grotesk", sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            Projects
          </h1>
          <p style={{ fontSize: '13px', color: '#6B6B70', marginTop: '4px' }}>
            {filtered.length} {isRtl ? 'مشروع' : `project${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            background: accentColor === '#B6FF33' ? 'linear-gradient(135deg, #B6FF33, #96da00)' : `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
            color: accentColor === '#B6FF33' ? '#121f00' : '#fff',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: '"Space Grotesk", sans-serif',
            boxShadow: accentColor === '#B6FF33' ? '0 0 25px rgba(182,255,51,0.25)' : `0 0 20px ${accentColor}20`,
            transition: 'all 0.2s',
          }}
        >
          <Plus size={16} /> {t('newProject')}
        </Link>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px',
            padding: '8px 14px',
            width: '100%',
            maxWidth: '320px',
          }}
        >
          <Search size={16} style={{ color: '#6B6B70' }} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#E8E4E0',
              fontSize: '13px',
              width: '100%',
              fontFamily: '"Inter", sans-serif',
            }}
          />
        </div>

        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter size={14} style={{ color: '#6B6B70', marginInlineEnd: '4px' }} />
          {statuses.map((s) => {
            const active = statusFilter === s;
            const statusLabel =
              s === 'ALL'
                ? t('all')
                : s === 'DRAFT'
                ? t('draft')
                : s === 'ACTIVE'
                ? t('active')
                : s === 'ON_HOLD'
                ? t('onHold')
                : s === 'COMPLETED'
                ? t('completed')
                : t('cancelled');

            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: active ? `1px solid ${accentColor}40` : '1px solid rgba(255,255,255,0.06)',
                  background: active ? (accentColor === '#B6FF33' ? 'rgba(182,255,51,0.1)' : `${accentColor}15`) : 'rgba(255,255,255,0.02)',
                  color: active ? accentColor : '#6B6B70',
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: '"Space Grotesk", sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {statusLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Table */}
      <div
        style={{
          borderRadius: '14px',
          background: 'rgba(18,18,20,0.6)',
          border: '1px solid rgba(255,255,255,0.04)',
          overflow: 'hidden',
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6B6B70' }}>
            <FolderKanban size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p style={{ fontSize: '14px' }}>{isRtl ? 'لا توجد مشاريع' : 'No projects found'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '940px' }}>
              <thead>
                <tr>
                  {[
                    t('projectTitle'),
                    t('client'),
                    t('projectType'),
                    t('totalAmount'),
                    t('salaries'),
                    t('netProfit'),
                    t('deposit'),
                    isRtl ? 'الجدول الزمني' : 'Timeline',
                    t('teamMembers'),
                    t('status'),
                    t('actions'),
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '14px 16px',
                        fontSize: '10px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: '#6B6B70',
                        textAlign: isRtl ? 'right' : 'left',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((project, i) => {
                  const style = statusColors[project.status] || statusColors.DRAFT;
                  const type = project.techProjectType || project.marketingProjectType || '—';
                  const salaries = project.employeeSalaries ?? 0;
                  const profitVal = project.netProfit ?? (project.totalAmount - salaries);
                  return (
                    <tr
                      key={project.id}
                      style={{
                        borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                        transition: 'background 0.15s',
                        cursor: 'pointer',
                      }}
                      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '13px' }}>
                          {project.title}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#8B8B90', fontSize: '13px' }}>{project.clientName}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', color: '#8B8B90', textTransform: 'capitalize' }}>
                          {type.replace(/_/g, ' ').toLowerCase()}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}>
                        {formatCurrency(project.totalAmount)}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: salaries > 0 ? '#EF4444' : '#6B6B70', fontFamily: '"Space Grotesk", sans-serif' }}>
                        {salaries > 0 ? `-${formatCurrency(salaries)}` : formatCurrency(0)}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 700, color: profitVal >= 0 ? '#22C55E' : '#DC2626', fontFamily: '"Space Grotesk", sans-serif' }}>
                        {formatCurrency(profitVal)}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#22C55E' }}>
                        {formatCurrency(project.depositPaid)}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {project.deadline ? (
                          <div>
                            <div style={{ color: '#E8E4E0', fontWeight: 500 }}>
                              Due {format(new Date(project.deadline), 'MMM d, yyyy')}
                            </div>
                            {project.startDate && (
                              <div style={{ fontSize: '11px', color: '#6B6B70', marginTop: '2px' }}>
                                From {format(new Date(project.startDate), 'MMM d')}
                              </div>
                            )}
                          </div>
                        ) : project.startDate ? (
                          <div style={{ color: '#8B8B90' }}>
                            Started {format(new Date(project.startDate), 'MMM d, yyyy')}
                          </div>
                        ) : (
                          <span style={{ color: '#555558' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: '#8B8B90' }}>
                        {project.salesRepName || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: '#8B8B90' }}>
                        {project.employeeCount}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            fontWeight: 500,
                            padding: '4px 10px',
                            borderRadius: '20px',
                            background: style.bg,
                            color: style.text,
                          }}
                        >
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: style.dot, boxShadow: `0 0 6px ${style.dot}` }} />
                          {project.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/projects/${project.id}`);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(255,255,255,0.03)',
                            color: '#E8E4E0',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = `${accentColor}80`;
                            e.currentTarget.style.color = accentColor;
                            e.currentTarget.style.background = `${accentColor}10`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.color = '#E8E4E0';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          }}
                        >
                          <Pencil size={12} /> Open & Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
