import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWordBySlug, getWordSlugs } from "@/lib/words";
import { SITE } from "@/lib/site";
import SubscribeForm from "@/components/SubscribeForm";

type Props = { params: Promise<{ slug: string }> };

// 빌드 시 data/words/*.json 전부를 정적 페이지로 생성
export function generateStaticParams() {
  return getWordSlugs().map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const word = getWordBySlug(slug);
  if (!word) return {};
  const url = `/words/${word.slug}`;
  return {
    title: { absolute: word.seo.meta_title },
    description: word.seo.meta_description,
    keywords: [word.korean, word.romanization, ...word.tags],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: word.seo.meta_title,
      description: word.seo.meta_description,
      url,
      siteName: SITE.name,
    },
    twitter: { card: "summary_large_image", title: word.seo.meta_title, description: word.seo.meta_description },
  };
}

export default async function WordPage({ params }: Props) {
  const { slug } = await params;
  const word = getWordBySlug(slug);
  if (!word) notFound();

  const { ai_failure: fail, natural_solution: fix } = word;

  // FAQPage 구조화 데이터 → 구글 리치 스니펫 후보
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Can I use "${word.korean}" when ${fail.situation.toLowerCase()}?`,
            acceptedAnswer: { "@type": "Answer", text: `${fail.why_it_fails} ${fix.rule}` },
          },
          {
            "@type": "Question",
            name: `What should I say instead of "${word.korean}"?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: fix.alternatives.map((a) => `${a.phrase} — ${a.context}`).join(" / "),
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
          { "@type": "ListItem", position: 2, name: word.korean, item: `${SITE.url}/words/${word.slug}` },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:text-ink">All expressions</Link> <span aria-hidden>/</span> {word.category}
      </nav>

      <header className="mt-6">
        <h1 className="font-serif text-5xl font-bold sm:text-6xl">{word.korean}</h1>
        <p className="mt-2 text-muted">
          {word.romanization} · literally <span className="italic">“{word.literal_meaning}”</span>
        </p>
        <p className="mt-6 text-lg">
          <span className="font-medium">Situation:</span> {fail.situation}
        </p>
      </header>

      {/* Before / After split view */}
      <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label="AI answer versus natural Korean">
        <div className="rounded-2xl border border-fail/20 bg-fail-soft p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-fail">✕ What AI tells you</h2>
          <p className="mt-3">{fail.ai_mistake}</p>
          <p className="mt-4 border-t border-fail/15 pt-4 text-sm text-fail">
            <span className="font-semibold">Why it fails: </span>
            {fail.why_it_fails}
          </p>
        </div>

        <div className="rounded-2xl border border-ok/20 bg-ok-soft p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ok">✓ What Koreans actually say</h2>
          <p className="mt-3 font-medium">{fix.rule}</p>
          <ul className="mt-4 space-y-3 border-t border-ok/15 pt-4">
            {fix.alternatives.map((a) => (
              <li key={a.phrase}>
                <p className="font-serif text-xl font-medium">{a.phrase}</p>
                {a.romanization && <p className="text-xs text-muted">{a.romanization}</p>}
                <p className="text-sm text-muted">{a.context}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {word.nuance && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Cultural nuance, in depth</h2>
          <p className="mt-4 text-lg leading-relaxed">{word.nuance}</p>
        </section>
      )}

      <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags">
        {word.tags.map((t) => (
          <li key={t} className="rounded-full border border-line bg-white px-3 py-1 text-xs text-muted">
            #{t}
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <SubscribeForm
          source={`/words/${word.slug}`}
          heading="Get all 20 traps in one printable checklist."
          compact
        />
      </div>

      <aside className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium">Found a weird AI Korean translation?</p>
        <a
          href={`${SITE.feedbackUrl}?expression=${encodeURIComponent(word.korean)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-accent"
        >
          Submit a case
        </a>
      </aside>
    </article>
  );
}
