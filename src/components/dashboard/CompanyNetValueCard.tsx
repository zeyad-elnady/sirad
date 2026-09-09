'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  Pencil,
  Check,
  X,
  Sparkles,
  ArrowUpRight,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import FormattedNumberInput from '@/components/ui/FormattedNumberInput';
import { useDashboardLang } from '@/context/DashboardLanguageContext';
import { useDashboardDepartment } from '@/context/DashboardDepartmentContext';

interface CompanySettingProps {
  initialValue: number;
  initialNotes?: string | null;
  lastUpdated?: string | null;
  updatedBy?: string | null;
  canEdit?: boolean;
  variant?: 'banner' | 'compact' | 'stat';
}

export default function CompanyNetValueCard({
  initialValue = 0,
  initialNotes = null,
  lastUpdated = null,
  updatedBy = null,
  canEdit = true,
  variant = 'banner',
}: CompanySettingProps) {
  const router = useRouter();
  const { isRtl, formatCurrency } = useDashboardLang();
  const { department } = useDashboardDepartment();
  const isTech = department === 'TECH';
  const accentColor = isTech ? '#B6FF33' : '#a78bfa';

  const [value, setValue] = useState<number>(initialValue);
  const [notes, setNotes] = useState<string>(initialNotes || '');
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string>(initialValue ? initialValue.toString() : '0');
  const [inputNotes, setInputNotes] = useState<string>(initialNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStartEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!canEdit) return;
    setInputValue(value.toString());
    setInputNotes(notes);
    setErrorMsg('');
    setIsEditing(true);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsEditing(false);
    setErrorMsg('');
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsSaving(true);
    setErrorMsg('');

    try {
      const cleanVal = parseFloat(inputValue.toString().replace(/,/g, '').trim()) || 0;
      const res = await fetch('/api/dashboard/company-value', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyNetValue: cleanVal,
          notes: inputNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to save value');
        return;
      }

      setValue(data.setting.companyNetValue);
      setNotes(data.setting.notes || '');
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      router.refresh();
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (variant === 'stat') {
    return (
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        onClick={() => canEdit && !isEditing && handleStartEdit()}
        className="rounded-2xl p-5 backdrop-blur-xl border transition-all duration-300 relative overflow-hidden group cursor-pointer bg-[#18181a]/90 border-[#B6FF33]/40 shadow-[0_0_30px_rgba(182,255,51,0.12)] col-span-2 sm:col-span-1"
      >
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-xl pointer-events-none bg-[#B6FF33]/25 opacity-100" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B6FF33] animate-pulse" />
            <span className="font-headline text-[10px] uppercase tracking-[0.14em] text-[#B6FF33] font-bold truncate">
              {isRtl ? 'رصيد البنك الفعلي' : 'Company Net Value'}
            </span>
          </div>
          <span className="p-1.5 rounded-lg border bg-[#B6FF33]/15 border-[#B6FF33]/40 text-[#B6FF33]">
            <Landmark size={18} />
          </span>
        </div>

        <div className="font-headline text-2xl font-bold tracking-tight text-[#B6FF33]">
          {formatCurrency(value)}
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06] text-[10px] text-[#e5e2e1]/60">
          <span>{isRtl ? 'الرصيد بالبنك حالياً' : 'Current bank funds'}</span>
          {canEdit && (
            <span className="inline-flex items-center gap-1 text-[#B6FF33] font-semibold hover:underline">
              <Pencil size={10} /> {isRtl ? 'تعديل' : 'Type value'}
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#18181b]/95 via-[#131315]/90 to-[#0e0e10]/95 border border-white/[0.1] p-6 shadow-2xl backdrop-blur-2xl overflow-hidden transition-all duration-300">
      {/* Ambient background glow */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{
          background: isTech
            ? 'radial-gradient(circle, rgba(182,255,51,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-40"
        style={{
          background: isTech
            ? 'radial-gradient(circle, rgba(182,255,51,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10">
        {/* Header Badge & Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
              style={{
                background: isTech ? 'rgba(182,255,51,0.12)' : 'rgba(167,139,250,0.12)',
                borderColor: isTech ? 'rgba(182,255,51,0.3)' : 'rgba(167,139,250,0.3)',
                color: isTech ? '#B6FF33' : '#a78bfa',
              }}
            >
              <Landmark size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B6FF33] animate-pulse" />
                <span
                  className="font-headline text-[10px] uppercase tracking-[0.16em] font-bold"
                  style={{ color: accentColor }}
                >
                  {isRtl ? 'الخزينة والحساب البنكي' : 'Company Treasury & Live Bank Balance'}
                </span>
                {saveSuccess && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#B6FF33]/20 text-[#B6FF33] border border-[#B6FF33]/30 font-semibold animate-fade-in">
                    <Check size={10} /> {isRtl ? 'تم الحفظ بنجاح' : 'Saved!'}
                  </span>
                )}
              </div>
              <h2 className="font-headline text-lg sm:text-xl font-bold text-[#e5e2e1] mt-0.5">
                {isRtl ? 'صافي قيمة الشركة (رصيد الحساب البنكي)' : 'Company Net Value'}
              </h2>
            </div>
          </div>

          {canEdit && !isEditing && (
            <button
              onClick={handleStartEdit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 cursor-pointer shadow-lg"
              style={{
                background: isTech
                  ? 'linear-gradient(135deg, #B6FF33, #96da00)'
                  : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                color: isTech ? '#121f00' : '#ffffff',
              }}
            >
              <Pencil size={13} />
              <span>{isRtl ? 'تعديل الرصيد بالبنك' : 'Type / Edit Bank Value'}</span>
            </button>
          )}
        </div>

        {/* Content: Display Mode vs Inline Edit Mode */}
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="display-mode"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-7">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    className="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
                    style={{
                      color: accentColor,
                      textShadow: isTech ? '0 0 35px rgba(182,255,51,0.25)' : '0 0 35px rgba(167,139,250,0.25)',
                    }}
                  >
                    {formatCurrency(value)}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-[#e5e2e1]/50 font-semibold">
                    EGP Available Cash
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#e5e2e1]/70 mt-2 font-body max-w-xl">
                  {isRtl
                    ? 'هذا هو المبلغ الفعلي المتوفر حالياً في الحساب البنكي للشركة (السيولة النقدية الحقيقية الجاهزة للاستخدام).'
                    : 'This represents what the company has right now in the bank account (actual liquid cash available in the treasury).'}
                </p>

                {notes && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#e5e2e1]/80">
                    <span className="text-[#e5e2e1]/40 font-semibold">{isRtl ? 'ملاحظة:' : 'Note:'}</span>
                    <span>{notes}</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-3 justify-end items-start md:items-end">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] w-full max-w-xs">
                  <div className="flex items-center gap-2 text-[11px] text-[#e5e2e1]/50 mb-1">
                    <ShieldCheck size={13} className="text-[#B6FF33]" />
                    <span className="font-semibold uppercase tracking-wider">
                      {isRtl ? 'حالة السيولة البنكية' : 'Treasury Status'}
                    </span>
                  </div>
                  <div className="text-xs text-[#e5e2e1]/80 font-medium">
                    {value > 0
                      ? isRtl
                        ? 'الرصيد إيجابي ومتاح للعمليات التشغيلية'
                        : 'Active treasury reserves healthy'
                      : isRtl
                      ? 'لم يتم تحديد رصيد الحساب البنكي بعد'
                      : 'Bank reserve not entered yet'}
                  </div>
                  {(lastUpdated || updatedBy) && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#e5e2e1]/40 mt-2 pt-2 border-t border-white/[0.04]">
                      <Clock size={10} />
                      <span>
                        {lastUpdated ? new Date(lastUpdated).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US') : ''}
                        {updatedBy ? ` • ${updatedBy}` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="edit-mode"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onSubmit={handleSave}
              className="p-5 rounded-xl bg-[#121214]/90 border border-white/[0.12] shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Landmark size={18} style={{ color: accentColor }} />
                  <span className="font-headline text-sm font-bold text-[#e5e2e1]">
                    {isRtl ? 'كتابة رصيد الحساب البنكي الحالي' : 'Type Current Bank Account Value'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-[#e5e2e1]/50 hover:text-[#e5e2e1] transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {errorMsg && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-7">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#e5e2e1]/70 mb-1.5">
                    {isRtl ? 'المبلغ الفعلي بالبنك (جنيه مصري) *' : 'Current Bank Balance (EGP) *'}
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      autoFocus
                      value={inputValue}
                      onChangeValue={(raw) => setInputValue(raw)}
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingRight: isRtl ? '16px' : '56px',
                        paddingLeft: isRtl ? '56px' : '16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: `1.5px solid ${isTech ? 'rgba(182,255,51,0.4)' : 'rgba(167,139,250,0.4)'}`,
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '18px',
                        fontWeight: 700,
                        fontFamily: '"Space Grotesk", sans-serif',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <span
                      className="absolute top-1/2 -translate-y-1/2 text-xs font-bold pointer-events-none"
                      style={{
                        right: isRtl ? 'auto' : '16px',
                        left: isRtl ? '16px' : 'auto',
                        color: accentColor,
                      }}
                    >
                      EGP
                    </span>
                  </div>
                  <p className="text-[11px] text-[#e5e2e1]/50 mt-1">
                    {isRtl
                      ? 'أدخل الرقم كما هو في كشف حساب البنك الحالي (يتم تنسيق الفواصل آلياً).'
                      : 'Type the exact figure as shown on your online bank statement (commas format automatically).'}
                  </p>
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#e5e2e1]/70 mb-1.5">
                    {isRtl ? 'ملاحظات (اختياري)' : 'Notes / Bank details (optional)'}
                  </label>
                  <input
                    type="text"
                    value={inputNotes}
                    onChange={(e) => setInputNotes(e.target.value)}
                    placeholder={isRtl ? 'مثال: بنك مصر + CIB' : 'e.g. CIB + Banque Misr combined'}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      color: '#e5e2e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#e5e2e1]/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all active:scale-95 cursor-pointer shadow-lg disabled:opacity-50"
                  style={{
                    background: isTech
                      ? 'linear-gradient(135deg, #B6FF33, #96da00)'
                      : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                    color: isTech ? '#121f00' : '#ffffff',
                  }}
                >
                  <Check size={14} />
                  <span>{isSaving ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ الرصيد الجديد' : 'Save Bank Balance')}</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
