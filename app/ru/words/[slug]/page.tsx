import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllRuWords, getRuSlugs, getRuWord, RU_CATEGORY } from "@/lib/words-ru";
import { getWordBySlug } from "@/lib/words";
import { SITE } from "@/lib/site";
import SubscribeForm from "@/components/SubscribeForm";
import ShareLinks from "@/components/ShareLinks";

type Props = { params: Promise<{ slug: string }> };

// data/words-ru/*.json → /ru/words/<slug> (영어 항목과 같은 slug)
export function generateStaticParams() {
  return getRuSlugs().map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const word = getRuWord(slug);
  if (!word) return {};
  const url = `/ru/words/${slug}`;
  const og = fs.existsSync(path.join(process.cwd(), "public", "og", `${slug}.png`))
    ? `/og/${slug}.png`
    : "/og/default.png";
  return {
    title: { absolute: word.title },
    description: word.description,
    keywords: [word.korean, word.translit],
    alternates: {
      canonical: url,
      languages: { en: `/words/${slug}`, ru: url, "x-default": `/words/${slug}` },
    },
    openGraph: {
      type: "article",
      title: word.title,
      description: word.description,
      url,
      siteName: SITE.name,
      locale: "ru_RU",
      images: [{ url: og, width: 1200, height: 630, alt: `${word.korean} — ${word.literal}` }],
    },
    twitter: { card: "summary_large_image", title: word.title, description: word.description, images: [og] },
  };
}

export default async function RuWordPage({ params }: Props) {
  const { slug } = await params;
  const word = getRuWord(slug);
  const en = getWordBySlug(slug);
  if (!word || !en) notFound();

  const isMeaning = word.type === "meaning";
  const category = RU_CATEGORY[en.category];

  const others = getAllRuWords().filter((w) => w.slug !== slug);
  const sameCat = others.filter((w) => getWordBySlug(w.slug)?.category === en.category);
  const related = [...sameCat, ...others.filter((w) => !sameCat.includes(w))].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "ru",
    mainEntity: [
      {
        "@type": "Question",
        name: `Можно ли сказать «${word.korean}»? ${word.situation}`,
        acceptedAnswer: { "@type": "Answer", text: `${word.why_it_fails} ${word.rule}` },
      },
      {
        "@type": "Question",
        name: isMeaning ? `Что на самом деле значит «${word.korean}»?` : `Что сказать вместо «${word.korean}»?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: word.alternatives.map((a) => `${a.phrase} — ${a.context}`).join(" / "),
        },
      },
    ],
  };

  return (
    <article lang="ru" className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Навигация" className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <span>
          <Link href="/ru" className="hover:text-ink">Все выражения</Link> <span aria-hidden>/</span> {category}
        </span>
        <Link href={`/words/${slug}`} hrefLang="en" lang="en" className="hover:text-ink">
          English
        </Link>
      </nav>

      <header className="mt-6">
        <h1 lang="ko" className="font-serif text-5xl font-bold sm:text-6xl">{word.korean}</h1>
        <p className="mt-2 text-muted">
          {word.translit} · дословно <span className="italic">«{word.literal}»</span>
        </p>
        <p className="mt-6 text-lg">
          <span className="font-medium">Ситуация:</span> {word.situation}
        </p>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Ответ ИИ и естественный корейский">
        <div className="rounded-2xl border border-fail/20 bg-fail-soft p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-fail">✕ Что говорит ИИ</h2>
          <p className="mt-3">{word.ai_mistake}</p>
          <p className="mt-4 border-t border-fail/15 pt-4 text-sm text-fail">
            <span className="font-semibold">Почему это ошибка: </span>
            {word.why_it_fails}
          </p>
        </div>

        <div className="rounded-2xl border border-ok/20 bg-ok-soft p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ok">
            {isMeaning ? "✓ Как это используют" : "✓ Что говорят корейцы"}
          </h2>
          <p className="mt-3 font-medium">{word.rule}</p>
          <ul className="mt-4 space-y-3 border-t border-ok/15 pt-4">
            {word.alternatives.map((a) => (
              <li key={a.phrase}>
                <p lang="ko" className="font-serif text-xl font-medium">{a.phrase}</p>
                <p className="text-xs text-muted">{a.translit}</p>
                <p className="text-sm text-muted">{a.context}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-accent/25 bg-white p-6" aria-labelledby="ru-note">
        <h2 id="ru-note" className="text-sm font-semibold text-accent">Если вы думаете по-русски</h2>
        <p className="mt-2 text-lg leading-relaxed">{word.ru_note}</p>
      </section>

      {word.nuance && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Культурный контекст</h2>
          <p className="mt-4 text-lg leading-relaxed">{word.nuance}</p>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-14" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-semibold tracking-tight">Ещё ошибки ИИ</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {related.map((w) => (
              <li key={w.slug}>
                <Link
                  href={`/ru/words/${w.slug}`}
                  className="block h-full rounded-2xl border border-line bg-white p-5 hover:border-accent"
                >
                  <p lang="ko" className="font-serif text-2xl font-bold">{w.korean}</p>
                  <p className="mt-2 text-sm text-muted">{w.situation}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/ru" className="mt-4 inline-block text-sm text-accent underline">
            Все выражения на русском
          </Link>
        </section>
      )}

      <div className="mt-12">
        <SubscribeForm source={`/ru/words/${slug}`} heading="Все 20 ловушек в одном чек-листе для печати." compact lang="ru" />
      </div>

      <section className="mt-12" aria-labelledby="share-heading">
        <h2 id="share-heading" className="text-sm font-medium text-muted">Поделиться</h2>
        <div className="mt-3">
          <ShareLinks url={`${SITE.url}/ru/words/${slug}`} text={`${word.korean} — корейский, в котором ошибается ИИ`} />
        </div>
      </section>

      <aside className="mt-6 rounded-2xl border border-line bg-white p-6">
        <p className="font-medium">Встретили странный корейский перевод от ИИ?</p>
        <p className="mt-1 text-sm text-muted">
          Напишите на{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="text-accent underline">{SITE.contactEmail}</a> — можно
          по-русски. Если мы опубликуем ваш случай, под статьёй будет ваше имя.
        </p>
      </aside>
    </article>
  );
}
