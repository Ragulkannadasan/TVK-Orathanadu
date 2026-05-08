'use client';
import { useState } from 'react';
import { adminLoginAction } from './actions';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, ArrowRight, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await adminLoginAction(form.email, form.password);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Banner */}
      <div className="md:flex-1 bg-[#800000] relative overflow-hidden hidden md:flex flex-col items-center justify-center p-12 text-center border-r border-[#FFD700]/20">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#FFD700] rounded-full blur-[150px] opacity-20" />
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 mx-auto mb-8 shadow-2xl">
            <Shield className="text-[#FFD700]" size={48} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white display-font mb-4 drop-shadow-lg">
            RESTRICTED<br />ACCESS
          </h1>
          <p className="text-white/80 text-lg max-w-md mx-auto">
            Authorized TVK Orathanadu administrative personnel only.
          </p>
        </div>
      </div>

      {/* Right side - Login */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 relative bg-[#080808]">
        {/* Mobile Header */}
        <div className="md:hidden text-center mb-10">
          <div className="w-16 h-16 bg-[#800000]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#800000]/40">
            <Shield className="text-[#FFD700]" size={28} />
          </div>
          <h1 className="text-3xl font-black text-white display-font drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">Admin Portal</h1>
        </div>

        <div className="w-full max-w-md mx-auto relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2 hidden md:block">Master Control Login</h2>
          <p className="text-[#a0a0a0] mb-8 hidden md:block">Enter your administrative credentials to proceed.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@tvk.com"
                  className="w-full input-dark pl-12 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#FFD700]/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full input-dark pl-12 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#FFD700]/50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#800000] text-[#FFD700] font-bold tracking-wider hover:bg-[#990000] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group mt-8 shadow-lg shadow-red-900/20"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  AUTHORIZE <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link href="/login" className="text-white/40 hover:text-white/70 text-sm transition-colors border-b border-transparent hover:border-white/40 pb-1">
              ← Return to public login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
