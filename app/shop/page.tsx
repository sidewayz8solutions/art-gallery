"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Navbar from "@/components/dom/Navbar";
import Cart from "@/components/dom/Cart";
import { supabase, type Artwork } from "@/lib/supabase";
import { useGalleryStore } from "@/lib/store";

export default function ShopPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useGalleryStore((s) => s.addToCart);

  useEffect(() => {
    async function fetchArtworks() {
      const { data, error } = await supabase
        .from("artworks")
        .select("*, artists(*)")
        .order("title");

      if (error) {
        console.error("Error fetching artworks:", error);
      } else {
        setArtworks(data ?? []);
      }
      setLoading(false);
    }
    fetchArtworks();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <h1 className="mb-2 text-3xl font-bold text-white">Shop</h1>
        <p className="mb-10 text-sm text-white/50">
          Browse all available works. Prefer a more immersive experience?{" "}
          <a href="/gallery" className="text-amber-400 hover:underline">
            Enter the 3D gallery
          </a>
          .
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-amber-400" />
          </div>
        ) : artworks.length === 0 ? (
          <p className="py-20 text-center text-white/40">
            No artworks found. Seed the database to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((art) => (
              <div
                key={art.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-white/20"
              >
                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={art.image_url}
                    alt={art.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <h3 className="text-base font-semibold text-white">
                    {art.title}
                  </h3>
                  {art.artists && (
                    <p className="text-xs text-amber-400">{art.artists.name}</p>
                  )}
                  {art.description && (
                    <p className="mt-1 text-xs text-white/50 line-clamp-2">
                      {art.description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="text-sm font-medium text-white">
                      {art.price
                        ? `$${art.price.toLocaleString()}`
                        : "Inquire"}
                    </span>
                    {art.is_sold ? (
                      <span className="text-xs text-red-400">Sold</span>
                    ) : (
                      <button
                        onClick={() => addToCart(art)}
                        className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-black transition hover:bg-amber-300"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Cart />
    </div>
  );
}
