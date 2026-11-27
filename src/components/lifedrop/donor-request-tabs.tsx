"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Droplets } from "lucide-react";
import { BloodRequests } from "@/components/lifedrop/blood-requests";
import { DonorDirectory } from "@/components/lifedrop/donor-directory";

type Tab = "find" | "request";

const tabs = [
  { id: "find", label: "Donors near you", icon: Droplets },
  { id: "request", label: "Blood requests", icon: AlertTriangle },
] as const;

export function DonorRequestTabs() {
  const [active, setActive] = useState<Tab>("find");

  useEffect(() => {
    const syncWithHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "find" || hash === "request") {
        setActive(hash);
      }
    };
    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);
    const interval = window.setInterval(syncWithHash, 300);
    return () => {
      window.removeEventListener("hashchange", syncWithHash);
      window.clearInterval(interval);
    };
  }, []);

  const selectTab = (tab: Tab) => {
    setActive(tab);
    window.history.replaceState(null, "", `#${tab}`);
  };

  return (
    <>
      <div className="bg-surface px-5 pt-14 sm:px-8">
        <div className="mx-auto flex max-w-6xl gap-2 rounded-2xl border border-outline-variant bg-surface-container-low p-1.5">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectTab(id)}
              aria-current={active === id ? "page" : undefined}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] shadow-sm ring-1 transition ${
                active === id
                  ? "bg-primary text-on-primary shadow-[#d71920]/25 ring-brand-dark/20"
                  : "bg-surface-container-lowest text-on-surface ring-outline-variant hover:text-primary"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>
      {active === "find" ? <DonorDirectory /> : <BloodRequests />}
    </>
  );
}
