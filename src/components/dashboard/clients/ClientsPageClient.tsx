'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '@prisma/client';
import {
  Plus,
  Search,
  Users,
  X,
  Pencil,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface ClientItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes?: string | null;
  projectCount: number;
  createdAt: string;
}

interface Props {
  role: UserRole;
  clients: ClientItem[];
}

export default function ClientsPageClient({ role, clients }: Props) {
  const router = useRouter();
  const accentColor = role === 'ZEYAD_TECH' ? '#B6FF33' : '#7C3AED';
  const [search, setSearch] = useState('');

  // Add Client State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit Client State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete Client State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingClient, setDeletingClient] = useState<ClientItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setAddError('');
    try {
      const res = await fetch('/api/dashboard/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error || 'Failed to create client');
        return;
      }
      setShowAddModal(false);
      setAddForm({ name: '', email: '', phone: '', company: '', notes: '' });
      router.refresh();
    } catch {
      setAddError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEditModal(c: ClientItem) {
    setEditingClient(c);
    setEditForm({
      name: c.name,
      email: c.email || '',
      phone: c.phone || '',
      company: c.company || '',
      notes: c.notes || '',
    });
    setEditError('');
    setShowEditModal(true);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingClient) return;

    setIsSaving(true);
    setEditError('');
    try {
      const res = await fetch(`/api/dashboard/clients/${editingClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || 'Failed to update client');
        return;
      }
      setShowEditModal(false);
      setEditingClient(null);
      router.refresh();
    } catch {
      setEditError('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  function openDeleteModal(c: ClientItem) {
    setDeletingClient(c);
    setDeleteError('');
    setShowDeleteModal(true);
  }

  async function handleDelete() {
    if (!deletingClient) return;

    setIsDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch(`/api/dashboard/clients/${deletingClient.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || 'Failed to delete client');
        return;
      }
      setShowDeleteModal(false);
      setDeletingClient(null);
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif' }}>
          Clients
        </h1>
        <button
          onClick={() => {
            setAddError('');
            setShowAddModal(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            borderRadius: '10px',
            background:
              accentColor === '#B6FF33'
                ? 'linear-gradient(135deg, #B6FF33, #96da00)'
                : `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
            color: accentColor === '#B6FF33' ? '#121f00' : '#fff',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow:
              accentColor === '#B6FF33'
                ? '0 0 25px rgba(182,255,51,0.25)'
                : `0 0 20px ${accentColor}20`,
          }}
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

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
          marginBottom: '20px',
          maxWidth: '320px',
        }}
      >
        <Search size={16} style={{ color: '#6B6B70' }} />
        <input
          type="text"
          placeholder="Search clients..."
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

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && (
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
            onClick={() => !isSubmitting && setShowAddModal(false)}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleCreate}
              style={{
                background: '#121214',
                borderRadius: '16px',
                padding: '28px',
                width: '100%',
                maxWidth: '480px',
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
                  New Client
                </h2>
                <button
                  type="button"
                  onClick={() => !isSubmitting && setShowAddModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6B6B70',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {addError && (
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
                  {addError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Client Name *</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g. Acme Corp"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
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
                      value={addForm.email}
                      onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input
                      style={inputStyle}
                      placeholder="+20 100 ..."
                      value={addForm.phone}
                      onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Company</label>
                  <input
                    style={inputStyle}
                    placeholder="Company name"
                    value={addForm.company}
                    onChange={(e) => setAddForm({ ...addForm, company: e.target.value })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Notes</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
                    placeholder="Notes or details..."
                    value={addForm.notes}
                    onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: accentColor,
                    color: accentColor === '#B6FF33' ? '#121f00' : '#fff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    marginTop: '6px',
                  }}
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {isSubmitting ? 'Creating...' : 'Create Client'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Client Modal */}
      <AnimatePresence>
        {showEditModal && editingClient && (
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
                maxWidth: '480px',
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
                  }}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Client Name *</label>
                  <input
                    style={inputStyle}
                    placeholder="Client name"
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
                      placeholder="Email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input
                      style={inputStyle}
                      placeholder="Phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Company</label>
                  <input
                    style={inputStyle}
                    placeholder="Company"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Notes</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
                    placeholder="Notes..."
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
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
        {showDeleteModal && deletingClient && (
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
                Are you sure you want to delete <strong style={{ color: '#FFFFFF' }}>{deletingClient.name}</strong>?
              </p>

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
                {deletingClient.projectCount === 0 ? (
                  <span>
                    This client has <strong style={{ color: '#E8E4E0' }}>0 projects</strong> and will be permanently removed.
                  </span>
                ) : (
                  <span>
                    This client is linked to{' '}
                    <strong style={{ color: '#E8E4E0' }}>
                      {deletingClient.projectCount} project{deletingClient.projectCount !== 1 ? 's' : ''}
                    </strong>
                    . It will be archived and hidden from active views.
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

      {/* Client Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '12px',
        }}
      >
        {filtered.map((c) => (
          <motion.div
            key={c.id}
            whileHover={{ y: -2 }}
            style={{
              padding: '20px',
              borderRadius: '14px',
              background: 'rgba(18,18,20,0.6)',
              border: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onClick={() => router.push(`/dashboard/clients/${c.id}`)}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: `${accentColor}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: accentColor,
                      fontWeight: 700,
                      fontSize: '15px',
                      fontFamily: '"Space Grotesk", sans-serif',
                      textTransform: 'uppercase',
                    }}
                  >
                    {c.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>{c.name}</div>
                    {c.company && <div style={{ fontSize: '12px', color: '#6B6B70' }}>{c.company}</div>}
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    title="Edit Client"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(c);
                    }}
                    style={{
                      padding: '7px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      color: '#A1A1AA',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${accentColor}80`;
                      e.currentTarget.style.color = accentColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = '#A1A1AA';
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    title="Delete Client"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(c);
                    }}
                    style={{
                      padding: '7px',
                      borderRadius: '8px',
                      border: '1px solid rgba(239,68,68,0.2)',
                      background: 'rgba(239,68,68,0.05)',
                      color: '#EF4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
                      e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239,68,68,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: '#6B6B70',
                paddingTop: '10px',
                borderTop: '1px solid rgba(255,255,255,0.03)',
              }}
            >
              <span>{c.email || '—'}</span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {c.projectCount} project{c.projectCount !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: '#6B6B70' }}>
            <Users size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p>No clients found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
