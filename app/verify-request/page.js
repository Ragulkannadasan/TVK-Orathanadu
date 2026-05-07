import Link from 'next/link';
import { Mail } from 'lucide-react';

export const metadata = { title: 'Check Your Email – TVK Orathanadu' };

export default function VerifyRequestPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-[#800000]/20 border border-[#800000]/40 flex items-center justify-center mx-auto mb-6 animate-float">
          <Mail className="text-[#FFD700]" size={36} />
        </div>
        <h1 className="text-white font-bold text-3xl mb-3">Check Your Email</h1>
        <p className="tamil text-[#FFD700]/70 text-lg mb-2">உங்கள் மின்னஞ்சலை சரிபார்க்கவும்</p>
        <p className="text-white/50 text-sm mb-8">
          A sign-in link has been sent to your email. Click the link in the email to sign in.
        </p>
        <div className="glass rounded-xl p-4 text-white/40 text-sm mb-6">
          <p>If you don't see the email, check your spam folder.</p>
          <p className="tamil mt-1 text-xs">மின்னஞ்சல் காணவில்லை என்றால் spam கோப்புறையை சரிபார்க்கவும்.</p>
        </div>
        <Link href="/login" className="text-[#FFD700]/70 hover:text-[#FFD700] text-sm transition-colors">
          ← Try a different email
        </Link>
      </div>
    </main>
  );
}
