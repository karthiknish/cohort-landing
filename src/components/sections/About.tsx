'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      title: "High-Agency",
      description: "We believe in empowering individuals to take ownership and drive meaningful change.",
      icon: "🚀"
    },
    {
      title: "Collaboration",
      description: "Great work happens when talented people come together with a shared vision.",
      icon: "🤝"
    },
    {
      title: "Innovation",
      description: "We push boundaries and challenge conventions to create something extraordinary.",
      icon: "💡"
    },
    {
      title: "Excellence",
      description: "We hold ourselves to the highest standards in everything we do.",
      icon: "⭐"
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <section id="about" className="py-24 md:py-32" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full mb-4 uppercase tracking-widest">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            We obsess over our <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">talent</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Because great work has great people at the heart of it. We bring together 
            fired-up, well-rested, fairly-paid individuals who are passionate about 
            building the future.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {values.map((value, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="bg-gradient-to-br from-secondary/80 to-secondary/40 border-white/10 hover:border-primary/30 transition-all h-full">
                <CardContent className="p-6">
                  <span className="text-4xl block mb-4">{value.icon}</span>
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
