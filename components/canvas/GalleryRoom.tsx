'use client';

import { MeshReflectorMaterial } from '@react-three/drei';
import { ArtFrame } from './ArtFrame';
import { Artwork } from '@/types/schema';

interface GalleryRoomProps {
  artworks?: Artwork[];
}

export function GalleryRoom({ artworks = [] }: GalleryRoomProps) {
  const FLOOR_WIDTH = 25;
  const FLOOR_LENGTH = 25;

  // Distribute artworks across 3 walls in a round-robin pattern:
  // i % 3 === 0 → Back Wall
  // i % 3 === 1 → Left Wall
  // i % 3 === 2 → Right Wall
  const renderArtworks = () => {
    return artworks.map((art, i) => {
      const positionIndex = Math.floor(i / 3); // 0,0,0, 1,1,1, 2,2,2...
      const spread = 4; // Space between frames

      if (i % 3 === 0) {
        // Back Wall
        return (
          <ArtFrame
            key={art.id}
            artwork={art}
            position={[positionIndex * spread - 4, 2.5, -9.8]}
            rotation={[0, 0, 0]}
          />
        );
      } else if (i % 3 === 1) {
        // Left Wall
        return (
          <ArtFrame
            key={art.id}
            artwork={art}
            position={[-9.8, 2.5, positionIndex * spread - 4]}
            rotation={[0, Math.PI / 2, 0]}
          />
        );
      } else {
        // Right Wall
        return (
          <ArtFrame
            key={art.id}
            artwork={art}
            position={[9.8, 2.5, positionIndex * spread - 4]}
            rotation={[0, -Math.PI / 2, 0]}
          />
        );
      }
    });
  };

  return (
    <group>
      {/* ── THE GLOSSY CONCRETE FLOOR ────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[FLOOR_WIDTH, FLOOR_LENGTH]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={1.5}
          roughness={1}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#151515"
          metalness={0.6}
          mirror={0.5}
        />
      </mesh>

      {/* ── DARK WALLS (dramatic backdrop for art) ── */}
      {/* Back Wall */}
      <mesh position={[0, 5, -10]} receiveShadow>
        <boxGeometry args={[FLOOR_WIDTH, 10, 0.5]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[FLOOR_LENGTH, 10, 0.5]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[10, 5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[FLOOR_LENGTH, 10, 0.5]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>

      {/* ── CEILING ─────────────────────────────── */}
      <mesh position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[FLOOR_WIDTH, FLOOR_LENGTH]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* ── ARTWORKS ────────────────────────────── */}
      {renderArtworks()}
    </group>
  );
}
