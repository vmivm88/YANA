import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";
import { getWordSlugs } from "@/lib/words";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const dir = path.join(process.cwd(), "data", "words");

  const words = getWordSlugs().map((slug) => ({
    url: `${SITE.url}/words/${slug}`,
    lastModified: fs.statSync(path.join(dir, `${slug}.json`)).mtime,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: SITE.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...words,
  ];
}
