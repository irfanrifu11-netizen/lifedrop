import Link from "next/link";
import {
  ArrowRight,
  Droplet,
  Droplets,
  HeartPulse,
  PhoneCall,
  Search,
  ShieldCheck,
} from "lucide-react";
import { siteConfig } from "@/lib/data";
import { DonorRegistration } from "@/components/lifedrop/donor-registration";
import { DonorRequestTabs } from "@/components/lifedrop/donor-request-tabs";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#fff5f6] to-[#ffe4e8] px-5 pb-16 pt-16 sm:px-8 lg:pb-24 lg:pt-20">
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-secondary-container/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-outline bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent shadow-sm backdrop-blur">
              <Droplet size={13} fill="currentColor" strokeWidth={1.5} />
              Community blood donor network
            </p>
            <h1 className="mt-7 max-w-3xl font-display text-5xl leading-[1.02] tracking-tight text-primary sm:text-6xl lg:text-[4.35rem]">
              <span className="block text-accent">Every Drop Can{" "}</span>
              <span className="block text-black">Save a Life</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
              LifeDrop connects patients who urgently need blood with volunteer
              donors nearby. Search, request, or donate through one simple,
              trusted flow.
            </p>
          </div>

          <div className="relative w-full">
            <div className="relative z-10 w-full max-w-md lg:max-w-lg">
              <a
                href={`tel:+91${siteConfig.adminContact.phone}`}
                aria-label={`Emergency admin contact: ${siteConfig.adminContact.name}, ${siteConfig.adminContact.phone}`}
                className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-accent px-5 py-4 text-white shadow-lg transition hover:bg-brand-dark"
              >
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
                  <PhoneCall size={16} />
                  Emergency: Admin ({siteConfig.adminContact.name})
                </span>
                <span className="text-base font-semibold">
                  {siteConfig.adminContact.phone}
                </span>
              </a>
              <div className="rounded-[2rem] border border-white bg-white/95 p-5 shadow-[0_28px_70px_-32px_rgba(146,19,27,0.45)] backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                    LifeDrop network
                  </p>
                  <Droplets size={18} className="text-accent" />
                </div>
                <div className="mt-4 flex items-center gap-4 rounded-2xl bg-accent px-5 py-5 text-white">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Droplet size={28} fill="currentColor" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-display text-xl">Donate. Request. Save.</p>
                    <p className="text-sm text-white/80">One network, real people.</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    { icon: ShieldCheck, text: "Consent-based donor listings" },
                    { icon: PhoneCall, text: "Direct contact with donors/requesters" },
                    {
                      icon: Search,
                      text: "Find by blood group, district and location",
                    },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-accent">
                        <item.icon size={16} />
                      </span>
                      <p className="text-sm text-black">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-outline-variant bg-white px-5 py-12 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          {[
            { value: "24/7", label: "Community Support", icon: HeartPulse },
            { value: "Local", label: "Blood Donors", icon: Droplets },
            { value: "Direct", label: "Donor Contact", icon: PhoneCall },
          ].map((item) => (
            <div
              key={item.label}
              className="lift-card flex items-center gap-4 rounded-2xl border border-outline-variant bg-white p-5 shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-accent">
                <item.icon size={20} />
              </span>
              <div>
                <p className="font-display text-2xl text-black">{item.value}</p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-black">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-outline-variant bg-surface-container-low px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-black">
            How it works
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Search,
                title: "Search or post",
                text: "Find a matching donor or share what you need in seconds.",
              },
              {
                step: "02",
                icon: PhoneCall,
                title: "Make contact",
                text: "Reach out directly using the contact details shared with consent.",
              },
              {
                step: "03",
                icon: HeartPulse,
                title: "Save a life",
                text: "Coordinate with a donor or volunteer and give the gift of life.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="lift-card rounded-2xl border border-outline-variant bg-white p-5 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-primary">
                    <item.icon size={18} />
                  </span>
                  <span className="text-xs font-semibold tracking-[0.2em] text-black">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl text-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DonorRequestTabs />
      <DonorRegistration />

      <section className="bg-primary px-5 py-16 text-on-primary sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">
              Ready to make a difference?
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Join the LifeDrop network and be someone&apos;s hope today.
            </p>
          </div>
          <Link
            href="/#donate"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition hover:bg-surface-container"
          >
            Register now
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
