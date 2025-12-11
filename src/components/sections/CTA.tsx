'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';
import BrochureModal from '../BrochureModal';

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="contact" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-[20%] w-96 h-96 bg-primary/15 rounded-full blur-[100px]" />
          <div className="absolute top-0 right-[20%] w-64 h-64 bg-orange-400/10 rounded-full blur-[80px]" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-secondary/90 to-secondary/50 border-white/10 shadow-2xl">
              <CardContent className="text-center p-10 md:p-16">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
                  Ready to join the <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Cohort</span>?
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                  Download our brochure to learn more about how we can help you 
                  achieve extraordinary things together.
                </p>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold text-lg px-8 py-6 shadow-[0_0_40px_rgba(255,107,53,0.3)] hover:shadow-[0_0_50px_rgba(255,107,53,0.4)] transition-all"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Brochure
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <BrochureModal onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
