import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";
import { getAllWords } from "@/lib/words";
import { CATEGORIES } from "@/lib/categories";
import { SITE } from "@/lib/site";

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

  // 표현이 하나라도 있는 카테고리만
  const topics = CATEGORIES.filter((c) => all.some((w) => w.category === c.name)).map((c) => {
    const inTopic = all.filter((w) => w.category === c.name);
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
    ...topics,
    ...words,
    { url: `${SITE.url}/about`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
