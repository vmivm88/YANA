// 사이트 주소 우선순위:
// 1) NEXT_PUBLIC_SITE_URL (커스텀 도메인을 연결하면 여기에 설정)
// 2) Vercel이 빌드 때 자동으로 넣어 주는 Production 도메인
// 3) 로컬 개발용 localhost
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const SITE = {
  name: "Context Korean",
  tagline: "Why Korean is Different, and Why Generic AI Fails to Teach It",
  description:
    "Open-source collection of Korean expressions that AI translators get wrong — with the natural alternatives Koreans actually use, explained through hierarchy and context.",
  url: siteUrl,
  version: "0.3",
  feedbackUrl: process.env.NEXT_PUBLIC_FEEDBACK_URL ?? "https://tally.so/r/LZAXxp",
  repoUrl: "https://github.com/vmivm88/YANA",
  contactEmail: "hello@yanakorean.com",
};

// 사업자 정보 (전자상거래법상 통신판매업자 표시 사항)
export const COMPANY = {
  name: "Fine Pearls",
  nameKo: "파인펄스",
  representative: "신연화",
  bizRegNo: "112-41-17165",
  mailOrderNo: "2023-경기양평-1030",
  address: "경기도 양평군 단월면",
  founded: "2023-09-23",
};
