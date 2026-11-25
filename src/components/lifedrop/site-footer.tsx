import Link from "next/link";
import { Droplet } from "lucide-react";
import { siteConfig } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-low px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Droplet size={20} className="text-accent" fill="currentColor" strokeWidth={1.5} />
            <span className="font-display text-2xl text-on-surface">
              {siteConfig.name}
            </span>
          </div>
          <p className="mt-2 max-w-sm text-sm text-on-surface-variant">
            {siteConfig.description}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-on-surface-variant sm:items-end">
          <Link href="/#find" className="hover:text-primary">
            Find donors
          </Link>
          <Link href="/#request" className="hover:text-primary">
            Post a request
          </Link>
          <Link href="/#donate" className="hover:text-primary">
            Register as a donor
          </Link>
          <p className="mt-2 text-xs">{siteConfig.location}</p>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl border-t border-outline-variant pt-6 text-xs text-on-surface-variant">
        © {new Date().getFullYear()} {siteConfig.name}. Donor details are shared
        only with consent. For emergencies, contact your local hospital.
      </p>
    </footer>
  );
}
