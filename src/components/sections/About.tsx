'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="min-h-screen flex flex-col justify-start bg-[#fffcf3] relative z-10">
      {/* What are we trying to build? - Matching Canva Design */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          {/* Left Column - Card (hidden on mobile, shown on desktop) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col relative z-20">
            <motion.div
              className="rounded-b-[3rem] rounded-t-none border-x border-b border-t-0 border-[#001640] p-10 md:p-12 flex flex-col justify-end h-[800px] relative overflow-hidden bg-[#fffcf3] -mt-32"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              {/* Title aligned to bottom */}
              <h2 className="text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.1] text-[#001640] tracking-tight mt-auto">
                What are we trying to <br />
                <span className="text-[#004aad]">build</span>?
              </h2>
            </motion.div>

            {/* Who Indicator - Desktop only */}
            <motion.div 
              className="flex items-center justify-center gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="text-base font-medium text-[#001640] tracking-wide">Who</span>
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
                  <path d="M7 17L17 17L17 7" />
                  <line x1="7" y1="7" x2="17" y2="17" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Mobile Card - Shown only on mobile */}
          <div className="lg:hidden flex flex-col relative z-20">
            <motion.div
              className="rounded-b-[2rem] rounded-t-none border-x border-b border-t-0 border-[#001640] p-8 flex flex-col justify-end min-h-[300px] relative overflow-hidden bg-[#fffcf3] -mt-8"
              initial={{ opacity: 0, y: -30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-normal leading-[1.1] text-[#001640] tracking-tight mt-auto">
                What are we trying to <br />
                <span className="text-[#004aad]">build</span>?
              </h2>
            </motion.div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-6 flex flex-col justify-start pt-16 lg:pt-24">
            <motion.div
              className="space-y-8 max-w-2xl"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-2xl md:text-3xl text-[#001640] leading-[1.6] text-justify font-normal">
                Modern agencies are under pressure to do more for less. Hiring great talent is slow, expensive, and risky. Freelancers are inconsistent, outsourced partners lack context, and in-house teams burn out under growing workloads and overheads.
              </p>
              
              <p className="text-2xl md:text-3xl text-[#001640] leading-[1.6] text-justify italic font-normal">
                We exist to fix that.
              </p>
              
              <p className="text-2xl md:text-3xl text-[#001640] leading-[1.6] text-justify font-normal">
                Our purpose is to remove the friction between ambition and execution. Hand-pick and hire a dedicated expert team (<span className="italic text-[#004aad]">cohort</span>), at the cost of hiring one resource. Built by seasoned agency people and powered by ad-tech, designed to remove the friction between ambition and execution.
              </p>
            </motion.div>

            {/* Who Indicator - Mobile only (after paragraphs) */}
            <motion.div 
              className="lg:hidden flex items-center justify-center gap-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="text-base font-medium text-[#001640] tracking-wide">Who</span>
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
                  <path d="M7 17L17 17L17 7" />
                  <line x1="7" y1="7" x2="17" y2="17" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}


