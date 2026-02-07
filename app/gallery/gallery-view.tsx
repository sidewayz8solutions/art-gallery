'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/dom/Navbar';
import Overlay from '@/components/dom/Overlay';
import Cart from '@/components/dom/Cart';
import type { Artwork } from '@/types/schema';

/* Dynamically import the 3D scene — ssr: false keeps WebGL off the server */
const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-amber-400" />
        <p className="text-sm text-white/40">Loading gallery...</p>
      </div>
    </div>
  ),
});

interface GalleryViewProps {
  artworks: Artwork[];
}

export default function GalleryView({ artworks }: GalleryViewProps) {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D canvas fills the background */}
      <Scene artworks={artworks} />

      {/* HTML UI layers on top */}
      <div className="pointer-events-none fixed inset-0 z-10">
        <div className="pointer-events-auto">
          <Navbar />
        </div>

        <Overlay />
        <Cart />

        {/* Click-to-enter prompt */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
          <p className="rounded-full bg-black/60 px-6 py-2 text-xs text-white/50 backdrop-blur-sm">
            Click to look around &middot; WASD to move
          </p>
        </div>
      </div>

      {/* Overlay title */}
      <div className="absolute top-20 left-6 z-10 pointer-events-none">
        <h1 className="text-2xl font-bold text-white/80">Virtual Gallery</h1>
      </div>
    </main>
  );
}
