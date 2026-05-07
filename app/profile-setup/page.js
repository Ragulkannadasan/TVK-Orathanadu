'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User, Phone, CreditCard, MapPin, Hash, Loader2, CheckCircle } from 'lucide-react';

export default function ProfileSetupPage() {
  const { update } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    voterId: '',
    panchayat: '',
    boothNumber: '',
  });

  const panchayats = [
    'ஓரத்தநாடு நகர் பஞ்சாயத்து',
    'வேப்பங்குளம் ஊராட்சி',
    'மனப்பாறை ஊராட்சி',
    'ஆடனூர் ஊராட்சி',
    'கண்டியூர் ஊராட்சி',
    'Other',
  ];

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.voterId || !form.panchayat) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, boothNumber: parseInt(form.boothNumber) || null }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      setStep(3); // Success
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-400" size={36} />
          </div>
          <h2 className="text-white font-bold text-2xl mb-2">Profile Created!</h2>
          <p className="tamil text-[#FFD700]/70">உங்கள் சுயவிவரம் உருவாக்கப்பட்டது</p>
          <p className="text-white/50 text-sm mt-2">Redirecting to dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#800000] mb-4 glow-maroon">
            <span className="text-[#FFD700] font-black text-lg">TVK</span>
          </div>
          <h1 className="text-white font-bold text-2xl">Complete Your Profile</h1>
          <p className="tamil text-[#FFD700]/70 text-sm mt-1">உங்கள் சுயவிவரத்தை பூர்த்தி செய்யுங்கள்</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#800000]' : 'bg-white/10'}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-7 border border-white/10 space-y-5">
          {step === 1 && (
            <>
              <h2 className="text-white font-semibold text-lg">Personal Information</h2>
              <FormField label="Full Name" labelTa="பெயர்" id="name" name="name" icon={<User size={16}/>} value={form.name} onChange={handleChange} placeholder="உங்கள் முழு பெயர்" required />
              <FormField label="Mobile Number" labelTa="கைபேசி எண்" id="mobile" name="mobile" icon={<Phone size={16}/>} value={form.mobile} onChange={handleChange} placeholder="+91 9876543210" type="tel" required />
              <button type="button" onClick={() => setStep(2)} disabled={!form.name || !form.mobile} className="btn-primary w-full py-3 rounded-xl mt-2 disabled:opacity-50">
                Next →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-white font-semibold text-lg">Voter & Booth Details</h2>
              <FormField label="Voter ID" labelTa="வாக்காளர் அடையாள அட்டை எண்" id="voterId" name="voterId" icon={<CreditCard size={16}/>} value={form.voterId} onChange={handleChange} placeholder="ABC1234567" required />
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2" htmlFor="panchayat">
                  Panchayat <span className="tamil text-[#FFD700]/50 text-xs">(பஞ்சாயத்து)</span>
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <select
                    id="panchayat"
                    name="panchayat"
                    value={form.panchayat}
                    onChange={handleChange}
                    required
                    className="input-dark pl-9 appearance-none"
                  >
                    <option value="" disabled>Select panchayat</option>
                    {panchayats.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <FormField label="Booth Number" labelTa="சாவடி எண்" id="boothNumber" name="boothNumber" icon={<Hash size={16}/>} value={form.boothNumber} onChange={handleChange} placeholder="e.g. 42" type="number" />

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">{error}</div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3 rounded-xl">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-[2] py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : '✅ Save Profile'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </main>
  );
}

function FormField({ label, labelTa, id, icon, required, ...props }) {
  return (
    <div>
      <label className="block text-white/70 text-sm font-medium mb-2" htmlFor={id}>
        {label} {labelTa && <span className="tamil text-[#FFD700]/50 text-xs">({labelTa})</span>}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">{icon}</span>
        <input id={id} {...props} className="input-dark pl-9" />
      </div>
    </div>
  );
}
