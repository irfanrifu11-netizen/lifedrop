import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { siteConfig } from "@/lib/data";

const links = [
  { href: "/#find", label: "Find Donors" },
  { href: "/#request", label: "Need Blood" },
  { href: "/#donate", label: "Become a Donor" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant bg-white/95 backdrop-blur-xl">
      <div className="mx-auto grid h-[74px] max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3 justify-self-start">
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

        <nav className="hidden items-center justify-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/admin/login"
          className="justify-self-end rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-brand-dark"
        >
          Admin
        </Link>
      </div>
      <nav className="flex items-center justify-center gap-6 border-t border-outline-variant px-4 py-2.5 md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs font-medium text-on-surface-variant"
          >
            {link.label}
          </Link>
        ))}
        <Link href="/admin/login" className="text-xs font-semibold text-accent">
          Admin
        </Link>
      </nav>
    </header>
  );
}
