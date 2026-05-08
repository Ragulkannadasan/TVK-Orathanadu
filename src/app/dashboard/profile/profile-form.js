"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/actions/profile";

export default function ProfileForm({ user }) {
  const [state, action, isPending] = useActionState(updateProfileAction, null);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="userId" value={user._id} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-white/50 ml-1">Mobile Number</label>
          <input
            name="mobile"
            type="tel"
            defaultValue={user.mobile}
            placeholder="9876543210"
            className="input-dark"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-white/50 ml-1">Voter ID Number</label>
          <input
            name="voterId"
            type="text"
            defaultValue={user.voterId}
            placeholder="ABC1234567"
            className="input-dark"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-white/50 ml-1">Panchayat</label>
          <select name="panchayat" defaultValue={user.panchayat} className="input-dark bg-black/40">
            <option value="">Select Panchayat</option>
            <option value="Orathanadu">Orathanadu</option>
            <option value="Kavarappattu">Kavarappattu</option>
            <option value="Vaduvoor">Vaduvoor</option>
            <option value="Mandalakkottai">Mandalakkottai</option>
            <option value="Thekkur">Thekkur</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-white/50 ml-1">Booth Number</label>
          <input
            name="boothNumber"
            type="text"
            defaultValue={user.boothNumber}
            placeholder="Enter Booth Number (e.g., 175/A)"
            className="input-dark"
          />
        </div>
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

      <div className="pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full sm:w-auto px-10"
        >
          {isPending ? "Updating..." : "Save Profile Details"}
        </button>
      </div>
    </form>
  );
}
