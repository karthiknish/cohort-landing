'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';
import BrochureModal from '../BrochureModal';
import DotGrid from '../DotGrid';

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="contact" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
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
        
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-[20%] w-96 h-96 bg-[#7389F4]/10 rounded-full blur-[100px]" />
          <div className="absolute top-0 right-[20%] w-64 h-64 bg-[#001640]/10 rounded-full blur-[80px]" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-[#F1F1E6] border-[#001640]/10 shadow-xl">
              <CardContent className="text-center p-10 md:p-16">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
                  Keen to know more about <span className="text-[#7389F4]">us</span>?
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                  Download our brochure to learn more about how we can help you 
                  achieve extraordinary things together.
                </p>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="bg-[#001640] hover:bg-[#001640]/90 text-[#F8F8FF] font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
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
