'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  X,
  ArrowUpRight,
  Mail,
  MapPin,
} from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bubbleOrigin, setBubbleOrigin] = useState({ x: '50%', y: '40px' });
  const isRtl = locale === 'ar';

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = Math.round(rect.left + rect.width / 2);
    const centerY = Math.round(rect.top + rect.height / 2);
    setBubbleOrigin({ x: `${centerX}px`, y: `${centerY}px` });
    setIsMenuOpen(true);
  };

  const bubbleVariants = {
    closed: (origin: { x: string; y: string }) => ({
      clipPath: `circle(0% at ${origin.x} ${origin.y})`,
      transition: {
        duration: 0.55,
        ease: [0.32, 0, 0.67, 0] as const,
      },
    }),
    open: (origin: { x: string; y: string }) => ({
      clipPath: `circle(160% at ${origin.x} ${origin.y})`,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const contentVariants = {
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.22,
        ease: 'easeOut' as const,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.18,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when full-screen menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track scroll position to hide top header and show center menu button
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageSwitch = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const navItems = [
    { num: '01', href: '/', label: t('home') },
    { num: '02', href: '/about', label: t('about') },
    { num: '03', href: '/work', label: t('work') },
    { num: '04', href: '/services', label: t('services') },
    { num: '05', href: '/contact', label: t('contact') },
  ];

  return (
    <>
      {/* ─── 1. TOP FLOATING HEADER (Visible at Top) ─── */}
      <motion.header
        initial={false}
        animate={
          !isScrolled
            ? { y: 0, opacity: 1, scale: 1, pointerEvents: 'auto' as const }
            : { y: -45, opacity: 0, scale: 0.96, pointerEvents: 'none' as const }
        }
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-3 sm:top-4 md:top-5 inset-x-0 z-40 flex flex-col items-center px-4 sm:px-6 md:px-8"
      >
        <nav
          className="w-full max-w-7xl mx-auto rounded-2xl md:rounded-full transition-all duration-300 flex justify-between items-center px-4 sm:px-6 md:px-8 py-2 md:py-2.5 bg-[#131313]/75 backdrop-blur-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(182,255,51,0.06)]"
        >
          {/* Logo */}
          <Link
            href="/"
            className="relative w-28 sm:w-36 md:w-44 h-10 md:h-12 flex items-center shrink-0"
          >
            <Image
              src="/logo-.png"
              alt="Sirad"
              fill
              className="pointer-events-none"
              style={{
                objectFit: 'contain',
                objectPosition: isRtl ? 'right center' : 'left center',
                transform: 'scale(1.5)',
                transformOrigin: isRtl ? 'right center' : 'left center',
              }}
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-headline text-sm lg:text-base transition-colors duration-300 ${
                  pathname === item.href
                    ? "text-[#B6FF33] font-bold relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-0.5 after:bg-[#B6FF33] after:shadow-[0_0_10px_#B6FF33]"
                    : 'text-[#e5e2e1]/70 hover:text-[#e5e2e1]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right / Left Actions */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            <button
              type="button"
              onClick={handleLanguageSwitch}
              className="text-[#e5e2e1]/70 hover:text-white font-headline text-[11px] tracking-[0.1em] uppercase cursor-pointer transition-colors px-2.5 py-1 rounded-full hover:bg-white/5 border border-white/5"
              aria-label="Switch Language"
            >
              <span className={locale === 'en' ? 'text-[#B6FF33] font-bold' : ''}>EN</span>
              <span className="mx-1 text-[#e5e2e1]/30">|</span>
              <span className={locale === 'ar' ? 'text-[#B6FF33] font-bold' : ''}>AR</span>
            </button>

            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center bg-[#B6FF33] text-[#121f00] px-5 py-2.5 rounded-full font-headline text-[11px] tracking-[0.08em] uppercase font-bold hover:shadow-[0_0_20px_rgba(182,255,51,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-center"
            >
              {t('getQuote')}
            </Link>

            {/* Mobile Menu Button on Header */}
            <button
              type="button"
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 space-y-1.5 z-40 relative rounded-full border border-white/10 bg-white/5 active:scale-95 transition-transform"
              aria-label="Open Menu"
              onClick={handleOpenMenu}
            >
              <span className="w-4 h-0.5 bg-[#B6FF33] rounded-full" />
              <span className="w-3 h-0.5 bg-[#B6FF33] rounded-full" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ─── 2. CENTER FLOATING MENU BUTTON (Appears After Scroll) ─── */}
      <motion.div
        initial={false}
        animate={
          isScrolled && !isMenuOpen
            ? { y: 0, opacity: 1, scale: 1, pointerEvents: 'auto' as const }
            : { y: -30, opacity: 0, scale: 0.9, pointerEvents: 'none' as const }
        }
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 md:top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <button
          type="button"
          onClick={handleOpenMenu}
          className="pointer-events-auto group flex items-center gap-3.5 px-6 py-2.5 rounded-full bg-[#131313]/90 hover:bg-[#1a1a1d] backdrop-blur-2xl border border-white/15 hover:border-[#B6FF33]/50 shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_25px_rgba(182,255,51,0.18)] cursor-pointer transition-all duration-300 active:scale-95"
          aria-label="Open Navigation Menu"
        >
          {/* Animated Hamburger Icon */}
          <div className="flex flex-col gap-1 w-4">
            <span className="w-full h-0.5 bg-[#B6FF33] rounded-full transition-all duration-300 group-hover:w-4" />
            <span className="w-2.5 h-0.5 bg-[#B6FF33] rounded-full transition-all duration-300 group-hover:w-full" />
          </div>

          <span className="font-headline text-xs font-bold tracking-[0.2em] text-[#e5e2e1] group-hover:text-white uppercase">
            {t('menu')}
          </span>

          <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF33] shadow-[0_0_8px_#B6FF33] animate-pulse" />
        </button>
      </motion.div>

      {/* ─── 3. BAUNFIRE-STYLE FULL-SCREEN MENU OVERLAY WITH BUBBLE EFFECT ─── */}
      <AnimatePresence custom={bubbleOrigin}>
        {isMenuOpen && (
          <>
            {/* Luminous Expanding Bubble Shockwave Ripple */}
            <motion.div
              key="bubble-glow-disc"
              initial={{
                left: bubbleOrigin.x,
                top: bubbleOrigin.y,
                width: 0,
                height: 0,
                x: '-50%',
                y: '-50%',
                opacity: 0.85,
              }}
              animate={{
                width: '280vmax',
                height: '280vmax',
                opacity: 0,
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.2 },
              }}
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="pointer-events-none fixed z-[99] rounded-full border-2 border-[#B6FF33]/60 bg-radial from-[#B6FF33]/30 via-[#B6FF33]/5 to-transparent"
            />

            {/* Bubble-Clipped Full-screen Overlay */}
            <motion.div
              key="baunfire-overlay"
              custom={bubbleOrigin}
              variants={bubbleVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{
                willChange: 'clip-path',
              }}
              className="fixed inset-0 z-[100] bg-[#0c0c0d]/98 backdrop-blur-3xl text-[#e5e2e1] flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 overflow-y-auto"
            >
              {/* Inner Content with Graceful Fade & Slide */}
              <motion.div
                variants={contentVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="w-full flex-1 flex flex-col justify-between"
              >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(182,255,51,0.08)_0%,transparent_70%)] blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(34,197,94,0.05)_0%,transparent_70%)] blur-[100px] pointer-events-none -z-10" />

            {/* Overlay Top Bar (Logo, Language Switcher, CTA, Close Button) */}
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto shrink-0 pb-6 border-b border-white/5">
              {/* Logo */}
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="relative w-28 sm:w-36 md:w-44 h-10 md:h-12 flex items-center"
              >
                <Image
                  src="/logo-.png"
                  alt="Sirad"
                  fill
                  className="pointer-events-none"
                  style={{
                    objectFit: 'contain',
                    objectPosition: isRtl ? 'right center' : 'left center',
                    transform: 'scale(1.5)',
                    transformOrigin: isRtl ? 'right center' : 'left center',
                  }}
                  priority
                />
              </Link>

              {/* Action Controls */}
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Language Switcher */}
                <button
                  type="button"
                  onClick={handleLanguageSwitch}
                  className="text-[#e5e2e1]/70 hover:text-white font-headline text-xs tracking-[0.1em] uppercase cursor-pointer transition-colors px-3 py-1.5 rounded-full hover:bg-white/5 border border-white/10"
                  aria-label="Switch Language"
                >
                  <span className={locale === 'en' ? 'text-[#B6FF33] font-bold' : ''}>EN</span>
                  <span className="mx-1 text-[#e5e2e1]/30">|</span>
                  <span className={locale === 'ar' ? 'text-[#B6FF33] font-bold' : ''}>AR</span>
                </button>

                {/* Let's Talk CTA */}
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="hidden sm:inline-flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-[0.15em] text-[#B6FF33] hover:text-white transition-colors group"
                >
                  <span>{t('getQuote')}</span>
                  <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>

                {/* Baunfire Circular Close Button */}
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-white/20 bg-white/5 hover:bg-[#B6FF33] text-white hover:text-[#121f00] hover:border-[#B6FF33] flex items-center justify-center transition-all duration-300 active:scale-95 shadow-lg group cursor-pointer"
                  aria-label="Close Menu"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Overlay Center / Main Navigation Area */}
            <div className="w-full max-w-7xl mx-auto my-auto py-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-20">
              {/* Left Column: Vertical Tag + Giant Typographic Links */}
              <div className="flex items-start gap-8 sm:gap-12 md:gap-16 w-full lg:w-auto">
                {/* Vertical "MENU" text rotated like in Baunfire */}
                <div className="hidden sm:flex flex-col items-center pt-3 select-none">
                  <span
                    className="font-headline text-[11px] uppercase tracking-[0.4em] text-[#e5e2e1]/30 font-bold"
                    style={{
                      writingMode: 'vertical-lr',
                      transform: 'rotate(180deg)',
                    }}
                  >
                    {t('menu')}
                  </span>
                </div>

                {/* Giant Typographic Menu Items */}
                <nav className="flex flex-col gap-3 sm:gap-5 md:gap-6 w-full">
                  {navItems.map((item, idx) => {
                    const isHovered = hoveredIndex === idx;
                    const isAnyHovered = hoveredIndex !== null;
                    const isActive = pathname === item.href;

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="relative"
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="group inline-flex items-baseline gap-4 sm:gap-6 py-1 transition-all duration-300"
                          style={{
                            transform: isHovered
                              ? isRtl
                                ? 'translateX(-16px)'
                                : 'translateX(16px)'
                              : 'translateX(0)',
                          }}
                        >
                          {/* Numbering (01, 02) */}
                          <span
                            className="font-headline text-xs sm:text-sm font-semibold tracking-widest transition-colors duration-300"
                            style={{
                              color: isHovered || isActive ? '#B6FF33' : 'rgba(229, 226, 225, 0.25)',
                            }}
                          >
                            {item.num}
                          </span>

                          {/* Link Title */}
                          <span
                            className="font-headline text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight transition-all duration-300"
                            style={{
                              color:
                                isHovered || isActive
                                  ? '#ffffff'
                                  : isAnyHovered
                                  ? 'rgba(229, 226, 225, 0.2)'
                                  : 'rgba(229, 226, 225, 0.85)',
                              textShadow:
                                isHovered || isActive
                                  ? '0 0 30px rgba(182, 255, 51, 0.35)'
                                  : 'none',
                            }}
                          >
                            {item.label}
                          </span>

                          {/* Glowing Accent Indicator when Hovered */}
                          <motion.span
                            initial={false}
                            animate={isHovered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                            className="w-2.5 h-2.5 rounded-full bg-[#B6FF33] shadow-[0_0_12px_#B6FF33] shrink-0"
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Right Column: Contact & Agency Info (Matching Baunfire Reference) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-8 max-w-sm w-full pt-8 lg:pt-0 border-t lg:border-t-0 border-white/5"
              >
                <div>
                  <span className="text-[10px] font-headline uppercase tracking-[0.25em] text-[#B6FF33] font-bold block mb-3">
                    {t('getInTouch')}
                  </span>
                  <a
                    href="mailto:hello@sirad-agancy.com"
                    className="text-lg sm:text-xl font-headline font-semibold text-[#e5e2e1] hover:text-[#B6FF33] transition-colors block mb-2"
                  >
                    hello@sirad-agancy.com
                  </a>
                  <a
                    href="tel:+201000000000"
                    className="text-sm font-headline text-[#e5e2e1]/60 hover:text-[#B6FF33] transition-colors block"
                  >
                    +20 100 000 0000
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-headline uppercase tracking-wider text-[#e5e2e1]/60 mb-2">
                    <MapPin size={13} className="text-[#B6FF33]" />
                    <span>{t('location')}</span>
                  </div>
                  <p className="text-xs text-[#e5e2e1]/40 leading-relaxed">
                    Creative Digital Hub & Engineering Studio
                  </p>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-3 pt-2">
                  {[
                    { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
                    { icon: LinkedinIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
                    { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
                    { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
                  ].map((s, idx) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={idx}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-[#B6FF33]/15 hover:border-[#B6FF33]/50 hover:text-[#B6FF33] text-[#e5e2e1]/70 flex items-center justify-center transition-all duration-300 active:scale-95"
                        aria-label={s.label}
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Overlay Bottom Footer */}
            <div className="w-full max-w-7xl mx-auto shrink-0 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-headline text-[#e5e2e1]/40">
              <span>© {new Date().getFullYear()} Sirad Agency. All rights reserved.</span>
              <span className="text-[#B6FF33]/80 font-bold uppercase tracking-wider">
                Crafted with Precision ✦ Sirad
              </span>
            </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
