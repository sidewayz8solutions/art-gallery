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

  // Curated layout: Centerpiece + Left Wing + Right Wing
  // 1 painting centered on back wall, 2 on each side wall
  const renderArtworks = () => {
    if (artworks.length === 0) return null;

    return (
      <>
        {/* 1. CENTERPIECE (Back Wall) - The first item in your DB */}
        {artworks[0] && (
          <ArtFrame
            artwork={artworks[0]}
            position={[0, 2.5, -9.8]} // Perfectly centered
            rotation={[0, 0, 0]}
          />
        )}

        {/* 2. LEFT WALL (Next 2 items) */}
        {artworks[1] && (
          <ArtFrame
            artwork={artworks[1]}
            position={[-9.8, 2.5, -3]} // Closer to back
            rotation={[0, Math.PI / 2, 0]}
          />
        )}
        {artworks[2] && (
          <ArtFrame
            artwork={artworks[2]}
            position={[-9.8, 2.5, 3]} // Closer to front
            rotation={[0, Math.PI / 2, 0]}
          />
        )}

        {/* 3. RIGHT WALL (Last 2 items) */}
        {artworks[3] && (
          <ArtFrame
            artwork={artworks[3]}
            position={[9.8, 2.5, -3]}
            rotation={[0, -Math.PI / 2, 0]}
          />
        )}
        {artworks[4] && (
          <ArtFrame
            artwork={artworks[4]}
            position={[9.8, 2.5, 3]}
            rotation={[0, -Math.PI / 2, 0]}
          />
        )}
      </>
    );
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
