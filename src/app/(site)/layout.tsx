import { SiteFooter } from "@/components/lifedrop/site-footer";
import { SiteHeader } from "@/components/lifedrop/site-header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
