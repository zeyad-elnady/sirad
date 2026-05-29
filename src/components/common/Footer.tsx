"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES WITH SIRAD BRAND COLORS
// -------------------------------------------------------------------------
const STYLES = `
.cinematic-footer-wrapper {
  font-family: var(--font-body), sans-serif;
  -webkit-font-smoothing: antialiased;
  
  /* Dynamic Variables using custom Obsidian and Bio-Digital Lime tokens */
  --pill-bg-1: rgba(255, 255, 255, 0.03);
  --pill-bg-2: rgba(255, 255, 255, 0.01);
  --pill-shadow: rgba(0, 0, 0, 0.5);
  --pill-highlight: rgba(255, 255, 255, 0.08);
  --pill-inset-shadow: rgba(0, 0, 0, 0.8);
  --pill-border: rgba(255, 255, 255, 0.08);
  
  --pill-bg-1-hover: rgba(255, 255, 255, 0.08);
  --pill-bg-2-hover: rgba(255, 255, 255, 0.02);
  --pill-border-hover: rgba(182, 255, 51, 0.3); /* Brand lime green hover border */
  --pill-shadow-hover: rgba(0, 0, 0, 0.7);
  --pill-highlight-hover: rgba(255, 255, 255, 0.15);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.7; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(182, 255, 51, 0.3)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px rgba(182, 255, 51, 0.6)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

/* Theme-adaptive Aurora Glow (Bio-Digital Lime and Soft Lilac) */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(182, 255, 51, 0.12) 0%, 
    rgba(198, 191, 255, 0.08) 40%, 
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: #B6FF33; /* Glow/accent color on hover */
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-family: var(--font-headline), sans-serif;
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.03);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  font-family: var(--font-headline), sans-serif;
  background: linear-gradient(180deg, #FAFFF3 0%, rgba(229, 226, 225, 0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px rgba(182, 255, 51, 0.15));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE (Zero Dependency)
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
    href?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------------
const MarqueeItem = ({ t }: { t: any }) => (
  <div className="flex items-center space-x-12 px-6">
    <span>{t('sol_dev')}</span> <span className="text-[#B6FF33]">✦</span>
    <span>{t('sol_design')}</span> <span className="text-[#B6FF33]">✦</span>
    <span>{t('sol_marketing')}</span> <span className="text-[#B6FF33]">✦</span>
    <span>{t('sol_consultancy')}</span> <span className="text-[#B6FF33]">✦</span>
  </div>
);

export default function Footer() {
  const t = useTranslations('Footer');
  const tCTA = useTranslations('CTA');
  const tHero = useTranslations('Hero');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    // React strict mode compatible GSAP context cleanup
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Staggered Content Reveal
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* 
        The "Curtain Reveal" Wrapper:
        It sits in standard flow. Because it has clip-path, its contents
        are ONLY visible within its bounding box. 
      */}
      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        {/* The actual footer stays fixed to the viewport underneath everything */}
        <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-[#0e0e0e] text-[#e5e2e1] cinematic-footer-wrapper">
          
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none uppercase"
          >
            SIRAD
          </div>

          {/* 1. Diagonal Sleek Marquee (Top of footer) */}
          <div className="absolute top-28 left-0 w-full overflow-hidden border-y border-white/5 bg-[#0e0e0e]/60 backdrop-blur-md py-4 z-10 -rotate-2 scale-110 shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold font-headline tracking-[0.3em] text-[#e5e2e1]/40 uppercase">
              <MarqueeItem t={t} />
              <MarqueeItem t={t} />
              <MarqueeItem t={t} />
              <MarqueeItem t={t} />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-24 w-full max-w-5xl mx-auto">


            {/* Localized Kinetic Headline */}
            <h2
              ref={headingRef}
              className="text-4xl md:text-7xl font-bold font-headline text-center uppercase tracking-tighter mb-10 max-w-4xl"
            >
              <span className="footer-text-glow">{tCTA('title1')}</span>
              <span className="text-[#B6FF33] drop-shadow-[0_0_20px_rgba(182,255,51,0.35)] font-black mx-2">
                {tCTA('titleHighlight')}
              </span>
              <span className="footer-text-glow">{tCTA('title2')}</span>
            </h2>

            {/* Interactive Magnetic Pills Layout */}
            <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
              {/* Primary Localized CTA Links */}
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <MagneticButton as={Link} href="/contact" className="footer-glass-pill px-10 py-4 rounded-xl text-[#FAFFF3] font-bold font-headline text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 group">
                  <svg className="w-5 h-5 text-[#e5e2e1]/60 group-hover:text-[#B6FF33] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {tHero('getQuote')}
                </MagneticButton>
                
                <MagneticButton as={Link} href="/work" className="footer-glass-pill px-10 py-4 rounded-xl text-[#FAFFF3] font-bold font-headline text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 group">
                  <svg className="w-5 h-5 text-[#e5e2e1]/60 group-hover:text-[#B6FF33] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {tHero('portfolio')}
                </MagneticButton>
              </div>

              {/* Secondary Dynamic Text Links */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mt-2">
                <MagneticButton as="a" href="#" className="footer-glass-pill px-6 py-2.5 rounded-xl text-[#e5e2e1]/60 font-medium font-headline text-[10px] tracking-widest uppercase hover:text-[#B6FF33]">
                  {t('privacy')}
                </MagneticButton>
                <MagneticButton as="a" href="#" className="footer-glass-pill px-6 py-2.5 rounded-xl text-[#e5e2e1]/60 font-medium font-headline text-[10px] tracking-widest uppercase hover:text-[#B6FF33]">
                  {t('terms')}
                </MagneticButton>
                <MagneticButton as="a" href="#" className="footer-glass-pill px-6 py-2.5 rounded-xl text-[#e5e2e1]/60 font-medium font-headline text-[10px] tracking-widest uppercase hover:text-[#B6FF33]">
                  {t('cookies')}
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Copyright */}
            <div className="text-[#e5e2e1]/40 text-[10px] md:text-xs font-semibold tracking-widest uppercase order-2 md:order-1 font-headline">
              {t('copyright')}
            </div>

            {/* "Made with Love" Badge */}
            <div className="footer-glass-pill px-6 py-3 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-white/5">
              <span className="text-[#e5e2e1]/40 text-[10px] md:text-xs font-bold uppercase tracking-widest font-headline">Crafted with</span>
              <span className="animate-footer-heartbeat text-sm md:text-base text-[#B6FF33]">✦</span>
              <span className="text-[#e5e2e1]/40 text-[10px] md:text-xs font-bold uppercase tracking-widest font-headline">by</span>
              <span className="text-[#B6FF33] font-black text-xs md:text-sm tracking-normal ml-1 font-headline">Sirad</span>
            </div>

            {/* Back to top */}
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full footer-glass-pill flex items-center justify-center text-[#e5e2e1]/60 hover:text-[#B6FF33] group order-3"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </MagneticButton>

          </div>
        </footer>
      </div>
    </>
  );
}
