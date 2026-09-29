'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import dynamic from 'next/dynamic';

const AuroraBackground = dynamic(
  () => import('@/components/animate-ui/components/backgrounds/aurora').then((mod) => mod.AuroraBackground),
  { ssr: false }
);

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
      style={{ backgroundColor: 'var(--sirad-bg)' }}
    >
      <AuroraBackground className="absolute inset-0 z-0 opacity-60 pointer-events-none" />

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
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ border: '1px solid color-mix(in srgb, var(--sirad-lime) 20%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sirad-lime) 5%, transparent)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: 'var(--sirad-lime)' }} />
            <span className="font-headline text-[10px] uppercase tracking-[0.15em] font-bold" style={{ color: 'var(--sirad-lime)' }}>
              {t('badge')}
            </span>
          </motion.div>

          {/* Headline with rotating service */}
          <motion.h1
            variants={itemVariants}
            className="font-headline font-bold text-[2.25rem] sm:text-4xl leading-[1.1] md:text-6xl lg:text-[5.5rem] lg:leading-[1] tracking-tighter"
            style={{ color: 'var(--sirad-text)' }}
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
                  className="block glow-text whitespace-nowrap"
                  style={{ color: 'var(--sirad-lime)' }}
                >
                  {services[activeIndex]}
                </motion.span>
              </AnimatePresence>
              {/* Animated underline bar */}
              <motion.span
                className="absolute bottom-0 left-0 h-[3px] rounded-full"
                style={{ backgroundColor: 'color-mix(in srgb, var(--sirad-lime) 40%, transparent)' }}
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
            className="text-xs sm:text-sm lg:text-xl max-w-[90%] sm:max-w-lg font-light leading-relaxed font-body"
            style={{ color: 'var(--sirad-text-muted)' }}
          >
            {t('description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-1 lg:pt-2 w-full sm:w-auto">
            <Link
              href="/contact"
              className="group relative overflow-hidden px-5 py-4 w-full sm:w-auto lg:px-10 lg:py-5 rounded-xl font-headline font-bold uppercase tracking-widest text-[9px] lg:text-xs transition-all duration-500 active:scale-95 flex items-center justify-center gap-2 pointer-events-auto"
              style={{ backgroundColor: 'var(--sirad-lime)', color: 'var(--sirad-lime-text)' }}
            >
              <span className="relative z-10">{t('getQuote')}</span>
              <span className="material-symbols-outlined text-sm lg:text-base relative z-10 group-hover:translate-x-1 rtl:group-hover:translate-x-0 rtl:group-hover:-translate-x-1 transition-transform">
                arrow_forward
              </span>
              {/* Shimmer */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
            </Link>

            <Link
              href="/work"
              className="backdrop-blur-md px-5 py-4 w-full sm:w-auto lg:px-10 lg:py-5 rounded-xl font-headline font-bold uppercase tracking-widest text-[9px] lg:text-xs transition-all duration-500 flex items-center justify-center pointer-events-auto"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--sirad-text) 5%, transparent)',
                color: 'var(--sirad-text)',
                border: '1px solid var(--sirad-border)',
              }}
            >
              {t('portfolio')}
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center lg:justify-start gap-4 lg:gap-8 pt-2 lg:pt-4 w-full"
            style={{ borderTop: '1px solid var(--sirad-border)' }}
          >
            {[
              { value: '150+', label: 'Projects' },
              { value: '98%', label: 'Satisfaction' },
              { value: '5yr', label: 'Expertise' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-0.5 lg:space-y-1 text-center lg:text-left">
                <div className="font-headline font-bold text-lg lg:text-2xl" style={{ color: 'var(--sirad-lime)' }}>{stat.value}</div>
                <div className="text-[8px] lg:text-[10px] uppercase tracking-widest font-label" style={{ color: 'var(--sirad-text-dim)' }}>{stat.label}</div>
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
              className="absolute w-[88%] h-[88%]"
              style={{ border: '2px solid color-mix(in srgb, var(--sirad-lime) 10%, transparent)', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[65%] h-[65%]"
              style={{ border: '1px solid var(--sirad-border)', borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[42%] h-[42%]"
              style={{ border: '1px solid color-mix(in srgb, var(--sirad-lime) 20%, transparent)', borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%' }}
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
                sizes="(max-width: 768px) 300px, (max-width: 1200px) 500px, 600px"
                className="object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
