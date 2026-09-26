import fs from "node:fs";
import path from "node:path";
import type { WordEntry } from "./types";

const WORDS_DIR = path.join(process.cwd(), "data", "words");

/** JSON 파일 하나를 읽고 최소한의 필수 필드를 검증합니다. */
function readEntry(fileName: string): WordEntry {
  const fullPath = path.join(WORDS_DIR, fileName);
  const raw = fs.readFileSync(fullPath, "utf8");

  let data: WordEntry;
  try {
    data = JSON.parse(raw) as WordEntry;
  } catch (err) {
    throw new Error(`[words] ${fileName}: JSON 형식이 잘못되었습니다. (${(err as Error).message})`);
  }

  const required = ["slug", "korean", "category", "seo", "ai_failure", "natural_solution"] as const;
  for (const key of required) {
    if (!data[key]) throw new Error(`[words] ${fileName}: "${key}" 필드가 없습니다.`);
  }

  const expectedSlug = fileName.replace(/\.json$/, "");
  if (data.slug !== expectedSlug) {
    throw new Error(`[words] ${fileName}: slug("${data.slug}")가 파일명과 다릅니다.`);
  }

  return data;
}

/** data/words 안의 모든 .json 파일 이름 */
export function getWordSlugs(): string[] {
  if (!fs.existsSync(WORDS_DIR)) return [];
  return fs
    .readdirSync(WORDS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

/** 모든 표현을 한국어 가나다순으로 반환 */
export function getAllWords(): WordEntry[] {
  return getWordSlugs()
    .map((slug) => readEntry(`${slug}.json`))
    .sort((a, b) => a.korean.localeCompare(b.korean, "ko"));
}

/** slug로 표현 하나 찾기. 없으면 null */
export function getWordBySlug(slug: string): WordEntry | null {
  const file = `${slug}.json`;
  if (!fs.existsSync(path.join(WORDS_DIR, file))) return null;
  return readEntry(file);
}

/** 카드 필터용 카테고리 목록 (데이터에 실제로 있는 것만) */
export function getCategories(words: WordEntry[] = getAllWords()): string[] {
  return Array.from(new Set(words.map((w) => w.category))).sort();
}
