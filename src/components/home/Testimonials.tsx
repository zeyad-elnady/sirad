'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee-01-utils/marquee";
import { useTranslations } from 'next-intl';
import FadeIn from '@/components/common/FadeIn';

const reviews = [
  {
    name: "Sarah Jenkins",
    username: "CMO, Nexus Tech",
    body: "Sirad transformed our entire digital presence. Their attention to pixel-perfect detail and deep understanding of our brand was incredible. The results exceeded every benchmark we set.",
    profile: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
  },
  {
    name: "Omar T.",
    username: "Founder & CEO, Velocity",
    body: "The most professional agency we've ever partnered with. The ROI from their marketing campaigns exceeded our highest projections. Truly a world-class team.",
    profile: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
  },
  {
    name: "Elena Rodriguez",
    username: "Product Lead, Aura",
    body: "A phenomenal team. They didn't just build a stunning mobile app; they reimagined our entire user experience from the ground up. Our engagement metrics tripled.",
    profile: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=faces",
  },
  {
    name: "James Liu",
    username: "CTO, Orbit Labs",
    body: "Switching to Sirad streamlined our entire workflow. Setup was effortless, performance improved instantly, and our team now ships features faster without worrying about infrastructure.",
    profile: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces",
  },
  {
    name: "Nadia Khaled",
    username: "Marketing Director, Solaris",
    body: "We evaluated multiple agencies, but Sirad stood out immediately. They're fast, creative, and thoughtfully design every detail for growth-focused brands that need stability without added complexity.",
    profile: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces",
  },
  {
    name: "Marcus Webb",
    username: "Head of Brand, Crest Digital",
    body: "Our productivity has nearly doubled since onboarding with Sirad. Their automation features removed repetitive bottlenecks, allowing our team to focus entirely on creative strategy.",
    profile: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces",
  },
  {
    name: "Priya Sharma",
    username: "Co-Founder, Wavelength",
    body: "What surprised us most was how quickly our vision came to life. Minimal back-and-forth, excellent communication, and powerful execution. A must-have partner for modern SaaS companies.",
    profile: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
  },
  {
    name: "Thomas Reeves",
    username: "CEO, Pinnacle Group",
    body: "This is easily one of the best investments we've made. Sirad delivered a platform that's intuitive, seamlessly integrated, and saves our team countless hours every single week.",
    profile: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=faces",
  },
];

const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

const ReviewCard = ({
  profile,
  name,
  username,
  body,
}: {
  profile: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <Card className="relative h-full w-72 cursor-pointer overflow-hidden border-white/8 bg-[#1a1a1a] shadow-none p-5 mx-2 hover:border-[#B6FF33]/30 transition-all duration-300">
      <CardContent className="p-0 flex flex-col gap-3">
        <div className="flex flex-row items-center gap-3">
          <img
            className="rounded-full w-9 h-9 object-cover border border-white/10"
            width="36"
            height="36"
            alt={name}
            src={profile}
          />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-[#e5e2e1]">{name}</p>
            <p className="text-xs font-medium text-[#e5e2e1]/40">
              {username}
            </p>
          </div>
        </div>
        {/* Stars */}
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3.5 h-3.5 text-[#B6FF33]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-sm text-[#e5e2e1]/70 leading-relaxed line-clamp-3">{body}</p>
      </CardContent>
    </Card>
  );
};

export default function Testimonials() {
  const t = useTranslations('Testimonials');

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B6FF33]/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 md:px-8 relative z-10 w-full">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <FadeIn direction="up">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-[#B6FF33]/20 bg-[#B6FF33]/5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF33] animate-ping" />
              <span className="font-headline text-[10px] uppercase tracking-[0.15em] text-[#B6FF33] font-bold">
                {t('badge')}
              </span>
            </div>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <h2 className="font-headline font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#e5e2e1]">
              {t('title')}
            </h2>
          </FadeIn>
        </div>
      </div>

      {/* Marquee — full bleed */}
      <FadeIn direction="up" delay={0.2}>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4">
          <Marquee pauseOnHover className="[--duration:30s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username + review.name} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:30s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username + review.name} {...review} />
            ))}
          </Marquee>

          {/* Edge fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-[#131313] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[#131313] to-transparent" />
        </div>
      </FadeIn>
    </section>
  );
}
