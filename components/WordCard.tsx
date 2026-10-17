import Link from "next/link";
import type { WordEntry } from "@/lib/types";

export default function WordCard({ word, headingLevel = 2 }: { word: WordEntry; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  const top = word.natural_solution.alternatives[0];

  return (
    <Link
      href={`/words/${word.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-[0_8px_24px_-12px_rgba(28,25,23,0.25)]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">{word.category}</span>
        <span className="text-xs text-muted">v{word.version}</span>
      </div>

      <Heading lang="ko" className="mt-3 font-serif text-3xl font-bold leading-tight">{word.korean}</Heading>
      <p className="mt-1 text-sm text-muted">
        {word.romanization} · <span className="italic">“{word.literal_meaning}”</span>
      </p>

      <div className="mt-4 rounded-lg bg-fail-soft px-3 py-2 text-sm text-fail">
        <span className="mr-1.5 font-semibold">AI gets it wrong:</span>
        {word.ai_failure.why_it_fails}
      </div>

      {top && (
        <div className="mt-3 rounded-lg bg-ok-soft px-3 py-2 text-sm">
          <span className="mr-1.5 font-semibold text-ok">
            {word.type === "meaning" ? "How it's used:" : "Say instead:"}
          </span>
          <span className="font-serif font-medium">{top.phrase}</span>
        </div>
      )}

      <span className="mt-auto pt-4 text-sm font-medium text-accent group-hover:underline">
        See why →
      </span>
    </Link>
  );
}
