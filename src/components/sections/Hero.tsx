'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import LiquidChrome from '@/components/LiquidChrome';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#001640]">
      {/* Liquid Chrome Background */}
      <LiquidChrome 
        baseColor={[0.0, 0.09, 0.25]} 
        speed={0.15}
        amplitude={0.4}
        frequencyX={2.5}
        frequencyY={2.5}
        interactive={true}
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
    </section>
  );
}


