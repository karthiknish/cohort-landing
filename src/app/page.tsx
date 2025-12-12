import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Features from '@/components/sections/Features';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <section className="snap-start">
        <Hero />
      </section>
      <section className="snap-start">
        <About />
      </section>
      <section className="snap-start">
        <Features />
      </section>
      <section className="snap-start">
        <CTA />
      </section>
      <section className="snap-start">
        <Footer />
      </section>
    </div>
  );
}


