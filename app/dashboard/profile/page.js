'use client';
import { useState, useEffect } from 'react';
import { User, Phone, CreditCard, MapPin, Hash, Loader2, CheckCircle, Edit3, LogOut, Trash2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import MembershipCard from '@/components/MembershipCard';

const panchayats = [
  'ஓரத்தநாடு நகர் பஞ்சாயத்து',
  'வேப்பங்குளம் ஊராட்சி',
  'மனப்பாறை ஊராட்சி',
  'ஆடனூர் ஊராட்சி',
  'கண்டியூர் ஊராட்சி',
  'Other',
];

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('⚠ CRITICAL: Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.');
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/profile', { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete account');
      await signOut({ callbackUrl: '/' });
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
        setForm(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, boothNumber: parseInt(form.boothNumber) || null }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();
      setUser(data.user);
      setForm(data.user);
      await update();
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#800000]" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="tamil text-[#FFD700]/60 text-sm mt-0.5">என் சுயவிவரம்</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-white/70 hover:text-white text-sm transition-all"
        >
          <Edit3 size={15} /> {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {success && (
        <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-green-400 text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle size={16} /> Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">{error}</div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card Preview */}
        <div>
          <p className="text-white/50 text-xs uppercase font-semibold tracking-wider mb-3">Membership Card Preview</p>
          <MembershipCard user={editing ? form : user} />
        </div>

        {/* Form */}
        <div>
          {editing ? (
            <form onSubmit={handleSave} className="glass rounded-2xl p-6 space-y-4">
              <ProfileField label="Full Name" id="name" icon={<User size={14}/>} value={form.name || ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              <ProfileField label="Mobile" id="mobile" icon={<Phone size={14}/>} value={form.mobile || ''} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))} type="tel" />
              <ProfileField label="Voter ID" id="voterId" icon={<CreditCard size={14}/>} value={form.voterId || ''} onChange={(e) => setForm((f) => ({ ...f, voterId: e.target.value }))} />
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Panchayat</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                  <select
                    value={form.panchayat || ''}
                    onChange={(e) => setForm((f) => ({ ...f, panchayat: e.target.value }))}
                    className="input-dark pl-8 appearance-none"
                  >
                    <option value="">Select panchayat</option>
                    {panchayats.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <ProfileField label="Booth Number" id="boothNumber" icon={<Hash size={14}/>} value={form.boothNumber || ''} onChange={(e) => setForm((f) => ({ ...f, boothNumber: e.target.value }))} type="number" />
              <button type="submit" disabled={saving} className="btn-primary w-full py-2.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin" /> : '💾 Save Changes'}
              </button>
            </form>
          ) : (
            <div className="glass rounded-2xl p-6 space-y-4 relative">
              {[
                { label: 'Email', value: user?.email, icon: '📧' },
                { label: 'Mobile', value: user?.mobile || '—', icon: '📱' },
                { label: 'Voter ID', value: user?.voterId || '—', icon: '🪪' },
                { label: 'Panchayat', value: user?.panchayat || '—', icon: '🏘️' },
                { label: 'Booth Number', value: user?.boothNumber ? `#${user.boothNumber}` : '—', icon: '🗳️' },
                { label: 'Role', value: session?.user?.role || '—', icon: '⭐' },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0">
                  <span className="text-lg">{row.icon}</span>
                  <div>
                    <p className="text-white/40 text-xs">{row.label}</p>
                    <p className="text-white text-sm font-medium mt-0.5">{row.value}</p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 mt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    import('next-auth/react').then((m) => m.signOut({ callbackUrl: '/' }));
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all font-medium text-sm"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white/20 hover:text-red-500/60 transition-all text-xs mt-2"
                >
                  <Trash2 size={12} />
                  {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, id, icon, ...props }) {
  return (
    <div>
      <label className="block text-white/70 text-sm font-medium mb-1.5" htmlFor={id}>{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">{icon}</span>
        <input id={id} className="input-dark pl-8" {...props} />
      </div>
    </div>
  );
}
