import type { Metadata } from "next";
import { IntroLabClient } from "./intro-lab-client";

export const metadata: Metadata = {
  title: "Intro Lab",
  description: "Compare the four Clothsomnia opening sequences.",
  robots: { index: false, follow: false },
};

export default function IntroLabPage() {
  return <IntroLabClient />;
}
