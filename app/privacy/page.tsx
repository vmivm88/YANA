import type { Metadata } from "next";
import { SITE, COMPANY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `How ${SITE.name} collects and uses your email address.`,
  alternates: { canonical: "/privacy" },
};

// 개인정보 보호법상 수집·이용 동의 고지 사항(목적·항목·보유기간·거부권)을 담습니다.
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Privacy notice</h1>
      <p className="mt-2 text-sm text-muted">개인정보 수집·이용 안내 · Last updated: October 14, 2026</p>

      <div className="mt-10 space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold">What we collect</h2>
          <p className="mt-2">
            When you subscribe, we collect your <strong>email address</strong>. If you choose to, we also store what
            you mostly use Korean for and whether you&apos;d like a Russian version. We don&apos;t ask for your name.
          </p>
          <p className="mt-1 text-sm text-muted">수집 항목: 이메일 주소(필수), 한국어 사용 목적·러시아어 버전 희망 여부(선택)</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Why we collect it</h2>
          <p className="mt-2">
            To send you new expressions, product updates (such as early access to the checker), and occasional
            offers related to {SITE.name}. Your interests help us decide what to build next.
          </p>
          <p className="mt-1 text-sm text-muted">이용 목적: 뉴스레터 및 서비스 소식·혜택 안내, 서비스 기획</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">How long we keep it</h2>
          <p className="mt-2">
            Until you unsubscribe. Every email includes an unsubscribe link, or you can write to{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="underline">
              {SITE.contactEmail}
            </a>{" "}
            and we&apos;ll delete your data.
          </p>
          <p className="mt-1 text-sm text-muted">보유 기간: 구독 해지 시까지 (해지 즉시 파기)</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Who processes it</h2>
          <p className="mt-2">
            Emails are stored and sent through MailerLite (mailerlite.com), our newsletter provider, which may store
            data outside Korea. We never sell your data.
          </p>
          <p className="mt-1 text-sm text-muted">처리 위탁 및 국외 이전: MailerLite (뉴스레터 발송·구독자 관리)</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contributor credit</h2>
          <p className="mt-2">
            When you submit a case through our form (Tally), we ask for your email so we can confirm your credit before
            publishing. Your email is never shown. If we publish your case, we show only the name, title and link you
            asked us to show. Ask us at any time to change or remove your credit.
          </p>
          <p className="mt-1 text-sm text-muted">
            기여자 표시: 제보 시 이메일(비공개, 크레딧 확인용)을 받으며, 본인이 동의한 이름·소개·링크만 공개합니다. 요청 시
            수정·삭제합니다. 제보 폼 처리: Tally
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Anonymous visit statistics</h2>
          <p className="mt-2">
            We count page views with Vercel Web Analytics to see which expressions help learners most and to show
            contributors how many people their entries reach. It uses no cookies and doesn&apos;t identify you.
          </p>
          <p className="mt-1 text-sm text-muted">방문 통계: 쿠키 없이 페이지별 방문 수만 익명으로 집계 (Vercel Web Analytics)</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Your choice</h2>
          <p className="mt-2">
            Subscribing is optional. You can use every page of {SITE.name} without giving us your email.
          </p>
          <p className="mt-1 text-sm text-muted">
            동의를 거부할 권리가 있으며, 거부하더라도 사이트 이용에는 제한이 없습니다(뉴스레터만 받을 수 없습니다).
          </p>
        </section>

        <section className="border-t border-line pt-8 text-sm text-muted">
          <p>
            Data controller: {COMPANY.name} ({COMPANY.nameKo}), 대표자 {COMPANY.representative}, {COMPANY.address} ·{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="underline">
              {SITE.contactEmail}
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
