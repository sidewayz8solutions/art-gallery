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
  isLeftWall?: boolean;
}

export function ArtFrame({ artwork, position, rotation = [0, 0, 0], isLeftWall = false }: ArtFrameProps) {
  const leftTarget = useMemo(() => new THREE.Object3D(), []);
  const rightTarget = useMemo(() => new THREE.Object3D(), []);
  const texture = useTexture(artwork.image_url, (txt) => {
    txt.colorSpace = THREE.SRGBColorSpace;
  });

  const setActiveArtwork = useGalleryStore((state) => state.setActiveArtwork);
  const [hovered, setHover] = useState(false);

  const aspectRatio = texture.image.width / texture.image.height;
  const FRAME_HEIGHT = 3.2;
  const FRAME_WIDTH = FRAME_HEIGHT * aspectRatio;
  const BORDER = 0.2;
  const DEPTH = 0.25;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setActiveArtwork(artwork);
  };

  // Sconce offset from frame edge (in local space: z is along wall)
  const sconceOffset = FRAME_WIDTH / 2 + 0.8;
  const sconceY = FRAME_HEIGHT / 2 + 0.6;

  return (
    <group position={position} rotation={rotation}>
      {/* --- GOLD FRAME --- */}
      <mesh
        onClick={handleClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[FRAME_WIDTH + BORDER, FRAME_HEIGHT + BORDER, DEPTH]} />
        <meshStandardMaterial
          color={hovered ? '#f5e6b8' : '#c9a227'}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* --- PAINTING --- */}
      <mesh position={[0, 0, DEPTH / 2 + 0.01]}>
        <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* --- LEFT SCONCE (wall-mounted light beside frame) --- */}
      <group position={[-sconceOffset, sconceY, 0.4]}>
        <primitive object={leftTarget} position={[sconceOffset * 0.5, -sconceY * 0.8, -0.5]} />
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.18, 0.5, 16]} />
          <meshStandardMaterial color="#2a2520" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.3, 0.08]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#fff8e7" emissive="#fff0c8" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        <spotLight
          position={[0, 0, 0.2]}
          target={leftTarget}
          intensity={25}
          angle={0.5}
          penumbra={0.6}
          color="#fff8e7"
          castShadow
          distance={8}
        />
      </group>

      {/* --- RIGHT SCONCE --- */}
      <group position={[sconceOffset, sconceY, 0.4]}>
        <primitive object={rightTarget} position={[-sconceOffset * 0.5, -sconceY * 0.8, -0.5]} />
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.18, 0.5, 16]} />
          <meshStandardMaterial color="#2a2520" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.3, 0.08]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#fff8e7" emissive="#fff0c8" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        <spotLight
          position={[0, 0, 0.2]}
          target={rightTarget}
          intensity={25}
          angle={0.5}
          penumbra={0.6}
          color="#fff8e7"
          castShadow
          distance={8}
        />
      </group>
    </group>
  );
}
