'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

export default function Ethos() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="ethos" 
      ref={ref} 
      className="min-h-screen flex flex-col justify-start relative z-0"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/background.jpeg"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#001640]/40" />
      </div>
      
      <div className="w-full px-12 lg:px-24 mx-auto relative z-10 pt-0 pb-8 md:pb-12 flex-1 flex flex-col">
        {/* Glassy Card Layout - Cropped top to appear emerging from above */}
        <div className="relative rounded-b-[3rem] rounded-t-none border-x border-b border-t-0 border-[#F8F8FF]/30 p-12 md:p-16 lg:p-20 overflow-hidden min-h-[700px] flex flex-col -mt-8 flex-1">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#fffcf3]/10 via-[#fffcf3]/5 to-transparent backdrop-blur-sm pointer-events-none" />
          
          <div className="relative z-10 flex-1 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <h3 className="text-3xl md:text-4xl text-[#F8F8FF] font-body font-normal">Our Ethos</h3>
            </motion.div>
            
            <div className="flex-1 flex items-center justify-center">
              <motion.div 
                className="space-y-8 md:space-y-10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {[
                  "1. 4x4 work week. Prioritise efficiency.",
                  "2. None of us is as smart as all of us.",
                  "3. Good work, good place to work.",
                  "4. One cohort, one client.",
                  "5. Purpose over profit."
                ].map((item, index) => (
                  <motion.p 
                    key={index}
                    className="text-xl md:text-2xl lg:text-3xl text-[#F8F8FF] font-light tracking-wide text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    {item}
                  </motion.p>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Moat Indicator - Outside the card */}
        <motion.div 
          className="flex items-center justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <span className="text-base font-medium text-[#F8F8FF] tracking-wide">Moat</span>
          <div className="w-10 h-10 rounded-full border border-[#F8F8FF] flex items-center justify-center">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-[#F8F8FF]"
            >
              <path d="M12 5v14" />
              <path d="M19 12l-7 7-7-7" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
