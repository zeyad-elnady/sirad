'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { UserRole } from '@prisma/client';
import { Plus, Search, Filter, FolderKanban, Pencil, Calendar, ArrowUpRight, Trash2, AlertTriangle, Loader2, Users } from 'lucide-react';
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

  const [projectList, setProjectList] = useState<ProjectItem[]>(projects);
  useEffect(() => {
    setProjectList(projects);
  }, [projects]);

  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  async function handleDelete() {
    if (!projectToDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch(`/api/dashboard/projects/${projectToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || 'Failed to delete project');
        return;
      }
      setProjectList((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setShowDeleteModal(false);
      setProjectToDelete(null);
      router.refresh();
    } catch {
      setDeleteError('Something went wrong. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }

  const filtered = projectList.filter((p) => {
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
          <div
            style={{
              width: '100%',
              overflowX: 'hidden',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                tableLayout: 'auto',
              }}
            >
              <thead>
                <tr>
                  {[
                    { label: t('projectTitle'), align: isRtl ? 'right' : 'left' },
                    { label: t('client'), align: isRtl ? 'right' : 'left' },
                    { label: t('projectType'), align: isRtl ? 'right' : 'left' },
                    { label: t('totalAmount'), align: isRtl ? 'right' : 'left' },
                    { label: t('salaries'), align: isRtl ? 'right' : 'left' },
                    { label: t('netProfit'), align: isRtl ? 'right' : 'left' },
                    { label: t('deposit'), align: isRtl ? 'right' : 'left' },
                    { label: isRtl ? 'الجدول الزمني' : 'Timeline', align: isRtl ? 'right' : 'left' },
                    { label: t('teamMembers'), align: 'center' },
                    { label: t('status'), align: isRtl ? 'right' : 'left' },
                    { label: t('actions'), align: isRtl ? 'left' : 'right' },
                  ].map((col, idx) => (
                    <th
                      key={idx}
                      style={{
                        padding: '12px 10px',
                        fontSize: '10px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#6B6B70',
                        textAlign: col.align as any,
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {col.label}
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
                      <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '13px' }}>
                          {project.title}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', color: '#8B8B90', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {project.clientName}
                      </td>
                      <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', color: '#8B8B90', textTransform: 'capitalize' }}>
                          {type.replace(/_/g, ' ').toLowerCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', whiteSpace: 'nowrap' }}>
                        {formatCurrency(project.totalAmount)}
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: '12px', color: salaries > 0 ? '#EF4444' : '#6B6B70', fontFamily: '"Space Grotesk", sans-serif', whiteSpace: 'nowrap' }}>
                        {salaries > 0 ? `-${formatCurrency(salaries)}` : formatCurrency(0)}
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 700, color: profitVal >= 0 ? '#22C55E' : '#DC2626', fontFamily: '"Space Grotesk", sans-serif', whiteSpace: 'nowrap' }}>
                        {formatCurrency(profitVal)}
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: '12px', color: '#22C55E', whiteSpace: 'nowrap' }}>
                        {formatCurrency(project.depositPaid)}
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: '11px', whiteSpace: 'nowrap' }}>
                        {project.deadline ? (
                          <div>
                            <div style={{ color: '#E8E4E0', fontWeight: 500 }}>
                              {format(new Date(project.deadline), 'MMM d, yyyy')}
                            </div>
                            {project.startDate && (
                              <div style={{ fontSize: '10px', color: '#6B6B70' }}>
                                {isRtl ? 'من' : 'From'} {format(new Date(project.startDate), 'MMM d')}
                              </div>
                            )}
                          </div>
                        ) : project.startDate ? (
                          <div style={{ color: '#8B8B90' }}>
                            {format(new Date(project.startDate), 'MMM d, yyyy')}
                          </div>
                        ) : (
                          <span style={{ color: '#555558' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: '12px', color: '#8B8B90', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {project.employeeCount > 0 ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Users size={12} style={{ opacity: 0.6 }} />
                            {project.employeeCount}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '11px',
                            fontWeight: 500,
                            padding: '3px 8px',
                            borderRadius: '20px',
                            background: style.bg,
                            color: style.text,
                          }}
                        >
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: style.dot, boxShadow: `0 0 6px ${style.dot}` }} />
                          {project.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', whiteSpace: 'nowrap', textAlign: isRtl ? 'left' : 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard/projects/${project.id}`);
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              border: '1px solid rgba(255,255,255,0.08)',
                              background: 'rgba(255,255,255,0.03)',
                              color: '#E8E4E0',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              whiteSpace: 'nowrap',
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
                            <Pencil size={12} /> {isRtl ? 'تعديل' : 'Edit'}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectToDelete(project);
                              setDeleteError('');
                              setShowDeleteModal(true);
                            }}
                            title={t('deleteProject')}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '5px 7px',
                              borderRadius: '8px',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              background: 'rgba(239, 68, 68, 0.08)',
                              color: '#EF4444',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Project Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && projectToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 110,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#121214',
                borderRadius: '16px',
                padding: '28px',
                width: '100%',
                maxWidth: '480px',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(239, 68, 68, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EF4444',
                    flexShrink: 0,
                  }}
                >
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      fontFamily: '"Space Grotesk", sans-serif',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    {t('deleteProjectConfirmTitle')}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#8E8E93', margin: '4px 0 0' }}>
                    {projectToDelete.title}
                  </p>
                </div>
              </div>

              {deleteError && (
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
                  {deleteError}
                </div>
              )}

              <p
                style={{
                  fontSize: '13px',
                  color: '#A1A1AA',
                  lineHeight: '1.6',
                  marginBottom: '24px',
                }}
              >
                {t('deleteProjectConfirmDesc')}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#E8E4E0',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
                    opacity: isDeleting ? 0.7 : 1,
                  }}
                >
                  {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  {isDeleting ? t('deleting') : t('deleteProject')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
