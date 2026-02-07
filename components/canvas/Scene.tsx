'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment } from '@react-three/drei';
import { GalleryRoom } from './GalleryRoom';
import Player from './Player';
import { Artwork } from '@/types/schema';

interface SceneProps {
  artworks: Artwork[];
}

export default function Scene({ artworks }: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]} // Optimizes for high-res screens (Retina)
      camera={{ position: [0, 1.7, 6], fov: 45 }} // Lower FOV = more "cinematic" lens
      className="w-full h-screen bg-[#111]" // Darker background for contrast
    >
      {/* 1. Realistic Environment Lighting (presets: city, studio, sunset) */}
      <Environment preset="city" background={false} />

      {/* 2. Main Spotlight (Simulating gallery track lighting) */}
      <spotLight
        position={[0, 15, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={2}
        castShadow
        shadow-bias={-0.0001}
      />

      <ambientLight intensity={0.4} />

      <Suspense fallback={null}>
        <GalleryRoom artworks={artworks} />
        <Player />
      </Suspense>
    </Canvas>
  );
}
