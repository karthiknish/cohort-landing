'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/password-reset/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gradient-to-br from-secondary/95 to-secondary/70 border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <a href="/" className="text-2xl font-black tracking-widest text-primary inline-block mb-4">
              COHORT
            </a>
            <CardTitle className="text-xl">
              {success ? 'Check Your Email' : 'Forgot Password'}
            </CardTitle>
            <CardDescription>
              {success
                ? 'We sent you a password reset link'
                : 'Enter your email to receive a reset link'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  If an account exists for <span className="text-white font-medium">{email}</span>, you&apos;ll receive a password reset link shortly.
                </p>
                <p className="text-muted-foreground text-xs">
                  The link expires in 1 hour. Check your spam folder if you don&apos;t see it.
                </p>
                <a
                  href="/admin/login"
                  className="flex items-center justify-center gap-2 text-primary hover:underline mt-6 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </a>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                      className="bg-background border-white/10 focus:border-primary focus:ring-primary/30 pl-10"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-[0_0_30px_rgba(255,107,53,0.3)]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>

                <a
                  href="/admin/login"
                  className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-6 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </a>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
