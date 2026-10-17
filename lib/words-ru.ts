import fs from "node:fs";
import path from "node:path";
import type { Category } from "./types";

// 러시아어 항목: data/words-ru/<slug>.json
// slug는 영어 항목(data/words/<slug>.json)과 같아야 합니다. 카테고리는 영어 항목에서 가져옵니다.
// 발음 표기: 콘체비치 표기(система Концевича)

export interface RuAlternative {
  phrase: string;
  translit: string;
  context: string;
}

export interface RuWordEntry {
  slug: string;
  type: "fix" | "meaning";
  korean: string;
  translit: string;
  literal: string;
  title: string;
  description: string;
  situation: string;
  ai_mistake: string;
  why_it_fails: string;
  rule: string;
  alternatives: RuAlternative[];
  /** 러시아어권 학습자에게 특히 걸리는 지점 (러시아어·러시아 문화와 비교) */
  ru_note: string;
  nuance?: string;
}

export const RU_CATEGORY: Record<Category, string> = {
  "Workplace & Hierarchy": "Работа и иерархия",
  "Daily Life": "Повседневная жизнь",
  "Emotion & Relationships": "Чувства и отношения",
  "Food & Dining": "Еда",
  "Texting & Online": "Переписка",
  "Email & Formal Writing": "Письма",
  "K-pop & Fandom": "K-pop",
};

const DIR = path.join(process.cwd(), "data", "words-ru");
const EN_DIR = path.join(process.cwd(), "data", "words");

const REQUIRED = [
  "slug", "korean", "translit", "literal", "title", "description",
  "situation", "ai_mistake", "why_it_fails", "rule", "alternatives", "ru_note",
] as const;

function read(slug: string): RuWordEntry {
  const file = path.join(DIR, `${slug}.json`);
  let data: RuWordEntry;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    throw new Error(`[words-ru] ${slug}.json: JSON 형식 오류 (${(err as Error).message})`);
  }
  for (const key of REQUIRED) {
    if (!data[key]) throw new Error(`[words-ru] ${slug}.json: "${key}" 필드가 없습니다.`);
  }
  if (data.slug !== slug) throw new Error(`[words-ru] ${slug}.json: slug가 파일명과 다릅니다.`);
  if (!fs.existsSync(path.join(EN_DIR, `${slug}.json`))) {
    throw new Error(`[words-ru] ${slug}.json: 같은 slug의 영어 항목(data/words)이 없습니다.`);
  }
  return data;
}

export function getRuSlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
}

export function hasRu(slug: string): boolean {
  return fs.existsSync(path.join(DIR, `${slug}.json`));
}

export function getRuWord(slug: string): RuWordEntry | null {
  return hasRu(slug) ? read(slug) : null;
}

export function getAllRuWords(): RuWordEntry[] {
  return getRuSlugs()
    .map(read)
    .sort((a, b) => a.korean.localeCompare(b.korean, "ko"));
}
