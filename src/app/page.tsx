'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Ethos from '@/components/sections/Ethos';
import Features from '@/components/sections/Features';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const rafRef = useRef<number | null>(null);
  const sectionsCount = 6;

  const scrollToSection = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    const sections = container.querySelectorAll(':scope > section, :scope > footer');
    const targetSection = sections[index];
    
    if (targetSection) {
      // Use RAF for smoother animation
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      
      rafRef.current = requestAnimationFrame(() => {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let accumulatedDelta = 0;
    const DELTA_THRESHOLD = 30;
    const SCROLL_COOLDOWN = 800;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrolling) return;

      accumulatedDelta += e.deltaY;

      // Only trigger when accumulated scroll exceeds threshold
      if (Math.abs(accumulatedDelta) < DELTA_THRESHOLD) return;

      const direction = accumulatedDelta > 0 ? 1 : -1;
      accumulatedDelta = 0; // Reset accumulated delta

      const nextSection = Math.max(0, Math.min(sectionsCount - 1, currentSection + direction));
      
      if (nextSection !== currentSection) {
        setIsScrolling(true);
        setCurrentSection(nextSection);
        scrollToSection(nextSection);
        
        // Reset scrolling flag after animation
        setTimeout(() => setIsScrolling(false), SCROLL_COOLDOWN);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      let direction = 0;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        direction = 1;
        e.preventDefault();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        direction = -1;
        e.preventDefault();
      }
      
      if (direction !== 0) {
        const nextSection = Math.max(0, Math.min(sectionsCount - 1, currentSection + direction));
        if (nextSection !== currentSection) {
          setIsScrolling(true);
          setCurrentSection(nextSection);
          scrollToSection(nextSection);
          setTimeout(() => setIsScrolling(false), SCROLL_COOLDOWN);
        }
      }
    };

    // Touch handling for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      if (Math.abs(diff) > 50) {
        const direction = diff > 0 ? 1 : -1;
        const nextSection = Math.max(0, Math.min(sectionsCount - 1, currentSection + direction));
        
        if (nextSection !== currentSection) {
          setIsScrolling(true);
          setCurrentSection(nextSection);
          scrollToSection(nextSection);
          setTimeout(() => setIsScrolling(false), SCROLL_COOLDOWN);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentSection, isScrolling, scrollToSection]);

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-hidden touch-none"
    >
      <Hero />
      <About />
      <Ethos />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
