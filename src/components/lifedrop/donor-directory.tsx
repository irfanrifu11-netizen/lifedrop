"use client";

import { useMemo, useState } from "react";
import { Droplets, MapPin, Phone, RotateCcw, Search } from "lucide-react";
import { BLOOD_GROUPS, useDonors } from "@/lib/lifedrop-store";

const DONORS_SHOWN = 20;

export function DonorDirectory() {
  const donors = useDonors();
  const [bloodGroup, setBloodGroup] = useState("");
  const [place, setPlace] = useState("");
  const [query, setQuery] = useState({ bloodGroup: "", place: "" });

  const results = useMemo(() => {
    const wantedPlace = query.place.trim().toLowerCase();
    return donors.filter((donor) => {
      const matchesGroup =
        !query.bloodGroup || donor.bloodGroup === query.bloodGroup;
      const matchesPlace =
        !wantedPlace || donor.place.toLowerCase().includes(wantedPlace);
      return (
        donor.consent &&
        donor.availability === "Available" &&
        matchesGroup &&
        matchesPlace
      );
    });
  }, [donors, query]);

  const visibleResults = results.slice(0, DONORS_SHOWN);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setQuery({ bloodGroup, place });
  };

  const showAll = () => {
    setBloodGroup("");
    setPlace("");
    setQuery({ bloodGroup: "", place: "" });
  };

  const inputClass =
    "w-full rounded-xl border border-outline bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

  return (
    <section id="find" className="scroll-mt-24 bg-surface px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">
              <Droplets size={14} />
              Donor network
            </p>
            <h2 className="mt-3 font-display text-4xl text-on-surface sm:text-5xl">
              Find a donor near you
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-on-surface-variant">
            Search by blood group and location, then call a volunteer directly.
            Every listing has been shared with consent.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-3xl border border-outline-variant bg-surface-container-lowest p-5 sm:grid-cols-[1fr_1.4fr_auto_auto] sm:items-end sm:p-6"
        >
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
              Blood group
            </span>
            <select
              className={inputClass}
              value={bloodGroup}
              onChange={(event) => setBloodGroup(event.target.value)}
            >
              <option value="">All blood groups</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-on-surface-variant">
              Location
            </span>
            <input
              className={inputClass}
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              placeholder="Enter a place, e.g. Calicut"
            />
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-on-primary transition hover:bg-brand-dark"
          >
            <Search size={15} />
            Search
          </button>
          <button
            type="button"
            onClick={showAll}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant transition hover:border-primary hover:text-primary"
          >
            <RotateCcw size={14} />
            Show all
          </button>
        </form>

        <div className="mt-7 flex items-center justify-between">
          <p className="text-sm text-on-surface-variant">
            <span className="font-semibold text-on-surface">
              {visibleResults.length}
            </span>{" "}
            of {results.length} {results.length === 1 ? "donor" : "donors"} shown
          </p>
          <p className="text-xs text-on-surface-variant">Updated instantly</p>
        </div>

        {results.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-dashed border-outline bg-surface-container-lowest px-6 py-16 text-center">
            <Droplets size={32} className="mx-auto text-primary/40" />
            <p className="mt-4 font-display text-2xl text-on-surface">
              No donors match that search
            </p>
            <p className="mt-2 text-sm text-on-surface-variant">
              Try another location or clear the filters to see everyone.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleResults.map((donor) => (
              <article
                key={donor.id}
                className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 transition hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl text-accent">
                      {donor.name}
                    </h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-on-surface-variant">
                      <MapPin size={14} className="text-primary" />
                      {donor.place}
                    </p>
                    <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                      <span>{donor.age} years old</span>
                      <span className="h-1 w-1 rounded-full bg-outline" />
                      <span className="text-primary">{donor.availability}</span>
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-error-container px-3 py-1.5 text-sm font-bold text-error">
                    {donor.bloodGroup}
                  </span>
                </div>
                <a
                  href={`tel:${donor.phone.replace(/\s/g, "")}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-brand-dark"
                >
                  <Phone size={14} />
                  {donor.phone}
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
