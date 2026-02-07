import Link from 'next/link';
import LandingScene from '@/components/canvas/LandingScene';
import { supabase } from '@/lib/supabase';

// Helper to fetch one featured image
async function getFeaturedArt() {
  const { data } = await supabase
    .from('artworks')
    .select('*')
    .limit(1)
    .single(); // Just get one
  return data;
}

export default async function Home() {
  const heroArt = await getFeaturedArt();

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white">
      
      {/* --- LAYER 1: The 3D Background --- */}
      <div className="absolute inset-0 z-0">
        {heroArt ? (
          <LandingScene artwork={heroArt} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
             Loading Experience...
          </div>
        )}
      </div>

      {/* --- LAYER 2: The "Unita" Style Overlay --- */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-12 md:px-24 pointer-events-none">
        
        {/* Giant Typography behind/blended with 3D
            For accessibility, we keep it on top but use mix-blend-mode for style 
        */}
        <div className="max-w-4xl space-y-6">
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-gray-400 uppercase">
            The Digital Collection
          </p>
          
          <h1 className="text-6xl md:text-8xl font-serif font-medium leading-tight mix-blend-overlay opacity-90">
            Art Beyond <br />
            <span className="italic text-white opacity-100 mix-blend-normal">Boundaries</span>
          </h1>

          <p className="max-w-lg text-lg text-gray-400 font-light leading-relaxed">
            Experience the works of our three resident artists in a fully immersive 
            virtual environment. Walk the gallery, inspect the details, and collect unique pieces.
          </p>

          <div className="pt-8 pointer-events-auto">
            <Link 
              href="/gallery"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-none overflow-hidden transition-all hover:pr-12"
            >
              <span className="relative z-10 font-bold tracking-widest uppercase text-sm">
                Enter Exhibition
              </span>
              {/* Arrow Animation */}
              <span className="absolute right-8 opacity-0 transition-all duration-300 group-hover:right-4 group-hover:opacity-100">
                →
              </span>
            </Link>
          </div>
        </div>

      </div>

      {/* Footer / Brand Element */}
      <div className="absolute bottom-8 right-8 z-10 text-right opacity-50">
         <p className="text-xs font-mono">EST. 2024</p>
         <p className="text-xs font-mono">VSCODE x AUGMENT</p>
      </div>

    </main>
  );
}
