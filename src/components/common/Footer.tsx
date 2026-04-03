import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-[#0e0e0e] w-full relative border-t border-white/5 mt-auto">
      <div className="max-w-screen-2xl mx-auto px-8 py-20 flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-sm space-y-6">
          <div className="text-xl font-black text-[#e5e2e1] uppercase">Sirad</div>
          <p className="font-headline text-[#e5e2e1]/60 text-sm">
            {t('description')}
          </p>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-on-surface hover:text-[#B6FF33] hover:border-[#B6FF33] transition-all" href="#">
              <span className="material-symbols-outlined text-sm">public</span>
            </a>
            <a className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-on-surface hover:text-[#B6FF33] hover:border-[#B6FF33] transition-all" href="#">
              <span className="material-symbols-outlined text-sm">share</span>
            </a>
            <a className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-on-surface hover:text-[#B6FF33] hover:border-[#B6FF33] transition-all" href="#">
              <span className="material-symbols-outlined text-sm">alternate_email</span>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h4 className="font-headline text-[#B6FF33] text-[10px] uppercase tracking-widest font-bold">{t('solutions')}</h4>
            <ul className="space-y-3 font-headline text-[#e5e2e1]/40 text-sm">
              <li className="hover:text-[#B6FF33] transition-all cursor-pointer">{t('sol_dev')}</li>
              <li className="hover:text-[#B6FF33] transition-all cursor-pointer">{t('sol_design')}</li>
              <li className="hover:text-[#B6FF33] transition-all cursor-pointer">{t('sol_marketing')}</li>
              <li className="hover:text-[#B6FF33] transition-all cursor-pointer">{t('sol_consultancy')}</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-headline text-[#B6FF33] text-[10px] uppercase tracking-widest font-bold">{t('agency')}</h4>
            <ul className="space-y-3 font-headline text-[#e5e2e1]/40 text-sm">
              <li className="hover:text-[#B6FF33] transition-all cursor-pointer">Work</li>
              <li className="hover:text-[#B6FF33] transition-all cursor-pointer">About</li>
              <li className="hover:text-[#B6FF33] transition-all cursor-pointer">Careers</li>
              <li className="hover:text-[#B6FF33] transition-all cursor-pointer">News</li>
            </ul>
          </div>
          <div className="space-y-6 hidden sm:block">
            <h4 className="font-headline text-[#B6FF33] text-[10px] uppercase tracking-widest font-bold">{t('contact')}</h4>
            <ul className="space-y-3 font-headline text-[#e5e2e1]/40 text-sm">
              <li>hello@sirad.tech</li>
              <li>+1 (555) 0123 4567</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-8 pb-12 flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-12 gap-6">
        <p className="font-headline text-[#e5e2e1]/40 text-[10px] uppercase tracking-widest">
          {t('copyright')}
        </p>
        <div className="flex gap-8">
          <a className="font-headline text-[#e5e2e1]/40 text-[10px] uppercase tracking-widest hover:text-[#B6FF33] transition-all" href="#">{t('privacy')}</a>
          <a className="font-headline text-[#e5e2e1]/40 text-[10px] uppercase tracking-widest hover:text-[#B6FF33] transition-all" href="#">{t('terms')}</a>
          <a className="font-headline text-[#e5e2e1]/40 text-[10px] uppercase tracking-widest hover:text-[#B6FF33] transition-all" href="#">{t('cookies')}</a>
        </div>
      </div>
    </footer>
  );
}
