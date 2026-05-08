"use client";

import { useActionState } from "react";
import { signUpAction } from "@/actions/auth";

export default function SignupForm() {
  const [state, action, isPending] = useActionState(signUpAction, null);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70 ml-1">Full Name</label>
        <input
          name="name"
          type="text"
          placeholder="John Doe"
          className="input-dark"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
        <input
          name="email"
          type="email"
          placeholder="email@example.com"
          className="input-dark"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70 ml-1">Password</label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          className="input-dark"
          required
        />
      </div>

      {state?.error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-500 text-sm">
          {state.success}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full mt-4"
      >
        {isPending ? "Creating account..." : "Sign Up →"}
      </button>
    </form>
  );
}
