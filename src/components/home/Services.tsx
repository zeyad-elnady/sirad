'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import FadeIn from '@/components/common/FadeIn';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  icon: string;
  image: string;
  accent: string;
}

interface ModalState {
  active: boolean;
  index: number;
}

/* ─────────────────────────────────────────────
   Animation variants
───────────────────────────────────────────── */
const scaleAnimation = {
  initial:  { scale: 0, x: '-50%', y: '-50%' },
  enter:    { scale: 1, x: '-50%', y: '-50%', transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as const } },
  closed:   { scale: 0, x: '-50%', y: '-50%', transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] as const } },
};

/* ─────────────────────────────────────────────
   Service Row
───────────────────────────────────────────── */
function ServiceRow({
  service,
  index,
  setModal,
  isRtl,
}: {
  service: ServiceItem;
  index: number;
  setModal: (s: ModalState) => void;
  isRtl: boolean;
}) {
  return (
    <div
      className="group relative flex w-full cursor-pointer items-center justify-between border-t border-white/[0.07] px-0 py-8 md:py-10 transition-all duration-300 last:border-b hover:px-4 md:hover:px-6"
      onMouseEnter={() => setModal({ active: true, index })}
      onMouseLeave={() => setModal({ active: false, index })}
    >
      {/* Left — number + title */}
      <div className={`flex items-center gap-5 md:gap-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <span className="font-headline text-xs font-bold text-[#B6FF33]/40 tracking-[0.2em] w-6 text-right shrink-0">
          0{index + 1}
        </span>
        <div className={`flex flex-col gap-1 ${isRtl ? 'items-end' : ''}`}>
          <h3 className="font-headline font-bold text-2xl md:text-4xl lg:text-5xl text-[#e5e2e1] group-hover:text-[#B6FF33] transition-colors duration-300 leading-none">
            {service.title}
          </h3>
          <p className="text-[#e5e2e1]/35 text-xs md:text-sm font-body transition-all duration-300 group-hover:text-[#e5e2e1]/60">
            {service.subtitle}
          </p>
        </div>
      </div>

      {/* Right — tag + arrow */}
      <div className={`hidden md:flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <span className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-[#e5e2e1]/25 group-hover:text-[#B6FF33]/70 transition-colors duration-300 border border-white/[0.06] group-hover:border-[#B6FF33]/30 px-3 py-1.5 rounded-full">
          {service.tag}
        </span>
        <span
          className={`material-symbols-outlined text-xl text-[#e5e2e1]/20 group-hover:text-[#B6FF33] transition-all duration-300 ${
            isRtl
              ? 'group-hover:-translate-x-2 rotate-180'
              : 'group-hover:translate-x-2'
          }`}
        >
          arrow_forward
        </span>
      </div>

      {/* Bottom border glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B6FF33]/0 to-transparent group-hover:via-[#B6FF33]/20 transition-all duration-500" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Hover Modal
───────────────────────────────────────────── */
function Modal({
  modal,
  services,
}: {
  modal: ModalState;
  services: ServiceItem[];
}) {
  const { active, index } = modal;
  const modalContainer = useRef<HTMLDivElement>(null);
  const cursor         = useRef<HTMLDivElement>(null);
  const cursorLabel    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const xMoveContainer  = gsap.quickTo(modalContainer.current, 'left', { duration: 0.8, ease: 'power3' });
    const yMoveContainer  = gsap.quickTo(modalContainer.current, 'top',  { duration: 0.8, ease: 'power3' });
    const xMoveCursor     = gsap.quickTo(cursor.current,         'left', { duration: 0.5, ease: 'power3' });
    const yMoveCursor     = gsap.quickTo(cursor.current,         'top',  { duration: 0.5, ease: 'power3' });
    const xMoveCursorLabel = gsap.quickTo(cursorLabel.current,   'left', { duration: 0.45, ease: 'power3' });
    const yMoveCursorLabel = gsap.quickTo(cursorLabel.current,   'top',  { duration: 0.45, ease: 'power3' });

    const onMouseMove = (e: MouseEvent) => {
      const { pageX, pageY } = e;
      xMoveContainer(pageX);  yMoveContainer(pageY);
      xMoveCursor(pageX);     yMoveCursor(pageY);
      xMoveCursorLabel(pageX); yMoveCursorLabel(pageY);
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <>
      {/* Image strip */}
      <motion.div
        ref={modalContainer}
        animate={active ? 'enter' : 'closed'}
        initial="initial"
        variants={scaleAnimation}
        className="pointer-events-none fixed z-50 flex h-72 w-80 items-center justify-center overflow-hidden rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.5)]"
      >
        {/* Scrolling strip */}
        <div
          className="absolute h-full w-full transition-[top] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{ top: `${index * -100}%` }}
        >
          {services.map((service, idx) => (
            <div
              key={service.id}
              className="relative flex h-full w-full items-center justify-center overflow-hidden"
              style={{ backgroundColor: '#0e0e0e' }}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover opacity-80"
                sizes="320px"
              />
              {/* Lime accent overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#B6FF33]/10 to-transparent" />
              {/* Icon overlay */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <span className={`material-symbols-outlined text-5xl text-[#B6FF33] drop-shadow-[0_0_20px_rgba(182,255,51,0.8)]`}>
                  {service.icon}
                </span>
                <span className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-[#B6FF33]/80">
                  {service.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Lime dot cursor */}
      <motion.div
        ref={cursor}
        animate={active ? 'enter' : 'closed'}
        initial="initial"
        variants={scaleAnimation}
        className="pointer-events-none fixed z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#B6FF33] shadow-[0_0_30px_rgba(182,255,51,0.6)]"
      />

      {/* "View" label */}
      <motion.div
        ref={cursorLabel}
        animate={active ? 'enter' : 'closed'}
        initial="initial"
        variants={scaleAnimation}
        className="pointer-events-none fixed z-50 flex h-16 w-16 items-center justify-center rounded-full bg-transparent font-headline text-[10px] font-black uppercase tracking-widest text-[#131313]"
      >
        View
      </motion.div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Main Services Component
───────────────────────────────────────────── */
export default function Services() {
  const t      = useTranslations('Services');
  const locale = useLocale();
  const isRtl  = locale === 'ar';

  const [modal, setModal] = useState<ModalState>({ active: false, index: 0 });

  const servicesList: ServiceItem[] = [
    {
      id: 'webDev',
      title:    t('webDev'),
      subtitle: t('webDevDesc'),
      tag:      t('webDevList1'),
      icon:     'terminal',
      image:    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&q=80',
      accent:   '#B6FF33',
    },
    {
      id: 'socialMedia',
      title:    t('mobileDev'),
      subtitle: t('mobileDevDesc'),
      tag:      t('mobileDevList2'),
      icon:     'photo_camera',
      image:    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=640&q=80',
      accent:   '#B6FF33',
    },
    {
      id: 'mediaProduction',
      title:    t('design'),
      subtitle: t('designDesc'),
      tag:      t('designList2'),
      icon:     'videocam',
      image:    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=640&q=80',
      accent:   '#B6FF33',
    },
    {
      id: 'marketing',
      title:    t('marketing'),
      subtitle: t('marketingDesc'),
      tag:      t('marketingList2'),
      icon:     'rocket_launch',
      image:    'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=640&q=80',
      accent:   '#B6FF33',
    },
  ];

  return (
    <section className="relative bg-[#131313] overflow-hidden">
      {/* Subtle top separator glow */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#B6FF33]/20 to-transparent"
      />

      {/* Radial ambient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(182,255,51,0.04)_0%,transparent_60%)]"
      />

      <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-24 md:py-32 relative z-10">

        {/* ── Section Header ── */}
        <div className={`flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
          <FadeIn direction={isRtl ? 'right' : 'left'} className="max-w-2xl">
            <p className="font-headline text-[10px] uppercase tracking-[0.25em] text-[#B6FF33] font-bold mb-4">
              {t('badge')}
            </p>
            <h2 className="font-headline font-bold text-4xl md:text-6xl tracking-tight text-[#e5e2e1] leading-[1.05]">
              {t('title1')}
              <br />
              <em className="text-[#e5e2e1]/30 not-italic">{t('title2')}</em>
            </h2>
          </FadeIn>

          {/* Hairline */}
          <div className="h-px flex-grow bg-gradient-to-r from-white/5 to-transparent mx-12 hidden lg:block" />

          <FadeIn direction={isRtl ? 'left' : 'right'} delay={0.2} className={`${isRtl ? 'text-left' : 'text-right'} max-w-64`}>
            <p className="text-[#e5e2e1]/40 text-sm leading-relaxed">
              {t('description')}
            </p>
          </FadeIn>
        </div>

        {/* ── Service Rows ── */}
        <FadeIn direction="up" delay={0.15}>
          <div className="relative w-full">
            {servicesList.map((service, idx) => (
              <ServiceRow
                key={service.id}
                service={service}
                index={idx}
                setModal={setModal}
                isRtl={isRtl}
              />
            ))}
          </div>
        </FadeIn>

        {/* ── Bottom CTA strip ── */}
        <FadeIn direction="up" delay={0.3}>
          <div className={`mt-16 flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className="h-px flex-grow bg-white/[0.04]" />
            <a
              href="/services"
              className="group inline-flex items-center gap-2 font-headline text-[10px] uppercase tracking-[0.2em] font-bold text-[#e5e2e1]/30 hover:text-[#B6FF33] transition-colors duration-300"
            >
              {isRtl ? 'اطلع على جميع خدماتنا' : 'Explore all services'}
              <span
                className={`material-symbols-outlined text-sm transition-transform duration-300 ${
                  isRtl
                    ? 'rotate-180 group-hover:-translate-x-1'
                    : 'group-hover:translate-x-1'
                }`}
              >
                arrow_forward
              </span>
            </a>
          </div>
        </FadeIn>
      </div>

      {/* ── Hover modal (portal-like, fixed position) ── */}
      <Modal modal={modal} services={servicesList} />
    </section>
  );
}
