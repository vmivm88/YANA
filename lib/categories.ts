import type { Category } from "./types";

// 카테고리 랜딩 페이지(/topics/[slug])용 정보.
// title/description 은 구글 검색 결과에 그대로 보이는 문구라서, 사람들이 실제로 검색할 말로 씁니다.
export interface CategoryInfo {
  slug: string;
  name: Category;
  title: string; // <title> (60자 안팎)
  heading: string; // 페이지 h1
  description: string; // meta description (155자 안팎)
  intro: string; // 페이지 상단 소개 문단
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "workplace-hierarchy",
    name: "Workplace & Hierarchy",
    title: "Korean Workplace Phrases: How to Talk to Your Boss in Korean",
    heading: "Korean at work: talking to your boss, seniors and elders",
    description:
      "Korean phrases AI translators get wrong at work — 수고하세요, 알았어요, 김 씨 and more — with what Korean coworkers actually say to bosses and seniors.",
    intro:
      "In a Korean office, the words change with rank. A phrase that is perfectly polite to a coworker can sound careless or even condescending to your team leader. These are the workplace expressions AI tools most often get wrong, and what to say instead.",
  },
  {
    slug: "daily-life",
    name: "Daily Life",
    title: "Everyday Korean Phrases AI Gets Wrong (and What Koreans Say)",
    heading: "Everyday Korean that doesn't mean what AI says",
    description:
      "Everyday Korean phrases like 괜찮아요, 밥 먹었어요? and 천만에요 that translators misread — explained with the natural replies Koreans actually use.",
    intro:
      "Some of the most common Korean phrases carry a meaning that a word-for-word translation misses. 괜찮아요 can be a refusal, 밥 먹었어요? is usually a greeting, and 천만에요 sounds like a period drama. Here is what they really mean in daily life.",
  },
  {
    slug: "emotion-relationships",
    name: "Emotion & Relationships",
    title: "Korean for Friends, Partners and Family: Words AI Gets Wrong",
    heading: "Korean for friends, partners and family",
    description:
      "How to say sorry, call an older friend, or say you feel hurt in Korean — 미안해요 vs 죄송합니다, 언니·오빠·형·누나, 서운해 vs 실망했어, and why not to say 당신.",
    intro:
      "Close relationships in Korean still follow age and respect. Calling an older friend by name, saying 당신 for “you”, or picking the wrong word for feeling hurt can change how a sentence lands. These are the relationship phrases AI translations most often miss.",
  },
  {
    slug: "food-dining",
    name: "Food & Dining",
    title: "Korean Mealtime Phrases: What to Say Before and After Eating",
    heading: "Korean at the table",
    description:
      "What Koreans say before and after a meal — 잘 먹겠습니다 and 잘 먹었습니다 — and why the AI translation 'thank you for the meal' sounds unnatural.",
    intro:
      "Korean meals come with fixed phrases, especially when someone else has cooked or paid. AI tends to translate the English “thank you for the meal”, which no Korean actually says. Here is what to say instead.",
  },
  {
    slug: "texting-online",
    name: "Texting & Online",
    title: "Korean Texting Etiquette: How to Reply on KakaoTalk",
    heading: "Korean texting and KakaoTalk etiquette",
    description:
      "Why a bare '네.' can sound cold on KakaoTalk, and how Koreans soften replies to bosses and friends — 넵, 네네, 네~ explained.",
    intro:
      "In Korean chats, small softeners carry the tone your face and voice would carry in person. A reply that is grammatically perfect can still read as cold or annoyed. These are the texting habits AI doesn't teach.",
  },
  {
    slug: "email-formal-writing",
    name: "Email & Formal Writing",
    title: "How to Write a Korean Email: Openings and Closings That Sound Natural",
    heading: "Writing Korean emails and formal messages",
    description:
      "How to start and end a Korean email to a professor or business contact — and why 'I hope this email finds you well' doesn't translate.",
    intro:
      "Korean emails follow a simple, fixed shape: greet, say who you are, get to the point, close politely. English email idioms translated by AI break that shape. Here is how Koreans actually write.",
  },
  {
    slug: "kpop-fandom",
    name: "K-pop & Fandom",
    title: "K-pop Korean: Lyrics Words and Fan Letters AI Gets Wrong",
    heading: "Korean for K-pop fans: lyrics, fan letters and fan talk",
    description:
      "What 소리꾼 really means, how to write a fan letter in Korean, and the K-pop lyric words AI translators misread — with what Korean fans actually say.",
    intro:
      "K-pop lyrics borrow traditional words, slang and grammar that word-for-word translation flattens, and fan letters translated by AI often sound stiff or oddly intimate. These are the words fans ask about most, and how Korean fans actually write to their idols.",
  },
];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function getCategoryByName(name: string) {
  return CATEGORIES.find((c) => c.name === name) ?? null;
}
