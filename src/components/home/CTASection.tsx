'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from '@/i18n/routing';

export default function CTASection() {
  const t = useTranslations('CTA');
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const yCard = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      ref={ref}
      className="py-24 px-6 md:px-8 relative overflow-hidden"
      style={{
        backgroundImage: [
          'linear-gradient(to bottom, #131313 0%, transparent 15%, transparent 85%, #0e0e0e 100%)',
          "url('https://lh3.googleusercontent.com/aida/ADBb0ugU6FQOuplUZWetrO22TpsF8rpL0eaFVzS6PQz2t3FoDx7hqzSESd6e7Wch-6umx4UAZWN6bRRmMKp-_Zhp0PwzYlXqcpoyoS6HWxeyvtq9OGL2Bhjzg7z8-GJh_qy_OTS4jt8BwesNIbC2FaW61FbUOWrnqy0LvP9Wffoqb8HGelRssfX6TLBt2YYacAzvNha1080l8jCFqv7xZ1MYYvhBOlVZOlJ932irfh2Kk5ERGFaQYBNiQJOSs4Jznf17Q6cXbZIrSERttQ')",
        ].join(', '),
        backgroundSize: 'auto, cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          style={{
            y: yCard,
            background: 'rgba(19, 19, 19, 0.65)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(182, 255, 51, 0.1)',
          }}
          className="relative group overflow-hidden rounded-[2rem] p-12 md:p-24 text-center"
        >
          {/* Hover glow fill */}
          <div className="absolute inset-0 bg-[#B6FF33]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[2rem]" />

          {/* Decorative corner dots  */}
          <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-[#B6FF33]/30" aria-hidden />
          <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-[#B6FF33]/30" aria-hidden />
          <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-white/10" aria-hidden />
          <div className="absolute bottom-8 right-8 w-2 h-2 rounded-full bg-white/10" aria-hidden />

          <div className="relative z-10 space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-headline font-bold text-4xl md:text-7xl tracking-tighter text-[#e5e2e1]"
            >
              {t('title1')}
              <span className="text-[#B6FF33] glow-text">{t('titleHighlight')}</span>
              {t('title2')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-[#e5e2e1]/50 text-lg md:text-xl max-w-2xl mx-auto font-body leading-relaxed"
            >
              {t('description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/contact" className="group relative overflow-hidden bg-[#B6FF33] text-[#121f00] px-14 py-6 rounded-full font-headline font-black uppercase tracking-[0.2em] text-sm hover:shadow-[0_0_60px_rgba(182,255,51,0.65)] transition-all duration-500 active:scale-95 inline-flex items-center gap-3">
                <span className="relative z-10">{t('start')}</span>
                <span className="material-symbols-outlined text-base relative z-10 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
                {/* Shimmer sweep */}
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
