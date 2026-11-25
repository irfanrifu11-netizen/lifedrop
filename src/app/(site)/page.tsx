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
import { BloodRequests } from "@/components/lifedrop/blood-requests";
import { DonorDirectory } from "@/components/lifedrop/donor-directory";
import { DonorRegistration } from "@/components/lifedrop/donor-registration";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#f5faff] to-[#e8f2fb] px-5 pb-16 pt-16 sm:px-8 lg:pb-24 lg:pt-20">
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#dceeff]/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#f8d9dc] bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent shadow-sm backdrop-blur">
              <Droplet size={13} fill="currentColor" strokeWidth={1.5} />
              Community blood network
            </p>
            <h1 className="mt-7 max-w-3xl font-display text-5xl leading-[1.02] tracking-tight text-primary sm:text-6xl lg:text-[4.35rem]">
              <span className="block">Blood help,</span>
              <span className="block text-accent">when minutes</span>
              <span className="block text-accent">matter.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-light-red sm:text-lg">
              LifeDrop connects urgent requests with nearby volunteer donors. Search,
              request, and register through one simple, trusted flow.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/#find"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-[#d71920]/20 transition hover:bg-brand-dark"
              >
                Find a donor
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/#request"
                className="inline-flex items-center gap-2 rounded-xl border border-primary bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-[#dceeff]"
              >
                Post request
              </Link>
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-10 lg:block lg:min-h-[620px]">
            <svg
              viewBox="0 0 500 500"
              className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 lg:block"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M256 408C238 392 80 268 80 168c0-56 43-100 99-100 32 0 58 15 77 41 19-26 45-41 77-41 56 0 99 44 99 100 0 100-158 224-176 240Z"
                stroke="#F8D9DC"
                strokeWidth="2.5"
              />
              <path
                d="M256 352c-14-12-112-92-112-164 0-40 31-70 69-70 22 0 41 11 53 29 12-18 31-29 53-29 38 0 69 30 69 70 0 72-98 152-112 164Z"
                stroke="#F8D9DC"
                strokeWidth="1.5"
                opacity="0.6"
              />
            </svg>

            <div className="relative w-full max-w-md lg:absolute lg:left-0 lg:top-1/2 lg:w-[62%] lg:-translate-y-1/2">
              <svg
                viewBox="0 0 420 430"
                className="mx-auto w-full drop-shadow-[0_28px_35px_rgba(18,52,90,0.18)]"
                role="img"
                aria-label="Blood drop above an open hand"
              >
                <defs>
                  <linearGradient id="lifedrop-hand" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#f7d8c0" />
                    <stop offset="1" stopColor="#d99a72" />
                  </linearGradient>
                  <radialGradient id="lifedrop-drop" cx="35%" cy="25%" r="75%">
                    <stop offset="0" stopColor="#ff767a" />
                    <stop offset="0.5" stopColor="#d71920" />
                    <stop offset="1" stopColor="#7c0d12" />
                  </radialGradient>
                </defs>
                <ellipse cx="214" cy="367" rx="135" ry="20" fill="#12345A" opacity="0.08" />
                <path
                  d="M126 330c-20-14-32-38-32-66v-48c0-14 10-24 23-24s23 10 23 24v30c0-7 3-13 8-18l36-36c9-9 24-9 33 0 9 9 9 24 0 33l-24 24 10-10c9-9 24-9 33 0 9 9 9 24 0 33l-18 18 12-12c9-9 24-9 33 0 9 9 9 24 0 33l-44 44c-17 17-40 26-64 26h-25c-15 0-29-5-40-13Z"
                  fill="url(#lifedrop-hand)"
                />
                <path
                  d="M154 226v52M190 208v66M226 226v54M262 250v42"
                  stroke="#c67f5c"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.45"
                />
                <path
                  d="M210 40c0 0-62 66-62 116a62 62 0 0 0 124 0c0-50-62-116-62-116Z"
                  fill="url(#lifedrop-drop)"
                />
                <path
                  d="M188 130c-8 12-12 26-10 40"
                  stroke="white"
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
            </div>

            <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white bg-white/95 p-5 shadow-[0_28px_70px_-32px_rgba(18,52,90,0.45)] backdrop-blur lg:absolute lg:right-0 lg:top-1/2 lg:w-[76%] lg:-translate-y-1/2">
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
                  { icon: Search, text: "Find by blood group and location" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 rounded-xl bg-[#fdf4f5] px-4 py-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-accent">
                      <item.icon size={16} />
                    </span>
                    <p className="text-sm text-primary">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#eaf2fa] bg-white px-5 py-12 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          {[
            { value: "24/7", label: "Community Support", icon: HeartPulse },
            { value: "Local", label: "Blood Donors", icon: Droplets },
            { value: "Direct", label: "Donor Contact", icon: PhoneCall },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-[#eaf2fa] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(18,52,90,0.35)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8d9dc] text-accent">
                <item.icon size={20} />
              </span>
              <div>
                <p className="font-display text-2xl text-primary">{item.value}</p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#eaf2fa] bg-[#f5faff] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
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
                className="rounded-2xl border border-[#eaf2fa] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(18,52,90,0.35)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dceeff] text-primary">
                    <item.icon size={18} />
                  </span>
                  <span className="text-xs font-semibold tracking-[0.2em] text-on-surface-variant">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DonorDirectory />
      <BloodRequests />
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
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition hover:bg-[#dceeff]"
          >
            Register now
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
