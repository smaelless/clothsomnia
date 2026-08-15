import type { Metadata } from "next";
import { LabClient } from "./lab-client";

export const metadata: Metadata = {
  title: "Lookbook Lab",
  description: "Compare lookbook layouts.",
  robots: { index: false, follow: false },
};

export default function LookbookLabPage() {
  return (
    <>
      <header className="mx-auto max-w-[1600px] px-4 pt-14 md:px-8">
        <p className="label-wide mb-6 text-lime">Internal — pick a layout</p>
        <h1 className="display text-giant">
          Four ways to
          <span className="block font-light italic text-silver">show the book</span>
        </h1>
        <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-silver">
          Same twelve frames, four completely different layouts. Switch between them and
          scroll. Tell me the letter and I will put it on the homepage.
        </p>
      </header>

      <LabClient />
    </>
  );
}
