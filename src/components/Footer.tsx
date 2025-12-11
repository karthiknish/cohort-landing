'use client';

import { motion } from 'framer-motion';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Features", href: "#features" },
        { label: "Contact", href: "#contact" },
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Community", href: "#" },
        { label: "Blog", href: "#" },
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
      ]
    }
  ];

  return (
    <footer className="py-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <a href="/" className="text-2xl font-black tracking-widest text-white inline-block mb-4">
              COHORT
            </a>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Building the future with the most talented individuals.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 flex items-center justify-center text-muted-foreground bg-secondary rounded-full hover:text-white hover:bg-primary transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center text-muted-foreground bg-secondary rounded-full hover:text-white hover:bg-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center text-muted-foreground bg-secondary rounded-full hover:text-white hover:bg-primary transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {footerLinks.map((column, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Cohort. All rights reserved.</p>
          <p>Made with <span className="text-primary">♥</span> for extraordinary people</p>
        </div>
      </div>
    </footer>
  );
}
