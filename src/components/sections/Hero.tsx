'use client';

import { motion, Variants } from 'framer-motion';

export default function Hero() {
  const words = [
    { text: "Cohort", highlight: true },
    { text: "is on a mission to bring together the" },
    { text: "most talented", highlight: true },
    { text: "individuals to build" },
    { text: "extraordinary", highlight: true },
    { text: "things." },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      rotateX: -90,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-32 px-6">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] bg-[radial-gradient(ellipse_at_center,rgba(255,107,53,0.08)_0%,rgba(255,107,53,0.02)_30%,transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl w-full text-center">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-10"
          style={{ perspective: '1000px' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              className={word.highlight ? 'bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent' : ''}
              variants={wordVariants}
              style={{ display: 'inline-block', marginRight: '0.3em' }}
            >
              {word.text}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-16 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Because great work has great people at the heart of it — fired-up, high-agency, fairly-paid people.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4 text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <motion.div 
            className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center pt-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <div className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
          <span>Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
}
