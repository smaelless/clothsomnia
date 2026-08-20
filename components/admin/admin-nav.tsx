"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard, LogOut, Receipt, Tag, Users } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", Icon: Receipt },
  { href: "/admin/stock", label: "Stock", Icon: Boxes },
  { href: "/admin/offers", label: "Offers", Icon: Tag },
  { href: "/admin/waitlist", label: "List", Icon: Users },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-bone/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1500px] items-center gap-2 px-4 py-3 md:px-8">
        <Link href="/admin" className="display mr-4 shrink-0 text-lg tracking-tight">
          Clothsomnia
          <span className="label-wide ml-2 align-middle text-lime">Admin</span>
        </Link>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {LINKS.map(({ href, label, Icon }) => {
            // Overview would otherwise match every page beneath it.
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "label flex shrink-0 items-center gap-2 rounded-full px-4 py-2 transition-colors",
                  active ? "bg-lime text-ink" : "text-smoke hover:bg-slate hover:text-bone",
                )}
              >
                <Icon className="size-4" strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        <form action={signOut}>
          <button
            type="submit"
            className="label flex items-center gap-2 rounded-full px-4 py-2 text-smoke transition-colors hover:bg-slate hover:text-bone"
          >
            <LogOut className="size-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
