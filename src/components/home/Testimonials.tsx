'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import FadeIn from '@/components/common/FadeIn';

export default function Testimonials() {
  const t = useTranslations('Testimonials');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setIsRTL(document.documentElement.dir === 'rtl');
  }, []);

  const testimonials = [
    { id: 1, name: t('client1'), role: t('role1'), review: t('review1') },
    { id: 2, name: t('client2'), role: t('role2'), review: t('review2') },
    { id: 3, name: t('client3'), role: t('role3'), review: t('review3') },
    { id: 4, name: t('client4'), role: t('role4'), review: t('review4') },
    { id: 5, name: t('client5'), role: t('role5'), review: t('review5') },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth > 768 ? 480 : clientWidth * 0.85;
      
      let left = direction === 'left' ? -scrollAmount : scrollAmount;
      if (isRTL) left = -left; // Invert scroll for RTL environments
      
      scrollRef.current.scrollBy({ left, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B6FF33]/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 md:px-8 relative z-10 w-full">
        {/* Header with Navigation Arrows */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-3xl">
            <FadeIn direction="up">
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-[#B6FF33]/20 bg-[#B6FF33]/5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF33] animate-ping" />
                <span className="font-headline text-[10px] uppercase tracking-[0.15em] text-[#B6FF33] font-bold">
                  {t('badge')}
                </span>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <h2 className="font-headline font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#e5e2e1]">
                {t('title')}
              </h2>
            </FadeIn>
          </div>
          
          <div className="hidden md:flex gap-4">
            <FadeIn direction="up" delay={0.2}>
              <button 
                onClick={() => scroll('left')}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-[#e5e2e1] hover:bg-[#B6FF33] hover:border-[#B6FF33] hover:text-[#121f00] transition-all duration-300"
              >
                <span className="material-symbols-outlined rtl:rotate-180">arrow_back</span>
              </button>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <button 
                onClick={() => scroll('right')}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-[#e5e2e1] hover:bg-[#B6FF33] hover:border-[#B6FF33] hover:text-[#121f00] transition-all duration-300"
              >
                <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
              </button>
            </FadeIn>
          </div>
        </div>

        {/* Testimonial Cards Carousel */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-8 pb-12 no-scrollbar scroll-smooth"
        >
          {testimonials.map((testimonial, idx) => (
            <div key={testimonial.id} className="snap-start shrink-0 w-[85vw] sm:w-[400px] lg:w-[480px]">
              <FadeIn direction="up" delay={0.2 + (idx % 3) * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="group h-[380px] flex flex-col p-8 md:p-10 rounded-2xl bg-[#131313] border border-white/5 hover:border-[#B6FF33]/30 transition-all duration-500 shadow-[0_0_0_transparent] hover:shadow-[0_20px_40px_-20px_rgba(182,255,51,0.15)] relative overflow-hidden"
                >
                  {/* Quote Icon SVG Watermark */}
                  <div className="absolute -top-4 -right-4 rtl:-right-auto rtl:-left-4 text-[#B6FF33] opacity-5 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12">
                    <svg
                      width="120"
                      height="120"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M14.017 21L16.417 14C16.892 12.574 17 11.236 17 10C17 7.239 15.267 5 12 5C11.531 5 11.082 5.093 10.662 5.275C11.391 6.137 11.854 7.25 11.854 8.444C11.854 10.96 9.814 13 7.298 13C6.31 13 5.4 12.68 4.654 12.148C4.223 12.87 4 13.722 4 14.629C4 17.59 5.866 20 8.5 20H9.5L8.5 21H14.017ZM18.5 21L21.417 14C21.892 12.574 22 11.236 22 10C22 7.239 20.267 5 17 5C16.531 5 16.082 5.093 15.662 5.275C16.391 6.137 16.854 7.25 16.854 8.444C16.854 10.96 14.814 13 12.298 13C11.31 13 10.4 12.68 9.654 12.148C9.223 12.87 9 13.722 9 14.629C9 17.59 10.866 20 13.5 20H14.5L13.5 21H18.5Z" />
                    </svg>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[#B6FF33] text-lg selection:bg-transparent">
                        star
                      </span>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="font-body text-[#e5e2e1]/80 text-lg leading-relaxed flex-grow relative z-10 font-light overflow-y-auto no-scrollbar">
                    "{testimonial.review}"
                  </p>

                  {/* Client Profile */}
                  <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4 relative z-10 shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#B6FF33] flex items-center justify-center shrink-0 text-[#121f00] font-headline font-bold text-xl uppercase">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <h4 className="font-headline font-bold text-[#e5e2e1] text-base truncate">
                        {testimonial.name}
                      </h4>
                      <p className="font-label text-[11px] text-[#e5e2e1]/40 uppercase tracking-widest mt-0.5 truncate">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
