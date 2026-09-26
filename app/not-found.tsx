import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-serif text-6xl font-bold text-accent">없어요</p>
      <h1 className="mt-4 text-2xl font-semibold">That expression isn&apos;t here (yet).</h1>
      <Link href="/" className="mt-6 inline-block text-accent underline">
        Back to all expressions
      </Link>
    </div>
  );
}
