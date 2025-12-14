import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Ethos from '@/components/sections/Ethos';
import Features from '@/components/sections/Features';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Ethos />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
