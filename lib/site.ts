// 배포 도메인이 정해지면 Vercel 환경변수 NEXT_PUBLIC_SITE_URL 로 설정하세요.
export const SITE = {
  name: "Context Korean",
  tagline: "Why Korean is Different, and Why Generic AI Fails to Teach It",
  description:
    "Open-source collection of Korean expressions that AI translators get wrong — with the natural alternatives Koreans actually use, explained through hierarchy and context.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  version: "0.1",
  feedbackUrl: process.env.NEXT_PUBLIC_FEEDBACK_URL ?? "https://tally.so",
  repoUrl: "https://github.com/vmivm88/YANA",
};
