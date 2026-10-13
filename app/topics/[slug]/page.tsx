import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import WordCard from "@/components/WordCard";
import SubscribeForm from "@/components/SubscribeForm";
import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";
import { getAllWords } from "@/lib/words";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const used = new Set(getAllWords().map((w) => w.category));
  return CATEGORIES.filter((c) => used.has(c.name)).map((c) => ({ slug: c.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  const url = `/topics/${cat.slug}`;
  return {
    title: { absolute: `${cat.title} | ${SITE.name}` },
    description: cat.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: cat.title,
      description: cat.description,
      url,
      siteName: SITE.name,
      images: [{ url: "/og/default.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: cat.title, description: cat.description, images: ["/og/default.png"] },
  };
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const words = getAllWords().filter((w) => w.category === cat.name);
  if (words.length === 0) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: cat.title,
        description: cat.description,
        url: `${SITE.url}/topics/${cat.slug}`,
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
      },
      {
        "@type": "ItemList",
        itemListElement: words.map((w, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE.url}/words/${w.slug}`,
          name: `${w.korean} (${w.romanization})`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
          { "@type": "ListItem", position: 2, name: cat.name, item: `${SITE.url}/topics/${cat.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/" className="hover:text-ink">All expressions</Link> <span aria-hidden>/</span> {cat.name}
          </nav>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            {cat.heading}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{cat.intro}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((w) => (
            <li key={w.slug}>
              <WordCard word={w} />
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-xl font-semibold tracking-tight">More topics</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
            <li key={c.slug}>
              <Link
                href={`/topics/${c.slug}`}
                className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-sm hover:border-ink/40"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14">
          <SubscribeForm source={`/topics/${cat.slug}`} />
        </div>
      </div>
    </>
  );
}
