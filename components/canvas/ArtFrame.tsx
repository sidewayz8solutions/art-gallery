'use client';

import { useState, useMemo } from 'react';
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
  // OPTIMIZATION: This allows the GPU to reuse the texture logic
  const texture = useTexture(artwork.image_url);
  
  // Memoize texture settings so we don't re-upload to GPU every frame
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true; // Better quality
    texture.minFilter = THREE.LinearMipmapLinearFilter;
  }, [texture]);
  
  const setActiveArtwork = useGalleryStore((state) => state.setActiveArtwork);
  const [hovered, setHover] = useState(false);

  // --- SIZE LOGIC ---
  let widthInInches = 24;
  let heightInInches = 36;

  if (artwork.dimensions) {
    const numbers = artwork.dimensions.match(/(\d+)/g);
    if (numbers && numbers.length >= 2) {
      widthInInches = parseInt(numbers[0]);
      heightInInches = parseInt(numbers[1]);
    }
  }

  const SCALE_FACTOR = 0.15; 
  const FRAME_WIDTH = widthInInches * SCALE_FACTOR;
  const FRAME_HEIGHT = heightInInches * SCALE_FACTOR;
  
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
          color={hovered ? '#ffffff' : '#D4AF37'} 
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* ARTWORK */}
      <mesh position={[0, 0, DEPTH / 2 + 0.001]}>
        <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
        {/* CRITICAL FIX: 'map={texture}' is fine, but we ensure we don't attach too many other maps */}
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* OPTIMIZATION: Only use lights if absolutely necessary, or bake them. 
          Dynamic lights are expensive. We removed the spotlight here to save GPU. 
          The room lights are enough. 
      */}
    </group>
  );
}