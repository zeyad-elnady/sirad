import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HeroSection from '@/components/home/HeroSection';
import Services from '@/components/home/Services';
import Portfolio from '@/components/home/Portfolio';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="relative flex-1">
        <HeroSection />
        <Services />
        <Portfolio />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
