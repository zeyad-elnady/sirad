'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '@prisma/client';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  X,
  Mail,
  Phone,
  Building2,
  FileText,
  AlertTriangle,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import Link from 'next/link';

export interface ClientDetailProject {
  id: string;
  title: string;
  status: string;
  totalAmount: number;
  salesRep?: {
    id: string;
    name: string;
  } | null;
  createdAt?: string;
}

export interface ClientDetailData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  projects: ClientDetailProject[];
}

interface Props {
  role: UserRole;
  client: ClientDetailData;
}

export default function ClientDetailClient({ role, client }: Props) {
  const router = useRouter();
  const accentColor = role === 'ZEYAD_TECH' ? '#B6FF33' : '#7C3AED';
  const totalRevenue = client.projects.reduce((s, p) => s + (p.totalAmount || 0), 0);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editForm, setEditForm] = useState({
    name: client.name || '',
    email: client.email || '',
    phone: client.phone || '',
    company: client.company || '',
    notes: client.notes || '',
  });

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  function openEditModal() {
    setEditForm({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      notes: client.notes || '',
    });
    setEditError('');
    setShowEditModal(true);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setEditError('');

    try {
      const res = await fetch(`/api/dashboard/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || 'Failed to update client data');
        return;
      }

      setShowEditModal(false);
      router.refresh();
    } catch {
      setEditError('Something went wrong. Please check your network and try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setDeleteError('');

    try {
      const res = await fetch(`/api/dashboard/clients/${client.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || 'Failed to delete client');
        return;
      }

      setShowDeleteModal(false);
      router.push('/dashboard/clients');
      router.refresh();
    } catch {
      setDeleteError('Failed to delete client. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }

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

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '6px',
    display: 'block',
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: 'rgba(34, 197, 94, 0.12)', text: '#22C55E', border: 'rgba(34, 197, 94, 0.25)' };
      case 'ACTIVE':
        return { bg: 'rgba(59, 130, 246, 0.12)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.25)' };
      case 'ON_HOLD':
        return { bg: 'rgba(245, 158, 11, 0.12)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.25)' };
      case 'CANCELLED':
        return { bg: 'rgba(239, 68, 68, 0.12)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.25)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.08)', text: '#A1A1AA', border: 'rgba(255, 255, 255, 0.1)' };
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '240px' }}>
          <Link
            href="/dashboard/clients"
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              color: '#8E8E93',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: '"Space Grotesk", sans-serif',
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              {client.name}
            </h1>
            <p style={{ fontSize: '13px', color: '#6B6B70', margin: '4px 0 0 0' }}>
              {client.company || 'No company'} • {client.projects.length} project
              {client.projects.length !== 1 ? 's' : ''} • Total: EGP {totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={openEditModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#E8E4E0',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${accentColor}60`;
              e.currentTarget.style.color = accentColor;
              e.currentTarget.style.boxShadow = `0 0 15px ${accentColor}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#E8E4E0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Pencil size={15} /> Edit Client
          </button>

          <button
            type="button"
            onClick={() => {
              setDeleteError('');
              setShowDeleteModal(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#EF4444',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Trash2 size={15} /> Delete Client
          </button>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            padding: '18px',
            borderRadius: '14px',
            background: 'rgba(18,18,20,0.6)',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B6B70' }}>
            <Mail size={14} />
            <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Email
            </span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: client.email ? '#FFFFFF' : '#6B6B70' }}>
            {client.email || '—'}
          </div>
        </div>

        <div
          style={{
            padding: '18px',
            borderRadius: '14px',
            background: 'rgba(18,18,20,0.6)',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B6B70' }}>
            <Phone size={14} />
            <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Phone
            </span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: client.phone ? '#FFFFFF' : '#6B6B70' }}>
            {client.phone || '—'}
          </div>
        </div>

        <div
          style={{
            padding: '18px',
            borderRadius: '14px',
            background: 'rgba(18,18,20,0.6)',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B6B70' }}>
            <Building2 size={14} />
            <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Company
            </span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: client.company ? '#FFFFFF' : '#6B6B70' }}>
            {client.company || '—'}
          </div>
        </div>

        {client.notes && (
          <div
            style={{
              padding: '18px',
              borderRadius: '14px',
              background: 'rgba(18,18,20,0.6)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              gridColumn: '1 / -1',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B6B70' }}>
              <FileText size={14} />
              <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Notes
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#B3B3B7', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {client.notes}
            </div>
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 700,
            fontFamily: '"Space Grotesk", sans-serif',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0,
          }}
        >
          <FolderOpen size={18} style={{ color: accentColor }} />
          Projects
        </h2>
        <span style={{ fontSize: '12px', color: '#6B6B70' }}>
          {client.projects.length} project{client.projects.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div
        style={{
          borderRadius: '14px',
          background: 'rgba(18,18,20,0.6)',
          border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        {client.projects.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <FolderOpen size={36} style={{ color: '#6B6B70', opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ color: '#8E8E93', fontSize: '14px', margin: '0 0 6px 0', fontWeight: 500 }}>
              No projects yet
            </p>
            <p style={{ color: '#6B6B70', fontSize: '12px', margin: 0 }}>
              Projects associated with this client will appear here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Project Title', 'Status', 'Sales Rep', 'Total Amount'].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: '14px 20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#8E8E93',
                        textAlign: i === 3 ? 'right' : 'left',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {client.projects.map((p) => {
                  const badge = getStatusBadgeStyle(p.status);
                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <Link
                          href={`/dashboard/projects/${p.id}`}
                          style={{
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '14px',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                        >
                          {p.title}
                        </Link>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            background: badge.bg,
                            color: badge.text,
                            border: `1px solid ${badge.border}`,
                            textTransform: 'capitalize',
                          }}
                        >
                          {p.status.replace(/_/g, ' ').toLowerCase()}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: '#8E8E93' }}>
                        {p.salesRep ? p.salesRep.name : '—'}
                      </td>
                      <td
                        style={{
                          padding: '14px 20px',
                          fontSize: '14px',
                          fontWeight: 700,
                          fontFamily: '"Space Grotesk", sans-serif',
                          color: '#FFFFFF',
                          textAlign: 'right',
                        }}
                      >
                        EGP {p.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Client Modal */}
      <AnimatePresence>
        {showEditModal && (
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
            onClick={() => !isSaving && setShowEditModal(false)}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleUpdate}
              style={{
                background: '#121214',
                borderRadius: '16px',
                padding: '28px',
                width: '100%',
                maxWidth: '500px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
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
                  Edit Client Data
                </h2>
                <button
                  type="button"
                  onClick={() => !isSaving && setShowEditModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6B6B70',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {editError && (
                <div
                  style={{
                    padding: '12px 14px',
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Client Name *</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g. John Doe / Acme Corp"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      style={inputStyle}
                      placeholder="client@example.com"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input
                      style={inputStyle}
                      placeholder="+20 100 ..."
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Company</label>
                  <input
                    style={inputStyle}
                    placeholder="Company Name"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Notes / Details</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    placeholder="Add special notes, preferred contact methods, or contract details..."
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '8px',
                  }}
                >
                  <button
                    type="button"
                    disabled={isSaving}
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
                    disabled={isSaving}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 22px',
                      borderRadius: '10px',
                      border: 'none',
                      background: accentColor,
                      color: accentColor === '#B6FF33' ? '#121f00' : '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      opacity: isSaving ? 0.7 : 1,
                      boxShadow: accentColor === '#B6FF33' ? '0 0 20px rgba(182,255,51,0.25)' : 'none',
                    }}
                  >
                    {isSaving && <Loader2 size={15} className="animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Client Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
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
                maxWidth: '460px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EF4444',
                  marginBottom: '16px',
                }}
              >
                <AlertTriangle size={24} />
              </div>

              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: '#FFFFFF',
                  margin: '0 0 8px 0',
                }}
              >
                Delete Client
              </h2>

              <p style={{ fontSize: '13px', color: '#A1A1AA', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                Are you sure you want to delete <strong style={{ color: '#FFFFFF' }}>{client.name}</strong>?
              </p>

              {/* Informative message based on project count */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '12px',
                  color: '#8E8E93',
                  lineHeight: 1.5,
                  marginBottom: '20px',
                }}
              >
                {client.projects.length === 0 ? (
                  <span>
                    This client has <strong style={{ color: '#E8E4E0' }}>0 projects</strong> and will be permanently
                    removed from the database.
                  </span>
                ) : (
                  <span>
                    This client is linked to{' '}
                    <strong style={{ color: '#E8E4E0' }}>
                      {client.projects.length} project{client.projects.length !== 1 ? 's' : ''}
                    </strong>
                    . To preserve project logs and contract records, the client will be archived and hidden from active views.
                  </span>
                )}
              </div>

              {deleteError && (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#EF4444',
                    fontSize: '12px',
                    marginBottom: '16px',
                  }}
                >
                  {deleteError}
                </div>
              )}

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
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    opacity: isDeleting ? 0.7 : 1,
                  }}
                >
                  {isDeleting && <Loader2 size={15} className="animate-spin" />}
                  {isDeleting ? 'Deleting...' : 'Delete Client'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
