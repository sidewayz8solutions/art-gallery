import Link from 'next/link';

export default function ArtisticNav() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-6 px-8 flex justify-between items-center pointer-events-auto mix-blend-difference">
      <Link href="/" className="group relative">
        <h1 className="font-serif text-3xl text-white tracking-widest uppercase relative z-10 transition-transform duration-300 group-hover:scale-105">
          Studio Nouveau
        </h1>
        <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
      </Link>

      <div className="flex gap-10 font-serif text-sm text-white tracking-[0.2em] uppercase">
        <Link href="/gallery" className="relative group overflow-hidden">
          <span className="relative z-10">3D Gallery</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
        </Link>
        <Link href="/shop" className="relative group overflow-hidden">
          <span className="relative z-10">Collection</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
        </Link>
        <Link href="/about" className="relative group overflow-hidden">
          <span className="relative z-10">About</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
        </Link>
      </div>
    </nav>
  );
}
