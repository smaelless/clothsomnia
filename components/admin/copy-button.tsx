"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

/** Copies the delivery details in one tap — the thing you do for every order. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          /* Clipboard blocked — the text is on screen to select by hand. */
        }
      }}
      className="label flex items-center gap-2 text-smoke transition-colors hover:text-lime"
    >
      {copied ? (
        <Check className="size-4 text-lime" strokeWidth={2} />
      ) : (
        <Copy className="size-4" strokeWidth={1.75} />
      )}
      {copied ? "Copied" : label}
    </button>
  );
}
