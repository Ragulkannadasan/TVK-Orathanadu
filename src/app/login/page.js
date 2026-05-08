import Link from 'next/link';
import OTPLoginForm from './otp-form';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#800000]/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#FFD700]/5 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="w-full max-w-md glass-card p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold display-font gradient-text">Access Portal</h1>
          <p className="tamil text-[#FFD700]/70 text-sm mt-2">மின்னஞ்சல் மூலம் உள்நுழையவும்</p>
        </div>

        <OTPLoginForm />

        <div className="text-center text-xs text-white/30 italic tamil">
          புதிய பயனர்கள் மின்னஞ்சல் மூலம் நேரடியாக சேரலாம்
        </div>

      </div>
    </main>
  );
}
