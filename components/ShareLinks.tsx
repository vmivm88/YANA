"use client";

import { useState } from "react";

type Props = { url: string; text: string };

/** 링크 복사 + LinkedIn / X / Facebook 공유. 기여자가 자기 항목을 자랑하기 쉽게 */
export default function ShareLinks({ url, text }: Props) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 권한이 없으면 조용히 무시 */
    }
  }

  const link = "rounded-full border border-line bg-white px-3.5 py-1.5 text-sm hover:border-ink/40";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={copy} className={link} aria-live="polite">
        {copied ? "Link copied" : "Copy link"}
      </button>
      <a className={link} target="_blank" rel="noopener noreferrer"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}>
        LinkedIn
      </a>
      <a className={link} target="_blank" rel="noopener noreferrer"
        href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`}>
        X
      </a>
      <a className={link} target="_blank" rel="noopener noreferrer"
        href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}>
        Facebook
      </a>
    </div>
  );
}
