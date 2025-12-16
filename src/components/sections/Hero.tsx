'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import TotalViews from '@/components/TotalViews';

export default function Hero() {
  return (
    <section className="relative z-20 min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#001640]">
      {/* Background Image */}
      <Image
        src="/background.jpeg"
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      
      {/* Slight overlay for better logo visibility */}
      <div className="absolute inset-0 bg-[#001640]/40 pointer-events-none" />
      
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <Image
          src="/logo_white.svg"
          alt="Cohort"
          width={300}
          height={100}
          priority
          className="w-48 sm:w-64 md:w-80 lg:w-96 h-auto"
        />
      </motion.div>

      <motion.div
        className="absolute top-6 right-6 z-10 rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md px-4 py-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <TotalViews />
      </motion.div>

      {/* Purpose Indicator at bottom */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <span className="text-base font-medium text-[#F8F8FF] tracking-wide">Purpose</span>
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
    </section>
  );
}
