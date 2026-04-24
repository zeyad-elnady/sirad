"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import FadeIn from '@/components/common/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServicesPage() {
  const t = useTranslations('ServicesPage');
  const [activeIdx, setActiveIdx] = useState(0);
  
  const services = [
    {
      id: "01",
      title: t('service1Title'),
      desc: t('service1Desc'),
      outputs: [t('service1Output1'), t('service1Output2'), t('service1Output3')],
      icon: "code_blocks"
    },
    {
      id: "02",
      title: t('service2Title'),
      desc: t('service2Desc'),
      outputs: [t('service2Output1'), t('service2Output2'), t('service2Output3')],
      icon: "motion_photos_on"
    },
    {
      id: "03",
      title: t('service3Title'),
      desc: t('service3Desc'),
      outputs: [t('service3Output1'), t('service3Output2'), t('service3Output3')],
      icon: "trending_up"
    }
  ];

  return (
    <>
      <Header />
      <main className="relative bg-[#050505]">
        {/* --- Page Header --- */}
        <section className="pt-32 pb-16 px-8 md:px-24 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] md:w-[1200px] h-[400px] md:h-[600px] bg-[#B6FF33]/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B6FF33]/20 to-transparent"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
            <FadeIn direction="up">
              <span className="inline-block text-[#B6FF33] font-label text-[10px] md:text-[12px] tracking-[0.4em] uppercase mb-8 py-2 px-4 border border-[#B6FF33]/20 rounded-full bg-[#B6FF33]/5 backdrop-blur-sm">
                {t('pageLabel')}
              </span>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-headline font-bold tracking-tighter leading-[0.9] text-[#FAFFF3] mb-8 uppercase">
                {t('pageTitle')} <br className="hidden md:block" />
                <span className="text-[#B6FF33] drop-shadow-[0_0_20px_rgba(182,255,51,0.4)]">{t('pageTitleHighlight')}</span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.2} direction="up" className="w-full flex justify-center mt-6">
              <div className="glass-card p-6 md:p-10 rounded-2xl max-w-3xl neon-monolith-shadow relative bg-white/5 backdrop-blur-md border border-white/10">
                <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#B6FF33]/40"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#B6FF33]/40"></div>
                <p className="text-lg md:text-2xl text-[#e5e2e1]/90 font-light leading-relaxed tracking-tight">
                  {t('pageDesc')}
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* --- Interactive Services Section --- */}
        <section className="px-6 md:px-16 lg:px-24 mb-32 max-w-[1600px] mx-auto min-h-[600px] relative z-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-24">
            
            {/* Left Side: Service List & Mobile Accordion */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:gap-8 justify-center">
              {services.map((service, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <FadeIn key={idx} delay={idx * 0.1} direction="up" className="w-full">
                    {/* Title Row */}
                    <div 
                      onClick={() => setActiveIdx(idx)}
                      onMouseEnter={() => {
                        // Only trigger hover on desktop
                        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                          setActiveIdx(idx);
                        }
                      }}
                      className={`group cursor-pointer flex items-center gap-4 md:gap-6 lg:gap-10 transition-all duration-500 py-3 lg:py-4 ${isActive ? 'opacity-100 lg:pl-8' : 'opacity-50 hover:opacity-80'}`}
                    >
                      <span className={`font-headline font-black text-3xl md:text-4xl lg:text-5xl transition-all duration-500 ${isActive ? 'text-[#B6FF33] drop-shadow-[0_0_15px_rgba(182,255,51,0.6)]' : 'text-transparent text-outline'}`} style={!isActive ? { WebkitTextStroke: '1px #FAFFF3' } : {}}>
                        {service.id}
                      </span>
                      <h2 className={`font-headline font-bold text-2xl md:text-3xl lg:text-5xl uppercase tracking-tighter transition-all duration-500 ${isActive ? 'text-[#FAFFF3]' : 'text-[#FAFFF3]/50'}`}>
                        {service.title}
                      </h2>
                    </div>

                    {/* Mobile Accordion Content (Hidden on lg) */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, filter: "blur(5px)" }}
                          animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                          exit={{ height: 0, opacity: 0, filter: "blur(5px)" }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="lg:hidden overflow-hidden"
                        >
                          <div className="mt-4 mb-2 p-6 md:p-8 rounded-3xl glass-card border border-[#B6FF33]/20 bg-[#0a0a0a] relative shadow-[0_10px_40px_rgba(182,255,51,0.05)]">
                            {/* High-end Noise Texture */}
                            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay rounded-3xl" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                            
                            {/* Radial Glow */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(182,255,51,0.1)_0%,transparent_60%)] rounded-3xl pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col">
                              <div className="w-12 h-12 rounded-xl bg-[#B6FF33]/10 border border-[#B6FF33]/20 flex items-center justify-center mb-6 backdrop-blur-md">
                                <span className="material-symbols-outlined text-2xl text-[#B6FF33]">
                                  {service.icon}
                               </span>
                              </div>

                              <p className="text-lg md:text-xl text-[#e5e2e1]/90 leading-relaxed font-light mb-8">
                                {service.desc}
                              </p>

                              <div className="space-y-4 border-t border-white/10 pt-6">
                                <h4 className="text-[10px] font-label uppercase tracking-[0.2em] text-[#B6FF33]">Core Deliverables</h4>
                                <ul className="flex flex-col gap-3">
                                  {service.outputs.map((output, outIdx) => (
                                    <li key={outIdx} className="flex items-center gap-3">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF33] shadow-[0_0_8px_#B6FF33] flex-shrink-0 animate-pulse"></span>
                                      <span className="font-body text-sm md:text-base text-[#e5e2e1]/80">{output}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FadeIn>
                );
              })}
            </div>

            {/* Right Side: Dynamic Content Display (Desktop Only) */}
            <div className="hidden lg:block w-full lg:w-1/2 relative min-h-[450px] lg:min-h-0">
              <div className="sticky top-32 w-full h-full lg:h-[600px] rounded-3xl overflow-hidden glass-card border border-white/10 bg-[#0a0a0a] group">
                
                {/* High-end Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                
                {/* Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(182,255,51,0.1)_0%,transparent_50%)]"></div>

                {/* Decorative Brackets */}
                <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/10 opacity-50"></div>
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/10 opacity-50"></div>

                {/* AnimatePresence for smooth transitions between contents */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 p-8 lg:p-14 flex flex-col justify-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#B6FF33]/10 border border-[#B6FF33]/20 flex items-center justify-center mb-8 backdrop-blur-md">
                      <span className="material-symbols-outlined text-3xl text-[#B6FF33]">
                        {services[activeIdx].icon}
                      </span>
                    </div>

                    <p className="text-xl lg:text-2xl text-[#e5e2e1]/90 leading-relaxed font-light mb-12">
                      {services[activeIdx].desc}
                    </p>

                    <div className="space-y-6 border-t border-white/10 pt-8">
                      <h4 className="text-xs font-label uppercase tracking-[0.2em] text-[#B6FF33]">Core Deliverables</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {services[activeIdx].outputs.map((output, outIdx) => (
                          <motion.li 
                            key={outIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (outIdx * 0.1), duration: 0.3 }}
                            className="flex items-center gap-3"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF33] shadow-[0_0_8px_#B6FF33] flex-shrink-0 animate-pulse"></span>
                            <span className="font-body text-sm lg:text-base text-[#e5e2e1]/80">{output}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
