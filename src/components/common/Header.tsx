'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isRtl = locale === 'ar';

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageSwitch = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className="fixed top-3 sm:top-4 md:top-5 inset-x-0 z-50 flex flex-col items-center px-4 sm:px-6 md:px-8 pointer-events-none">
      {/* Floating Island / Pill Navbar */}
      <nav
        className={`pointer-events-auto w-full max-w-7xl mx-auto rounded-2xl md:rounded-full transition-all duration-300 flex justify-between items-center px-4 sm:px-6 md:px-8 py-2 md:py-2.5 ${
          isScrolled
            ? 'bg-[#131313]/90 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(182,255,51,0.12)]'
            : 'bg-[#131313]/75 backdrop-blur-xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(182,255,51,0.06)]'
        }`}
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
          <Link 
            href="/" 
            className={`font-headline text-sm lg:text-base transition-colors duration-300 ${
              pathname === '/' 
                ? "text-[#B6FF33] font-bold relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-0.5 after:bg-[#B6FF33] after:shadow-[0_0_10px_#B6FF33]" 
                : "text-[#e5e2e1]/70 hover:text-[#e5e2e1]"
            }`}
          >
            {t('home')}
          </Link>
          <Link 
            href="/about" 
            className={`font-headline text-sm lg:text-base transition-colors duration-300 ${
              pathname === '/about' 
                ? "text-[#B6FF33] font-bold relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-0.5 after:bg-[#B6FF33] after:shadow-[0_0_10px_#B6FF33]" 
                : "text-[#e5e2e1]/70 hover:text-[#e5e2e1]"
            }`}
          >
            {t('about')}
          </Link>
          <Link 
            href="/work" 
            className={`font-headline text-sm lg:text-base transition-colors duration-300 ${
              pathname === '/work' 
                ? "text-[#B6FF33] font-bold relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-0.5 after:bg-[#B6FF33] after:shadow-[0_0_10px_#B6FF33]" 
                : "text-[#e5e2e1]/70 hover:text-[#e5e2e1]"
            }`}
          >
            {t('work')}
          </Link>
          <Link 
            href="/services" 
            className={`font-headline text-sm lg:text-base transition-colors duration-300 ${
              pathname === '/services' 
                ? "text-[#B6FF33] font-bold relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-0.5 after:bg-[#B6FF33] after:shadow-[0_0_10px_#B6FF33]" 
                : "text-[#e5e2e1]/70 hover:text-[#e5e2e1]"
            }`}
          >
            {t('services')}
          </Link>
          <Link 
            href="/contact" 
            className={`font-headline text-sm lg:text-base transition-colors duration-300 ${
              pathname === '/contact' 
                ? "text-[#B6FF33] font-bold relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-0.5 after:bg-[#B6FF33] after:shadow-[0_0_10px_#B6FF33]" 
                : "text-[#e5e2e1]/70 hover:text-[#e5e2e1]"
            }`}
          >
            {t('contact')}
          </Link>
        </div>

        {/* Action Controls */}
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

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 space-y-1.5 z-50 relative rounded-full border border-white/10 bg-white/5 active:scale-95 transition-transform"
            aria-label="Toggle Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`w-4 h-0.5 bg-[#B6FF33] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`w-4 h-0.5 bg-[#B6FF33] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-4 h-0.5 bg-[#B6FF33] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 translate-y-[-8px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown Card */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-full max-w-7xl mx-auto mt-2 bg-[#131313]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl flex flex-col px-6 py-6 gap-4 md:hidden"
          >
            <Link href="/" className={`font-headline text-lg font-bold py-1.5 ${pathname === '/' ? 'text-[#B6FF33]' : 'text-[#e5e2e1]'}`}>
              {t('home')}
            </Link>
            <Link href="/about" className={`font-headline text-lg font-bold py-1.5 ${pathname === '/about' ? 'text-[#B6FF33]' : 'text-[#e5e2e1]'}`}>
              {t('about')}
            </Link>
            <Link href="/work" className={`font-headline text-lg font-bold py-1.5 ${pathname === '/work' ? 'text-[#B6FF33]' : 'text-[#e5e2e1]'}`}>
              {t('work')}
            </Link>
            <Link href="/services" className={`font-headline text-lg font-bold py-1.5 ${pathname === '/services' ? 'text-[#B6FF33]' : 'text-[#e5e2e1]'}`}>
              {t('services')}
            </Link>
            <Link href="/contact" className={`font-headline text-lg font-bold py-1.5 ${pathname === '/contact' ? 'text-[#B6FF33]' : 'text-[#e5e2e1]'}`}>
              {t('contact')}
            </Link>
            
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#B6FF33] text-[#121f00] px-6 py-3 rounded-xl font-headline text-xs tracking-[0.1em] uppercase font-bold mt-2 w-full block text-center shadow-[0_0_20px_rgba(182,255,51,0.25)]">
              {t('getQuote')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
