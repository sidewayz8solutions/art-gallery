import Link from 'next/link';

const BACKGROUND_IMAGE =
  'https://gvzjlvwqyvbmbczmqggk.supabase.co/storage/v1/object/public/gallery-images/background.JPEG';

export default function Home() {
  return (
    <main 
      className="relative w-full h-screen overflow-hidden bg-black bg-cover bg-center"
      style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}
    >
      {/* Dark Overlay to make text readable over the image */}
      <div className="absolute inset-0 bg-black/40" />

      {/* --- Main Content --- */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4">
        
        {/* The Brand Name is in the image, so we focus on the Call to Action */}
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-xl">
          Welcome to the Gallery
        </h1>

        <p className="max-w-xl text-xl text-gray-200 font-light mb-12 drop-shadow-md">
           Experience the works of Betty Efferson, Tonni McCollister, Debbie Shirley, and Emma Schellinger.
        </p>

        {/* Navigation Options */}
        <div className="flex flex-col md:flex-row gap-6">
          <Link 
            href="/gallery"
            className="px-8 py-4 bg-white/90 hover:bg-white text-black font-bold tracking-widest uppercase transition-all hover:scale-105 rounded-sm backdrop-blur-sm"
          >
            Enter 3D Experience
          </Link>

          <Link 
            href="/shop"
            className="px-8 py-4 bg-black/60 hover:bg-black/80 text-white border border-white/30 font-bold tracking-widest uppercase transition-all hover:scale-105 rounded-sm backdrop-blur-sm"
          >
            View Collection
          </Link>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 w-full text-center z-10 text-white/60 font-mono text-xs uppercase tracking-widest">
         Studio Nouveau &bull; Est. 2024
      </div>
    </main>
  );
}
