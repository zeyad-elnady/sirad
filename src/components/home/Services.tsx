'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import FadeIn from '@/components/common/FadeIn';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
} as const;


export default function Services() {
  const t = useTranslations('Services');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const servicesList = [
    {
      id: 'webDev',
      icon: 'terminal',
      bgIcon: 'code',
      title: t('webDev'),
      desc: t('webDevDesc'),
      list: [t('webDevList1'), t('webDevList2'), t('webDevList3')],
    },
    {
      id: 'mobileDev',
      icon: 'android',
      bgIcon: 'smartphone',
      title: t('mobileDev'),
      desc: t('mobileDevDesc'),
      list: [t('mobileDevList1'), t('mobileDevList2'), t('mobileDevList3')],
    },
    {
      id: 'uiux',
      icon: 'category',
      bgIcon: 'draw',
      title: t('design'),
      desc: t('designDesc'),
      list: [t('designList1'), t('designList2'), t('designList3')],
    },
    {
      id: 'marketing',
      icon: 'rocket_launch',
      bgIcon: 'trending_up',
      title: t('marketing'),
      desc: t('marketingDesc'),
      list: [t('marketingList1'), t('marketingList2'), t('marketingList3')],
    },
  ];

  return (
    <section className="py-32 px-6 md:px-8 bg-[#1c1b1b] relative overflow-hidden">
      {/* Subtle top separator glow */}
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#B6FF33]/30 to-transparent" />

      <div className="max-w-screen-2xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <FadeIn direction="left" className="max-w-2xl">
            <p className="font-headline text-[10px] uppercase tracking-[0.25em] text-[#B6FF33] font-bold mb-4">
              {t('badge')}
            </p>
            <h2 className="font-headline font-bold text-4xl md:text-6xl tracking-tight text-[#e5e2e1] leading-[1.05]">
              {t('title1')}
              <br />
              <em className="text-[#e5e2e1]/35 not-italic">{t('title2')}</em>
            </h2>
          </FadeIn>

          {/* Decorative hairline */}
          <div className="h-px flex-grow bg-gradient-to-r from-white/5 to-transparent mx-12 hidden lg:block" />

          <FadeIn direction="right" delay={0.2} className={`${isRtl ? '' : 'text-right'} max-w-64`}>
            <p className="text-[#e5e2e1]/40 text-sm leading-relaxed">
              {t('description')}
            </p>
          </FadeIn>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-5%' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]"
        >
          {servicesList.map((service, idx) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              className="group relative bg-[#131313] p-10 py-16 transition-all duration-700 hover:bg-[#2a2a2a] overflow-hidden cursor-default"
            >
              {/* Ghost background icon */}
              <div className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} p-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none`}>
                <span className="material-symbols-outlined text-[8rem] leading-none">{service.bgIcon}</span>
              </div>

              {/* Lime top-edge glow on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B6FF33] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Icon */}
              <span className="material-symbols-outlined text-[#B6FF33] text-4xl mb-8 block group-hover:scale-110 group-hover:[text-shadow:0_0_15px_rgba(182,255,51,0.6)] transition-all duration-500">
                {service.icon}
              </span>

              {/* Content */}
              <h3 className="font-headline text-2xl font-bold mb-4 text-[#e5e2e1]">{service.title}</h3>
              <p className="text-[#e5e2e1]/50 text-[0.95rem] mb-8 group-hover:text-[#e5e2e1]/80 transition-colors duration-500 leading-relaxed">
                {service.desc}
              </p>

              {/* List — slides up on hover */}
              <ul className="space-y-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-[11px] font-label font-bold uppercase tracking-widest text-[#B6FF33]">
                {service.list.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1 h-1 flex-shrink-0 bg-[#B6FF33] rounded-sm" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Card number */}
              <div className={`absolute bottom-8 ${isRtl ? 'left-10' : 'right-10'} font-headline font-black text-6xl text-white/[0.025] select-none`}>
                0{idx + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
