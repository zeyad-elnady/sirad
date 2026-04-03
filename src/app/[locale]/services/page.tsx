import {useTranslations} from 'next-intl';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import FadeIn from '@/components/common/FadeIn';

export default function ServicesPage() {
  const t = useTranslations('ServicesPage');
  
  const services = [
    {
      title: t('service1Title'),
      desc: t('service1Desc'),
      outputs: [t('service1Output1'), t('service1Output2'), t('service1Output3')]
    },
    {
      title: t('service2Title'),
      desc: t('service2Desc'),
      outputs: [t('service2Output1'), t('service2Output2'), t('service2Output3')]
    },
    {
      title: t('service3Title'),
      desc: t('service3Desc'),
      outputs: [t('service3Output1'), t('service3Output2'), t('service3Output3')]
    }
  ];

  return (
    <>
      <Header />
      <main className="relative">
        {/* --- Page Header --- */}
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

        {/* --- Services Breakdown Sequence --- */}
        <section className="px-8 md:px-24 mb-48 max-w-screen-xl mx-auto flex flex-col gap-12 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#B6FF33]/40 via-[#B6FF33]/10 to-transparent z-0 hidden lg:block"></div>

          {services.map((service, idx) => (
            <FadeIn key={idx} direction="up" delay={0.1 * idx}>
              <div className="relative group w-full glass-card p-10 md:p-16 rounded-2xl border border-white/5 hover:border-[#B6FF33]/40 transition-all duration-700 bg-[#1c1b1b] hover:bg-[#2a2a2a] z-10 overflow-hidden shadow-2xl">
                
                {/* Background Glow */}
                <div className="absolute right-0 top-0 w-96 h-96 kinetic-gradient translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity duration-1000 -z-10"></div>

                <div className="flex flex-col lg:flex-row gap-12 md:gap-24 items-start">
                  {/* Left Column (Index & Title) */}
                  <div className="flex gap-8 items-start min-w-[300px]">
                    <span className="text-transparent text-outline font-headline font-black text-6xl tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity duration-500" style={{ WebkitTextStroke: '1px #B6FF33' }}>
                      0{idx + 1}
                    </span>
                    <div>
                      <h2 className="text-3xl font-headline font-bold text-[#FAFFF3] tracking-tighter uppercase mb-4 leading-tight group-hover:text-[#B6FF33] transition-colors duration-500">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  {/* Right Column (Desc & List) */}
                  <div className="flex-1 flex flex-col gap-8">
                    <p className="text-lg text-[#e5e2e1]/70 leading-relaxed max-w-2xl">
                      {service.desc}
                    </p>
                    
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 border-t border-white/5 pt-8">
                      {service.outputs.map((output, outIdx) => (
                        <li key={outIdx} className="flex items-center gap-3">
                          <span className="text-[#B6FF33] w-1.5 h-1.5 rounded-full bg-[#B6FF33] shadow-[0_0_8px_#B6FF33] flex-shrink-0"></span>
                          <span className="font-label text-xs tracking-widest uppercase text-[#e5e2e1]/80">{output}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
