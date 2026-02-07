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
      dpr={[1, 2]} 
      camera={{ position: [0, 1.7, 35], fov: 50 }} 
      className="w-full h-screen bg-[#111]" 
    >
      {/* 1. Realistic Environment Lighting */}
      <Environment preset="city" blur={1} />
      
      {/* 2. Main Ambient Light */}
      <ambientLight intensity={0.35} />

      <Suspense fallback={null}>
        <GalleryRoom artworks={artworks} />
        <Player />
      </Suspense>
    </Canvas>
  );
}
