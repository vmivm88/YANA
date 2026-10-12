import { NextResponse } from "next/server";

// 이메일 구독 API — Kit(구 ConvertKit) v4 로 구독자를 보냅니다.
//
// 필요한 환경변수 (Vercel → Project → Settings → Environment Variables):
//   KIT_API_KEY      Kit 계정 → Settings → Developer → API Key (v4)
//   KIT_FORM_ID      구독자를 넣을 Kit 폼 ID (숫자)
// 선택 환경변수 (관심사 태그 — 비워 두면 태그 없이 저장):
//   KIT_TAG_RU       러시아어 버전에 관심 있는 사람
//   KIT_TAG_WORK     직장·비즈니스
//   KIT_TAG_FAMILY   연인·가족
//   KIT_TAG_STUDY    공부·유학
//   KIT_TAG_TRAVEL   여행·일상

const KIT_API = "https://api.kit.com/v4";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const USE_TAG_ENV: Record<string, string> = {
  work: "KIT_TAG_WORK",
  family: "KIT_TAG_FAMILY",
  study: "KIT_TAG_STUDY",
  travel: "KIT_TAG_TRAVEL",
};

type Body = {
  email?: unknown;
  consent?: unknown;
  russian?: unknown;
  use?: unknown;
  source?: unknown;
  company?: unknown; // honeypot — 사람은 비워 둠
};

async function kit(path: string, apiKey: string, body: unknown) {
  return fetch(`${KIT_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Kit-Api-Key": apiKey },
    body: JSON.stringify(body),
  });
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // 봇이 숨은 필드를 채웠으면 성공한 척하고 버립니다
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: "Please agree to the privacy notice to subscribe." }, { status: 400 });
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;
  if (!apiKey || !formId) {
    console.error("[subscribe] KIT_API_KEY or KIT_FORM_ID is not set");
    return NextResponse.json(
      { error: "Subscriptions aren't open yet. Please try again soon." },
      { status: 503 },
    );
  }

  const source = typeof body.source === "string" ? body.source.slice(0, 200) : "";
  const referrer = `${req.headers.get("origin") ?? ""}${source.startsWith("/") ? source : ""}` || null;

  try {
    // 1) 구독자 생성(이미 있으면 갱신) → 2) 폼에 추가
    const created = await kit("/subscribers", apiKey, { email_address: email });
    if (!created.ok) throw new Error(`create subscriber: ${created.status} ${await created.text()}`);

    const added = await kit(`/forms/${formId}/subscribers`, apiKey, { email_address: email, referrer });
    if (!added.ok) throw new Error(`add to form: ${added.status} ${await added.text()}`);

    // 3) 관심사 태그 (실패해도 구독 자체는 성공으로 처리)
    const tagIds: string[] = [];
    if (body.russian === true && process.env.KIT_TAG_RU) tagIds.push(process.env.KIT_TAG_RU);
    if (typeof body.use === "string" && USE_TAG_ENV[body.use]) {
      const id = process.env[USE_TAG_ENV[body.use]];
      if (id) tagIds.push(id);
    }
    await Promise.all(
      tagIds.map((id) =>
        kit(`/tags/${id}/subscribers`, apiKey, { email_address: email }).catch((e) =>
          console.error("[subscribe] tag failed", id, e),
        ),
      ),
    );
  } catch (e) {
    console.error("[subscribe]", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
