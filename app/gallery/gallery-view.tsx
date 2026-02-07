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
      {/* 1. The 3D Layer */}
      <div className="absolute inset-0 z-0">
        <Scene artworks={artworks} />
      </div>

      {/* 2. The UI Layer — sits on top because it is later in the DOM order */}
      <Overlay />

      {/* 3. Navigation */}
      <div className="pointer-events-none fixed inset-0 z-10">
        <div className="pointer-events-auto">
          <Navbar />
        </div>
        <Cart />
      </div>

      {/* 4. Instructions — bottom-left to avoid overlapping Navbar */}
      <div className="absolute bottom-6 left-6 z-10 text-white/60 pointer-events-none text-xs uppercase tracking-widest">
        Drag to look &bull; Click art to view details
      </div>
    </main>
  );
}
