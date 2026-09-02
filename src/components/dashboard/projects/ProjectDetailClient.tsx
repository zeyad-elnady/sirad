'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { UserRole } from '@prisma/client';
import type { ProjectProfitResult } from '@/lib/finance';
import { ArrowLeft, Calendar, DollarSign, Users, FileText, Server, Clapperboard } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  role: UserRole;
  project: Record<string, unknown>;
  profit: ProjectProfitResult | null;
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

export default function ProjectDetailClient({ role, project, profit }: Props) {
  const accentColor = role === 'ZEYAD_TECH' ? '#B6FF33' : '#7C3AED';
  const p = project as Record<string, any>;
  const st = statusColors[p.status as string] || statusColors.DRAFT;

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
        <h3 style={sectionTitle}><Users size={16} /> Team ({(p.employees as any[])?.length || 0})</h3>
        {(p.employees as any[])?.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {(p.employees as any[]).map((pe: any) => (
              <Link
                key={pe.id}
                href={`/dashboard/employees/${pe.employeeId}`}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  textDecoration: 'none',
                  color: '#E8E4E0',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{pe.employee.name}</div>
                <div style={{ fontSize: '11px', color: '#6B6B70', marginTop: '4px' }}>{pe.assignedRole}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: '#22C55E', marginTop: '8px' }}>
                  {formatCurrency(pe.payAmount)}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: '#6B6B70' }}>No team members assigned yet.</p>
        )}
      </div>

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
