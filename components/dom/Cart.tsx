"use client";

import { useGalleryStore } from "@/lib/store";

export default function Cart() {
  const cart = useGalleryStore((s) => s.cart);
  const cartOpen = useGalleryStore((s) => s.cartOpen);
  const setCartOpen = useGalleryStore((s) => s.setCartOpen);
  const removeFromCart = useGalleryStore((s) => s.removeFromCart);
  const clearCart = useGalleryStore((s) => s.clearCart);

  if (!cartOpen) return null;

  const total = cart.reduce((sum, item) => sum + (item.price ?? 0), 0);

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />

      {/* Panel */}
      <div className="relative z-10 flex h-full w-full max-w-sm flex-col bg-zinc-950/95 border-l border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-lg font-bold text-white">Cart ({cart.length})</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="text-white/60 hover:text-white transition"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <p className="text-center text-sm text-white/40 mt-12">
              Your cart is empty.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg bg-white/5 p-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-white/50">
                      {item.price ? `$${item.price.toLocaleString()}` : "Inquire"}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-white/40 hover:text-red-400 transition"
                    aria-label={`Remove ${item.title}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-white/10 px-6 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Total</span>
              <span className="text-lg font-bold text-white">
                ${total.toLocaleString()}
              </span>
            </div>
            <button className="w-full rounded-full bg-amber-400 py-3 text-sm font-semibold text-black transition hover:bg-amber-300">
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="text-xs text-white/40 hover:text-white/60 transition"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
