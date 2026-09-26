"use client";

import { useMemo, useState } from "react";
import type { WordEntry } from "@/lib/types";
import WordCard from "./WordCard";

interface Props {
  words: WordEntry[];
  categories: string[];
}

export default function WordGrid({ words, categories }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return words.filter((w) => {
      if (category && w.category !== category) return false;
      if (!q) return true;
      const haystack = [
        w.korean,
        w.romanization,
        w.literal_meaning,
        w.ai_failure.situation,
        w.natural_solution.rule,
        ...w.natural_solution.alternatives.map((a) => a.phrase),
        ...w.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [words, query, category]);

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm transition ${
      active ? "border-ink bg-ink text-paper" : "border-line bg-white text-ink hover:border-ink/40"
    }`;

  return (
    <section aria-label="Expressions">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button type="button" className={chip(category === null)} onClick={() => setCategory(null)}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={chip(category === c)}
              aria-pressed={category === c}
              onClick={() => setCategory(category === c ? null : c)}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="relative sm:w-72">
          <span className="sr-only">Search expressions</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 수고, boss, honorifics…"
            className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm placeholder:text-muted focus:border-ink focus:outline-none"
          />
        </label>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {filtered.length} of {words.length} expressions
      </p>

      {filtered.length > 0 ? (
        <ul className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w) => (
            <li key={w.slug}>
              <WordCard word={w} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3 rounded-2xl border border-dashed border-line px-6 py-12 text-center text-muted">
          No matches yet. Know one AI gets wrong? Submit it — that&apos;s how v0.2 gets built.
        </div>
      )}
    </section>
  );
}
