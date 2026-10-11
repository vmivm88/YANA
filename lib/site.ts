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
  version: "0.1",
  feedbackUrl: process.env.NEXT_PUBLIC_FEEDBACK_URL ?? "https://tally.so/r/LZAXxp",
  repoUrl: "https://github.com/vmivm88/YANA",
};
