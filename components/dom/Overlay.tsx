'use client';

import { useGalleryStore } from '@/lib/store';

export default function Overlay() {
  // Grab the active artwork and the close function from our store
  const { activeArtwork, setActiveArtwork } = useGalleryStore();

  if (!activeArtwork) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* The Backdrop
        - pointer-events-auto re-enables clicking on this layer
        - bg-black/60 dims the background so you focus on the UI
      */}
      <div
        className="absolute inset-0 bg-black/60 pointer-events-auto transition-opacity duration-300"
        onClick={() => setActiveArtwork(null)} // Click outside to close
      />

      {/* The Info Card */}
      <div className="relative z-10 bg-white text-black p-8 rounded-lg shadow-2xl max-w-lg w-full pointer-events-auto flex flex-col gap-4 mx-4">

        {/* Close Button (Top Right) */}
        <button
          onClick={() => setActiveArtwork(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          ✕
        </button>

        {/* Content */}
        <div>
          <h2 className="text-3xl font-bold font-serif mb-1">{activeArtwork.title}</h2>

          {/* If we joined artist data, show it here */}
          {activeArtwork.artists && (
            <p className="text-lg text-gray-500 italic mb-4">
              by {activeArtwork.artists.name}
            </p>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
          <p>{activeArtwork.description || 'No description available.'}</p>
          <div className="flex justify-between mt-2 font-mono text-xs uppercase tracking-widest text-gray-400">
            <span>Dimensions: {activeArtwork.dimensions || 'N/A'}</span>
            <span>{activeArtwork.is_sold ? 'Sold' : 'Available'}</span>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          <span className="text-2xl font-bold">
            ${activeArtwork.price?.toLocaleString()}
          </span>

          <button
            disabled={activeArtwork.is_sold}
            className={`px-6 py-3 rounded-full font-bold text-white transition-transform active:scale-95 ${
              activeArtwork.is_sold
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800'
            }`}
            onClick={() => alert(`Redirecting to checkout for ${activeArtwork.title}...`)}
          >
            {activeArtwork.is_sold ? 'Sold Out' : 'Purchase Now'}
          </button>
        </div>

      </div>
    </div>
  );
}
