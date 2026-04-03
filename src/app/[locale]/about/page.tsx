import {useTranslations} from 'next-intl';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import FadeIn from '@/components/common/FadeIn';

export default function AboutPage() {
  const t = useTranslations('AboutPage');
  
  return (
    <>
      <Header />
      <main className="relative">
        {/* --- About Us Page Header --- */}
        <section className="pt-32 pb-24 px-8 md:px-24 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-[#B6FF33]/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B6FF33]/20 to-transparent"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
            <FadeIn direction="up">
              <span className="inline-block text-[#B6FF33] font-label text-[10px] tracking-[0.4em] uppercase mb-8 py-1 px-3 border border-[#B6FF33]/20 rounded-full bg-[#B6FF33]/5">
                {t('pageLabel')}
              </span>
              <h1 className="text-6xl md:text-9xl font-headline font-bold tracking-tighter leading-[0.85] text-[#FAFFF3] mb-10 uppercase">
                {t('pageTitle')} <br/>
                <span className="text-[#B6FF33] drop-shadow-[0_0_20px_rgba(182,255,51,0.4)]">{t('pageTitleHighlight')}</span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.2} direction="up" className="w-full flex justify-center">
              <div className="glass-card p-8 md:p-12 rounded-2xl max-w-4xl neon-monolith-shadow relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#B6FF33]/30"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#B6FF33]/30"></div>
                <p className="text-xl md:text-3xl text-[#e5e2e1] font-light leading-snug tracking-tight">
                  {t('pageDesc')}
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* --- Original Hero Section --- */}
        <section className="px-8 md:px-24 mb-32 relative min-h-[40vh] flex items-center">
          <div className="absolute inset-0 z-0 overflow-hidden rounded-b-[4rem]">
            <img alt="Atmospheric background" className="w-full h-full object-cover opacity-20 mix-blend-screen scale-110 blur-xl md:blur-3xl" src="https://lh3.googleusercontent.com/aida/ADBb0ujcW7TF2Y2U50VkrW5TFHZzchnLsJCNLbc0V-kjPd0WPuhkBdtvBrpZD97ryl0mImXXjuEm9IY2OQqPxvtyTEr6N2dZVLlCAzjX3kQRd2mWVZZTQbEnQ-RQc3j7se5uzLmfNmRO8lssWKhvSr1Bq27HFNeydnlwLiEmpfL2KdOPoLQtDEgGNy987G8yugjT9JObyQ83bm7a-u3F2HpW_q2mc5P1120MWCNcrx08_cskUmLfTe9sfXnv7j4IQYhaX_mf8Pbd7tGJrQ"/>
            <div className="absolute inset-0 bg-gradient-to-b from-[#131313] via-transparent to-[#131313]"></div>
          </div>
          <div className="max-w-5xl relative z-10">
            <FadeIn direction="up">
              <span className="inline-block text-[#B6FF33] font-label text-xs tracking-[0.3em] uppercase mb-6">{t('heroLabel')}</span>
              <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter leading-[0.9] text-[#FAFFF3] mb-8">
                {t('heroTitle')} <br/>
                <span className="text-[#B6FF33]">{t('heroTitleHighlight')}</span>
              </h2>
              <p className="text-lg md:text-xl text-[#e5e2e1]/80 max-w-2xl font-light leading-relaxed">
                {t('heroDesc')}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* --- Mission & Philosophy Section --- */}
        <section className="px-8 md:px-24 lg:px-32 mb-48 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7">
            <FadeIn>
              <div className="relative group overflow-hidden rounded-xl h-[500px] border border-[#B6FF33]/10">
                <img className="w-full h-full object-cover grayscale brightness-50 contrast-125 group-hover:scale-105 transition-transform duration-1000" alt="architectural interior with neon light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGe_TGVoYK--lPfikVhs1JNKZDX3ozSaviVI-XIxy5DLdsq9j4FH0vHDxSLH9CWqDbxF5GW5NEeCtFvNY21vxAFhtT2sFHf_6fhAWbnnik-g2OaznRsHEP42tiBPo7dSZkR0rliPk8QRFFJauG_seI4D3orh4BoGUaqwjpAcyHrxDUnMS0ZrrdT9qVhN0K2eV0CoDS12Sn7cYRwbFfsAXKK0XN0VdvaD0XZ0flTRRmMoAC_nSTbHT9d9qCduFFtSS2yz_8sJsuR8s"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent opacity-70"></div>
              </div>
            </FadeIn>
          </div>
          <div className="md:col-span-5 pt-12">
            <div className="flex flex-col gap-12">
              <FadeIn direction="up">
                <h2 className="text-xs font-label uppercase tracking-[0.2em] text-[#B6FF33] mb-4">{t('missionLabel')}</h2>
                <h3 className="text-3xl font-headline font-semibold mb-6 text-[#FAFFF3]">{t('missionTitle')}</h3>
                <p className="text-[#e5e2e1]/80 leading-relaxed text-lg">
                  {t('missionDesc')}
                </p>
              </FadeIn>
              
              <FadeIn direction="up" delay={0.2}>
                <div className="glass-card p-8 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 rtl:left-0 rtl:right-auto right-0 p-4 opacity-10">
                    <span className="material-symbols-outlined text-6xl text-[#B6FF33]">precision_manufacturing</span>
                  </div>
                  <h4 className="text-xl font-headline font-bold mb-4 text-[#B6FF33]">{t('missionProtocolTitle')}</h4>
                  <ul className="space-y-4">
                    {[t('missionProtocol1'), t('missionProtocol2'), t('missionProtocol3')].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-[#B6FF33] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B6FF33] shadow-[0_0_8px_#B6FF33] flex-shrink-0"></span>
                        <span className="text-sm text-[#e5e2e1]/90 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* --- Values Bento Grid --- */}
        <section className="px-8 md:px-24 mb-48">
          <FadeIn direction="up">
            <h2 className="text-center text-xs font-label uppercase tracking-[0.4em] text-[#B6FF33]/60 mb-16">{t('valuesLabel')}</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <div className="bg-[#1c1b1b] p-10 rounded-xl hover:bg-[#2a2a2a] transition-all group border border-white/5 hover:border-[#B6FF33]/20 h-full">
                <div className="w-12 h-12 rounded-lg bg-[#2a2a2a] flex items-center justify-center mb-8 border border-white/5 group-hover:border-[#B6FF33]/40 transition-colors">
                  <span className="material-symbols-outlined text-[#B6FF33]">bolt</span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4 text-[#FAFFF3]">{t('value1Title')}</h3>
                <p className="text-[#e5e2e1]/50 text-sm leading-relaxed">
                    {t('value1Desc')}
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <div className="bg-[#1c1b1b] p-10 rounded-xl hover:bg-[#2a2a2a] transition-all group border border-white/5 hover:border-[#B6FF33]/20 h-full">
                <div className="w-12 h-12 rounded-lg bg-[#2a2a2a] flex items-center justify-center mb-8 border border-white/5 group-hover:border-[#B6FF33]/40 transition-colors">
                  <span className="material-symbols-outlined text-[#B6FF33]">straighten</span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4 text-[#FAFFF3]">{t('value2Title')}</h3>
                <p className="text-[#e5e2e1]/50 text-sm leading-relaxed">
                    {t('value2Desc')}
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <div className="bg-[#1c1b1b] p-10 rounded-xl hover:bg-[#2a2a2a] transition-all group border border-white/5 hover:border-[#B6FF33]/20 h-full">
                <div className="w-12 h-12 rounded-lg bg-[#2a2a2a] flex items-center justify-center mb-8 border border-white/5 group-hover:border-[#B6FF33]/40 transition-colors">
                  <span className="material-symbols-outlined text-[#B6FF33]">layers</span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4 text-[#FAFFF3]">{t('value3Title')}</h3>
                <p className="text-[#e5e2e1]/50 text-sm leading-relaxed">
                    {t('value3Desc')}
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* --- The Team Section --- */}
        <section className="px-8 md:px-24 mb-48 max-w-screen-xl mx-auto">
          <FadeIn direction="up">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <h2 className="text-xs font-label uppercase tracking-[0.2em] text-[#B6FF33] mb-4">{t('teamLabel')}</h2>
                <h3 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-[#FAFFF3]">{t('teamTitle')}</h3>
              </div>
              <div className="text-[#e5e2e1]/40 font-label text-xs tracking-widest uppercase pb-2 border-b border-[#B6FF33]/20 text-right">
                {t('teamSubtitle')}
              </div>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { role: 'Founder / Creative Director', name: 'Elias Thorne', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNKCqP1WhdfTAsGf99aEjoBtGcRkuvAAIte4UtSjbeJEjFpcLhFLH1JykRAJQ4lsJ2ZY40Yc6kqdjSmT81321g-ju57qcAuPer0LmeIEgDqdx0WNuervPVWhzPqR05coVgkk-EWPNu6JPq6QdfLTtGFrSGt1DFJ6KICO4Oa_SqGCs9nwqK2_lNDwH36STztXU8UguwYj9eCA3KupyOEes4CaemSstqel7FKdBpK4D9Cm_lF31zhZjaNkfGAjrg77_5Xvun-Vb-xJg' },
              { role: 'Lead Systems Architect', name: 'Sarah Chen', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2SH6JnVozdJFeICmo-qQHZ-q0BSKMzhS6SnxLICKy_f1lauTMJCUyon9cymToR0CELAWkhJzJL7ne_eVx7GTd8ZG47DCszgZ46yTQZeTNnF82ozJDtjdlJPUt0jNUU1uk8d08pzA9VSaLHHlUM-Mr2rxDOnBUo9F8vke_PsgRl9sAsyNBA2y2CqQMwn3rHbEH7s-gxAT_8ejbM6Xl-IVv8Sb1JWpN1sqoc1m1JQMncmaUjWkh2cjqOqJ923K6qzVKrM_LuFVy0cg' },
              { role: 'Motion Specialist', name: 'Marcus Vane', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATeGR0QQy1X5vAmf6oRgAPG-kifdrv2E_Q7GEKy4ISJ89XwK44Ih6k-WBSQUbXGqDBCbm86c80FwuZHEgg-uKpjas2CcswRFI1omo2csr9dvyU9SeVpU25mjcn4SUWiyPaVNptH6h3Vo7IiH4nJh2AnQVHgKLT6-feXCu8aAHg7ePjXYT8KxoW-LwW0C6pLUHMT869J19UMkMmY6bHRToxaAhonh1toc0chUVQIWtx63JyxebwShw-On2BBR0YkolHRltCwyLit34' },
              { role: 'Brand Strategist', name: 'Lena Sokolov', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdz65CnZw0DE_tSZnjKn8WhuvCZ6ODwP8DcH6f6vb47S5yu8kb2sGMtKaTgJ11t8xVcU9EQCCOXw-iqrgz5cuHui3Tfi83U3VMSF5KxoGwJ4ZbfivGRKlSde-io018M5D8sk0k3QDmWWw3lHqgnUG7Aq8xsEqZ7PQpcFmygi82gO8VQ0k1q9wvjpOb4NaupMxLw2z3jPsRy-9ekt5avnEZ89ZCdXqL3gFB7b2KDlznPl1zKDYqsDpLX8T_Z-hOZarEBsn9Vi8xL40' }
            ].map((member, idx) => (
              <FadeIn key={idx} direction="up" delay={0.1 * idx}>
                <div className="group relative overflow-hidden aspect-[3/4] rounded-xl bg-[#1c1b1b] border border-[#B6FF33]/5 hover:border-[#B6FF33]/20 transition-all">
                  <img className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" src={member.img} alt={member.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full z-10 rtl:text-right">
                    <p className="text-[#B6FF33] font-label text-[10px] uppercase tracking-widest mb-1">{member.role}</p>
                    <h4 className="text-xl font-headline font-bold text-[#FAFFF3] uppercase tracking-tighter">{member.name}</h4>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="px-8 md:px-24 mb-24 relative max-w-screen-xl mx-auto group">
          <FadeIn direction="up">
            <div className="absolute inset-0 z-0 overflow-hidden rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-1000">
              <img alt="" className="w-full h-full object-cover rotate-180 scale-150 blur-2xl" src="https://lh3.googleusercontent.com/aida/ADBb0ujcW7TF2Y2U50VkrW5TFHZzchnLsJCNLbc0V-kjPd0WPuhkBdtvBrpZD97ryl0mImXXjuEm9IY2OQqPxvtyTEr6N2dZVLlCAzjX3kQRd2mWVZZTQbEnQ-RQc3j7se5uzLmfNmRO8lssWKhvSr1Bq27HFNeydnlwLiEmpfL2KdOPoLQtDEgGNy987G8yugjT9JObyQ83bm7a-u3F2HpW_q2mc5P1120MWCNcrx08_cskUmLfTe9sfXnv7j4IQYhaX_mf8Pbd7tGJrQ"/>
            </div>
            <div className="glass-card rounded-xl p-16 md:p-24 flex flex-col items-center text-center relative z-10 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-[#B6FF33]/20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] kinetic-gradient opacity-30 pointer-events-none"></div>
              <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter mb-8 max-w-3xl relative uppercase text-[#FAFFF3]">
                {t('ctaTitle1')} <span className="text-[#B6FF33]">{t('ctaTitleHighlight')}</span>
              </h2>
              <button className="bg-[#B6FF33] text-[#060802] px-12 py-5 rounded-xl font-label text-sm font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(182,255,51,0.4)] relative">
                {t('ctaButton')}
              </button>
            </div>
          </FadeIn>
        </section>

      </main>
      <Footer />
    </>
  );
}
