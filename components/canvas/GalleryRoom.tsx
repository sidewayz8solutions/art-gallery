'use client';

import { MeshReflectorMaterial, Text } from '@react-three/drei';
import { ArtFrame } from './ArtFrame';
import { Artwork } from '@/types/schema';
import * as THREE from 'three';

interface GalleryRoomProps {
  artworks?: Artwork[];
}

export function GalleryRoom({ artworks = [] }: GalleryRoomProps) {
  const ROOM_SIZE = 30; // Made room slightly bigger
  const WALL_HEIGHT = 14;

  const renderArtworks = () => {
    if (artworks.length === 0) return null;
    return (
      <>
        {/* Centerpiece (Back Wall) */}
        {artworks[0] && <ArtFrame artwork={artworks[0]} position={[0, 4, -14]} rotation={[0, 0, 0]} />}
        
        {/* Left Wing */}
        {artworks[1] && <ArtFrame artwork={artworks[1]} position={[-14, 4, -5]} rotation={[0, Math.PI / 2, 0]} />}
        {artworks[2] && <ArtFrame artwork={artworks[2]} position={[-14, 4, 5]} rotation={[0, Math.PI / 2, 0]} />}

        {/* Right Wing */}
        {artworks[3] && <ArtFrame artwork={artworks[3]} position={[14, 4, -5]} rotation={[0, -Math.PI / 2, 0]} />}
        {artworks[4] && <ArtFrame artwork={artworks[4]} position={[14, 4, 5]} rotation={[0, -Math.PI / 2, 0]} />}
      </>
    );
  };

  return (
    <group>
      {/* --- 1. FLOOR (Polished Dark Stone) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={1.5}
          roughness={0.5}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#1a1a1a"
          metalness={0.6}
          mirror={0.5}
        />
      </mesh>

      {/* --- 2. WALLS (Dark Marble Simulation) --- */}
      {/* Back Wall */}
      <mesh position={[0, WALL_HEIGHT / 2, -ROOM_SIZE / 2]} receiveShadow>
        <boxGeometry args={[ROOM_SIZE, WALL_HEIGHT, 0.5]} />
        <meshPhysicalMaterial 
          color="#0f0f0f" 
          roughness={0.2} 
          clearcoat={1} 
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Branding on Back Wall */}
      <Text 
        position={[0, 9, -14.7]} 
        fontSize={1.5} 
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        STUDIO NOUVEAU
      </Text>

      {/* Left Wall */}
      <mesh position={[-ROOM_SIZE / 2, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[ROOM_SIZE, WALL_HEIGHT, 0.5]} />
        <meshPhysicalMaterial color="#0f0f0f" roughness={0.2} clearcoat={1} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[ROOM_SIZE / 2, WALL_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[ROOM_SIZE, WALL_HEIGHT, 0.5]} />
        <meshPhysicalMaterial color="#0f0f0f" roughness={0.2} clearcoat={1} />
      </mesh>

      {/* --- 3. ROOF & SKYLIGHT --- */}
      {/* Ceiling Main */}
      <mesh position={[0, WALL_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        <meshStandardMaterial color="#222" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Skylight Frame */}
      <mesh position={[0, WALL_HEIGHT - 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[14, 14, 0.5]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      
      {/* The Light Source (The Glass) */}
      <mesh position={[0, WALL_HEIGHT - 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      
      {/* Actual Light coming from Skylight */}
      <rectAreaLight 
        width={12} 
        height={12} 
        color={"white"} 
        intensity={5} 
        position={[0, WALL_HEIGHT - 1, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
      />

      {renderArtworks()}
    </group>
  );
}
