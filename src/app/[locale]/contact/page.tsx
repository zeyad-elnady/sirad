'use client';

import {useTranslations} from 'next-intl';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import FadeIn from '@/components/common/FadeIn';

export default function ContactPage() {
  const t = useTranslations('ContactPage');

  return (
    <>
      <Header />
      <main className="relative min-h-[90vh]">
        {/* --- Unified Contact Layout --- */}
        <section className="pt-40 pb-24 px-8 md:px-24 max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
          
          {/* Left Side: Atmosphere & Info */}
          <div className="flex-1 flex flex-col items-start text-left justify-center relative">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-[#B6FF33]/5 blur-[120px] rounded-full -z-10"></div>
            
            <FadeIn direction="up">
              <span className="inline-block text-[#B6FF33] font-label text-[10px] tracking-[0.4em] uppercase mb-8 py-1 px-3 border border-[#B6FF33]/20 rounded-full bg-[#B6FF33]/5">
                {t('pageLabel')}
              </span>
              <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-[0.85] text-[#FAFFF3] mb-8 uppercase">
                {t('pageTitle')} <br/>
                <span className="text-[#B6FF33] drop-shadow-[0_0_20px_rgba(182,255,51,0.4)]">{t('pageTitleHighlight')}</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#e5e2e1]/80 font-light leading-snug tracking-tight mb-16 max-w-lg">
                {t('pageDesc')}
              </p>
            </FadeIn>

            <FadeIn delay={0.2} direction="up" className="w-full flex justify-start gap-16 mt-8">
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-xs font-label uppercase tracking-[0.2em] text-[#B6FF33] mb-4">{t('addressTitle')}</h3>
                  <p className="text-[#e5e2e1] uppercase font-label tracking-widest text-xs leading-loose">
                    {t('addressLine1')} <br/>
                    {t('addressLine2')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-label uppercase tracking-[0.2em] text-[#B6FF33] mb-4">{t('contactTitle')}</h3>
                  <a href={`mailto:${t('email')}`} className="block text-[#e5e2e1] uppercase font-label tracking-wide text-sm hover:text-[#B6FF33] transition-colors mb-2">
                    {t('email')}
                  </a>
                  <a href={`tel:${t('phone')}`} className="block text-[#e5e2e1] uppercase font-label tracking-wide text-sm hover:text-[#B6FF33] transition-colors">
                    {t('phone')}
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Side: The Form */}
          <div className="flex-1 flex items-center justify-center relative z-10 w-full">
            <FadeIn delay={0.3} direction="up" className="w-full">
              <div className="glass-card w-full max-w-xl p-8 md:p-12 rounded-2xl neon-monolith-shadow relative flex flex-col gap-8 bg-[#131313]/90 backdrop-blur-3xl border border-white/5">
                
                <h3 className="font-headline font-bold text-2xl uppercase tracking-tighter text-[#FAFFF3] border-b border-[#B6FF33]/20 pb-4">
                  Transmission Socket
                </h3>
                
                <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                  
                  {/* Name Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#B6FF33] font-label text-[10px] uppercase tracking-widest px-2">
                      {t('formName')}
                    </label>
                    <input 
                      type="text" 
                      className="bg-[#0e0e0e]/50 border-white/10 text-[#FAFFF3] rounded-lg px-4 py-3 font-body focus:ring-0 focus:border-[#B6FF33]/50 transition-colors w-full placeholder:text-[#e5e2e1]/20"
                      placeholder="e.g. Director Ren"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#B6FF33] font-label text-[10px] uppercase tracking-widest px-2">
                      {t('formEmail')}
                    </label>
                    <input 
                      type="email" 
                      className="bg-[#0e0e0e]/50 border-white/10 text-[#FAFFF3] rounded-lg px-4 py-3 font-body focus:ring-0 focus:border-[#B6FF33]/50 transition-colors w-full placeholder:text-[#e5e2e1]/20"
                      placeholder="ren@corporation.com"
                    />
                  </div>

                  {/* Message Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#B6FF33] font-label text-[10px] uppercase tracking-widest px-2">
                      {t('formMessage')}
                    </label>
                    <textarea 
                      rows={5}
                      className="bg-[#0e0e0e]/50 border-white/10 text-[#FAFFF3] rounded-lg px-4 py-3 font-body focus:ring-0 focus:border-[#B6FF33]/50 transition-colors w-full placeholder:text-[#e5e2e1]/20 resize-none"
                      placeholder={t('formMessagePlaceholder')}
                    ></textarea>
                  </div>

                  <button type="submit" className="bg-[#B6FF33] text-[#060802] mt-4 px-8 py-4 rounded-xl font-label text-sm font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(182,255,51,0.2)] hover:shadow-[0_0_40px_rgba(182,255,51,0.5)]">
                    {t('formSubmit')}
                  </button>
                  
                </form>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
