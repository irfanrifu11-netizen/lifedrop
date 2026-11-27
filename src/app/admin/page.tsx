"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Droplets,
  HandHeart,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import {
  BLOOD_GROUPS,
  connectDonorToRequest,
  disconnectDonorFromRequest,
  useConnections,
  useDonors,
  useRequests,
} from "@/lib/lifedrop-store";
import type { BloodGroup, Urgency } from "@/lib/lifedrop-store";

type ConnectionFilter = "all" | "connected" | "unconnected";

export default function AdminDashboardPage() {
  const donors = useDonors();
  const requests = useRequests();
  const connections = useConnections();

  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [bloodGroup, setBloodGroup] = useState<"All" | BloodGroup>("All");
  const [urgency, setUrgency] = useState<"All" | Urgency>("All");
  const [connectionFilter, setConnectionFilter] =
    useState<ConnectionFilter>("all");
  const [showAllDonors, setShowAllDonors] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);

  const filteredRequests = useMemo(() => {
    const search = appliedQuery.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesSearch =
        !search ||
        [request.patientName, request.place, request.contactName, request.phone]
          .join(" ")
          .toLowerCase()
          .includes(search) ||
        donors.some(
          (donor) =>
            (donor.name.toLowerCase().includes(search) ||
              donor.place.toLowerCase().includes(search) ||
              (donor.district ?? "").toLowerCase().includes(search)) &&
            donor.bloodGroup === request.bloodGroup &&
            donor.consent &&
            donor.availability === "Available",
        );
      const matchesBloodGroup =
        bloodGroup === "All" || request.bloodGroup === bloodGroup;
      const matchesUrgency = urgency === "All" || request.urgency === urgency;
      const isConnected = connections.some(
        (connection) => connection.requestId === request.id,
      );
      const matchesConnection =
        connectionFilter === "all" ||
        (connectionFilter === "connected" ? isConnected : !isConnected);
      return (
        matchesSearch && matchesBloodGroup && matchesUrgency && matchesConnection
      );
    });
  }, [requests, donors, connections, appliedQuery, bloodGroup, urgency, connectionFilter]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setAppliedQuery(query.trim());
  };

  const hasFilters =
    appliedQuery !== "" ||
    bloodGroup !== "All" ||
    urgency !== "All" ||
    connectionFilter !== "all";

  const clearFilters = () => {
    setQuery("");
    setAppliedQuery("");
    setBloodGroup("All");
    setUrgency("All");
    setConnectionFilter("all");
  };

  const inputClass =
    "w-full rounded-xl border border-outline bg-surface px-4 py-3 text-sm outline-none focus:border-primary";

  const totalDonors = donors.length;
  const totalRequests = requests.length;
  const collected = donors.filter((d) => d.availability === "Available").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">
            Overview
          </p>
          <h1 className="mt-2 font-display text-4xl text-on-surface">Dashboard</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            LifeDrop donor and blood request statistics.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 rounded-full border border-outline px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "Total Donors", value: totalDonors, icon: Users },
          { label: "Blood Requests", value: totalRequests, icon: Droplets },
          { label: "Available Donors", value: collected, icon: HandHeart },
          { label: "Connected", value: connections.length, icon: CheckCircle2 },
        ].map((stat) => (
          <div
            key={stat.label}
              className="lift-card rounded-2xl border border-outline-variant bg-surface p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                {stat.label}
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-primary">
                <stat.icon size={18} />
              </span>
            </div>
            <p className="mt-4 font-display text-4xl text-on-surface">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-outline-variant bg-surface shadow-card">
        <div className="border-b border-outline-variant px-6 py-4">
          <h2 className="font-display text-xl text-on-surface">
            {`Connect Donors to Requests${hasFilters ? ` (${filteredRequests.length})` : ""}`}
          </h2>
          <p className="mt-1 text-xs text-on-surface-variant">
            Matching donors by blood group and availability.
          </p>
        </div>
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-end gap-3 border-b border-outline-variant px-6 py-4"
        >
          <label className="min-w-[200px] flex-1">
            <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
              Search requests
            </span>
            <span className="relative block">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
              />
              <input
                className={`${inputClass} pl-9`}
                value={query}
                onChange={(event) => {
                  const value = event.target.value;
                  setQuery(value);
                  setAppliedQuery(value.trim());
                }}
                placeholder="Patient, donor, place or contact"
              />
            </span>
          </label>
          <label className="w-full sm:w-32">
            <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
              Blood group
            </span>
            <select
              className={inputClass}
              value={bloodGroup}
              onChange={(event) =>
                setBloodGroup(event.target.value as "All" | BloodGroup)
              }
            >
              <option value="All">All groups</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </label>
          <label className="w-full sm:w-32">
            <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
              Urgency
            </span>
            <select
              className={inputClass}
              value={urgency}
              onChange={(event) => setUrgency(event.target.value as "All" | Urgency)}
            >
              <option value="All">All</option>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Critical">Critical</option>
            </select>
          </label>
          <label className="w-full sm:w-40">
            <span className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
              Status
            </span>
            <select
              className={inputClass}
              value={connectionFilter}
              onChange={(event) =>
                setConnectionFilter(event.target.value as ConnectionFilter)
              }
            >
              <option value="all">All requests</option>
              <option value="connected">Connected</option>
              <option value="unconnected">Not connected</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-widest text-on-primary hover:bg-brand-dark"
          >
            Search
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-outline px-4 py-3 text-xs font-semibold uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary"
            >
              Clear
            </button>
          )}
        </form>
        {!hasFilters && requests.length > 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-on-surface-variant">
              Use the filters above to find matching donors.
            </p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-on-surface-variant">
              {requests.length === 0
                ? "No blood requests yet."
                : "No requests match these filters."}
            </p>
            {requests.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-xl border border-outline px-4 py-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {filteredRequests.map((request) => {
              const matches = donors.filter(
                (donor) =>
                  donor.bloodGroup === request.bloodGroup &&
                  donor.consent &&
                  donor.availability === "Available",
              );
              const donorSearch = appliedQuery.trim().toLowerCase();
              const donorMatches = donorSearch
                ? matches.filter(
                    (donor) =>
                      donor.name.toLowerCase().includes(donorSearch) ||
                      donor.place.toLowerCase().includes(donorSearch) ||
                      (donor.district ?? "").toLowerCase().includes(donorSearch),
                  )
                : [];
              const visibleMatches = donorMatches.length ? donorMatches : matches;
              const connection = connections.find(
                (item) => item.requestId === request.id,
              );
              return (
                <div key={request.id} className="px-6 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-error-container px-3 py-1 text-xs font-bold text-error">
                          {request.bloodGroup}
                        </span>
                        <p className="text-sm font-semibold text-on-surface">{request.patientName}</p>
                        <span className="text-[11px] text-on-surface-variant">({request.urgency})</span>
                        {connection && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800">
                            Connected to {connection.donorName}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
                        <MapPin size={13} className="text-primary" />
                        {request.place} · {request.contactName}
                      </p>
                    </div>
                    <a
                      href={`tel:${request.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-on-primary"
                    >
                      <Phone size={13} />
                      Requester
                    </a>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                      Matching donors ({visibleMatches.length})
                    </p>
                    {visibleMatches.length === 0 ? (
                      <p className="text-xs text-on-surface-variant">No matching available donor found.</p>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        {visibleMatches.map((donor) => {
                          const isConnected = connection?.donorId === donor.id;
                          return (
                            <div
                              key={donor.id}
                              className="rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2.5"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-on-surface">{donor.name}</p>
                                  <p className="truncate text-[11px] text-on-surface-variant">{donor.place}</p>
                                </div>
                                <a
                                  href={`tel:${donor.phone.replace(/\s/g, "")}`}
                                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-on-primary hover:bg-brand-dark"
                                >
                                  <Phone size={12} />
                                  Call
                                </a>
                              </div>
                              <div className="mt-2 flex items-center justify-between gap-2 border-t border-outline-variant pt-2">
                                <span className="text-[11px] text-on-surface-variant">
                                  {isConnected ? "Connection status" : "Not connected"}
                                </span>
                                {isConnected ? (
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800">
                                      <CheckCircle2 size={12} />
                                      Connected
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        disconnectDonorFromRequest(request.id)
                                      }
                                      className="text-[10px] font-semibold text-on-surface-variant underline hover:text-error"
                                    >
                                      Undo
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      connectDonorToRequest(request.id, donor)
                                    }
                                    className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100"
                                  >
                                    Connect
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="lift-card overflow-hidden rounded-3xl border border-outline-variant bg-surface shadow-card">
          <div className="border-b border-outline-variant px-6 py-4">
            <h2 className="font-display text-xl text-on-surface">Recent Donors</h2>
          </div>
          {donors.length === 0 ? (
            <p className="px-6 py-10 text-sm text-on-surface-variant">No donors yet.</p>
          ) : (
            <>
              <div className="divide-y divide-outline-variant">
                {(showAllDonors ? donors : donors.slice(0, 2)).map((donor) => (
                  <div key={donor.id} className="flex items-center justify-between gap-3 px-6 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-on-surface">{donor.name}</p>
                      <p className="truncate text-xs text-on-surface-variant">
                        {donor.age} years · {donor.district || donor.place} · {donor.phone}
                      </p>
                      <p className="mt-0.5 text-[11px] text-accent">{donor.availability}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-error-container px-3 py-1 text-xs font-bold text-error">
                      {donor.bloodGroup}
                    </span>
                  </div>
                ))}
              </div>
              {donors.length > 2 && (
                <button
                  type="button"
                  onClick={() => setShowAllDonors((current) => !current)}
                  className="w-full border-t border-outline-variant px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary hover:bg-surface-container"
                >
                  {showAllDonors ? "Show less" : `See more (${donors.length - 2})`}
                </button>
              )}
            </>
          )}
        </div>

        <div className="lift-card overflow-hidden rounded-3xl border border-outline-variant bg-surface shadow-card">
          <div className="border-b border-outline-variant px-6 py-4">
            <h2 className="font-display text-xl text-on-surface">Recent Requests</h2>
          </div>
          {requests.length === 0 ? (
            <p className="px-6 py-10 text-sm text-on-surface-variant">No requests yet.</p>
          ) : (
            <>
              <div className="divide-y divide-outline-variant">
                {(showAllRequests ? requests : requests.slice(0, 2)).map((request) => (
                  <div key={request.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{request.patientName}</p>
                      <p className="text-xs text-on-surface-variant">
                        {request.district || request.place}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-error-container px-3 py-1 text-xs font-bold text-error">
                        {request.bloodGroup}
                      </span>
                      <p className="mt-1 text-[11px] text-on-surface-variant">{request.urgency}</p>
                    </div>
                  </div>
                ))}
              </div>
              {requests.length > 2 && (
                <button
                  type="button"
                  onClick={() => setShowAllRequests((current) => !current)}
                  className="w-full border-t border-outline-variant px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary hover:bg-surface-container"
                >
                  {showAllRequests ? "Show less" : `See more (${requests.length - 2})`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
