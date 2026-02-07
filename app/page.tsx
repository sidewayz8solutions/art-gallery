import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Logo mark */}
        <div className="flex items-center gap-1 text-sm uppercase tracking-[0.3em] text-white/40">
          <span className="inline-block h-px w-8 bg-white/20" />
          Virtual Art Experience
          <span className="inline-block h-px w-8 bg-white/20" />
        </div>

        {/* Heading */}
        <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-7xl">
          Gallery<span className="text-amber-400">.</span>
        </h1>

        <p className="max-w-md text-lg leading-relaxed text-white/60">
          Step inside a curated 3D space featuring original works from three
          emerging artists. Walk the room. Click a piece. Make it yours.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/gallery"
            className="rounded-full bg-amber-400 px-8 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
          >
            Enter Gallery
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-white/15 px-8 py-3 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
          >
            Browse Shop
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 h-32 w-full bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
