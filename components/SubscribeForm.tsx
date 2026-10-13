"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  /** 어디서 구독했는지 (예: "/", "/words/sugohaseyo") */
  source: string;
  /** 카드 상단 문구를 페이지마다 바꿀 때 */
  heading?: string;
  compact?: boolean;
};

type Status = "idle" | "loading" | "done" | "error";

const CHECKLIST_URL = "/free/ai-korean-trap-checklist.pdf";

const USES = [
  { value: "", label: "What do you mostly use Korean for? (optional)" },
  { value: "work", label: "Work — a Korean boss, coworkers, clients" },
  { value: "family", label: "A Korean partner or family" },
  { value: "study", label: "Study in Korea" },
  { value: "travel", label: "Travel and daily life" },
];

export default function SubscribeForm({ source, heading, compact = false }: Props) {
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
      setMessage("Please agree to the privacy notice to subscribe.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, use, russian, consent, source, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-ok/20 bg-ok-soft p-6" role="status">
        <p className="font-semibold text-ok">You&apos;re on the list. 감사합니다!</p>
        <p className="mt-1 text-sm text-muted">Here&apos;s your checklist. New expressions will land in your inbox.</p>
        <a
          href={CHECKLIST_URL}
          download
          className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-accent"
        >
          Download the checklist (PDF)
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-white p-6" noValidate>
      <p className="text-sm font-medium text-accent">Free PDF</p>
      <h2 className={`mt-1 font-semibold tracking-tight ${compact ? "text-lg" : "text-2xl"}`}>
        {heading ?? "Get the AI Korean Trap Checklist."}
      </h2>
      <p className={`mt-2 max-w-xl text-muted ${compact ? "text-sm" : ""}`}>
        20 phrases AI gets wrong and a 7-point check to run before you send anything an AI wrote. Plus new
        expressions by email, and first access to our upcoming checker.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`email-${source}`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-full border border-line bg-paper px-4 py-2.5 outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-accent disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Get the checklist"}
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
          aria-label="What do you mostly use Korean for?"
          value={use}
          onChange={(e) => setUse(e.target.value)}
          className="mt-3 w-full rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-muted outline-none focus:border-accent sm:w-auto"
        >
          {USES.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      )}

      <div className="mt-4 space-y-2 text-sm">
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
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 accent-[var(--color-accent)]"
          />
          <span className="text-muted">
            I agree to the collection and use of my email address as described in the{" "}
            <Link href="/privacy" className="underline hover:text-ink">
              privacy notice
            </Link>
            . Unsubscribe anytime.
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
