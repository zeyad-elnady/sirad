'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { GravityStarsBackground } from '@/components/animate-ui/components/backgrounds/gravity-stars';

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
      className="relative min-h-[100svh] flex flex-col justify-center px-6 md:px-16 lg:px-24 overflow-hidden pt-24 lg:pt-32 pb-10 lg:pb-16"
    >
      {/* Interactive Star Background */}
      <GravityStarsBackground 
        className="absolute inset-0 z-0 opacity-80" 
        starsInteraction={true}
        gravityStrength={100}
        movementSpeed={0.12}
      />

      <div className="max-w-screen-xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center justify-center relative z-10 w-full pointer-events-none mt-8 lg:mt-0">
        {/* ---- Text Column ---- */}
        <motion.div
          style={{ y: yText, opacity }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 lg:space-y-8 order-last lg:order-none text-center lg:text-left flex flex-col items-center lg:items-start w-full max-w-[100vw] px-2 sm:px-0"
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
            className="font-headline font-bold text-[2.25rem] sm:text-4xl leading-[1.1] md:text-6xl lg:text-[5.5rem] lg:leading-[1] tracking-tighter text-[#e5e2e1]"
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
            className="text-[#e5e2e1]/60 text-xs sm:text-sm lg:text-xl max-w-[90%] sm:max-w-lg font-light leading-relaxed font-body"
          >
            {t('description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-1 lg:pt-2 w-full sm:w-auto">
            <Link href="/contact" className="group relative overflow-hidden bg-[#B6FF33] text-[#121f00] px-5 py-4 w-full sm:w-auto lg:px-10 lg:py-5 rounded-xl font-headline font-bold uppercase tracking-widest text-[9px] lg:text-xs transition-all duration-500 hover:shadow-[0_0_35px_rgba(182,255,51,0.55)] active:scale-95 flex items-center justify-center gap-2 pointer-events-auto">
              <span className="relative z-10">{t('getQuote')}</span>
              <span className="material-symbols-outlined text-sm lg:text-base relative z-10 group-hover:translate-x-1 rtl:group-hover:translate-x-0 rtl:group-hover:-translate-x-1 transition-transform">
                arrow_forward
              </span>
              {/* Shimmer */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
            </Link>

            <Link href="/work" className="bg-white/5 backdrop-blur-md text-[#e5e2e1] px-5 py-4 w-full sm:w-auto lg:px-10 lg:py-5 rounded-xl font-headline font-bold uppercase tracking-widest text-[9px] lg:text-xs hover:bg-white/10 transition-all duration-500 flex items-center justify-center border border-white/10 pointer-events-auto">
              {t('portfolio')}
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center lg:justify-start gap-4 lg:gap-8 pt-2 lg:pt-4 border-t border-white/5 w-full"
          >
            {[
              { value: '150+', label: 'Projects' },
              { value: '98%', label: 'Satisfaction' },
              { value: '5yr', label: 'Expertise' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-0.5 lg:space-y-1 text-center lg:text-left">
                <div className="font-headline font-bold text-lg lg:text-2xl text-[#B6FF33]">{stat.value}</div>
                <div className="text-[8px] lg:text-[10px] uppercase tracking-widest text-[#e5e2e1]/40 font-label">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ---- Illustration Column ---- */}
        <div className="relative block order-first lg:order-none w-full max-w-[150px] sm:max-w-[200px] lg:max-w-none mx-auto mt-2 lg:mt-0">
          <div className="relative w-full aspect-square flex items-center justify-center">
            {/* Concentric spinning rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[88%] h-[88%] border-2 border-[#B6FF33]/10"
              style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[65%] h-[65%] border border-white/5"
              style={{ borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[42%] h-[42%] border border-[#B6FF33]/20"
              style={{ borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%' }}
            />

            {/* Main Image */}
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.5 } }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
              className="absolute w-[145%] h-[145%] z-10 cursor-pointer pointer-events-auto"
            >
              <Image
                src="/photos/visual-elements-02.png"
                alt="Main Visual"
                fill
                className="object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
                priority
              />
            </motion.div>

            {/* Floating badge — top right */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              className="hidden lg:block absolute top-2 right-[-20px] lg:top-12 lg:right-12 glass-card p-2 lg:p-3.5 rounded-xl shadow-[0_0_20px_rgba(182,255,51,0.15)]"
            >
              <span className="material-symbols-outlined text-[#B6FF33] text-sm lg:text-base">insights</span>
            </motion.div>

            {/* Floating badge — bottom left */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="hidden lg:flex absolute bottom-6 left-[-20px] lg:bottom-16 lg:left-8 glass-card px-3 py-2 lg:px-4 lg:py-3 rounded-lg flex items-center gap-1.5 lg:gap-2 shadow-[0_0_20px_rgba(182,255,51,0.1)]"
            >
              <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#B6FF33] animate-ping" />
              <span className="font-headline text-[8px] lg:text-[10px] uppercase tracking-widest text-[#e5e2e1]/70">Live Analytics</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
