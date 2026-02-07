"use client";

import { useGalleryStore } from "@/lib/store";

export default function Overlay() {
  const activeArtwork = useGalleryStore((s) => s.activeArtwork);
  const overlayOpen = useGalleryStore((s) => s.overlayOpen);
  const setActiveArtwork = useGalleryStore((s) => s.setActiveArtwork);
  const addToCart = useGalleryStore((s) => s.addToCart);

  if (!overlayOpen || !activeArtwork) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setActiveArtwork(null)}
      />

      {/* Side Panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col gap-6 overflow-y-auto bg-zinc-950/95 p-8 pt-24 border-l border-white/10 animate-in slide-in-from-right">
        {/* Close Button */}
        <button
          onClick={() => setActiveArtwork(null)}
          className="absolute top-6 right-6 text-white/60 hover:text-white transition"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Artwork Image Preview */}
        <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeArtwork.image_url}
            alt={activeArtwork.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-white">{activeArtwork.title}</h2>
          {activeArtwork.artists && (
            <p className="text-sm text-amber-400">{activeArtwork.artists.name}</p>
          )}
          {activeArtwork.description && (
            <p className="text-sm leading-relaxed text-white/70">
              {activeArtwork.description}
            </p>
          )}
          {activeArtwork.dimensions && (
            <p className="text-xs text-white/40">{activeArtwork.dimensions}</p>
          )}
        </div>

        {/* Price & CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-xl font-semibold text-white">
            {activeArtwork.price ? `$${activeArtwork.price.toLocaleString()}` : "Inquire"}
          </span>
          {activeArtwork.is_sold ? (
            <span className="rounded-full bg-red-900/50 px-4 py-2 text-sm text-red-300">
              Sold
            </span>
          ) : (
            <button
              onClick={() => {
                addToCart(activeArtwork);
                setActiveArtwork(null);
              }}
              className="rounded-full bg-amber-400 px-6 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
