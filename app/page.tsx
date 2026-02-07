import Link from 'next/link';
import LandingBackground from '@/components/canvas/LandingBackground';
import ArtisticNav from '@/components/dom/ArtisticNav';

export default function Home() {
  return (
    <main className="w-full h-screen bg-black text-white overflow-hidden flex flex-col md:flex-row">
      <ArtisticNav />

      {/* --- LEFT SIDE: The 3D Image --- */}
      <div className="w-full md:w-1/2 h-[40vh] md:h-full relative order-1 md:order-1">
        <LandingBackground />
      </div>

      {/* --- RIGHT SIDE: The Text --- */}
      <div className="w-full md:w-1/2 h-[60vh] md:h-full flex flex-col justify-center px-8 md:px-20 order-2 md:order-2 z-10 bg-black">
        <div className="max-w-lg">
          <p className="text-gray-400 font-serif tracking-[0.2em] uppercase text-xs mb-4">
            Est. 2024
          </p>

          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
            Welcome to the <br />
            <span className="italic text-gray-400">Gallery</span>
          </h2>

          <p className="text-lg text-gray-300 font-light mb-10 leading-relaxed">
            Experience the works of Betty Efferson, Tonni McCollister, Debbie Shirley, and Emma Schellinger in a curated virtual environment.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              href="/gallery"
              className="px-8 py-4 bg-white text-black font-serif font-bold tracking-[0.1em] uppercase text-sm hover:bg-gray-200 transition-transform hover:scale-105 text-center"
            >
              Enter 3D Space
            </Link>

            <Link
              href="/shop"
              className="px-8 py-4 bg-transparent text-white border border-white/30 font-serif font-bold tracking-[0.1em] uppercase text-sm hover:border-white transition-colors text-center"
            >
              Collection
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
