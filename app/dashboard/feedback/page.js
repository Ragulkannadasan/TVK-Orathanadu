'use client';
import { useState } from 'react';
import { MessageSquare, Star, Send, Loader2, CheckCircle } from 'lucide-react';

export default function FeedbackPage() {
  const [form, setForm] = useState({ category: 'General', rating: 0, feedback: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.feedback.trim() || form.rating === 0) {
      setError('Please provide a rating and your feedback.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) throw new Error('Failed to submit feedback');
      
      setSuccess(true);
      setForm({ category: 'General', rating: 0, feedback: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-[#800000]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#800000]/40">
          <MessageSquare className="text-[#FFD700]" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-white display-font">App Feedback</h1>
        <p className="text-white/60 text-sm mt-2">Help us improve the TVK Orathanadu platform</p>
      </div>

      {success ? (
        <div className="glass rounded-2xl p-10 text-center animate-fade-in border border-green-500/30">
          <CheckCircle className="text-green-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
          <p className="text-white/70">Your feedback has been successfully submitted. We appreciate your time!</p>
          <button onClick={() => setSuccess(false)} className="btn-primary mt-6 px-6 py-2 rounded-lg text-sm">
            Submit Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#800000]/10 rounded-full blur-3xl pointer-events-none" />
          
          {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

          <div>
            <label className="block text-white/70 text-sm font-medium mb-3">Rate your experience</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    size={32} 
                    className={star <= form.rating ? 'fill-[#FFD700] text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' : 'text-white/20'} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Feedback Type</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full input-dark p-3 rounded-xl appearance-none"
            >
              <option value="General">General Feedback</option>
              <option value="Bug">Report a Bug</option>
              <option value="Feature Request">Feature Request</option>
            </select>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Tell us more</label>
            <textarea
              value={form.feedback}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
              placeholder="What do you think about the app? Any issues or suggestions?"
              rows={4}
              className="w-full input-dark p-4 rounded-xl resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 font-medium tracking-wide shadow-lg shadow-red-900/20"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Submit Feedback</>}
          </button>
        </form>
      )}
    </div>
  );
}
