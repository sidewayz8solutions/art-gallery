import Link from 'next/link';
import ArtisticNav from '@/components/dom/ArtisticNav';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <ArtisticNav />
      <div className="pt-32 px-8 md:px-20 max-w-2xl">
        <h1 className="text-4xl font-serif mb-6">About Studio Nouveau</h1>
        <p className="text-gray-300 font-light leading-relaxed mb-8">
          A curated virtual gallery featuring the works of Betty Efferson, Tonni McCollister, Debbie Shirley, and Emma Schellinger.
        </p>
        <Link
          href="/"
          className="text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
