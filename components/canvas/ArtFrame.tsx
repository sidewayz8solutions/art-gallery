'use client';

import { useState } from 'react';
import { useTexture } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { Artwork } from '@/types/schema';
import { useGalleryStore } from '@/lib/store';
import * as THREE from 'three';

interface ArtFrameProps {
  artwork: Artwork;
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function ArtFrame({ artwork, position, rotation = [0, 0, 0] }: ArtFrameProps) {
  const texture = useTexture(artwork.image_url);
  texture.colorSpace = THREE.SRGBColorSpace;
  
  const setActiveArtwork = useGalleryStore((state) => state.setActiveArtwork);
  const [hovered, setHover] = useState(false);

  // --- 1. PARSE "ACTUAL SIZE" FROM DB ---
  // Default to 24x36 if missing
  let widthInInches = 24;
  let heightInInches = 36;

  if (artwork.dimensions) {
    // Look for patterns like "24x36", "24 x 36", "24 by 36"
    const numbers = artwork.dimensions.match(/(\d+)/g);
    if (numbers && numbers.length >= 2) {
      widthInInches = parseInt(numbers[0]);
      heightInInches = parseInt(numbers[1]);
    }
  }

  // --- 2. CONVERT TO 3D UNITS ---
  // In our scene, let's say 1 unit = 10 inches for good visibility
  const SCALE_FACTOR = 0.15; 
  const FRAME_WIDTH = widthInInches * SCALE_FACTOR;
  const FRAME_HEIGHT = heightInInches * SCALE_FACTOR;
  
  // Frame Settings
  const BORDER = 0.5; 
  const DEPTH = 0.3;

  return (
    <group position={position} rotation={rotation}>
      
      {/* FRAME */}
      <mesh
        onClick={(e) => { e.stopPropagation(); setActiveArtwork(artwork); }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[FRAME_WIDTH + BORDER, FRAME_HEIGHT + BORDER, DEPTH]} />
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : '#D4AF37'} // Antique Gold
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* ARTWORK */}
      <mesh position={[0, 0, DEPTH / 2 + 0.001]}>
        <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* LIGHTING */}
      <spotLight
        position={[0, 5, 5]} 
        target-position={[0, 0, 0]} 
        intensity={30}
        angle={0.5}
        penumbra={0.4}
        distance={10}
        castShadow
      />
    </group>
  );
}