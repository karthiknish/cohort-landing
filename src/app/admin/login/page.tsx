'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AdminAuthProvider';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/admin/leads');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
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
            <CardTitle className="text-xl">Admin Login</CardTitle>
            <CardDescription>Sign in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="bg-background border-white/10 focus:border-primary focus:ring-primary/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-background border-white/10 focus:border-primary focus:ring-primary/30"
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-[0_0_30px_rgba(255,107,53,0.3)]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <a href="/" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-6 text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to website
            </a>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
