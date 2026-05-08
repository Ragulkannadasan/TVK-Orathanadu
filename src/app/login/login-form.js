"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

export default function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, null);

  return (
    <form action={action} className="space-y-4">
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

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full mt-4"
      >
        {isPending ? "Logging in..." : "Login →"}
      </button>
    </form>
  );
}
