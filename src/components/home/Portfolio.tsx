'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import FadeIn from '@/components/common/FadeIn';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface TeamMember {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  category: string;
  categoryAr: string;
  image: string;
  tags: string[];
  tagsAr: string[];
  link: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 'flualy',
    name: 'Flualy Cual',
    nameAr: 'فلوالي كوال',
    role: 'Founder & CEO',
    roleAr: 'المؤسس والمدير التنفيذي',
    category: 'Executive Leadership',
    categoryAr: 'القيادة التنفيذية',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    tags: ['Vision', 'Creative Direction', 'Brand Strategy'],
    tagsAr: ['الرؤية', 'الإخراج الإبداعي', 'استراتيجية العلامة'],
    link: '/about',
  },
  {
    id: 'adrian',
    name: 'Adrian Paul',
    nameAr: 'أدريان بول',
    role: 'COO & Co-Founder',
    roleAr: 'المدير التنفيذي للعمليات والشريك المؤسس',
    category: 'Operations & Growth',
    categoryAr: 'العمليات والنمو',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
    tags: ['Operations', 'Client Success', 'Scaling'],
    tagsAr: ['إدارة العمليات', 'نجاح العملاء', 'التوسع'],
    link: '/about',
  },
  {
    id: 'naymur',
    name: 'Naymur Rahman',
    nameAr: 'نعيم الرحمن',
    role: 'CTO & Co-Founder',
    roleAr: 'الرئيس التنفيذي للتكنولوجيا والشريك المؤسس',
    category: 'Technology & AI',
    categoryAr: 'التكنولوجيا والذكاء الاصطناعي',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
    tags: ['Architecture', 'AI Systems', 'Full Stack'],
    tagsAr: ['هندسة البرمجيات', 'نظم الذكاء الاصطناعي', 'التطوير الشامل'],
    link: '/about',
  },
];

export default function Portfolio() {
  const t = useTranslations('Portfolio');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className="py-28 md:py-36 relative overflow-hidden" id="team" style={{ backgroundColor: 'var(--sirad-bg)' }}>
      {/* Background kinetic ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[350px] blur-[140px] pointer-events-none rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--sirad-lime) 5%, transparent)' }} />

      {/* Section Header */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-8 mb-12 md:mb-16">
        <FadeIn direction="up">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--sirad-lime)', boxShadow: '0 0 8px var(--sirad-lime)' }} />
            <span className="font-headline font-bold text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--sirad-lime)' }}>
              {t('badge')}
            </span>
          </div>
          <h2 className="font-headline font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight" style={{ color: 'var(--sirad-text)' }}>
            {t('title')}
          </h2>
        </FadeIn>
      </div>

      {/* Tailwind Image Accordion */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-8">
        <div className="group/accordion flex flex-col md:flex-row gap-4 h-auto md:h-[520px] w-full">
          {teamMembers.map((member, idx) => {
            const isActive = activeIndex === idx;

            return (
              <article
                key={member.id}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  'group/article relative overflow-hidden rounded-2xl border transition-all duration-700 ease-[cubic-bezier(.25,1,.5,1)] cursor-pointer',
                  'w-full h-80 md:h-full',
                  isActive
                    ? 'md:flex-[3.2] border-[var(--sirad-lime)]/50 shadow-[0_0_35px_rgba(182,255,51,0.12)]'
                    : 'md:flex-[1] hover:border-[var(--sirad-border-hover)]'
                )}
                style={{
                  borderColor: isActive ? 'var(--sirad-border-lime)' : 'var(--sirad-border)',
                }}
              >
                {/* Background Image with smooth zoom on active */}
                <Image
                  src={member.image}
                  alt={isAr ? member.nameAr : member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={cn(
                    'object-cover transition-all duration-1000 ease-out',
                    isActive
                      ? 'scale-105 grayscale-0 opacity-80'
                      : 'scale-100 grayscale opacity-40 group-hover/article:grayscale-0 group-hover/article:opacity-60'
                  )}
                  priority={idx === 0}
                />

                {/* Dark Gradient Overlay for optimal contrast */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to top, var(--sirad-bg-deep), color-mix(in srgb, var(--sirad-bg-deep) 50%, transparent), transparent)` }} />

                {/* Subtle frosted glass blur overlay when sibling is active */}
                <div
                  className={cn(
                    'absolute inset-0 transition-opacity duration-500 pointer-events-none',
                    !isActive
                      ? 'bg-black/35 backdrop-blur-[2px] opacity-100'
                      : 'opacity-0'
                  )}
                />

                {/* Kinetic Lime Accent line at bottom */}
                <div
                  className={cn(
                    'absolute bottom-0 left-0 right-0 h-[3px] bg-[#B6FF33] transition-all duration-500 origin-left rtl:origin-right shadow-[0_0_15px_#B6FF33]',
                    isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                  )}
                />

                {/* Top-Right Arrow Outward Button */}
                <div className="absolute top-6 right-6 rtl:left-6 rtl:right-auto z-20">
                  <div
                    className={cn(
                      'w-11 h-11 rounded-full border flex items-center justify-center backdrop-blur-md transition-all duration-500',
                      isActive
                        ? 'rotate-45'
                        : 'rotate-0'
                    )}
                    style={{
                      backgroundColor: isActive ? 'var(--sirad-lime)' : 'rgba(0,0,0,0.4)',
                      color: isActive ? 'var(--sirad-lime-text)' : 'rgba(255,255,255,0.7)',
                      borderColor: isActive ? 'var(--sirad-lime)' : 'var(--sirad-border)',
                      boxShadow: isActive ? '0 0 20px var(--sirad-lime-glow)' : 'none',
                    }}
                  >
                    <span className="material-symbols-outlined text-lg">arrow_outward</span>
                  </div>
                </div>

                {/* Bottom Content Info */}
                <Link
                  href={member.link}
                  className="absolute inset-0 z-10 p-6 md:p-8 flex flex-col justify-end text-left rtl:text-right"
                >
                  <p className="font-headline font-bold text-[10px] md:text-xs uppercase tracking-[0.25em] mb-1" style={{ color: 'var(--sirad-lime)' }}>
                    {isAr ? member.categoryAr : member.category}
                  </p>

                  <h3
                    className={cn(
                      'font-headline font-bold text-2xl md:text-3xl lg:text-4xl mb-1 transition-transform duration-500',
                      isActive ? 'translate-x-0' : 'md:whitespace-nowrap md:truncate'
                    )}
                    style={{ color: 'var(--sirad-text)' }}
                  >
                    {isAr ? member.nameAr : member.name}
                  </h3>

                  <p className="font-body text-xs md:text-sm mb-3" style={{ color: 'var(--sirad-text-muted)' }}>
                    {isAr ? member.roleAr : member.role}
                  </p>

                  {/* Tags badge row (revealed prominently when active) */}
                  <div
                    className={cn(
                      'flex flex-wrap items-center gap-2 transition-all duration-500',
                      isActive
                        ? 'opacity-100 max-h-16 translate-y-0'
                        : 'md:opacity-0 md:max-h-0 md:overflow-hidden md:translate-y-2'
                    )}
                  >
                    {(isAr ? member.tagsAr : member.tags).map((tag) => (
                      <span
                        key={tag}
                        className="font-label text-[11px] backdrop-blur-sm rounded-full px-3 py-1 uppercase tracking-wider"
                        style={{ color: 'var(--sirad-text-muted)', backgroundColor: 'color-mix(in srgb, var(--sirad-text) 10%, transparent)', border: '1px solid var(--sirad-border)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
