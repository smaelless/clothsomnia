import { NotConfigured, Panel, when } from "@/components/admin/bits";
import { CopyButton } from "@/components/admin/copy-button";
import { requireAdmin } from "@/lib/admin";
import { isConfigured, listSignups } from "@/lib/waitlist";

/**
 * THE LIST
 *
 * Who is waiting, and their numbers in one block ready to paste into a
 * WhatsApp broadcast — which is how this list will actually be used, rather
 * than one row at a time.
 */
export default async function WaitlistPage() {
  await requireAdmin();
  if (!isConfigured()) return <NotConfigured />;

  const signups = await listSignups();

  const day = 24 * 60 * 60 * 1000;
  const today = signups.filter((s) => Date.now() - Date.parse(s.created_at) < day).length;
  const week = signups.filter((s) => Date.now() - Date.parse(s.created_at) < 7 * day).length;

  /* Comma separated: what WhatsApp Business and every broadcast tool expects. */
  const allNumbers = signups.map((s) => s.phone).join(", ");

  return (
    <>
      <h1 className="display text-4xl leading-none md:text-5xl">The list</h1>
      <p className="mt-3 text-sm text-smoke">
        {signups.length} waiting — {today} today, {week} this week.
      </p>

      {signups.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-bone/15 px-6 py-16 text-center">
          <p className="display text-2xl">Nobody yet.</p>
          <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-smoke">
            Numbers land here the moment someone leaves one on the waiting page.
          </p>
        </div>
      ) : (
        <>
          <Panel
            title="Every number"
            action={<CopyButton value={allNumbers} label="Copy all" />}
            className="mt-8"
          >
            <p className="text-sm leading-relaxed break-words text-silver">{allNumbers}</p>
            <p className="mt-4 text-xs text-smoke">
              Paste straight into a WhatsApp broadcast. Send the code once, to everyone.
            </p>
          </Panel>

          <Panel title="Who and when" className="mt-3">
            <ul>
              {signups.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-bone/10 py-3 last:border-0"
                >
                  <span className="label tabular-nums text-bone">{s.phone}</span>
                  {s.name && <span className="text-sm text-silver">{s.name}</span>}
                  <span className="ml-auto text-xs text-smoke">{when(s.created_at)}</span>
                  {s.notified_at && <span className="label text-lime">told</span>}
                </li>
              ))}
            </ul>
          </Panel>
        </>
      )}
    </>
  );
}
