'use client';

import { useRef, useState } from 'react';
import { useTexture, Text } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { Artwork } from '@/types/schema';
import { useGalleryStore } from '@/lib/store';

interface ArtFrameProps {
  artwork: Artwork;
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function ArtFrame({ artwork, position, rotation = [0, 0, 0] }: ArtFrameProps) {
  // Load the texture from the Supabase URL
  // Note: Ensure your Supabase bucket is public or URLs are signed
  const texture = useTexture(artwork.image_url);

  const setActiveArtwork = useGalleryStore((state) => state.setActiveArtwork);
  const [hovered, setHover] = useState(false);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation(); // Prevent click from passing through to the wall
    setActiveArtwork(artwork);
  };

  return (
    <group position={position} rotation={rotation}>
      {/* The Frame (Container) */}
      <mesh
        onClick={handleClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        {/* A box with slight depth acts as the frame */}
        <boxGeometry args={[3, 4, 0.2]} />
        <meshStandardMaterial
          color={hovered ? '#d4a373' : '#1a1a1a'} // Gold when hovered, Black default
        />
      </mesh>

      {/* The Artwork (Canvas) */}
      {/* Positioned slightly forward (z=0.11) so it sits on top of the frame */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[2.6, 3.6]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Floating Title below art */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {artwork.title}
      </Text>
    </group>
  );
}
