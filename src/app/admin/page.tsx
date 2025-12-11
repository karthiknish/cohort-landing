'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AdminAuthProvider';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/admin/leads');
      } else {
        router.push('/admin/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#0A0A0A',
      color: '#fff'
    }}>
      <div className="animate-pulse">Loading...</div>
    </div>
  );
}
