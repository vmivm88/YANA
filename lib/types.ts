// data/words/*.json 한 파일 = 한 표현. 스키마는 명세서 3장 기준.

export type Category =
  | "Workplace & Hierarchy"
  | "Daily Life"
  | "Emotion & Relationships"
  | "Food & Dining"
  | "Texting & Online"
  | "Email & Formal Writing";

export interface Alternative {
  phrase: string;
  romanization?: string;
  context: string;
}

export interface WordEntry {
  slug: string;
  version: string;
  korean: string;
  romanization: string;
  literal_meaning: string;
  category: Category;
  seo: {
    meta_title: string;
    meta_description: string;
  };
  ai_failure: {
    situation: string;
    ai_mistake: string;
    why_it_fails: string;
  };
  natural_solution: {
    rule: string;
    alternatives: Alternative[];
  };
  /** 상세 페이지 "Cultural Nuance Deep Dive" 본문 (선택) */
  nuance?: string;
  tags: string[];
}
