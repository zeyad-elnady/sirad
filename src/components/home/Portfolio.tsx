'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import FadeIn from '@/components/common/FadeIn';
import { useRef } from 'react';

const projects = [
  {
    id: 'neo',
    title: 'NeoVault 2.0',
    category: 'Fintech Ecosystem',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAACTh9thvTtX3XaZzhjTS8V2ySqKhoCt5QcEFJTIEpjtvLMQ7eTCwaCKjLtXBOJ4U1377_ma3ojPAgEm-a7_WZ0YL9njjQzhI4rdDCny41F90H-Cl0Gt8FLyvLk-0hJEMpYeMoX12lQapEfaUY0E43u1aHSxx-aKXgJl30j8SIpoJOgmRkAAdyV98L1NayUEJa9uvGz1hkbQ668BLnPsUFoYgql04HHiLts6YP03_SkQ4DXFGH62yGEdOrtR-dSBtfTOpf-hzFa04',
    tags: ['Strategy', 'Design', 'Development'],
    color: '#B6FF33',
  },
  {
    id: 'aura',
    title: 'Aura Fashion',
    category: 'E-commerce Platform',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBcJJsxvhkBJeUNUy_r9p-InK1ionkLXIF4wfCXNOOsl24KR1jpUqySxQ7ZmTQwjnBJ_D_u3es1Z0v3eUjGcbFI_TV0k4mpKYVoSpLu-5Uxj6MvZZCcFqxyh22z9rwypG9JPG3kiEEzCv2eKqcQW1ECnGScsH7NZjpKlcprapLwS-o6kNNBtXLr0j-FjBzu4gCNtU_gfMpv51e08PIycTnPXzS-OpYcpkq3dB-UYQ8L-UsugAqDfoRVRH4frDjmgUVgRRmTAxNTOao',
    tags: ['Performance', 'UI/UX'],
    color: '#B6FF33',
  },
  {
    id: 'sync',
    title: 'SyncNet Analytics',
    category: 'SaaS Dashboard',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBwuRSSsdzwRvw6R5erv-X7PoI06NygHR6UQ6hceM1iDmmdD-FEZUlDmlg93HcaGmh8meK9UZKhcc0cZbTLFA4KciHXGY1-KtnU20Z8gXS8nJsBhLFoZrdR8_rq3Fk8g3_RqxYhSNg7hV0cLsSRsnl4YfDVNKoJcyhSAK4tW-xPahMIBeQr04SpdGwJACGnQoHRijJJCSrx55w_E-tao4nTD3PYb-lQXAa2q7QOdWo9b2Nrr9B7Jpn4gRsoVcAylkwNIgigxh16CV8',
    tags: ['Data Viz', 'Product'],
    color: '#B6FF33',
  },
];

export default function Portfolio() {
  const t = useTranslations('Portfolio');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const slide = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-32 bg-[#131313] relative overflow-hidden">
      {/* Section Header */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-8 mb-16">
        <div className="flex items-end justify-between gap-8">
          <FadeIn direction="up">
            <h2 className="font-headline font-bold text-4xl md:text-5xl tracking-tight text-[#e5e2e1]">
              {t('title')}
            </h2>
          </FadeIn>
          
          <div className="flex items-center gap-6">
            {/* Scroll Control Arrows */}
            <FadeIn direction="up" delay={0.1}>
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => slide('left')}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#B6FF33]/10 hover:border-[#B6FF33]/30 transition-all text-[#e5e2e1]/60 hover:text-[#B6FF33] group"
                  aria-label="Slide Left"
                >
                  <span className="material-symbols-outlined rtl:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
                    arrow_back
                  </span>
                </button>
                <button
                  onClick={() => slide('right')}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#B6FF33]/10 hover:border-[#B6FF33]/30 transition-all text-[#e5e2e1]/60 hover:text-[#B6FF33] group"
                  aria-label="Slide Right"
                >
                  <span className="material-symbols-outlined rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    arrow_forward
                  </span>
                </button>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <button className="hidden md:flex items-center gap-2 font-headline font-bold uppercase tracking-widest text-xs text-[#B6FF33] hover:gap-4 transition-all duration-300 group">
                {t('viewAll')}
                <span className="material-symbols-outlined text-base rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">arrow_right_alt</span>
              </button>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-12 gap-6 px-6 md:px-8 no-scrollbar mask-gradient-fade snap-x snap-mandatory scroll-smooth"
      >
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px 0px 0px -100px' }}
            transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="group relative min-w-[300px] md:min-w-[580px] h-[440px] overflow-hidden rounded-2xl bg-[#2a2a2a] flex-shrink-0 snap-start cursor-pointer"
          >
            {/* Image */}
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/30 to-transparent" />

            {/* Lime border bottom on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B6FF33] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rtl:origin-right shadow-[0_0_12px_#B6FF33]" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
              <p className="font-label font-bold text-[10px] uppercase tracking-[0.2em] text-[#B6FF33] mb-2">
                {project.category}
              </p>
              <h3 className="font-headline font-bold text-3xl text-[#e5e2e1] mb-4 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 rtl:group-hover:translate-x-0 transition-transform duration-500">
                {project.title}
              </h3>
              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                {project.tags.map((tag) => (
                  <span key={tag} className="font-label text-[11px] text-[#e5e2e1]/50 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Arrow button top-right */}
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              className="absolute top-8 right-8 rtl:left-8 rtl:right-auto w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-500 bg-black/20"
            >
              <span className="material-symbols-outlined text-white text-base">arrow_outward</span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
