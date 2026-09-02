'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import type { UserRole } from '@prisma/client';
import { Plus, Search, Filter, FolderKanban } from 'lucide-react';

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
  createdAt: string;
}

interface Props {
  role: UserRole;
  projects: ProjectItem[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
  }).format(amount);
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
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
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
          <Plus size={16} /> New Project
        </Link>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px',
            padding: '8px 14px',
            flex: '1',
            maxWidth: '320px',
          }}
        >
          <Search size={16} style={{ color: '#6B6B70' }} />
          <input
            type="text"
            placeholder="Search projects..."
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
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <Filter size={14} style={{ color: '#6B6B70', marginRight: '4px' }} />
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: `1px solid ${statusFilter === s ? accentColor + '40' : 'rgba(255,255,255,0.06)'}`,
                background: statusFilter === s ? accentColor + '15' : 'transparent',
                color: statusFilter === s ? accentColor : '#6B6B70',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {s === 'ALL' ? 'All' : s.replace(/_/g, ' ').toLowerCase()}
            </button>
          ))}
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
            <p style={{ fontSize: '14px' }}>No projects found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr>
                  {['Project', 'Client', 'Type', 'Amount', 'Deposit', 'Sales Rep', 'Team', 'Status'].map((h) => (
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
                  return (
                    <tr
                      key={project.id}
                      style={{
                        borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                        transition: 'background 0.15s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <Link href={`/dashboard/projects/${project.id}`} style={{ color: '#E8E4E0', textDecoration: 'none', fontWeight: 500, fontSize: '13px' }}>
                          {project.title}
                        </Link>
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
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#22C55E' }}>
                        {formatCurrency(project.depositPaid)}
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
