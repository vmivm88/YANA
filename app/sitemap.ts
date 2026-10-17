import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";
import { getAllWords } from "@/lib/words";
import { CATEGORIES, getWordsForTopic } from "@/lib/categories";
import { SITE } from "@/lib/site";
import { getRuSlugs } from "@/lib/words-ru";

export default function sitemap(): MetadataRoute.Sitemap {
  const dir = path.join(process.cwd(), "data", "words");
  const all = getAllWords();
  const mtime = (slug: string) => fs.statSync(path.join(dir, `${slug}.json`)).mtime;

  const words = all.map((w) => ({
    url: `${SITE.url}/words/${w.slug}`,
    lastModified: mtime(w.slug),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // 표현이 하나라도 있는 주제만 (카테고리 + 태그 주제)
  const topics = CATEGORIES.filter((c) => getWordsForTopic(c, all).length > 0).map((c) => {
    const inTopic = getWordsForTopic(c, all);
    const latest = new Date(Math.max(...inTopic.map((w) => mtime(w.slug).getTime())));
    return {
      url: `${SITE.url}/topics/${c.slug}`,
      lastModified: latest,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  return [
    { url: SITE.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/ru`, changeFrequency: "monthly", priority: 0.8 },
    ...topics,
    ...words,
    ...getRuSlugs().map((slug) => ({
      url: `${SITE.url}/ru/words/${slug}`,
      lastModified: fs.statSync(path.join(process.cwd(), "data", "words-ru", `${slug}.json`)).mtime,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${SITE.url}/contributors`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE.url}/about`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
