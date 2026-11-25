"use client";

import { useState } from "react";
import { AlertTriangle, Clock3, MapPin, Phone, Send } from "lucide-react";
import {
  BLOOD_GROUPS,
  addRequest,
  useConnections,
  useRequests,
  type BloodGroup,
  type Urgency,
} from "@/lib/lifedrop-store";

const emptyForm = {
  patientName: "",
  bloodGroup: "",
  place: "",
  contactName: "",
  phone: "",
  urgency: "Urgent" as Urgency,
  note: "",
};

export function BloodRequests() {
  const requests = useRequests();
  const connections = useConnections();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [postedId, setPostedId] = useState("");

  const update = <K extends keyof typeof emptyForm>(
    key: K,
    value: (typeof emptyForm)[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !form.patientName.trim() ||
      !form.bloodGroup ||
      !form.place.trim() ||
      !form.contactName.trim() ||
      !form.phone.trim()
    ) {
      setError("Please complete the patient, location and contact fields.");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid contact number.");
      return;
    }
    const request = addRequest({
      patientName: form.patientName.trim(),
      bloodGroup: form.bloodGroup as BloodGroup,
      place: form.place.trim(),
      contactName: form.contactName.trim(),
      phone: form.phone.trim(),
      urgency: form.urgency,
      note: form.note.trim(),
    });
    setPostedId(request.id);
    setForm(emptyForm);
  };

  const inputClass =
    "w-full rounded-xl border border-outline bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

  return (
    <section
      id="request"
      className="scroll-mt-24 border-t border-outline-variant bg-surface px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-9">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">
            <AlertTriangle size={14} />
            Need blood?
          </p>
          <h2 className="mt-3 font-display text-4xl text-on-surface sm:text-5xl">
            Post a blood request
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
            Share the details below so donors can reach you directly. For a
            medical emergency, always contact the hospital or emergency services
            first.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,440px)_1fr] xl:items-start">
          <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-6 sm:p-8 xl:sticky xl:top-24">
            <h3 className="mb-5 font-display text-2xl text-on-surface">Request details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
                    Patient name or detail
                  </span>
                  <input
                    className={inputClass}
                    value={form.patientName}
                    onChange={(event) =>
                      update("patientName", event.target.value)
                    }
                    placeholder="e.g. Patient, 32 years"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
                    Blood group needed
                  </span>
                  <select
                    className={inputClass}
                    value={form.bloodGroup}
                    onChange={(event) =>
                      update("bloodGroup", event.target.value)
                    }
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

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
                    Location or hospital
                  </span>
                  <input
                    className={inputClass}
                    value={form.place}
                    onChange={(event) => update("place", event.target.value)}
                    placeholder="Where is blood needed?"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
                    Urgency
                  </span>
                  <select
                    className={inputClass}
                    value={form.urgency}
                    onChange={(event) =>
                      update("urgency", event.target.value as Urgency)
                    }
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
                    Your name
                  </span>
                  <input
                    className={inputClass}
                    value={form.contactName}
                    onChange={(event) =>
                      update("contactName", event.target.value)
                    }
                    placeholder="Contact person"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
                    Contact number
                  </span>
                  <input
                    className={inputClass}
                    type="tel"
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="9876543210"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
                  Additional details (optional)
                </span>
                <textarea
                  className={`${inputClass} min-h-24 resize-none`}
                  value={form.note}
                  onChange={(event) => update("note", event.target.value)}
                  placeholder="Timing, units required, or anything donors should know"
                />
              </label>

              {error && <p className="text-xs text-error">{error}</p>}
              {postedId && (
                <p
                  className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                  role="status"
                >
                  Your request is now visible to donors.
                </p>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-on-primary transition hover:bg-brand-dark"
              >
                <Send size={15} />
                Post request
              </button>
            </form>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl text-on-surface">
                Recent requests
              </h3>
              <span className="text-xs text-on-surface-variant">
                {requests.length} open
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {requests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-outline bg-surface-container-lowest px-6 py-12 text-center text-sm text-on-surface-variant sm:col-span-2">
                  No blood requests right now.
                </div>
              ) : (
                requests.map((request) => (
                  <article
                    key={request.id}
                    className="flex h-full flex-col rounded-2xl border border-outline-variant bg-surface-container-lowest p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-error-container px-3 py-1 text-sm font-bold text-error">
                            {request.bloodGroup}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                              request.urgency === "Critical"
                                ? "bg-error text-white"
                                : request.urgency === "Urgent"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-surface-container text-on-surface-variant"
                            }`}
                          >
                            {request.urgency}
                          </span>
                          {connections.some(
                            (item) => item.requestId === request.id,
                          ) && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                              Connected
                            </span>
                          )}
                        </div>
                        <h4 className="mt-3 font-semibold text-accent">
                          {request.patientName}
                        </h4>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-on-surface-variant">
                          <MapPin size={14} className="text-primary" />
                          {request.place}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                        <Clock3 size={12} />
                        {new Date(request.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                      </span>
                    </div>
                    {request.note && (
                      <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                        {request.note}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-outline-variant pt-4">
                      <span className="text-xs text-accent">
                        {request.contactName}
                      </span>
                      <a
                        href={`tel:${request.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-dark"
                      >
                        <Phone size={14} />
                        Contact
                      </a>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
