'use client';

import { useState } from 'react';
import { useTexture, Text } from '@react-three/drei';
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
    txt.colorSpace = THREE.SRGBColorSpace; // Ensure correct colors
  });

  const setActiveArtwork = useGalleryStore((state) => state.setActiveArtwork);
  const [hovered, setHover] = useState(false);

  // 2. Calculate aspect ratio automatically from the image file
  const aspectRatio = texture.image.width / texture.image.height;

  // 3. Define a standard height (e.g. 3.5 meters/units) and calculate width
  const FRAME_HEIGHT = 3.5;
  const FRAME_WIDTH = FRAME_HEIGHT * aspectRatio;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setActiveArtwork(artwork);
  };

  // Frame thickness
  const BORDER = 0.2;

  return (
    <group position={position} rotation={rotation}>
      {/* --- THE FRAME CONTAINER --- */}
      <mesh
        onClick={handleClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        {/* Box Geometry: Width + border, Height + border, Depth */}
        <boxGeometry args={[FRAME_WIDTH + BORDER, FRAME_HEIGHT + BORDER, 0.15]} />
        <meshStandardMaterial
          color={hovered ? '#d4a373' : '#111'} // Gold on hover, Matte Black default
          roughness={0.6}
        />
      </mesh>

      {/* --- THE ARTWORK CANVAS --- */}
      {/* Sits slightly in front (z=0.08) */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
        {/* MeshBasicMaterial so the painting looks "lit" from within (clear visibility) */}
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* --- SPOTLIGHT FOR THIS PAINTING --- */}
      {/* A light attached to the frame, pointing at it */}
      <spotLight
        position={[0, 4, 3]} // 4 units up, 3 units back
        target-position={[0, 0, 0]} // Point at the center of the frame
        intensity={8}
        angle={0.5}
        penumbra={0.5}
        distance={10}
        castShadow
      />
    </group>
  );
}
