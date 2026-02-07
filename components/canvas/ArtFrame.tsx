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
  // 1. Load the texture
  const texture = useTexture(artwork.image_url, (txt) => {
    txt.colorSpace = THREE.SRGBColorSpace;
  });
  
  const setActiveArtwork = useGalleryStore((state) => state.setActiveArtwork);
  const [hovered, setHover] = useState(false);

  // 2. Dynamic Size Calculation
  // We use a fixed height of 3.5, and let width adjust based on the image ratio
  const aspectRatio = texture.image.width / texture.image.height;
  const FRAME_HEIGHT = 3.5;
  const FRAME_WIDTH = FRAME_HEIGHT * aspectRatio;
  const BORDER = 0.2;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setActiveArtwork(artwork);
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Frame Box */}
      <mesh
        onClick={handleClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[FRAME_WIDTH + BORDER, FRAME_HEIGHT + BORDER, 0.15]} />
        <meshStandardMaterial 
          color={hovered ? '#d4a373' : '#111'} 
          roughness={0.4}
        />
      </mesh>

      {/* The Painting Canvas */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Spotlight for this painting */}
      <spotLight
        position={[0, 4, 3]} 
        target-position={[0, 0, 0]} 
        intensity={8}
        angle={0.5}
        penumbra={0.5}
        distance={10}
        castShadow
      />
    </group>
  );
}
