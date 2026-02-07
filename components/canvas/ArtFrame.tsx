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
  const texture = useTexture(artwork.image_url, (txt) => {
    txt.colorSpace = THREE.SRGBColorSpace;
  });
  
  const setActiveArtwork = useGalleryStore((state) => state.setActiveArtwork);
  const [hovered, setHover] = useState(false);

  // --- ASPECT RATIO LOGIC ---
  const imgWidth = texture.image.width;
  const imgHeight = texture.image.height;
  const aspectRatio = imgWidth / imgHeight;

  // Fixed height for consistency, width adjusts to image ratio
  const FRAME_HEIGHT = 4; 
  const FRAME_WIDTH = FRAME_HEIGHT * aspectRatio;
  
  // Frame Thickness
  const BORDER = 0.3; 
  const DEPTH = 0.3;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setActiveArtwork(artwork);
  };

  return (
    <group position={position} rotation={rotation}>
      
      {/* --- THE PHYSICAL FRAME --- */}
      <mesh
        onClick={handleClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        position={[0, 0, 0]}
      >
        <boxGeometry args={[FRAME_WIDTH + BORDER, FRAME_HEIGHT + BORDER, DEPTH]} />
        <meshStandardMaterial 
          color={hovered ? '#ffaa00' : '#4a3c31'} // Gold on hover, Dark Wood default
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* --- THE PAINTING --- */}
      <mesh position={[0, 0, DEPTH / 2 + 0.01]}>
        <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* --- INDIVIDUAL SPOTLIGHT --- */}
      <spotLight
        position={[0, 4, 4]} 
        target-position={[0, 0, 0]} 
        intensity={20} // Much brighter highlight
        angle={0.4}
        penumbra={0.5}
        castShadow
        distance={15}
      />
    </group>
  );
}
