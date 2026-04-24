"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import FadeIn from '@/components/common/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkPage() {
  const t = useTranslations('WorkPage');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = [
    { id: 'All', label: t('categoryAll') },
    { id: 'Web Apps', label: t('categoryWeb') },
    { id: 'Mobile Apps', label: t('categoryMobile') },
    { id: 'Marketing', label: t('categoryMarketing') },
    { id: 'Branding', label: t('categoryBranding') },
  ];

  const projects = [
    { id: 1, title: t('project1Title'), desc: t('project1Desc'), category: 'Web Apps', height: 'md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[500px]' },
    { id: 2, title: t('project2Title'), desc: t('project2Desc'), category: 'Mobile Apps', height: 'md:col-span-1 md:row-span-1 min-h-[300px]' },
    { id: 3, title: t('project3Title'), desc: t('project3Desc'), category: 'Branding', height: 'md:col-span-1 md:row-span-2 min-h-[300px] md:min-h-[600px]' },
    { id: 4, title: t('project4Title'), desc: t('project4Desc'), category: 'Web Apps', height: 'md:col-span-1 md:row-span-1 min-h-[300px]' },
    { id: 5, title: t('project5Title'), desc: t('project5Desc'), category: 'Marketing', height: 'md:col-span-2 md:row-span-1 min-h-[300px] md:min-h-[400px]' },
    { id: 6, title: t('project6Title'), desc: t('project6Desc'), category: 'Branding', height: 'md:col-span-1 md:row-span-1 min-h-[300px]' },
  ];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

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

        {/* --- Category Filters --- */}
        <section className="px-0 md:px-24 mb-12 max-w-screen-2xl mx-auto relative z-20">
          <FadeIn delay={0.3} direction="up">
            <div className="flex overflow-x-auto no-scrollbar md:flex-wrap justify-start md:justify-center gap-3 md:gap-6 px-8 md:px-0 py-2 w-full">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative px-5 py-2.5 rounded-full text-sm md:text-base font-medium tracking-wide transition-all duration-300 overflow-hidden whitespace-nowrap flex-shrink-0 ${
                    activeCategory === category.id 
                      ? 'text-[#050505]' 
                      : 'text-[#FAFFF3]/70 hover:text-[#FAFFF3] bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {activeCategory === category.id && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-[#B6FF33] rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category.label}</span>
                </button>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* --- Project Gallery (Bento Grid) --- */}
        <section className="px-6 md:px-16 lg:px-24 mb-32 max-w-[1600px] mx-auto min-h-[800px]">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[300px]"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  transition={{ 
                    duration: 0.5, 
                    delay: idx * 0.05,
                    layout: { type: "spring", stiffness: 300, damping: 30 }
                  }}
                  className={`group relative w-full ${project.height} rounded-3xl overflow-hidden glass-card border border-white/5 hover:border-[#B6FF33]/50 transition-all duration-500 block`}
                >
                  {/* Background Base with Noise Texture */}
                  <div className="absolute inset-0 bg-[#0a0a0a] group-hover:bg-[#111] transition-colors duration-700">
                    <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] opacity-80"></div>
                  </div>
                  
                  {/* Subtle kinetic glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(182,255,51,0.12)_0%,transparent_60%)]"></div>

                  {/* Decorative Elements */}
                  <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/10 opacity-50 group-hover:opacity-100 group-hover:border-[#B6FF33]/30 transition-all duration-500"></div>
                  <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/10 opacity-50 group-hover:opacity-100 group-hover:border-[#B6FF33]/30 transition-all duration-500"></div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end bg-gradient-to-t from-[#050505]/90 md:from-[#050505] via-[#050505]/40 to-transparent">
                    <div className="transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="flex items-center gap-3 mb-2 md:mb-4 opacity-100 md:opacity-80 md:group-hover:opacity-100 transition-opacity duration-500">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#B6FF33] animate-pulse shadow-[0_0_8px_rgba(182,255,51,0.8)]"></span>
                        <span className="text-[#B6FF33] font-label text-[10px] md:text-xs tracking-[0.2em] uppercase">
                          {project.category}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl md:text-4xl lg:text-5xl font-headline font-bold text-[#FAFFF3] uppercase tracking-tighter mb-2 md:mb-3 leading-none md:group-hover:text-[#B6FF33] transition-colors duration-300 pr-12 md:pr-0">
                        {project.title}
                      </h3>
                      
                      <p className="text-[#e5e2e1]/70 font-body text-sm md:text-base max-w-md line-clamp-2 md:line-clamp-none opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0">
                        {project.desc}
                      </p>
                      
                      <div className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-500 delay-150">
                        <span className="material-symbols-outlined text-[#B6FF33] text-xl">arrow_outward</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
