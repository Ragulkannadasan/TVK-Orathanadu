"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import OTPLoginForm from './otp-form';
import LoginForm from './login-form';

export default function LoginPage() {
  const [mode, setMode] = useState('otp'); // 'otp' or 'password'

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-text-muted hover:text-gold-dynamic transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">Back to Home</span>
      </Link>
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#800000]/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#FFD700]/5 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="w-full max-w-md glass-card p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold display-font gradient-text">
            {mode === 'otp' ? 'Access Portal' : 'Admin Login'}
          </h1>
          <p className="tamil text-gold-dynamic/70 text-sm mt-2">
            {mode === 'otp' ? 'மின்னஞ்சல் மூலம் உள்நுழையவும்' : 'நிர்வாகி உள்நுழைவு'}
          </p>
        </div>

        {mode === 'otp' ? <OTPLoginForm /> : <LoginForm />}

        <div className="text-center space-y-4">
          <button 
            onClick={() => setMode(mode === 'otp' ? 'password' : 'otp')}
            className="text-gold-dynamic text-sm hover:underline"
          >
            {mode === 'otp' ? 'Use Admin Password →' : '← Back to OTP Login'}
          </button>
          
          <div className="text-center text-xs text-text-muted italic tamil">
            {mode === 'otp' ? 'புதிய பயனர்கள் மின்னஞ்சல் மூலம் நேரடியாக சேரலாம்' : 'நிர்வாக சான்றுகளைப் பயன்படுத்தவும்'}
          </div>
        </div>

      </div>
    </main>
  );
}
