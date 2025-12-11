'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      number: "01",
      title: "Join the Cohort",
      description: "Connect with like-minded individuals who share your passion for excellence and innovation.",
      icon: "🎯"
    },
    {
      number: "02",
      title: "Learn & Grow",
      description: "Access exclusive resources, mentorship, and opportunities tailored to accelerate your growth.",
      icon: "📈"
    },
    {
      number: "03",
      title: "Build Together",
      description: "Collaborate on meaningful projects that push boundaries and create real impact.",
      icon: "🔨"
    },
    {
      number: "04",
      title: "Achieve More",
      description: "Unlock your full potential with a supportive community that celebrates your success.",
      icon: "🏆"
    }
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-[#111111]" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full mb-4 uppercase tracking-widest">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
            How it <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">works</span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-4">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gradient-to-br from-secondary/60 to-secondary/30 border border-white/10 rounded-xl hover:border-primary/30 hover:translate-x-2 transition-all"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="text-5xl font-black text-primary/60 min-w-[80px] text-center md:text-left">
                {feature.number}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-1">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
              <div className="text-4xl opacity-80">{feature.icon}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
