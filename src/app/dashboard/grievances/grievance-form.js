"use client";

import { useActionState, useRef, useEffect } from "react";
import { submitGrievance } from "@/actions/grievance";

export default function GrievanceForm({ userId, panchayat, booth }) {
  const [state, action, isPending] = useActionState(submitGrievance, null);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <input type="hidden" name="userId" value={userId || ""} />
      <input type="hidden" name="panchayat" value={panchayat || ""} />
      <input type="hidden" name="boothNumber" value={booth || ""} />

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-bold text-text-muted ml-1">Category</label>
        <select name="category" className="input-dark bg-black/40" required>
          <option value="Agriculture">Agriculture</option>
          <option value="Water">Water</option>
          <option value="Road">Road</option>
          <option value="Electricity">Electricity</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-bold text-text-muted ml-1">Subject</label>
        <input
          name="title"
          type="text"
          placeholder="Brief title of the issue"
          className="input-dark"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-bold text-text-muted ml-1">Description</label>
        <textarea
          name="description"
          placeholder="Describe the problem in detail..."
          className="input-dark min-h-[120px] resize-none"
          required
        />
      </div>

      {state?.error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] uppercase font-bold text-center">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-500 text-[10px] uppercase font-bold text-center">
          {state.success}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full text-sm py-3"
      >
        {isPending ? "Submitting..." : "📢 Submit Report"}
      </button>
    </form>
  );
}
