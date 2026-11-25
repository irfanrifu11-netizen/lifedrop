"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Droplets, LayoutDashboard, LogOut } from "lucide-react";
import { localStore } from "@/lib/local-store";

const nav = [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStore.setAdmin(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-surface-container-low lg:flex">
      <aside className="border-b border-outline-variant bg-surface-container-lowest lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r lg:px-4 lg:py-5">
        <div className="border-b border-outline-variant px-5 py-5 lg:rounded-2xl lg:border lg:bg-surface lg:px-4 lg:py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm">
              <Droplets size={20} />
            </span>
            <div>
              <p className="font-display text-xl leading-none text-on-surface">
                LifeDrop
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
                Admin panel
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 lg:px-0 lg:py-5">
          <p className="mb-2 hidden px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant lg:block">
            Menu
          </p>
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1.5 lg:overflow-visible">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface hover:text-primary lg:hover:shadow-sm"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      active
                        ? "bg-white/15 text-on-primary"
                        : "bg-surface-container text-secondary group-hover:text-primary"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto hidden px-0 pb-2 lg:block">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm font-medium text-on-surface-variant transition hover:border-error/30 hover:bg-error-container hover:text-error"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container">
              <LogOut size={16} />
            </span>
            Log out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 sm:px-10 lg:py-12">{children}</main>
    </div>
  );
}
