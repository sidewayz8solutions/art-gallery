import { create } from "zustand";
import type { Artwork } from "@/types/schema";

/* ────────────────────────────────────────────
   Gallery Store — bridges 3D canvas ↔ HTML UI
   ──────────────────────────────────────────── */

interface GalleryState {
  /* Currently selected artwork (clicked in 3D) */
  activeArtwork: Artwork | null;
  setActiveArtwork: (art: Artwork | null) => void;

  /* Shopping cart */
  cart: Artwork[];
  addToCart: (art: Artwork) => void;
  removeFromCart: (artId: string) => void;
  clearCart: () => void;

  /* Overlay / panel visibility */
  overlayOpen: boolean;
  setOverlayOpen: (open: boolean) => void;

  /* Cart drawer visibility */
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  activeArtwork: null,
  setActiveArtwork: (art) =>
    set({ activeArtwork: art, overlayOpen: art !== null }),

  cart: [],
  addToCart: (art) =>
    set((state) => {
      if (state.cart.find((item) => item.id === art.id)) return state;
      return { cart: [...state.cart, art] };
    }),
  removeFromCart: (artId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== artId),
    })),
  clearCart: () => set({ cart: [] }),

  overlayOpen: false,
  setOverlayOpen: (open) =>
    set({ overlayOpen: open, activeArtwork: open ? undefined : null }),

  cartOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),
}));
