import Link from 'next/link';
import LandingBackground from '@/components/canvas/LandingBackground';
import ArtisticNav from '@/components/dom/ArtisticNav';

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* --- LAYER 1: The 3D Parallax Background --- */}
      <LandingBackground />

      {/* --- LAYER 2: The Artistic Navigation --- */}
      <ArtisticNav />

      {/* --- LAYER 3: The Content Overlay --- */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4 pointer-events-none">
        <div className="relative z-20 mt-20">
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-2xl tracking-wide">
            Welcome to the Gallery
          </h2>

          <p className="max-w-xl mx-auto text-xl text-gray-200 font-light mb-12 drop-shadow-lg tracking-wider">
            Experience the works of Betty Efferson, Tonni McCollister, Debbie Shirley, and Emma Schellinger.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center pointer-events-auto">
            <Link
              href="/gallery"
              className="px-10 py-4 bg-white text-black font-serif font-bold tracking-[0.2em] uppercase transition-all hover:bg-gray-200 hover:scale-105 rounded-sm"
            >
              Enter 3D Experience
            </Link>

            <Link
              href="/shop"
              className="px-10 py-4 bg-transparent text-white border-2 border-white font-serif font-bold tracking-[0.2em] uppercase transition-all hover:bg-white hover:text-black hover:scale-105 rounded-sm"
            >
              View Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 w-full text-center z-10 text-white/60 font-serif text-sm uppercase tracking-[0.3em] pointer-events-none">
        Est. 2024
      </div>
    </main>
  );
}
