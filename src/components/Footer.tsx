'use client';

import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-[#001640]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Logo */}
          <a href="/">
            <Image 
              src="/logo_white.svg" 
              alt="Cohort Logo" 
              width={140} 
              height={40}
              className="h-10 w-auto"
            />
          </a>

          {/* LinkedIn CTA */}
          <Button
            asChild
            className="bg-[#7389F4] hover:bg-[#7389F4]/90 text-[#F8F8FF] font-semibold px-6"
          >
            <a 
              href="https://www.linkedin.com/company/cohorts-team" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Linkedin className="w-5 h-5" />
              Follow us on LinkedIn
            </a>
          </Button>
        </motion.div>

        <div className="text-center mt-8 pt-6 border-t border-[#F8F8FF]/10 text-sm text-[#F8F8FF]/50">
          <p>© {currentYear} Cohort. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

