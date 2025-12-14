'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Linkedin } from 'lucide-react';
import BrochureModal from '../BrochureModal';
import DotGrid from '../DotGrid';
import Image from 'next/image';

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="contact" className="min-h-screen flex flex-col relative bg-[#fffcf3] overflow-hidden" ref={ref}>
        {/* DotGrid Background */}
        <DotGrid 
          dotSize={4}
          gap={24}
          baseColor="#7389F4"
          activeColor="#001640"
          proximity={100}
          shockRadius={200}
          shockStrength={3}
          returnDuration={1.2}
        />
        
        {/* Top Content Area */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.1] text-[#001640] tracking-tight">
                Keen to know <br />
                <span className="text-[#004aad]">more</span>?
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <span className="text-lg md:text-xl text-[#001640]">Reach out to us on</span>
              <a 
                href="https://www.linkedin.com/company/cohorts-team" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#001640] flex items-center justify-center hover:bg-[#001640]/80 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Bottom Card - Full Width Bleed with Background Image */}
        <motion.div 
          className="relative z-10 w-full -mx-0"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative rounded-t-[3rem] border-t border-x border-[#001640]/20 overflow-hidden min-h-[300px] md:min-h-[350px]">
            {/* Background Image */}
            <Image
              src="/background.jpeg"
              alt="Background"
              fill
              className="object-cover"
            />
            
            {/* Glassy Overlay */}
            <div className="absolute inset-0 bg-[#001640]/30 backdrop-blur-sm" />
            
            {/* Content */}
            <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col items-start justify-center h-full min-h-[300px] md:min-h-[350px]">
              <div className="max-w-md">
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  variant="ghost"
                  className="text-[#F8F8FF] hover:text-[#F8F8FF] hover:bg-white/10 text-lg px-0 flex items-center gap-3"
                >
                  Download Brochure
                  <div className="w-10 h-10 rounded-full border border-[#F8F8FF] flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                </Button>
              </div>
            </div>

            {/* Footer Content - Inside the card */}
            <div className="absolute bottom-4 left-0 right-0 px-8 md:px-12 lg:px-16 flex justify-between items-center text-sm text-[#F8F8FF]/70">
              <p>© {new Date().getFullYear()} Cohortsteam. All rights reserved.</p>
              <p>Made with <span className="text-red-500">❤</span> for Ad agencies</p>
            </div>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <BrochureModal onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
