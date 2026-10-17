import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllWords, getWordBySlug, getWordSlugs } from "@/lib/words";
import { getCategoryByName, getTagTopicsFor } from "@/lib/categories";
import WordCard from "@/components/WordCard";
import { SITE } from "@/lib/site";
import SubscribeForm from "@/components/SubscribeForm";
import ShareLinks from "@/components/ShareLinks";
import FoundingBadge from "@/components/FoundingBadge";
import { creditsFor, ROLE_LABEL } from "@/lib/contributors";

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
  // scripts/build-og.py 로 만든 미리보기 이미지. 없으면 기본 이미지
  const og = fs.existsSync(path.join(process.cwd(), "public", "og", `${word.slug}.png`))
    ? `/og/${word.slug}.png`
    : "/og/default.png";
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
      images: [{ url: og, width: 1200, height: 630, alt: `${word.korean} — ${word.literal_meaning}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: word.seo.meta_title,
      description: word.seo.meta_description,
      images: [og],
    },
  };
}

export default async function WordPage({ params }: Props) {
  const { slug } = await params;
  const word = getWordBySlug(slug);
  if (!word) notFound();

  const { ai_failure: fail, natural_solution: fix } = word;
  const topic = getCategoryByName(word.category);
  const tagTopics = getTagTopicsFor(word);
  const credits = creditsFor(word);

  // 관련 표현: 같은 카테고리 먼저, 모자라면 다른 카테고리에서 채움 (내부 링크 → 검색 노출에 도움)
  const others = getAllWords().filter((w) => w.slug !== word.slug);
  const related = [
    ...others.filter((w) => w.category === word.category),
    ...others.filter((w) => w.category !== word.category),
  ].slice(0, 3);

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
          ...(topic
            ? [{ "@type": "ListItem", position: 2, name: topic.name, item: `${SITE.url}/topics/${topic.slug}` }]
            : []),
          { "@type": "ListItem", position: topic ? 3 : 2, name: word.korean, item: `${SITE.url}/words/${word.slug}` },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:text-ink">All expressions</Link> <span aria-hidden>/</span>{" "}
        {topic ? (
          <Link href={`/topics/${topic.slug}`} className="hover:text-ink">{word.category}</Link>
        ) : (
          word.category
        )}
      </nav>

      <header className="mt-6">
        <h1 lang="ko" className="font-serif text-5xl font-bold sm:text-6xl">{word.korean}</h1>
        <p className="mt-2 text-muted">
          {word.romanization} · literally <span className="italic">“{word.literal_meaning}”</span>
        </p>
        {word.source && (
          <p className="mt-2 text-sm text-muted">
            ♪ From the song{" "}
            <cite lang="ko" className="font-medium not-italic text-ink">{word.source.song}</cite>
            {word.source.english_title && <> (“{word.source.english_title}”)</>} by{" "}
            <span className="font-medium text-ink">{word.source.artist}</span>, {word.source.year}
          </p>
        )}
        <p className="mt-6 text-lg">
          <span className="font-medium">Situation:</span> {fail.situation}
        </p>
        {credits.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" aria-label="Contributors">
            {credits.map((c) => (
              <li key={`${c.role}-${c.id}`} className="flex flex-wrap items-center gap-1.5">
                {ROLE_LABEL[c.role]}{" "}
                <Link href={`/contributors#${c.id}`} className="font-medium text-ink hover:text-accent">
                  {c.person.name}
                </Link>
                {c.person.founding && <FoundingBadge small />}
              </li>
            ))}
          </ul>
        )}
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
                <p lang="ko" className="font-serif text-xl font-medium">{a.phrase}</p>
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

      {related.length > 0 && (
        <section className="mt-14" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-semibold tracking-tight">
            {topic ? `More on ${topic.name.toLowerCase()}` : "More expressions AI gets wrong"}
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {related.map((w) => (
              <li key={w.slug}>
                <WordCard word={w} headingLevel={3} />
              </li>
            ))}
          </ul>
          {topic && (
            <Link href={`/topics/${topic.slug}`} className="mt-4 inline-block text-sm text-accent underline">
              See all {topic.name.toLowerCase()} expressions
            </Link>
          )}
          {tagTopics.map((t) => (
            <Link key={t.slug} href={`/topics/${t.slug}`} className="mt-4 ml-4 inline-block text-sm text-accent underline">
              See all {t.name.toLowerCase()}
            </Link>
          ))}
        </section>
      )}

      <div className="mt-12">
        <SubscribeForm
          source={`/words/${word.slug}`}
          heading="Get all 20 traps in one printable checklist."
          compact
        />
      </div>

      <section className="mt-12" aria-labelledby="share-heading">
        <h2 id="share-heading" className="text-sm font-medium text-muted">Share this entry</h2>
        <div className="mt-3">
          <ShareLinks
            url={`${SITE.url}/words/${word.slug}`}
            text={
              credits.length > 0
                ? `I helped build this entry on ${SITE.name}: ${word.korean} — Korean that AI gets wrong`
                : `${word.korean} — Korean that AI gets wrong`
            }
          />
        </div>
      </section>

      <aside className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Found a weird AI Korean translation?</p>
          <p className="mt-1 text-sm text-muted">
            If we publish it, your name goes on the entry. The first 50 contributors become{" "}
            <Link href="/contributors" className="underline hover:text-ink">Founding Contributors</Link>.
          </p>
        </div>
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
