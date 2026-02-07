import Link from 'next/link';
import LandingBackground from '@/components/canvas/LandingBackground';

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* --- LAYER 1: The 3D Parallax Background --- */}
      <LandingBackground />

      {/* --- LAYER 2: The Content Overlay --- */}
      {/* pointer-events-none on the container allows mouse to pass through to the 3D canvas */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4 pointer-events-none">
        
        {/* Dark Vignette to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />

        <div className="relative z-20">
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-2xl">
              Welcome to the Gallery
            </h1>

            <p className="max-w-xl mx-auto text-xl text-gray-200 font-light mb-12 drop-shadow-lg">
              Experience the works of Betty Efferson, Tonni McCollister, Debbie Shirley, and Emma Schellinger.
            </p>

            {/* Navigation Options */}
            <div className="flex flex-col md:flex-row gap-6 justify-center pointer-events-auto">
              <Link 
                href="/gallery"
                className="px-8 py-4 bg-white/90 hover:bg-white text-black font-bold tracking-widest uppercase transition-all hover:scale-105 rounded-sm backdrop-blur-sm"
              >
                Enter 3D Experience
              </Link>

              <Link 
                href="/shop"
                className="px-8 py-4 bg-black/40 hover:bg-black/80 text-white border border-white/30 font-bold tracking-widest uppercase transition-all hover:scale-105 rounded-sm backdrop-blur-sm"
              >
                View Collection
              </Link>
            </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 w-full text-center z-10 text-white/60 font-mono text-xs uppercase tracking-widest pointer-events-none">
         Studio Nouveau &bull; Est. 2024
      </div>
    </main>
  );
}
