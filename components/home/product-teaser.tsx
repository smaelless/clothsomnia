import { ProductDetail } from "@/components/product/product-detail";
import { SplitLines } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/wordmark";
import { getProduct } from "@/lib/catalog";

/**
 * PRODUCT EXPERIENCE TEASER — a live preview, not a mockup.
 * This is the real product component running in `compact` mode: the sizes,
 * swatches and add-to-bag all work from here.
 */
export function ProductTeaser() {
  const product = getProduct("nocturne-trench");
  if (!product) return null;

  return (
    <section className="relative border-y border-bone/10 py-14 md:py-20" aria-label="Product experience">
      <div aria-hidden className="bloom left-[-8%] top-[20%] size-[34rem] bg-pine/20" />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="04" className="mb-8">
              The product page
            </SectionLabel>
            <SplitLines
              lines={["Every piece gets", "its own spread"]}
              className="display text-giant"
              lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
            />
          </div>
          <p className="max-w-[32ch] pb-3 text-sm leading-relaxed text-smoke">
            Editorial where it counts, ruthlessly practical where it has to be. This preview is
            the real thing — pick a size and add it to your bag from right here.
          </p>
        </div>

        {/* Stage — corner marks frame the preview like a contact sheet */}
        <div className="relative mt-10 md:mt-8">
          {(
            [
              "-top-3 -left-3 border-l border-t",
              "-top-3 -right-3 border-r border-t",
              "-bottom-3 -left-3 border-l border-b",
              "-bottom-3 -right-3 border-r border-b",
            ] as const
          ).map((pos) => (
            <span key={pos} aria-hidden className={`absolute size-8 border-lime/60 ${pos}`} />
          ))}

          <div className="border border-bone/10 bg-charcoal/40 p-4 md:p-10">
            <ProductDetail product={product} compact />
          </div>
        </div>
      </div>
    </section>
  );
}
