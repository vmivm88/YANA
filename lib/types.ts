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
  /** 이 항목에 기여한 사람 (data/contributors.json 의 id) */
  contributors?: ContributorRef[];
}

/** 항목 → 기여자 연결. role: 제보 / 작성 / 원어민 검수 */
export interface ContributorRef {
  id: string;
  role: "submitted" | "written" | "reviewed";
}

/** data/contributors.json 한 줄 = 기여자 한 명 */
export interface Contributor {
  id: string;
  name: string;
  /** 짧은 소개: "Korean teacher", "UX designer in Seoul" 등 (선택) */
  title?: string;
  country?: string;
  /** 본인 SNS·포트폴리오 링크 (선택) */
  url?: string;
  /** 첫 기여가 실린 날짜 YYYY-MM-DD */
  joined: string;
  /** 첫 50명 = Founding Contributor */
  founding?: boolean;
}
