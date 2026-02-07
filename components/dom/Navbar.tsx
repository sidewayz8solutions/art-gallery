"use client";

import Link from "next/link";
import { useGalleryStore } from "@/lib/store";

export default function Navbar() {
  const cart = useGalleryStore((s) => s.cart);
  const setCartOpen = useGalleryStore((s) => s.setCartOpen);

  return (
    <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-4 backdrop-blur-md bg-black/40 border-b border-white/10">
      {/* Logo / Home */}
      <Link
        href="/"
        className="text-lg font-bold tracking-widest text-white uppercase"
      >
        Gallery<span className="text-amber-400">.</span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 text-sm text-white/80">
        <Link href="/gallery" className="transition hover:text-white">
          3D Gallery
        </Link>
        <Link href="/shop" className="transition hover:text-white">
          Shop
        </Link>

        {/* Cart Button */}
        <button
          onClick={() => setCartOpen(true)}
          className="relative transition hover:text-white"
          aria-label="Open cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
            />
          </svg>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-black">
              {cart.length}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
