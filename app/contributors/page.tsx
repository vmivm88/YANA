import type { Metadata } from "next";
import Link from "next/link";
import FoundingBadge from "@/components/FoundingBadge";
import { getAllContributors, entriesBy, foundingTaken, FOUNDING_LIMIT } from "@/lib/contributors";
import { getAllWords } from "@/lib/words";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contributors",
  description: `The learners and native speakers who build ${SITE.name}. The first ${FOUNDING_LIMIT} become Founding Contributors.`,
  alternates: { canonical: "/contributors" },
};

export default function ContributorsPage() {
  const people = getAllContributors();
  const words = getAllWords();
  const taken = foundingTaken();
  const left = Math.max(FOUNDING_LIMIT - taken, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Built by learners and native speakers</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
        Every entry on {SITE.name} starts with someone noticing that an AI got Korean wrong. When we publish a case
        you sent, your name goes on that entry — and stays there.
      </p>

      {/* Founding Contributor 자리 */}
      <section className="mt-10 rounded-2xl border border-accent/30 bg-white p-6 sm:p-8" aria-labelledby="founding">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="founding" className="text-2xl font-semibold tracking-tight">Founding Contributors</h2>
          <FoundingBadge />
        </div>
        <p className="mt-3 max-w-2xl text-muted">
          The first {FOUNDING_LIMIT} people whose cases or reviews are published keep the Founding Contributor title
          permanently, on every entry they’ve helped build.
        </p>

        <div className="mt-6" aria-label={`${taken} of ${FOUNDING_LIMIT} spots taken`}>
          <div className="h-2 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-accent" style={{ width: `${(taken / FOUNDING_LIMIT) * 100}%` }} />
          </div>
          <p className="mt-2 text-sm">
            <span className="font-semibold">{left}</span> of {FOUNDING_LIMIT} spots left
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={SITE.feedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-accent"
          >
            Submit a case
          </a>
          <a
            href={`${SITE.repoUrl}/blob/master/CONTRIBUTING.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium hover:border-ink/40"
          >
            Contribute on GitHub
          </a>
        </div>
      </section>

      {/* 기여자 목록 */}
      <section className="mt-14" aria-labelledby="people">
        <h2 id="people" className="text-2xl font-semibold tracking-tight">Contributors</h2>
        {people.length === 0 ? (
          <p className="mt-4 text-muted">
            No one yet — the first published case gets the first spot. It could be yours.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {people.map((c) => {
              const mine = entriesBy(c.id, words);
              return (
                <li key={c.id} id={c.id} className="scroll-mt-24 rounded-2xl border border-line bg-white p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener" className="text-lg font-semibold hover:text-accent">
                        {c.name}
                      </a>
                    ) : (
                      <span className="text-lg font-semibold">{c.name}</span>
                    )}
                    {c.founding && <FoundingBadge small />}
                  </div>
                  {(c.title || c.country) && (
                    <p className="mt-1 text-sm text-muted">{[c.title, c.country].filter(Boolean).join(", ")}</p>
                  )}
                  {mine.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {mine.map((w) => (
                        <li key={w.slug}>
                          <Link
                            href={`/words/${w.slug}`}
                            lang="ko"
                            className="inline-block rounded-full border border-line px-3 py-1 font-serif text-sm hover:border-ink/40"
                          >
                            {w.korean}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-14" aria-labelledby="how">
        <h2 id="how" className="text-2xl font-semibold tracking-tight">How credit works</h2>
        <ul className="mt-4 space-y-2 leading-relaxed">
          <li><span className="font-medium">Submitted by</span> — you sent us the AI mistake and the situation.</li>
          <li><span className="font-medium">Written by</span> — you wrote the entry itself.</li>
          <li><span className="font-medium">Reviewed by</span> — you’re a native speaker who checked it.</li>
        </ul>
        <p className="mt-4 text-muted">
          Tell us the name you’d like shown and, if you want, a short title and a link to your site or profile. You can
          stay anonymous too.
        </p>
      </section>
    </div>
  );
}
