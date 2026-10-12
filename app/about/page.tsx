import type { Metadata } from "next";
import { SITE, COMPANY } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE.name} is an open-source Korean learning project operated by ${COMPANY.name}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">About {SITE.name}</h1>

      <div className="mt-6 space-y-4 leading-relaxed text-ink">
        <p>
          {SITE.name} collects Korean expressions that AI translators get wrong, and explains what
          Koreans actually say instead. Korean changes with the relationship between speakers —
          age, rank, closeness — and word-for-word translation misses that.
        </p>
        <p>
          The project is open source and versioned. Every entry is written and reviewed by a native
          Korean speaker with experience teaching Korean to foreign learners. Anyone can suggest a new
          case through the submission form or on GitHub.
        </p>
      </div>

      <h2 className="mt-12 text-xl font-semibold">Company</h2>
      <dl className="mt-4 grid grid-cols-[auto,1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="text-muted">Operator</dt>
        <dd>{COMPANY.name} ({COMPANY.nameKo})</dd>
        <dt className="text-muted">Founded</dt>
        <dd>{COMPANY.founded}</dd>
        <dt className="text-muted">Representative</dt>
        <dd>{COMPANY.representative}</dd>
        <dt className="text-muted">Business reg. no.</dt>
        <dd>{COMPANY.bizRegNo}</dd>
        <dt className="text-muted">Mail-order reg. no.</dt>
        <dd>{COMPANY.mailOrderNo}</dd>
        <dt className="text-muted">Address</dt>
        <dd>{COMPANY.address}</dd>
        <dt className="text-muted">Contact</dt>
        <dd>
          <a href={`mailto:${SITE.contactEmail}`} className="text-accent underline">
            {SITE.contactEmail}
          </a>
        </dd>
      </dl>
    </div>
  );
}
