import Sidebar from '@/components/Sidebar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export default async function DashboardLayout({ children }) {
  const session = await auth();
  
  if (!session?.user?.userId) {
    redirect('/login');
  }



  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row pb-20 md:pb-0">
      <Sidebar />
      <main className="flex-1 md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
