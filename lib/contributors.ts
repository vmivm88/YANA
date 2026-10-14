import fs from "node:fs";
import path from "node:path";
import type { Contributor, ContributorRef, WordEntry } from "./types";
import { getAllWords } from "./words";

const FILE = path.join(process.cwd(), "data", "contributors.json");

/** Founding Contributor 자리 수 */
export const FOUNDING_LIMIT = 50;

export const ROLE_LABEL: Record<ContributorRef["role"], string> = {
  submitted: "Submitted by",
  written: "Written by",
  reviewed: "Reviewed by",
};

export function getAllContributors(): Contributor[] {
  if (!fs.existsSync(FILE)) return [];
  const list = JSON.parse(fs.readFileSync(FILE, "utf8")) as Contributor[];
  // Founding 먼저, 그다음 먼저 기여한 순
  return [...list].sort(
    (a, b) => Number(!!b.founding) - Number(!!a.founding) || a.joined.localeCompare(b.joined),
  );
}

export function getContributor(id: string): Contributor | null {
  return getAllContributors().find((c) => c.id === id) ?? null;
}

export function foundingTaken(): number {
  return getAllContributors().filter((c) => c.founding).length;
}

/** 기여자 한 명이 참여한 항목들 */
export function entriesBy(id: string, words: WordEntry[] = getAllWords()) {
  return words.filter((w) => w.contributors?.some((c) => c.id === id));
}

/** 항목의 기여자 정보를 이름까지 풀어서 반환 (없는 id는 건너뜀) */
export function creditsFor(word: WordEntry) {
  return (word.contributors ?? [])
    .map((ref) => ({ ...ref, person: getContributor(ref.id) }))
    .filter((c): c is ContributorRef & { person: Contributor } => c.person !== null);
}
