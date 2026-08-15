import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";
import { isSignedIn } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin",
  // The order list holds customers' names, phone numbers and home addresses.
  robots: { index: false, follow: false },
};

/** Orders change constantly, so nothing under /admin may be served from cache. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedIn = await isSignedIn();

  return (
    <div className="min-h-dvh bg-ink text-bone">
      {signedIn && <AdminNav />}
      <main className="mx-auto max-w-[1500px] px-4 py-8 md:px-8 md:py-10">{children}</main>
    </div>
  );
}
