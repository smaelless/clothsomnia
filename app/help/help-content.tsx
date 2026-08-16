import Link from "next/link";
import { CONTACT, RETURNS, SHIPPING, hasContact } from "@/lib/policies";
import { LOW_STOCK_AT } from "@/lib/catalog";

/**
 * The three trust pages share this component and differ only by which section
 * they open on. A first-time buyer paying cash to a brand they have never heard
 * of reads all three anyway, so splitting them into separate copies would only
 * create three places for the facts to drift apart.
 */
export type HelpSection = "shipping" | "returns" | "contact";

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-bone/10 py-5 sm:flex-row sm:gap-8">
      <dt className="label-wide w-full shrink-0 pt-1 text-smoke sm:w-52">{k}</dt>
      <dd className="text-base leading-relaxed text-silver">{v}</dd>
    </div>
  );
}

export function HelpContent({ open }: { open: HelpSection }) {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-12 md:px-8 md:py-16">
      {/* ---------------- Shipping ---------------- */}
      <section aria-label="Shipping" id="shipping" className={open === "shipping" ? "" : "mt-16"}>
        <h2 className="display text-huge leading-[0.95]">Shipping</h2>
        <dl className="mt-8">
          {SHIPPING.freeNationwide && (
            <Row k="Cost" v="Free, anywhere in Morocco. No minimum order." />
          )}
          <Row k="Payment" v="Cash on delivery. You pay the courier when it reaches you — nothing is taken online." />
          {SHIPPING.dispatchTime && <Row k="Dispatch" v={SHIPPING.dispatchTime} />}
          {SHIPPING.deliveryTime && <Row k="Delivery" v={SHIPPING.deliveryTime} />}
          <Row
            k="Before it ships"
            v="We call the number you left to confirm the order and the address. If we cannot reach you we will try again the next day."
          />
          {SHIPPING.exclusions && <Row k="Where we cannot deliver" v={SHIPPING.exclusions} />}
          {!SHIPPING.international && (
            <Row k="Outside Morocco" v="Not yet. Chapter 1 ships within Morocco only." />
          )}
          <Row
            k="Chapter 1"
            v="Orders placed before 27 September are held and dispatched after the drop, in the order they came in."
          />
        </dl>
      </section>

      {/* ---------------- Returns ---------------- */}
      <section aria-label="Returns" id="returns" className="mt-20">
        <h2 className="display text-huge leading-[0.95]">Returns &amp; exchanges</h2>
        <dl className="mt-8">
          {RETURNS.window ? (
            <Row k="Window" v={RETURNS.window} />
          ) : (
            <Row
              k="Window"
              v="If something is wrong with your order, contact us and we will sort it out."
            />
          )}
          <Row k="Condition" v={RETURNS.condition} />
          {RETURNS.exchanges && (
            <Row
              k="Wrong size"
              v={`We exchange sizes while stock lasts. There are ${LOW_STOCK_AT > 0 ? "only fifty pieces per size" : "limited pieces"}, so tell us quickly and we will hold one.`}
            />
          )}
          {RETURNS.whoPays === "us" && <Row k="Return shipping" v="We cover it." />}
          {RETURNS.whoPays === "customer" && (
            <Row k="Return shipping" v="Paid by you, unless the piece arrived faulty." />
          )}
          <Row
            k="Faulty or not as described"
            v="Send us a photo and we will replace it or refund you in full. That is on us, always."
          />
          <Row
            k="How to start one"
            v="Message us with your order reference — the CLS- code from your confirmation."
          />
        </dl>
      </section>

      {/* ---------------- Contact ---------------- */}
      <section aria-label="Contact" id="contact" className="mt-20">
        <h2 className="display text-huge leading-[0.95]">Contact</h2>

        {hasContact ? (
          <dl className="mt-8">
            {CONTACT.whatsapp && (
              <div className="flex flex-col gap-1 border-b border-bone/10 py-5 sm:flex-row sm:gap-8">
                <dt className="label-wide w-full shrink-0 pt-1 text-smoke sm:w-52">WhatsApp</dt>
                <dd>
                  <a
                    href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base text-lime underline-offset-4 hover:underline"
                  >
                    {CONTACT.phoneDisplay || CONTACT.whatsapp}
                  </a>
                </dd>
              </div>
            )}
            {CONTACT.email && (
              <div className="flex flex-col gap-1 border-b border-bone/10 py-5 sm:flex-row sm:gap-8">
                <dt className="label-wide w-full shrink-0 pt-1 text-smoke sm:w-52">Email</dt>
                <dd>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-base text-lime underline-offset-4 hover:underline"
                  >
                    {CONTACT.email}
                  </a>
                </dd>
              </div>
            )}
            {CONTACT.whatsappCommunity && (
              <div className="flex flex-col gap-1 border-b border-bone/10 py-5 sm:flex-row sm:gap-8">
                <dt className="label-wide w-full shrink-0 pt-1 text-smoke sm:w-52">
                  WhatsApp community
                </dt>
                <dd>
                  <a
                    href={CONTACT.whatsappCommunity}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base text-lime underline-offset-4 hover:underline"
                  >
                    Join the group
                  </a>
                  <p className="mt-1 text-sm text-smoke">
                    Drop news and sizing questions land here first.
                  </p>
                </dd>
              </div>
            )}
            {CONTACT.instagram && (
              <div className="flex flex-col gap-1 border-b border-bone/10 py-5 sm:flex-row sm:gap-8">
                <dt className="label-wide w-full shrink-0 pt-1 text-smoke sm:w-52">Instagram</dt>
                <dd>
                  <a
                    href={`https://instagram.com/${CONTACT.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base text-lime underline-offset-4 hover:underline"
                  >
                    @{CONTACT.instagram}
                  </a>
                </dd>
              </div>
            )}
            {CONTACT.hours && <Row k="Hours" v={CONTACT.hours} />}
          </dl>
        ) : (
          /* No invented phone number sits here in the meantime. */
          <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-silver">
            Contact details are being set up before the drop. In the meantime, join the
            after-hours list and you will hear from us first.
          </p>
        )}

        <p className="mt-10 text-sm text-smoke">
          Ordering something?{" "}
          <Link href="/collections/new" className="text-lime underline-offset-4 hover:underline">
            Chapter 1 is here
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
