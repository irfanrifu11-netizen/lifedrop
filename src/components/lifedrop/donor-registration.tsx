"use client";

import { useState } from "react";
import { CheckCircle2, HeartHandshake, ShieldCheck } from "lucide-react";
import { BLOOD_GROUPS, addDonor, type BloodGroup } from "@/lib/lifedrop-store";

type Status = { type: "success" | "error"; message: string };

const emptyForm = {
  name: "",
  age: "",
  phone: "",
  bloodGroup: "",
  place: "",
  consent: false,
};

export function DonorRegistration() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<Status | null>(null);

  const update = <K extends keyof typeof emptyForm>(
    key: K,
    value: (typeof emptyForm)[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setStatus(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const age = Number(form.age);
    const phone = form.phone.trim();

    if (
      !form.name.trim() ||
      !form.age ||
      !phone ||
      !form.bloodGroup ||
      !form.place.trim()
    ) {
      setStatus({
        type: "error",
        message: "Please complete every field before registering.",
      });
      return;
    }
    if (!Number.isInteger(age) || age < 18 || age > 65) {
      setStatus({
        type: "error",
        message: "Donors must be between 18 and 65 years old.",
      });
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setStatus({
        type: "error",
        message: "Please enter a valid phone number.",
      });
      return;
    }
    if (!form.consent) {
      setStatus({
        type: "error",
        message: "Please agree to share your contact details.",
      });
      return;
    }

    const result = addDonor({
      name: form.name.trim(),
      age,
      phone,
      bloodGroup: form.bloodGroup as BloodGroup,
      place: form.place.trim(),
      consent: form.consent,
      availability: "Available",
    });

    if (!result.ok) {
      setStatus({ type: "error", message: result.message });
      return;
    }

    setStatus({
      type: "success",
      message: `Thank you, ${form.name.trim().split(" ")[0]}! You are now listed as a donor. Syncing to Google Sheet...`,
    });
    setForm(emptyForm);
  };

  const inputClass =
    "w-full rounded-xl border border-outline bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

  return (
    <section
      id="donate"
      className="scroll-mt-24 border-t border-outline-variant bg-surface-container-low px-5 py-20 sm:px-8"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1fr]">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">
            <HeartHandshake size={14} />
            Give the gift of life
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-on-surface sm:text-5xl">
            Become a donor
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-on-surface-variant">
            Join the LifeDrop network. Your details are shown only to people
            searching for a donor, and only after you give consent.
          </p>
          <div className="mt-8 space-y-4">
            {[
              {
                icon: ShieldCheck,
                title: "Shared with consent",
                text: "Your phone number appears only after you opt in.",
              },
              {
                icon: CheckCircle2,
                title: "Simple registration",
                text: "Takes less than a minute to join the network.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-primary">
                  <item.icon size={17} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-on-surface-variant">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
                  Full name
                </span>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Your full name"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
                  Age
                </span>
                <input
                  className={inputClass}
                  type="number"
                  min={18}
                  max={65}
                  value={form.age}
                  onChange={(event) => update("age", event.target.value)}
                  placeholder="18 - 65"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
                  Phone number
                </span>
                <input
                  className={inputClass}
                  type="tel"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  placeholder="9876543210"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
                  Blood group
                </span>
                <select
                  className={inputClass}
                  value={form.bloodGroup}
                  onChange={(event) => update("bloodGroup", event.target.value)}
                >
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
                Location
              </span>
              <input
                className={inputClass}
                value={form.place}
                onChange={(event) => update("place", event.target.value)}
                placeholder="City or area"
              />
            </label>

            <label className="flex items-start gap-3 rounded-xl bg-surface-container px-4 py-3">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(event) => update("consent", event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
              />
              <span className="text-xs leading-relaxed text-on-surface-variant">
                I agree to share my contact details with people searching for
                donors.
              </span>
            </label>

            {status && (
              <p
                className={`rounded-xl px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-error-container text-error"
                }`}
                role="status"
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-on-primary transition hover:bg-brand-dark"
            >
              <HeartHandshake size={16} />
              Register as donor
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
