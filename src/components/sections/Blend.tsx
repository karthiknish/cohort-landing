'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

export default function Blend() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="blend" 
      ref={ref} 
      className="min-h-[70vh] flex flex-col justify-center bg-[#fffcf3] relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-end">
          {/* Left Column - Text Content */}
          <motion.div
            className="space-y-6 pb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-2xl md:text-3xl lg:text-4xl text-[#001640] leading-[1.5] font-normal">
              Blend years of agency experience with innovative technology, and you get{' '}
              <span className="text-[#004aad]">Cohorts.team</span>.
            </p>
          </motion.div>

          {/* Right Column - Image with cropped top */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Image container */}
            <div className="relative rounded-[2rem] overflow-hidden h-[300px] md:h-[400px]">
              <Image
                src="/background.jpeg"
                alt="Innovative technology"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[#001640]/20" />
            </div>

            {/* Core Indicator - Below the image */}
            <motion.div 
              className="flex items-center justify-center gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="text-base font-medium text-[#001640] tracking-wide">Core</span>
              <div className="w-10 h-10 rounded-full border border-[#001640] flex items-center justify-center">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-[#001640]"
                >
                  <path d="M17 7L7 17" />
                  <path d="M7 7L7 17L17 17" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
