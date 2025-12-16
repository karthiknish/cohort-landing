'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import BrochureModal from './BrochureModal';
import { trackEvent } from '@/lib/analytics-ingest';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 py-4 bg-gradient-to-b from-[#0A0A0A]/90 to-transparent backdrop-blur-sm"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.a 
            href="/" 
            className="text-2xl font-black tracking-widest text-white hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            COHORT
          </motion.a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              About
            </a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              Features
            </a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              Contact
            </a>
          </div>

          <Button 
            onClick={() => {
              trackEvent('cta_clicked', { cta_name: 'download_brochure', location: 'navbar' });
              setIsModalOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-[0_0_20px_rgba(255,107,53,0.3)] hover:shadow-[0_0_30px_rgba(255,107,53,0.4)] transition-all"
          >
            Download Brochure
          </Button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isModalOpen && (
          <BrochureModal source="navbar" onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
