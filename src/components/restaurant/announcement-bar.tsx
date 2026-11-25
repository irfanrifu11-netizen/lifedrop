"use client";

import Link from "next/link";
import { Copy, X } from "lucide-react";
import { useState } from "react";
import { useRestaurant } from "./restaurant-provider";
import { localStore, useLocalValue } from "@/lib/local-store";

const CODE = "WELCOME10";

export function AnnouncementBar() {
  const { setNotice } = useRestaurant();
  const [dismissed, setDismissed] = useState(false);
  const welcomeUsed = useLocalValue<boolean>(
    localStore.keys.welcome10Used,
    false,
  );

  if (dismissed || welcomeUsed) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(CODE);
      setNotice(`${CODE} copied to clipboard`);
    } catch {
      setNotice(`Use ${CODE} at checkout for 10% off`);
    }
  };

  return (
    <div className="bg-brand text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-2 text-center sm:px-8">
        <p className="text-[11px] font-medium leading-relaxed sm:text-xs">
          New here? Get <span className="font-bold">10% off</span> your first
          order with code{" "}
          <span className="font-bold tracking-widest">{CODE}</span>
        </p>
        <button
          type="button"
          onClick={() => void copyCode()}
          className="inline-flex items-center gap-1 rounded-full border border-white/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest transition-colors hover:bg-white/15"
        >
          <Copy size={11} />
          Copy
        </button>
        <Link
          href="/#menu"
          className="hidden text-[11px] font-semibold uppercase tracking-widest underline underline-offset-4 hover:text-primary-container sm:inline"
        >
          Order now
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="ml-1 rounded-full p-0.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
