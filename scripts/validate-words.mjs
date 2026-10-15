// data/words/*.json 검증: npm run validate
// 빌드 전에 기여자가 직접 실행하거나 CI에서 사용할 수 있습니다.
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "data", "words");
const CATEGORIES = [
  "Workplace & Hierarchy",
  "Daily Life",
  "Emotion & Relationships",
  "Food & Dining",
  "Texting & Online",
  "Email & Formal Writing",
  "K-pop & Fandom",
];
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const errors = [];

// 기여자 목록 검증
const ROLES = ["submitted", "written", "reviewed"];
const CONTRIB_FILE = path.join(process.cwd(), "data", "contributors.json");
const contributorIds = new Set();
if (fs.existsSync(CONTRIB_FILE)) {
  let list = [];
  try {
    list = JSON.parse(fs.readFileSync(CONTRIB_FILE, "utf8"));
  } catch (e) {
    errors.push(`contributors.json: JSON 형식 오류 — ${e.message}`);
  }
  if (!Array.isArray(list)) errors.push("contributors.json: 배열이어야 합니다");
  else {
    let founding = 0;
    list.forEach((c, i) => {
      const where = `contributors.json[${i}]`;
      if (!c?.id || !SLUG_RE.test(c.id)) errors.push(`${where}: id는 영문 소문자·숫자·하이픈만 사용하세요`);
      if (contributorIds.has(c?.id)) errors.push(`${where}: id "${c.id}" 중복`);
      if (!c?.name) errors.push(`${where}: name이 없습니다`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(c?.joined ?? "")) errors.push(`${where}: joined는 YYYY-MM-DD 형식이어야 합니다`);
      if (c?.url && !/^https?:\/\//.test(c.url)) errors.push(`${where}: url은 http(s)://로 시작해야 합니다`);
      if (c?.founding) founding++;
      contributorIds.add(c?.id);
    });
    if (founding > 50) errors.push(`contributors.json: Founding Contributor가 50명을 넘습니다 (${founding}명)`);
  }
}
const seenKorean = new Map();

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const err = (msg) => errors.push(`${file}: ${msg}`);
  let d;
  try {
    d = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8"));
  } catch (e) {
    err(`JSON 형식 오류 — ${e.message}`);
    continue;
  }

  const slug = file.replace(/\.json$/, "");
  if (d.slug !== slug) err(`slug("${d.slug}")가 파일명("${slug}")과 다릅니다`);
  if (!SLUG_RE.test(slug)) err("파일명은 영문 소문자·숫자·하이픈만 사용하세요");

  for (const key of ["version", "korean", "romanization", "literal_meaning"]) {
    if (typeof d[key] !== "string" || !d[key].trim()) err(`"${key}" 값이 비어 있습니다`);
  }
  if (!CATEGORIES.includes(d.category)) err(`category는 ${CATEGORIES.join(" / ")} 중 하나여야 합니다`);

  if (!d.seo?.meta_title) err("seo.meta_title이 없습니다");
  else if (d.seo.meta_title.length > 70) err(`seo.meta_title이 깁니다 (${d.seo.meta_title.length}자, 70자 이하 권장)`);
  if (!d.seo?.meta_description) err("seo.meta_description이 없습니다");
  else if (d.seo.meta_description.length > 160)
    err(`seo.meta_description이 깁니다 (${d.seo.meta_description.length}자, 160자 이하 권장)`);

  for (const key of ["situation", "ai_mistake", "why_it_fails"]) {
    if (!d.ai_failure?.[key]) err(`ai_failure.${key}가 없습니다`);
  }
  if (!d.natural_solution?.rule) err("natural_solution.rule이 없습니다");
  const alts = d.natural_solution?.alternatives;
  if (!Array.isArray(alts) || alts.length === 0) err("natural_solution.alternatives가 최소 1개 필요합니다");
  else alts.forEach((a, i) => (!a.phrase || !a.context) && err(`alternatives[${i}]에 phrase/context가 없습니다`));

  if (!Array.isArray(d.tags) || d.tags.length === 0) err("tags가 최소 1개 필요합니다");

  if (d.contributors !== undefined) {
    if (!Array.isArray(d.contributors)) err("contributors는 배열이어야 합니다");
    else
      d.contributors.forEach((c, i) => {
        if (!contributorIds.has(c?.id)) err(`contributors[${i}].id("${c?.id}")가 data/contributors.json에 없습니다`);
        if (!ROLES.includes(c?.role)) err(`contributors[${i}].role은 ${ROLES.join(" / ")} 중 하나여야 합니다`);
      });
  }

  if (d.korean) {
    if (seenKorean.has(d.korean)) err(`"${d.korean}"은(는) ${seenKorean.get(d.korean)}와 중복됩니다`);
    seenKorean.set(d.korean, file);
  }
}

if (errors.length) {
  console.error(`✕ ${errors.length}개 문제 발견:\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ ${files.length}개 표현 모두 통과`);
