"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useRestaurant } from "@/components/restaurant/restaurant-provider";
import { ADMIN_PASSWORD, localStore } from "@/lib/local-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setNotice } = useRestaurant();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== ADMIN_PASSWORD) {
      setError("Incorrect password. Try again.");
      return;
    }
    localStore.setAdmin(true);
    setNotice("Welcome back.");
    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-low px-5 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-outline-variant bg-surface p-8 shadow-xl sm:p-10">
        <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-primary">
          <ShieldCheck size={22} />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">
          Staff access
        </p>
        <h1 className="mt-2 font-display text-3xl text-on-surface">
          Admin login
        </h1>
        <p className="mt-3 text-sm text-on-surface-variant">
          Enter the staff password to view LifeDrop donor and request stats.
        </p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              autoFocus
              className="w-full rounded-xl border border-outline bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Admin password"
            />
            {error && <p className="mt-2 text-xs text-error">{error}</p>}
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-on-primary hover:bg-brand-dark"
          >
            Enter dashboard
          </button>
        </form>
        <Link
          href="/"
          className="mt-6 block text-center text-xs font-semibold text-secondary hover:text-primary"
        >
          Back to website
        </Link>
      </div>
    </div>
  );
}
