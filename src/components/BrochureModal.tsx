'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, Check, Loader2 } from 'lucide-react';

interface BrochureModalProps {
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string; // Honeypot field - should remain empty
}

export default function BrochureModal({ onClose }: BrochureModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '', // Honeypot
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formLoadTime] = useState(Date.now()); // Track when form opened

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Spam checks
    // 1. Honeypot field should be empty (bots fill it)
    if (formData.website) {
      console.warn('Honeypot triggered');
      setIsSuccess(true); // Fake success for bots
      return;
    }

    // 2. Form submitted too quickly (less than 3 seconds)
    const timeTaken = Date.now() - formLoadTime;
    if (timeTaken < 3000) {
      console.warn('Form submitted too quickly');
      setError('Please take a moment to fill out the form.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { website, ...submitData } = formData; // Exclude honeypot from submission
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSuccess(true);

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 4000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-[#F8F8FF] border-[#001640]/10">
        {isSuccess ? (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-[#7389F4] rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-[#F8F8FF]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Thank You!</h3>
            <p className="text-muted-foreground">Your brochure has been sent to your email!</p>
            <p className="text-sm text-muted-foreground mt-2">Check your inbox (and spam folder).</p>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">Download Brochure</DialogTitle>
              <DialogDescription className="text-center">
                Fill in your details to receive our comprehensive brochure
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="bg-[#F1F1E6] border-[#001640]/10 focus:border-[#7389F4] focus:ring-[#7389F4]/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="bg-[#F1F1E6] border-[#001640]/10 focus:border-[#7389F4] focus:ring-[#7389F4]/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (234) 567-890"
                  className="bg-[#F1F1E6] border-[#001640]/10 focus:border-[#7389F4] focus:ring-[#7389F4]/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company"
                  className="bg-[#F1F1E6] border-[#001640]/10 focus:border-[#7389F4] focus:ring-[#7389F4]/30"
                />
              </div>

              {/* Honeypot field - hidden from users, bots will fill it */}
              <div className="hidden" aria-hidden="true">
                <Label htmlFor="website">Website</Label>
                <Input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-[#001640] hover:bg-[#001640]/90 text-[#F8F8FF] font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Get Brochure'
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
