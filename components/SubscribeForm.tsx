"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  /** 어디서 구독했는지 (예: "/", "/words/sugohaseyo") */
  source: string;
  /** 카드 상단 문구를 페이지마다 바꿀 때 */
  heading?: string;
  compact?: boolean;
  /** 폼 언어. "ru"면 러시아어 문구 + 러시아어 PDF + 러시아어 구독자 그룹 */
  lang?: Lang;
};

type Status = "idle" | "loading" | "done" | "error";

type Lang = "en" | "ru";

const COPY = {
  en: {
    checklistUrl: "/free/ai-korean-trap-checklist.pdf",
    uses: [
      { value: "", label: "What do you mostly use Korean for? (optional)" },
      { value: "work", label: "Work — a Korean boss, coworkers, clients" },
      { value: "family", label: "A Korean partner or family" },
      { value: "study", label: "Study in Korea" },
      { value: "travel", label: "Travel and daily life" },
    ],
    usesLabel: "What do you mostly use Korean for?",
    eyebrow: "Free PDF",
    heading: "Get the AI Korean Trap Checklist.",
    body: "20 phrases AI gets wrong and a 7-point check to run before you send anything an AI wrote. Plus new expressions by email, and first access to our upcoming checker.",
    emailLabel: "Email address",
    placeholder: "you@example.com",
    submit: "Get the checklist",
    sending: "Sending…",
    consentBefore: "I agree to the collection and use of my email address as described in the",
    consentLink: "privacy notice",
    consentAfter: ". Unsubscribe anytime.",
    needConsent: "Please agree to the privacy notice to subscribe.",
    genericError: "Something went wrong. Please try again.",
    doneTitle: "You're on the list. 감사합니다!",
    doneBody: "Here's your checklist. New expressions will land in your inbox.",
    download: "Download the checklist (PDF)",
  },
  ru: {
    checklistUrl: "/free/ai-korean-trap-checklist-ru.pdf",
    uses: [
      { value: "", label: "Зачем вам корейский? (необязательно)" },
      { value: "work", label: "Работа — корейский начальник, коллеги, клиенты" },
      { value: "family", label: "Корейский партнёр или его семья" },
      { value: "study", label: "Учёба в Корее" },
      { value: "travel", label: "Путешествия и повседневная жизнь" },
    ],
    usesLabel: "Зачем вам корейский?",
    eyebrow: "Бесплатный PDF",
    heading: "Получите чек-лист «Ловушки ИИ в корейском».",
    body: "20 фраз, в которых ошибается ИИ, и 7 вопросов, которые стоит задать себе перед отправкой. А ещё — новые выражения по почте на русском и ранний доступ к нашей проверке текстов.",
    emailLabel: "Электронная почта",
    placeholder: "you@example.com",
    submit: "Получить чек-лист",
    sending: "Отправляем…",
    consentBefore: "Я согласен(-на) на сбор и использование моего email в соответствии с",
    consentLink: "политикой конфиденциальности",
    consentAfter: " (на английском). Отписаться можно в любой момент.",
    needConsent: "Чтобы подписаться, отметьте согласие с политикой конфиденциальности.",
    genericError: "Что-то пошло не так. Попробуйте ещё раз.",
    doneTitle: "Вы подписаны. 감사합니다!",
    doneBody: "Вот ваш чек-лист. Новые выражения будут приходить на почту.",
    download: "Скачать чек-лист (PDF)",
  },
} as const;

export default function SubscribeForm({ source, heading, compact = false, lang = "en" }: Props) {
  const t = COPY[lang];
  const [email, setEmail] = useState("");
  const [use, setUse] = useState("");
  const [russian, setRussian] = useState(false);
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setStatus("error");
      setMessage(t.needConsent);
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, use, russian, consent, source, company, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? t.genericError);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : t.genericError);
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-ok/20 bg-ok-soft p-6" role="status">
        <p className="font-semibold text-ok">{t.doneTitle}</p>
        <p className="mt-1 text-sm text-muted">{t.doneBody}</p>
        <a
          href={t.checklistUrl}
          download
          className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-accent"
        >
          {t.download}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-white p-6" noValidate>
      <p className="text-sm font-medium text-accent">{t.eyebrow}</p>
      <h2 className={`mt-1 font-semibold tracking-tight ${compact ? "text-lg" : "text-2xl"}`}>
        {heading ?? t.heading}
      </h2>
      <p className={`mt-2 max-w-xl text-muted ${compact ? "text-sm" : ""}`}>
        {t.body}
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`email-${source}`} className="sr-only">
          {t.emailLabel}
        </label>
        <input
          id={`email-${source}`}
          type="email"
          required
          autoComplete="email"
          placeholder={t.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-full border border-line bg-paper px-4 py-2.5 outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-accent disabled:opacity-60"
        >
          {status === "loading" ? t.sending : t.submit}
        </button>
      </div>

      {/* 봇 차단용 숨은 필드 */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="hidden"
      />

      {!compact && (
        <select
          aria-label={t.usesLabel}
          value={use}
          onChange={(e) => setUse(e.target.value)}
          className="mt-3 w-full rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-muted outline-none focus:border-accent sm:w-auto"
        >
          {t.uses.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      )}

      <div className="mt-4 space-y-2 text-sm">
        {lang === "en" && (
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={russian}
            onChange={(e) => setRussian(e.target.checked)}
            className="mt-1 accent-[var(--color-accent)]"
          />
          <span className="text-muted">
            I&apos;d also like this in Russian <span lang="ru">(хочу версию на русском)</span>
          </span>
        </label>
        )}
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 accent-[var(--color-accent)]"
          />
          <span className="text-muted">
            {t.consentBefore}{" "}
            <Link href="/privacy" className="underline hover:text-ink">
              {t.consentLink}
            </Link>
            {t.consentAfter}
          </span>
        </label>
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-fail" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
