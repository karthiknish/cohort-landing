'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });


  return (
    <section id="features" className="bg-[#fffcf3] min-h-screen flex flex-col justify-center py-24 md:pb-32 lg:pb-40 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-stretch">
          
          {/* Mobile Title - Shown only on mobile, before paragraphs */}
          <div className="lg:hidden -mt-24">
            <motion.div
              className="rounded-b-[2rem] rounded-t-none border-x border-b border-t-0 border-[#001640] p-8 flex flex-col justify-end min-h-[300px] bg-[#fffcf3]"
              initial={{ opacity: 0, y: -30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-normal leading-[1.1] text-[#001640] tracking-tight mt-auto">
                What makes us <br />
                <span className="text-[#004aad]">different</span>?
              </h2>
            </motion.div>
          </div>

          {/* Left Column - Text Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div 
              className="space-y-8 max-w-2xl"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <p className="text-2xl md:text-3xl text-[#001640] leading-[1.6] text-justify font-normal">
                We have built the <span className="text-[#004aad]">Magic Dashboard</span>, a platform every marketeer wishes existed. It allows you to track advertising performance on all platforms, review SEO metrics, sentiment analysis, generate proposals, monitor/assign tasks and communicate with your team, all in one place.
              </p>
              
              <p className="text-2xl md:text-3xl text-[#001640] leading-[1.6] text-justify font-normal">
                A dashboard like this saves 4 hours in a marketeer's day. An <span className="text-[#004aad]">average agency spends £350</span> a month on subscriptions to tools. The Magic Dashboard is included as part of your service and costs <span className="text-[#004aad] font-bold">£0</span>.
              </p>
            </motion.div>

            {/* Grow Indicator */}
            <motion.div 
              className="flex items-center gap-4 mt-12 lg:mt-20"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-base font-medium text-[#001640] tracking-wide">Grow</span>
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
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Placeholder for grid alignment */}
          <div className="hidden lg:block lg:col-span-5" />
        </div>
      </div>

      {/* Title Card - Positioned absolutely to bleed to right edge */}
      <motion.div
        className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 w-[40%] xl:w-[35%]"
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex-1 rounded-l-[3rem] rounded-r-none border-y border-l border-r-0 border-[#001640] p-10 md:p-12 flex flex-col justify-center min-h-[700px] relative overflow-hidden bg-[#fffcf3]">
          <h2 className="text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.1] text-[#001640] tracking-tight">
            What makes us <br />
            <span className="text-[#004aad]">different</span>?
          </h2>
        </div>
      </motion.div>
    </section>
  );
}
