'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { UserRole } from '@prisma/client';
import { ArrowLeft, Save, Plus, X, Users, Trash2 } from 'lucide-react';
import Link from 'next/link';
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

export interface EmployeeOption {
  id: string;
  name: string;
  role: string;
  department: string;
  monthlyRate: number | null;
  hourlyRate: number | null;
  isFreelancer: boolean;
}

export interface AssignedEmployeeInput {
  employeeId: string;
  assignedRole: string;
  payAmount: string;
}

interface Props {
  role: UserRole;
  department: 'TECH' | 'MARKETING';
  clients: { id: string; name: string; company: string | null }[];
  salesReps: { id: string; name: string }[];
  employees?: EmployeeOption[];
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  color: '#E8E4E0',
  fontSize: '13px',
  fontFamily: '"Inter", sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box' as const,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: '#6B6B70',
  marginBottom: '6px',
};

export default function NewProjectForm({ role, department, clients, salesReps, employees = [] }: Props) {
  const router = useRouter();
  const { t, isRtl } = useDashboardLang();
  const accentColor = role === 'ZEYAD_TECH' ? '#B6FF33' : '#7C3AED';
  const projectTypes = department === 'TECH' ? techTypes : marketingTypes;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');

  const [salesRepList, setSalesRepList] = useState<{ id: string; name: string }[]>(salesReps);
  const [showNewSalesRep, setShowNewSalesRep] = useState(false);
  const [newSalesRepName, setNewSalesRepName] = useState('');
  const [isCreatingSalesRep, setIsCreatingSalesRep] = useState(false);
  const [salesRepError, setSalesRepError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    clientId: '',
    projectType: '',
    totalAmount: '',
    depositPaid: '',
    startDate: '',
    deadline: '',
    hasSalesRep: false,
    salesRepId: '',
    salesCommissionPercent: '',
  });

  const [assignedEmployees, setAssignedEmployees] = useState<AssignedEmployeeInput[]>([]);

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addEmployeeRow() {
    setAssignedEmployees((prev) => [
      ...prev,
      { employeeId: '', assignedRole: '', payAmount: '' },
    ]);
  }

  function updateEmployeeRow(index: number, field: keyof AssignedEmployeeInput, value: string) {
    setAssignedEmployees((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      if (field === 'employeeId') {
        const emp = employees.find((e) => e.id === value);
        if (emp) {
          if (!updated[index].assignedRole) {
            updated[index].assignedRole = emp.role;
          }
          if (!updated[index].payAmount && (emp.hourlyRate || emp.monthlyRate)) {
            updated[index].payAmount = String(emp.hourlyRate || emp.monthlyRate || '');
          }
        }
      }
      return updated;
    });
  }

  function removeEmployeeRow(index: number) {
    setAssignedEmployees((prev) => prev.filter((_, i) => i !== index));
  }

  async function createNewClient() {
    if (!newClientName.trim()) return;
    try {
      const res = await fetch('/api/dashboard/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClientName }),
      });
      const data = await res.json();
      if (res.ok) {
        update('clientId', data.client.id);
        setShowNewClient(false);
        setNewClientName('');
        router.refresh();
      }
    } catch { /* ignore */ }
  }

  async function createNewSalesRep() {
    if (!newSalesRepName.trim()) return;
    setIsCreatingSalesRep(true);
    setSalesRepError('');
    try {
      const res = await fetch('/api/dashboard/sales-reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSalesRepName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSalesRepError(data.error || 'Failed to add sales rep');
        return;
      }
      if (data.salesRep) {
        setSalesRepList((prev) => [...prev, data.salesRep]);
        setForm((prev) => ({
          ...prev,
          hasSalesRep: true,
          salesRepId: data.salesRep.id,
        }));
        setShowNewSalesRep(false);
        setNewSalesRepName('');
        router.refresh();
      }
    } catch {
      setSalesRepError('Network error. Please try again.');
    } finally {
      setIsCreatingSalesRep(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const body = {
        title: form.title,
        description: form.description,
        department,
        clientId: form.clientId,
        techProjectType: department === 'TECH' ? form.projectType || null : null,
        marketingProjectType: department === 'MARKETING' ? form.projectType || null : null,
        totalAmount: parseFloat(form.totalAmount) || 0,
        depositPaid: parseFloat(form.depositPaid) || 0,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
        hasSalesRep: form.hasSalesRep,
        salesRepId: form.hasSalesRep ? form.salesRepId || null : null,
        salesCommissionPercent: form.hasSalesRep ? parseFloat(form.salesCommissionPercent) || null : null,
        assignedEmployees: assignedEmployees
          .filter((ae) => ae.employeeId && ae.assignedRole)
          .map((ae) => ({
            employeeId: ae.employeeId,
            assignedRole: ae.assignedRole,
            payAmount: parseFloat(ae.payAmount) || 0,
          })),
      };

      const res = await fetch('/api/dashboard/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create project');
        setIsSubmitting(false);
        return;
      }

      router.push(`/dashboard/projects/${data.project.id}`);
      router.refresh();
    } catch {
      setError('Something went wrong');
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
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
          <h1 style={{ fontSize: '22px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '-0.02em' }}>
            {t('newProject')}
          </h1>
          <p style={{ fontSize: '13px', color: '#6B6B70', marginTop: '2px' }}>
            {department === 'TECH' ? t('tech') : t('marketing')} - {t('department')}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            borderRadius: '14px',
            background: 'rgba(18,18,20,0.6)',
            border: '1px solid rgba(255,255,255,0.04)',
            padding: '28px',
          }}
        >
          {/* Project Details */}
          <h2 style={{ fontSize: '14px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', marginBottom: '20px', color: accentColor }}>
            {t('projectDetails')}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            <div>
              <label style={labelStyle}>{t('projectTitle')} *</label>
              <input
                style={inputStyle}
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>{t('projectType')}</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.projectType}
                onChange={(e) => update('projectType', e.target.value)}
              >
                <option value="" style={{ background: '#121214' }}>Select type...</option>
                {projectTypes.map((tItem) => (
                  <option key={tItem.value} value={tItem.value} style={{ background: '#121214' }}>{tItem.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>{t('startDate')}</label>
              <input
                type="date"
                style={{ ...inputStyle, colorScheme: 'dark' }}
                value={form.startDate}
                onChange={(e) => update('startDate', e.target.value)}
              />
            </div>

            <div>
              <label style={labelStyle}>{t('deadline')}</label>
              <input
                type="date"
                style={{ ...inputStyle, colorScheme: 'dark' }}
                value={form.deadline}
                onChange={(e) => update('deadline', e.target.value)}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>{t('description')}</label>
              <textarea
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Project description..."
              />
            </div>
          </div>

          {/* Client Selection */}
          <h2 style={{ fontSize: '14px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', marginBottom: '20px', color: accentColor }}>
            {t('client')}
          </h2>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'end', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <label style={labelStyle}>{t('selectClient')} *</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.clientId}
                onChange={(e) => update('clientId', e.target.value)}
                required
              >
                <option value="" style={{ background: '#121214' }}>Choose a client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id} style={{ background: '#121214' }}>
                    {c.name}{c.company ? ` (${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>
            {!showNewClient ? (
              <button
                type="button"
                onClick={() => setShowNewClient(true)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#E8E4E0',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                <Plus size={14} /> {t('newClient')}
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  style={{ ...inputStyle, width: '200px' }}
                  placeholder="Client name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), createNewClient())}
                />
                <button type="button" onClick={createNewClient} style={{ padding: '10px', borderRadius: '8px', background: accentColor, border: 'none', color: accentColor === '#B6FF33' ? '#121f00' : '#fff', cursor: 'pointer', fontWeight: 600 }}>
                  <Plus size={16} />
                </button>
                <button type="button" onClick={() => setShowNewClient(false)} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#6B6B70', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Financial */}
          <h2 style={{ fontSize: '14px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', marginBottom: '20px', color: accentColor }}>
            {t('finance')}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            <div>
              <label style={labelStyle}>{t('totalAmount')} ({t('egp')})</label>
              <FormattedNumberInput
                style={inputStyle}
                value={form.totalAmount}
                onChangeValue={(val) => update('totalAmount', val)}
                placeholder="0"
              />
            </div>
            <div>
              <label style={labelStyle}>{t('depositPaid')} ({t('egp')})</label>
              <FormattedNumberInput
                style={inputStyle}
                value={form.depositPaid}
                onChangeValue={(val) => update('depositPaid', val)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Sales Rep */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: accentColor, margin: 0 }}>
              {t('salesRepresentative')}
            </h2>
            {!showNewSalesRep ? (
              <button
                type="button"
                onClick={() => {
                  update('hasSalesRep', true);
                  setShowNewSalesRep(true);
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#E8E4E0',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                <Plus size={14} /> {t('newSalesRep')}
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  style={{ ...inputStyle, width: '180px', padding: '6px 12px', fontSize: '12px' }}
                  placeholder="Sales rep name"
                  value={newSalesRepName}
                  onChange={(e) => setNewSalesRepName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), createNewSalesRep())}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={createNewSalesRep}
                  disabled={isCreatingSalesRep}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: accentColor,
                    border: 'none',
                    color: accentColor === '#B6FF33' ? '#121f00' : '#fff',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Plus size={14} /> {isCreatingSalesRep ? '...' : t('add')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewSalesRep(false)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#6B6B70',
                    cursor: 'pointer',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '20px',
                  borderRadius: '10px',
                  background: form.hasSalesRep ? accentColor : 'rgba(255,255,255,0.1)',
                  position: 'relative',
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => update('hasSalesRep', !form.hasSalesRep)}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: form.hasSalesRep ? '18px' : '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }}
                />
              </div>
              <span style={{ fontSize: '13px', color: '#E8E4E0' }}>{t('closedBySalesRep')}</span>
            </label>

            {form.hasSalesRep && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>{t('salesRepName')} *</label>
                    {!showNewSalesRep && (
                      <button
                        type="button"
                        onClick={() => setShowNewSalesRep(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: accentColor,
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0,
                        }}
                      >
                        <Plus size={12} /> {t('newSalesRep')}
                      </button>
                    )}
                  </div>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={form.salesRepId}
                    onChange={(e) => update('salesRepId', e.target.value)}
                  >
                    <option value="" style={{ background: '#121214' }}>Select sales representative...</option>
                    {salesRepList.map((s) => (
                      <option key={s.id} value={s.id} style={{ background: '#121214' }}>{s.name}</option>
                    ))}
                  </select>
                  {salesRepError && (
                    <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                      {salesRepError}
                    </span>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>{t('commission')}</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    style={inputStyle}
                    value={form.salesCommissionPercent}
                    onChange={(e) => update('salesCommissionPercent', e.target.value)}
                    placeholder="e.g. 10"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Team Members / Assigned Employees */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} style={{ color: accentColor }} />
                <h2 style={{ fontSize: '14px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: accentColor, margin: 0 }}>
                  {t('teamMembers')} ({assignedEmployees.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={addEmployeeRow}
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

            {assignedEmployees.length === 0 ? (
              <div
                style={{
                  padding: '18px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(255,255,255,0.08)',
                  textAlign: 'center',
                  color: '#6B6B70',
                  fontSize: '13px',
                }}
              >
                {isRtl ? 'لا يوجد أعضاء معينين في الفريق بعد. يمكنك تعيين الموظفين الآن أو لاحقاً من صفحة المشروع.' : 'No team members assigned yet. You can assign employees now or later from the project page.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {assignedEmployees.map((ae, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 40px',
                      gap: '12px',
                      alignItems: 'end',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <div>
                      <label style={labelStyle}>{t('employeeName')} *</label>
                      <select
                        style={{ ...inputStyle, cursor: 'pointer' }}
                        value={ae.employeeId}
                        onChange={(e) => updateEmployeeRow(index, 'employeeId', e.target.value)}
                        required
                      >
                        <option value="" style={{ background: '#121214' }}>Select employee...</option>
                        {employees.map((e) => (
                          <option key={e.id} value={e.id} style={{ background: '#121214' }}>
                            {e.name} ({e.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>{t('assignedRole')} *</label>
                      <input
                        style={inputStyle}
                        value={ae.assignedRole}
                        onChange={(e) => updateEmployeeRow(index, 'assignedRole', e.target.value)}
                        placeholder="e.g. Lead Designer"
                        required
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>{t('projectPay')} ({t('egp')}) *</label>
                      <FormattedNumberInput
                        style={inputStyle}
                        value={ae.payAmount}
                        onChangeValue={(val) => updateEmployeeRow(index, 'payAmount', val)}
                        placeholder="0"
                        required
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeEmployeeRow(index)}
                      style={{
                        padding: '12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '10px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={t('delete')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(220,38,38,0.1)',
                border: '1px solid rgba(220,38,38,0.2)',
                color: '#ef4444',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 28px',
              borderRadius: '10px',
              border: 'none',
              background: accentColor === '#B6FF33' ? 'linear-gradient(135deg, #B6FF33, #96da00)' : `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
              color: accentColor === '#B6FF33' ? '#121f00' : '#fff',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: '"Space Grotesk", sans-serif',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: accentColor === '#B6FF33' ? '0 0 25px rgba(182,255,51,0.25)' : `0 0 20px ${accentColor}20`,
              opacity: isSubmitting ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            <Save size={16} />
            {isSubmitting ? t('loading') : t('createNewProject')}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
