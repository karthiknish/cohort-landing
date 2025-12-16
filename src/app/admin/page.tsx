'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AdminAuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Users, LogOut, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin/login');
      }
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    // Keep this page as the "home"; logging out should land you back at login.
    try {
      // logout is available on the provider but not currently destructured here
      // We'll just navigate; the login page will enforce auth too.
      // (If you'd like, we can also expose logout here.)
      await (await import('@/lib/firebase')).auth.signOut();
    } catch {
      // ignore
    }
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-card">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-black tracking-widest text-primary">COHORT</Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-lg font-semibold">Admin</h1>
        </div>
        {user ? (
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        ) : null}
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[260px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !user ? (
          <div className="flex items-center justify-center min-h-[260px]">
            <div className="text-muted-foreground">Redirecting to login…</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/leads" className="group">
              <Card className="bg-gradient-to-br from-secondary/80 to-secondary/40 border-white/10 transition-all group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-0.5">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <div className="text-xl font-semibold">Leads</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        View, filter, export, and manage lead statuses.
                      </div>
                      <div className="mt-5">
                        <Button className="bg-primary hover:bg-primary/90">
                          Open Leads
                        </Button>
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/analytics" className="group">
              <Card className="bg-gradient-to-br from-secondary/80 to-secondary/40 border-white/10 transition-all group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-0.5">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <div className="text-xl font-semibold">Analytics</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        View event trends and top actions.
                      </div>
                      <div className="mt-5">
                        <Button className="bg-primary hover:bg-primary/90">
                          Open Analytics
                        </Button>
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
