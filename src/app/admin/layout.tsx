import { AdminAuthProvider } from '@/components/AdminAuthProvider';
import '../globals.css';

export const metadata = {
  title: 'Admin | Cohort',
  description: 'Admin dashboard for managing leads',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}
