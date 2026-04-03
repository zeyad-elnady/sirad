'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
} as const;

const ROTATE_INTERVAL = 3000;

export default function HeroSection() {
  const t = useTranslations('Hero');
  const ref = useRef<HTMLElement>(null);

  // Rotating services
  const services = [
    t('service_mobile'),
    t('service_website'),
    t('service_marketing'),
    t('service_social'),
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const advance = useCallback(() => {
    setActiveIndex((i) => (i + 1) % services.length);
  }, [services.length]);

  useEffect(() => {
    const id = setInterval(advance, ROTATE_INTERVAL);
    return () => clearInterval(id);
  }, [advance]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const yText   = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center px-6 md:px-16 lg:px-24 overflow-hidden pt-24"
    >


      <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
        {/* ---- Text Column ---- */}
        <motion.div
          style={{ y: yText, opacity }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B6FF33]/20 bg-[#B6FF33]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF33] animate-ping" />
            <span className="font-headline text-[10px] uppercase tracking-[0.15em] text-[#B6FF33] font-bold">
              {t('badge')}
            </span>
          </motion.div>

          {/* Headline with rotating service */}
          <motion.h1
            variants={itemVariants}
            className="font-headline font-bold text-5xl md:text-7xl lg:text-[5.5rem] leading-[1] tracking-tighter text-[#e5e2e1]"
          >
            {t('titlePrefix')}
            <br />
            <span className="relative inline-block h-[1.15em] overflow-hidden align-bottom min-w-[3ch]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={services[activeIndex]}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-[#B6FF33] glow-text whitespace-nowrap"
                >
                  {services[activeIndex]}
                </motion.span>
              </AnimatePresence>
              {/* Animated underline bar */}
              <motion.span
                className="absolute bottom-0 left-0 h-[3px] bg-[#B6FF33]/40 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: ROTATE_INTERVAL / 1000, ease: 'linear' }}
                key={`bar-${activeIndex}`}
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-[#e5e2e1]/60 text-lg md:text-xl max-w-lg font-light leading-relaxed font-body"
          >
            {t('description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-2">
            <button className="group relative overflow-hidden bg-[#B6FF33] text-[#121f00] px-10 py-5 rounded-xl font-headline font-bold uppercase tracking-widest text-xs transition-all duration-500 hover:shadow-[0_0_35px_rgba(182,255,51,0.55)] active:scale-95 flex items-center justify-center gap-2">
              <span className="relative z-10">{t('getQuote')}</span>
              <span className="material-symbols-outlined text-base relative z-10 group-hover:translate-x-1 rtl:group-hover:translate-x-0 rtl:group-hover:-translate-x-1 transition-transform">
                arrow_forward
              </span>
              {/* Shimmer */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
            </button>

            <button className="bg-white/5 backdrop-blur-md text-[#e5e2e1] px-10 py-5 rounded-xl font-headline font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all duration-500 flex items-center justify-center border border-white/10">
              {t('portfolio')}
            </button>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            variants={itemVariants}
            className="flex gap-8 pt-4 border-t border-white/5"
          >
            {[
              { value: '150+', label: 'Projects Shipped' },
              { value: '98%', label: 'Client Satisfaction' },
              { value: '5yr', label: 'Industry Expertise' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="font-headline font-bold text-2xl text-[#B6FF33]">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#e5e2e1]/40 font-label">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ---- Illustration Column ---- */}
        <div className="relative hidden lg:block">
          <div className="relative w-full aspect-square flex items-center justify-center">
            {/* Concentric spinning rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[88%] h-[88%] rounded-full border-2 border-[#B6FF33]/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[65%] h-[65%] rounded-full border border-white/5"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[42%] h-[42%] rounded-full border border-[#B6FF33]/20"
            />

            {/* Main glass card */}
            <motion.div
              initial={{ rotate: 6, y: 60, opacity: 0 }}
              animate={{ rotate: 6, y: 0, opacity: 1 }}
              whileHover={{ rotate: 0, scale: 1.04, transition: { duration: 0.5 } }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
              className="glass-card w-64 h-80 rounded-2xl flex flex-col items-center justify-center p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] z-10 cursor-pointer"
            >
              <span className="material-symbols-outlined text-6xl text-[#B6FF33] mb-6">hub</span>
              <div className="space-y-3 text-center w-full">
                <div className="h-1.5 w-24 bg-[#B6FF33]/20 rounded-full mx-auto overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '66%' }}
                    transition={{ duration: 2, delay: 1.5, ease: 'easeOut' }}
                    className="h-full bg-[#B6FF33] rounded-full shadow-[0_0_8px_#B6FF33]"
                  />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[#B6FF33] font-bold font-headline">Integration Alpha</p>
                <div className="h-1 w-16 bg-white/5 rounded-full mx-auto" />
              </div>
            </motion.div>

            {/* Floating badge — top right */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-12 right-12 glass-card p-3.5 rounded-xl shadow-[0_0_20px_rgba(182,255,51,0.15)]"
            >
              <span className="material-symbols-outlined text-[#B6FF33]">insights</span>
            </motion.div>

            {/* Floating badge — bottom left */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-16 left-8 glass-card px-4 py-3 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(182,255,51,0.1)]"
            >
              <span className="w-2 h-2 rounded-full bg-[#B6FF33] animate-ping" />
              <span className="font-headline text-[10px] uppercase tracking-widest text-[#e5e2e1]/70">Live Analytics</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
