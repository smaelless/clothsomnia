import { Download } from "lucide-react";
import { NotConfigured, Stat, when } from "@/components/admin/bits";
import { WaitlistTable } from "@/components/admin/waitlist-table";
import { requireAdmin } from "@/lib/admin";
import { isConfigured, listSignups } from "@/lib/waitlist";

/**
 * THE LIST — who is waiting, and whether they have been told.
 */
export default async function WaitlistPage() {
  await requireAdmin();
  if (!isConfigured()) return <NotConfigured />;

  const signups = await listSignups();

  const day = 24 * 60 * 60 * 1000;
  const since = (ms: number) =>
    signups.filter((s) => Date.now() - Date.parse(s.created_at) < ms).length;

  const told = signups.filter((s) => s.notified_at).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl leading-none md:text-5xl">The list</h1>
          <p className="mt-3 text-sm text-smoke">
            Every WhatsApp number left on the waiting page, newest first.
          </p>
        </div>

        {signups.length > 0 && (
          <a
            href="/admin/waitlist/export"
            className="label flex items-center gap-2 rounded-full border border-bone/20 px-5 py-3 text-smoke transition-colors hover:border-lime hover:text-lime"
          >
            <Download className="size-4" strokeWidth={1.75} />
            Export CSV
          </a>
        )}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Waiting" value={String(signups.length)} accent />
        <Stat label="Today" value={String(since(day))} hint={`${since(7 * day)} this week`} />
        <Stat label="Told" value={String(told)} hint="Message already sent" />
        <Stat
          label="Still to tell"
          value={String(signups.length - told)}
          hint="Before 27 September"
        />
      </div>

      {signups.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-bone/15 px-6 py-16 text-center">
          <p className="display text-2xl">Nobody yet.</p>
          <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-smoke">
            Numbers land here the moment someone leaves one on the waiting page — and a
            message reaches your Telegram at the same time.
          </p>
        </div>
      ) : (
        <WaitlistTable
          rows={signups.map((s) => ({
            id: s.id,
            phone: s.phone,
            name: s.name,
            when: when(s.created_at),
            notified: Boolean(s.notified_at),
          }))}
        />
      )}
    </>
  );
}
