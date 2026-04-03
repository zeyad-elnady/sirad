import {useTranslations} from 'next-intl';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import FadeIn from '@/components/common/FadeIn';

export default function WorkPage() {
  const t = useTranslations('WorkPage');
  
  const projects = [
    { title: t('project1Title'), desc: t('project1Desc'), height: 'h-[400px]', delay: 0 },
    { title: t('project2Title'), desc: t('project2Desc'), height: 'h-[500px]', delay: 0.1 },
    { title: t('project3Title'), desc: t('project3Desc'), height: 'h-[450px]', delay: 0 },
    { title: t('project4Title'), desc: t('project4Desc'), height: 'h-[350px]', delay: 0.1 },
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

        {/* --- Project Gallery (Masonry Grid) --- */}
        <section className="px-8 md:px-24 mb-48 max-w-screen-2xl mx-auto">
          <div className="columns-1 md:columns-2 gap-8 space-y-8">
            {projects.map((project, idx) => (
              <FadeIn key={idx} direction="up" delay={project.delay}>
                <div className={`group relative w-full ${project.height} rounded-2xl overflow-hidden glass-card border border-white/5 hover:border-[#B6FF33]/40 transition-all duration-700 break-inside-avoid block`}>
                  {/* Empty Photo Placeholder */}
                  <div className="absolute inset-0 bg-[#1c1b1b] group-hover:bg-[#2a2a2a] transition-colors duration-700"></div>
                  
                  {/* Subtle kinetic glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 kinetic-gradient"></div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/60 to-transparent flex flex-col justify-end">
                    <div className="transform translate-y-4 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-[#B6FF33] font-label text-[10px] tracking-[0.2em] uppercase mb-4 block">0{idx + 1} // System</span>
                      <h3 className="text-3xl md:text-4xl font-headline font-bold text-[#FAFFF3] uppercase tracking-tighter mb-2">
                        {project.title}
                      </h3>
                      <p className="text-[#e5e2e1]/60 font-body text-sm md:text-base">
                        {project.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
