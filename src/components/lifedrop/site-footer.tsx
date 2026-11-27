import Link from "next/link";
import { Droplet, Mail, Phone, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/data";

const usefulLinks = [
  { href: "/#find", label: "Find a Donor" },
  { href: "/#request", label: "Request Blood" },
  { href: "/#donate", label: "Become a Donor" },
  { href: "/admin/login", label: "Admin Login" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-low px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Droplet
              size={22}
              className="text-accent"
              fill="currentColor"
              strokeWidth={1.5}
            />
            <span className="font-display text-2xl text-on-surface">
              {siteConfig.name}
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-on-surface-variant">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            About us
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
            LifeDrop is a community blood donor network built to make urgent
            blood requests easier to solve.
          </p>
          <p className="mt-3 flex items-center gap-2 text-xs text-on-surface-variant">
            <ShieldCheck size={14} className="shrink-0 text-accent" />
            Consent-first donor privacy.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Useful links
          </h3>
          <div className="mt-4 flex flex-col gap-2.5">
            {usefulLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-on-surface-variant transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Contact
          </h3>
          <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 transition-colors hover:text-accent"
            >
              <Phone size={15} className="shrink-0 text-accent" />
              {siteConfig.phone}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 break-all transition-colors hover:text-accent"
            >
              <Mail size={15} className="shrink-0 text-accent" />
              {siteConfig.email}
            </a>
            <p>{siteConfig.location}</p>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-outline-variant pt-6 text-xs text-on-surface-variant">
        © {new Date().getFullYear()} {siteConfig.name}. Donor details are shared
        only with consent. For emergencies, contact your local hospital.
      </p>
    </footer>
  );
}
