"use client";

import {
  CheckCircle2,
  Droplets,
  HandHeart,
  MapPin,
  Phone,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  connectDonorToRequest,
  disconnectDonorFromRequest,
  useConnections,
  useDonors,
  useRequests,
} from "@/lib/lifedrop-store";

export default function AdminDashboardPage() {
  const donors = useDonors();
  const requests = useRequests();
  const connections = useConnections();

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
            className="rounded-2xl border border-outline-variant bg-surface p-6"
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

      <div className="mt-8 overflow-hidden rounded-3xl border border-outline-variant bg-surface">
        <div className="border-b border-outline-variant px-6 py-4">
          <h2 className="font-display text-xl text-on-surface">Connect Donors to Requests</h2>
          <p className="mt-1 text-xs text-on-surface-variant">
            Matching donors by blood group and availability.
          </p>
        </div>
        {requests.length === 0 ? (
          <p className="px-6 py-10 text-sm text-on-surface-variant">No blood requests yet.</p>
        ) : (
          <div className="divide-y divide-outline-variant">
            {requests.map((request) => {
              const matches = donors.filter(
                (donor) =>
                  donor.bloodGroup === request.bloodGroup &&
                  donor.consent &&
                  donor.availability === "Available",
              );
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
                      Matching donors ({matches.length})
                    </p>
                    {matches.length === 0 ? (
                      <p className="text-xs text-on-surface-variant">No matching available donor found.</p>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        {matches.map((donor) => {
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
        <div className="overflow-hidden rounded-3xl border border-outline-variant bg-surface">
          <div className="border-b border-outline-variant px-6 py-4">
            <h2 className="font-display text-xl text-on-surface">Recent Donors</h2>
          </div>
          {donors.length === 0 ? (
            <p className="px-6 py-10 text-sm text-on-surface-variant">No donors yet.</p>
          ) : (
            <div className="divide-y divide-outline-variant">
              {donors.slice(0, 20).map((donor) => (
                <div key={donor.id} className="flex items-center justify-between gap-3 px-6 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-on-surface">{donor.name}</p>
                    <p className="truncate text-xs text-on-surface-variant">
                      {donor.age} years · {donor.place} · {donor.phone}
                    </p>
                    <p className="mt-0.5 text-[11px] text-primary">{donor.availability}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-error-container px-3 py-1 text-xs font-bold text-error">
                    {donor.bloodGroup}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-3xl border border-outline-variant bg-surface">
          <div className="border-b border-outline-variant px-6 py-4">
            <h2 className="font-display text-xl text-on-surface">Recent Requests</h2>
          </div>
          {requests.length === 0 ? (
            <p className="px-6 py-10 text-sm text-on-surface-variant">No requests yet.</p>
          ) : (
            <div className="divide-y divide-outline-variant">
              {requests.slice(0, 8).map((request) => (
                <div key={request.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{request.patientName}</p>
                    <p className="text-xs text-on-surface-variant">{request.place}</p>
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
          )}
        </div>
      </div>
    </div>
  );
}
