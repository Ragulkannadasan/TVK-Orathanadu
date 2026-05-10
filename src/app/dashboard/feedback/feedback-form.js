"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitFeedbackAction } from "@/actions/feedback";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function FeedbackForm() {
  const [state, action, isPending] = useActionState(submitFeedbackAction, null);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground/70 ml-1 uppercase tracking-wider">Category / வகை</label>
        <select
          name="category"
          className="input-dark bg-[#0a0a0a]"
          required
        >
          <option value="Suggestion">Suggestion / ஆலோசனை</option>
          <option value="Bug Report">Bug Report / பிழை அறிக்கை</option>
          <option value="Appreciation">Appreciation / பாராட்டு</option>
          <option value="Other">Other / இதர</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground/70 ml-1 uppercase tracking-wider">Subject / தலைப்பு</label>
        <input
          name="subject"
          type="text"
          placeholder="What is this about?"
          className="input-dark"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground/70 ml-1 uppercase tracking-wider">Message / செய்தி</label>
        <textarea
          name="message"
          rows={5}
          placeholder="Write your feedback here..."
          className="input-dark resize-none"
          required
        ></textarea>
      </div>

      {state?.error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-shake">
          <AlertCircle size={18} />
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={18} />
          {state.success}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full py-4 flex items-center justify-center gap-2 group overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-surface-border/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <Send size={18} className={isPending ? "animate-pulse" : "group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"} />
        <span className="font-bold tracking-tight">
          {isPending ? "Submitting..." : "Submit Feedback / சமர்ப்பிக்கவும்"}
        </span>
      </button>
    </form>
  );
}
