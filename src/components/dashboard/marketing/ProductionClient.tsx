'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '@prisma/client';
import { Clapperboard, Plus, Camera, DollarSign, X } from 'lucide-react';
import Link from 'next/link';
import FormattedNumberInput from '@/components/ui/FormattedNumberInput';

interface ProductionItem {
  id: string;
  title: string;
  clientName: string;
  status: string;
  equipmentType: string | null;
  rentalCost: number;
  notes: string | null;
  createdAt: string;
}

interface ProjectOption {
  id: string;
  title: string;
}

interface Props {
  role: UserRole;
  projects: ProductionItem[];
  allMarketingProjects: ProjectOption[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(amount);
}

export default function ProductionClient({ role, projects, allMarketingProjects }: Props) {
  const router = useRouter();
  const accentColor = '#7C3AED';
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(allMarketingProjects[0]?.id || '');
  const [equipmentType, setEquipmentType] = useState('');
  const [rentalCost, setRentalCost] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalRentals = projects.reduce((acc, curr) => acc + curr.rentalCost, 0);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProjectId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/dashboard/production-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          equipmentType,
          rentalCost: parseFloat(rentalCost) || 0,
          notes,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setEquipmentType('');
        setRentalCost('');
        setNotes('');
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif' }}>
            Production & Shooting Equipment
          </h1>
          <p style={{ fontSize: '13px', color: '#6B6B70', marginTop: '4px' }}>
            Manage video shoots, photography equipment rentals, and crew logistics (Marketing Workspace)
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}90)`,
            color: '#fff',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: `0 0 20px ${accentColor}20`,
          }}
        >
          <Plus size={16} /> Log Equipment Rental
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Total Equipment Rental Cost
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#7C3AED' }}>
            {formatCurrency(totalRentals)}
          </div>
        </div>
        <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(18,18,20,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B6B70', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Production Projects
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#E8E4E0' }}>
            {projects.length}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {projects.map((p) => (
          <div
            key={p.id}
            style={{
              padding: '24px',
              borderRadius: '14px',
              background: 'rgba(18,18,20,0.6)',
              border: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <Link href={`/dashboard/projects/${p.id}`} style={{ color: '#E8E4E0', textDecoration: 'none', fontSize: '16px', fontWeight: 600 }}>
                    {p.title}
                  </Link>
                  <div style={{ fontSize: '12px', color: '#6B6B70', marginTop: '2px' }}>{p.clientName}</div>
                </div>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(124,58,237,0.15)', color: '#7C3AED', fontWeight: 500 }}>
                  {p.status}
                </span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Camera size={14} className="text-purple-400" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#E8E4E0' }}>
                    {p.equipmentType || 'No equipment logged'}
                  </span>
                </div>
                {p.notes && <p style={{ fontSize: '11px', color: '#8B8B90', margin: 0 }}>{p.notes}</p>}
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#6B6B70' }}>Rental Cost:</span>
              <span style={{ fontSize: '15px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#F59E0B' }}>
                {formatCurrency(p.rentalCost)}
              </span>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: '#6B6B70' }}>
            <Clapperboard size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p>No production projects found. Create a project with type &apos;Production&apos; to track equipment.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.form
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSave}
              style={{
                background: '#121214',
                borderRadius: '16px',
                padding: '28px',
                width: '100%',
                maxWidth: '460px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}>Log Equipment Rental</h2>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#6B6B70', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', marginBottom: '6px' }}>Project</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    required
                  >
                    {allMarketingProjects.map((p) => (
                      <option key={p.id} value={p.id} style={{ background: '#121214' }}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', marginBottom: '6px' }}>Equipment Type / Gear</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g. Sony FX3, Aputure 600d, Wireless Mics, DJI Ronin"
                    value={equipmentType}
                    onChange={(e) => setEquipmentType(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', marginBottom: '6px' }}>Rental Cost (EGP)</label>
                  <FormattedNumberInput
                    style={inputStyle}
                    placeholder="0"
                    value={rentalCost}
                    onChangeValue={(val) => setRentalCost(val)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#6B6B70', textTransform: 'uppercase', marginBottom: '6px' }}>Notes</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                    placeholder="Rental house name, return date, shoot details..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: accentColor,
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '8px',
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Equipment'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
