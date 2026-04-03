'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, Link } from '@/i18n/routing';

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageSwitch = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#131313]/80 backdrop-blur-xl shadow-[0_0_40px_rgba(182,255,51,0.15)]">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center w-full px-8 py-6">
        <div className="text-2xl font-black tracking-tighter text-[#e5e2e1] uppercase">
          Sirad
        </div>
        <div className="hidden md:flex items-center gap-12">
          <Link 
            href="/" 
            className={`font-headline text-base transition-colors duration-300 ${pathname === '/' ? "text-[#B6FF33] font-bold relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#B6FF33] after:shadow-[0_0_10px_#B6FF33]" : "text-[#e5e2e1]/60 hover:text-[#e5e2e1]"}`}
          >
            {t('home')}
          </Link>
          <Link 
            href="/about" 
            className={`font-headline text-base transition-colors duration-300 ${pathname === '/about' ? "text-[#B6FF33] font-bold relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#B6FF33] after:shadow-[0_0_10px_#B6FF33]" : "text-[#e5e2e1]/60 hover:text-[#e5e2e1]"}`}
          >
            {t('about')}
          </Link>
          <Link 
            href="/work" 
            className={`font-headline text-base transition-colors duration-300 ${pathname === '/work' ? "text-[#B6FF33] font-bold relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#B6FF33] after:shadow-[0_0_10px_#B6FF33]" : "text-[#e5e2e1]/60 hover:text-[#e5e2e1]"}`}
          >
            {t('work')}
          </Link>
          <Link 
            href="/services" 
            className={`font-headline text-base transition-colors duration-300 ${pathname === '/services' ? "text-[#B6FF33] font-bold relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#B6FF33] after:shadow-[0_0_10px_#B6FF33]" : "text-[#e5e2e1]/60 hover:text-[#e5e2e1]"}`}
          >
            {t('services')}
          </Link>
          <Link 
            href="/contact" 
            className={`font-headline text-base transition-colors duration-300 ${pathname === '/contact' ? "text-[#B6FF33] font-bold relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#B6FF33] after:shadow-[0_0_10px_#B6FF33]" : "text-[#e5e2e1]/60 hover:text-[#e5e2e1]"}`}
          >
            {t('contact')}
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <span 
            onClick={handleLanguageSwitch}
            className="text-[#e5e2e1]/60 font-headline text-[10px] tracking-[0.1em] uppercase cursor-pointer transition-colors"
          >
            <span className={locale === 'en' ? 'text-[#B6FF33]' : 'hover:text-[#B6FF33]'}>EN</span>
            <span className="mx-2">|</span>
            <span className={locale === 'ar' ? 'text-[#B6FF33]' : 'hover:text-[#B6FF33]'}>AR</span>
          </span>
          <button className="bg-[#B6FF33] text-[#121f00] px-6 py-2.5 rounded-xl font-headline text-[10px] tracking-[0.1em] uppercase font-bold hover:shadow-[0_0_20px_rgba(182,255,51,0.4)] transition-all duration-300 active:scale-95">
            {t('getQuote')}
          </button>
        </div>
      </div>
    </nav>
  );
}
