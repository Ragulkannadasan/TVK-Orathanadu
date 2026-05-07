import Sidebar from '@/components/Sidebar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function PoruppalarLayout({ children }) {
  const session = await auth();
  
  if (!session?.user) redirect('/login');

  if (session.user.role !== 'Poruppalar' && session.user.role !== 'Admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row pb-20 md:pb-0">
      <Sidebar />
      <main className="flex-1 md:ml-64 min-h-screen">{children}</main>
    </div>
  );
}
