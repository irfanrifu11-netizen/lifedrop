import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { siteConfig } from "@/lib/data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-transform group-hover:rotate-6">
            <HeartPulse size={20} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-wide text-on-surface">
              {siteConfig.name}
            </span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-accent">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        <Link
          href="/admin/login"
          className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-brand-dark"
        >
          Admin Login
        </Link>
      </div>
    </header>
  );
}
