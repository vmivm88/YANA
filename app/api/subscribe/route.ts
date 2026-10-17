import { NextResponse } from "next/server";

// 이메일 구독 API — MailerLite 로 구독자를 보냅니다. (무료 플랜: 구독자 500명까지, API 포함)
//
// 필요한 환경변수 (Vercel → Project → Settings → Environment Variables):
//   MAILERLITE_API_KEY     MailerLite → Integrations → API → Generate new token
// 선택 환경변수 (그룹 ID — MailerLite → Subscribers → Groups. 비워 두면 그룹 없이 저장):
//   MAILERLITE_GROUP_ID    모든 구독자를 넣을 기본 그룹 (예: "Newsletter")
//   MAILERLITE_GROUP_RU    러시아어권 수요 집계용 꼬리표. /ru 페이지에서 구독한 사람 + 영어 폼에서 "러시아어도" 체크한 사람
//                          (뉴스레터는 영어 하나로 모두에게 발송. 이 그룹에 별도 메일은 걸지 않음)
//   MAILERLITE_GROUP_WORK  직장·비즈니스
//   MAILERLITE_GROUP_FAMILY 연인·가족
//   MAILERLITE_GROUP_STUDY 공부·유학
//   MAILERLITE_GROUP_TRAVEL 여행·일상

const ML_API = "https://connect.mailerlite.com/api/subscribers";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const USE_GROUP_ENV: Record<string, string> = {
  work: "MAILERLITE_GROUP_WORK",
  family: "MAILERLITE_GROUP_FAMILY",
  study: "MAILERLITE_GROUP_STUDY",
  travel: "MAILERLITE_GROUP_TRAVEL",
};

type Body = {
  email?: unknown;
  consent?: unknown;
  russian?: unknown;
  use?: unknown;
  source?: unknown;
  company?: unknown; // honeypot — 사람은 비워 둠
  lang?: unknown; // "ru" = /ru 페이지 구독
};

const MSG = {
  en: {
    invalid: "Invalid request.",
    email: "Please enter a valid email address.",
    consent: "Please agree to the privacy notice to subscribe.",
    closed: "Subscriptions aren't open yet. Please try again soon.",
    failed: "Something went wrong. Please try again.",
  },
  ru: {
    invalid: "Некорректный запрос.",
    email: "Введите правильный адрес электронной почты.",
    consent: "Чтобы подписаться, отметьте согласие с политикой конфиденциальности.",
    closed: "Подписка пока не открыта. Попробуйте чуть позже.",
    failed: "Что-то пошло не так. Попробуйте ещё раз.",
  },
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: MSG.en.invalid }, { status: 400 });
  }

  const ru = body.lang === "ru";
  const m = ru ? MSG.ru : MSG.en;

  // 봇이 숨은 필드를 채웠으면 성공한 척하고 버립니다
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: m.email }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: m.consent }, { status: 400 });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    console.error("[subscribe] MAILERLITE_API_KEY is not set");
    return NextResponse.json(
      { error: m.closed },
      { status: 503 },
    );
  }

  // 모두 기본 그룹(영어 뉴스레터) + 러시아어 관심이면 러시아어 꼬리표 + 관심사 그룹
  const groups: string[] = [];
  if (process.env.MAILERLITE_GROUP_ID) groups.push(process.env.MAILERLITE_GROUP_ID);
  if ((ru || body.russian === true) && process.env.MAILERLITE_GROUP_RU) groups.push(process.env.MAILERLITE_GROUP_RU);
  if (typeof body.use === "string" && USE_GROUP_ENV[body.use]) {
    const id = process.env[USE_GROUP_ENV[body.use]];
    if (id) groups.push(id);
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  try {
    const res = await fetch(ML_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        ...(groups.length ? { groups } : {}),
        ...(ip ? { ip_address: ip } : {}),
      }),
    });
    // 201 = 새 구독자, 200 = 기존 구독자 갱신
    if (!res.ok) throw new Error(`mailerlite: ${res.status} ${await res.text()}`);
  } catch (e) {
    console.error("[subscribe]", e);
    return NextResponse.json({ error: m.failed }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
