/** Founding Contributor 표시 (첫 50명) */
export default function FoundingBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      title="One of the first 50 contributors to Context Korean"
      className={`inline-flex items-center gap-1 rounded-full border border-accent/40 bg-white font-medium text-accent ${
        small ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.5 text-xs"
      }`}
    >
      <span aria-hidden className="font-serif">맥</span>
      Founding Contributor
    </span>
  );
}
