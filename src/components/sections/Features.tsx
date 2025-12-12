'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BarChart3, Search, MessageSquare, FileText, CheckSquare, Users } from 'lucide-react';

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const dashboardFeatures = [
    { icon: BarChart3, label: "Track advertising performance" },
    { icon: Search, label: "Review SEO metrics" },
    { icon: MessageSquare, label: "Sentiment analysis" },
    { icon: FileText, label: "Generate proposals" },
    { icon: CheckSquare, label: "Monitor & assign tasks" },
    { icon: Users, label: "Team communication" },
  ];


  return (
    <section id="features" className="py-24 md:py-32 bg-[#001640]" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-[#F8F8FF] bg-[#7389F4]/20 border border-[#7389F4]/30 rounded-full mb-4 uppercase tracking-widest">
            Our Edge
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-[#F8F8FF] mb-6">
            How are we <span className="text-[#7389F4]">different</span>?
          </h2>
          <div className="text-lg text-[#F8F8FF]/80 max-w-3xl mx-auto leading-relaxed space-y-4">
            <p>
              We have built the <span className="font-bold text-[#7389F4]">Magic Dashboard</span>, a platform every marketeer wishes existed.
            </p>
            <p>
              It allows you to track advertising performance on all platforms, review SEO metrics, sentiment analysis, generate proposals, monitor/assign tasks and communicate with your team, all in one place.
            </p>
          </div>
        </motion.div>

        {/* Dashboard Features Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {dashboardFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-4 bg-[#F8F8FF]/10 border border-[#F8F8FF]/20 rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-lg bg-[#7389F4]/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#7389F4]" />
                </div>
                <span className="text-sm font-medium text-[#F8F8FF]">{feature.label}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-lg text-[#F8F8FF]/80 max-w-2xl mx-auto">
            An average agency spends <span className="font-bold text-[#F8F8FF]">£350 a month</span> on subscription tools. 
            The Magic Dashboard is included as part of your service.
          </p>
        </motion.div>
      </div>
    </section>
  );
}


