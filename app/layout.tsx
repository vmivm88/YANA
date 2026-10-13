import type { Metadata } from "next";
import { Inter, Noto_Serif_KR } from "next/font/google";
import Link from "next/link";
import { SITE, COMPANY } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const serifKr = Noto_Serif_KR({
  weight: ["500", "700"],
  subsets: ["latin"],
  preload: false, // 한글 글리프는 용량이 커서 필요할 때만 불러옵니다
  variable: "--font-serif-kr",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.tagline,
    description: SITE.description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: SITE.tagline, description: SITE.description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serifKr.variable}`}>
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-line">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-bold text-accent">맥락</span>
              <span className="font-semibold tracking-tight">{SITE.name}</span>
            </Link>
            <div className="flex items-center gap-5 text-sm text-muted">
              <a href={SITE.repoUrl} className="hover:text-ink" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a
                href={SITE.feedbackUrl}
                className="rounded-full bg-ink px-3.5 py-1.5 font-medium text-paper hover:bg-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                Submit a case
              </a>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line">
          <div className="mx-auto max-w-6xl space-y-4 px-4 py-8 text-sm text-muted sm:px-6">
            <p>
              {SITE.name} v{SITE.version} · Open source, curated by native speakers ·{" "}
              <a href={SITE.repoUrl} className="underline hover:text-ink">Contribute on GitHub</a> ·{" "}
              <Link href="/about" className="underline hover:text-ink">About</Link> ·{" "}
              <Link href="/privacy" className="underline hover:text-ink">Privacy</Link>
            </p>
            <p className="text-xs leading-relaxed">
              {SITE.name} is operated by <span className="font-medium text-ink">{COMPANY.name}</span> ({COMPANY.nameKo})
              <br />
              대표자 {COMPANY.representative} · 사업자등록번호 {COMPANY.bizRegNo} · 통신판매업신고 {COMPANY.mailOrderNo}
              <br />
              {COMPANY.address} ·{" "}
              <a href={`mailto:${SITE.contactEmail}`} className="underline hover:text-ink">{SITE.contactEmail}</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
