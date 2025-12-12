'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const ethos = [
    {
      title: "4x4 Work Week",
      description: "Prioritise efficiency.",
      image: "/ethos/efficiency.png",
      colSpan: "md:col-span-2"
    },
    {
      title: "Collective Intelligence",
      description: "None of us is as smart as all of us.",
      image: "/ethos/intelligence.png",
      colSpan: "md:col-span-1"
    },
    {
      title: "Great Culture",
      description: "Good work, good place to work.",
      image: "/ethos/culture.png",
      colSpan: "md:col-span-1"
    },
    {
      title: "Dedicated Focus",
      description: "One cohort, one client.",
      image: "/ethos/focus.png",
      colSpan: "md:col-span-2"
    },
    {
      title: "Purpose Driven",
      description: "Purpose over profit.",
      image: "/ethos/purpose.png",
      colSpan: "md:col-span-3"
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
  };

  return (
    <section id="about" className="py-24 md:py-32" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        {/* What are we trying to build? */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-[#001640] bg-[#7389F4]/10 border border-[#7389F4]/30 rounded-full mb-4 uppercase tracking-widest">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight mb-6">
            What are we trying to <span className="text-[#7389F4]">build</span>?
          </h2>
          <div className="text-lg text-[#001640]/80 max-w-4xl mx-auto leading-relaxed space-y-6">
            <p>
              Agencies face capacity issues, burnout, slow hiring cycles, inconsistent freelancers or outsourced partners, communication gaps, and high overheads that come with in-house teams.
            </p>
            <p>
              We are building ad tech products to improve the way agencies operate. Work with talent from anywhere in the world without heavy overhead. Work with experts who have scaled brands and been part of the advertising Big Six.
            </p>
            <p className="text-xl">
              Blend years of agency experience with innovative technology, and you get <span className="font-bold text-[#7389F4]">cohorts.team</span>.
            </p>
          </div>
        </motion.div>

        {/* Our Ethos - Bento Grid */}
        <div className="bg-[#001640] rounded-3xl p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-normal text-[#F8F8FF]">Our Ethos</h3>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {ethos.map((value, index) => {
              return (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className={`${value.colSpan} group relative overflow-hidden rounded-2xl bg-[#001640] border border-[#F8F8FF]/10 hover:border-[#7389F4]/50 transition-all duration-300 isolate`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={value.image}
                      alt={value.title}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001640] via-[#001640]/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300" />
                  </div>

                  <div className="relative z-10 p-8 h-full flex flex-col justify-end min-h-[240px]">
                    <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h4 className="text-2xl text-[#F8F8FF] mb-2">{value.title}</h4>
                      <p className="text-[#F8F8FF]/80 leading-relaxed font-medium">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}


