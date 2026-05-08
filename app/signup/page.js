'use client';
import { useState } from 'react';
import { signupLoginAction } from './actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await signupLoginAction(email, otp);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-[#800000]/20 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-[#FFD700]/10 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#800000] mb-4 glow-maroon animate-glow-pulse">
            <span className="text-[#FFD700] font-black text-xl">TVK</span>
          </div>
          <h1 className="text-white font-bold text-2xl display-font">Join Us</h1>
          <p className="tamil text-[#FFD700]/70 text-sm mt-1">தமிழக வெற்றி கழகத்தில் இணையுங்கள்</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {step === 1 ? (
            <>
              <h2 className="text-white font-semibold text-lg mb-1 display-font">Sign Up to Connect</h2>
              <p className="text-white/50 text-sm mb-6">
                Register with your email to become an official digital member of TVK Orathanadu.
              </p>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="input-dark pl-10"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Send Registration OTP
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
                
                <p className="text-white/40 text-xs text-center mt-4">
                  By signing up, you agree to our Terms, Privacy Policy, and Cookies Policy.
                </p>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-white font-semibold text-lg mb-1 display-font">Verify Email</h2>
              <p className="text-white/50 text-sm mb-6">
                We've sent a 6-digit code to <strong className="text-[#FFD700]">{email}</strong>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2" htmlFor="otp">
                    Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="000000"
                      required
                      className="input-dark pl-10 text-center tracking-[0.5em] font-bold text-xl placeholder:text-base placeholder:tracking-normal placeholder:font-normal"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(''); setError(''); }}
                  className="w-full text-[#FFD700]/70 text-sm hover:text-[#FFD700] transition-colors mt-2"
                >
                  Change email address
                </button>
              </form>
            </>
          )}
        </div>

        {/* Log In Box */}
        <div className="glass-card mt-4 p-4 text-center">
          <p className="text-white/70 text-sm">
            Have an account?{' '}
            <Link href="/login" className="text-[#FFD700] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-white/40 text-sm hover:text-white/70 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
