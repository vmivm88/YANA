import WordGrid from "@/components/WordGrid";
import SubscribeForm from "@/components/SubscribeForm";
import { getAllWords, getCategories } from "@/lib/words";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const words = getAllWords();
  const categories = getCategories(words);

  // 검색엔진용 구조화 데이터: 사이트 + 표현 목록
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        inLanguage: "en",
      },
      {
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}/icon.png`,
        email: SITE.contactEmail,
        sameAs: [SITE.repoUrl],
      },
      {
        "@type": "ItemList",
        name: "Korean expressions AI gets wrong",
        itemListElement: words.map((w, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE.url}/words/${w.slug}`,
          name: `${w.korean} (${w.romanization})`,
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-white px-3 py-1 text-xs font-medium text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            v{SITE.version} Released: {words.length} Critical Nuances AI Gets Wrong
          </span>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-start">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
                Your AI translated the words. Not the relationship.
              </h1>

              <div className="mt-6 grid max-w-3xl gap-4 text-lg leading-relaxed text-muted">
                <p>
                  Korean is a language of <strong className="text-ink">relationships</strong>. Who you&apos;re
                  talking to — older, younger, your boss, a stranger — changes the words themselves.
                </p>
                <p>
                  AI translators map words one-to-one and miss that. This open project collects the phrases they
                  get wrong, and what Koreans actually say instead.
                </p>
              </div>

              <a href="#expressions" className="mt-6 inline-block text-sm font-medium text-accent underline">
                Browse all {words.length} expressions ↓
              </a>
            </div>

            <div id="checklist" className="scroll-mt-24">
              <SubscribeForm
                source="/#hero"
                heading="Before you send Korean an AI wrote, run this check."
                compact
              />
            </div>
          </div>
        </div>
      </section>

      <div id="expressions" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-10 sm:px-6">
        <WordGrid words={words} categories={categories} />
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-label="Newsletter">
        <SubscribeForm source="/" />
      </section>
    </>
  );
}
