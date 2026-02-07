'use client';

import { MeshReflectorMaterial } from '@react-three/drei';
import { ArtFrame } from './ArtFrame';
import { Artwork } from '@/types/schema';
import * as THREE from 'three';

interface GalleryRoomProps {
  artworks?: Artwork[];
}

export function GalleryRoom({ artworks = [] }: GalleryRoomProps) {
  const ROOM_SIZE = 24; 
  const WALL_HEIGHT = 12;

  // Layout Logic for 5 items
  const renderArtworks = () => {
    if (artworks.length === 0) return null;
    return (
      <>
        {/* Centerpiece (Back Wall) */}
        {artworks[0] && <ArtFrame artwork={artworks[0]} position={[0, 3.5, -11.5]} rotation={[0, 0, 0]} />}
        
        {/* Left Wing */}
        {artworks[1] && <ArtFrame artwork={artworks[1]} position={[-11.5, 3.5, -4]} rotation={[0, Math.PI / 2, 0]} />}
        {artworks[2] && <ArtFrame artwork={artworks[2]} position={[-11.5, 3.5, 4]} rotation={[0, Math.PI / 2, 0]} />}

        {/* Right Wing */}
        {artworks[3] && <ArtFrame artwork={artworks[3]} position={[11.5, 3.5, -4]} rotation={[0, -Math.PI / 2, 0]} />}
        {artworks[4] && <ArtFrame artwork={artworks[4]} position={[11.5, 3.5, 4]} rotation={[0, -Math.PI / 2, 0]} />}
      </>
    );
  };

  return (
    <group>
      {/* --- 1. LUXURY MARBLE FLOOR --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={2} 
          roughness={0.4} 
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505" 
          metalness={0.5}
          mirror={0.7} 
        />
      </mesh>

      {/* --- 2. DARK STONE WALLS --- */}
      <mesh position={[0, WALL_HEIGHT / 2, -ROOM_SIZE / 2]} receiveShadow>
        <boxGeometry args={[ROOM_SIZE, WALL_HEIGHT, 0.5]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh position={[-ROOM_SIZE / 2, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[ROOM_SIZE, WALL_HEIGHT, 0.5]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh position={[ROOM_SIZE / 2, WALL_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[ROOM_SIZE, WALL_HEIGHT, 0.5]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>

      {/* --- 3. CEILING & SKYLIGHT --- */}
      <mesh position={[0, WALL_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        <meshStandardMaterial color="#000" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, WALL_HEIGHT - 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 4]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* --- 4. CENTER BENCH --- */}
      <group position={[0, 0.8, 0]}>
         <mesh castShadow receiveShadow>
           <boxGeometry args={[6, 0.4, 2]} />
           <meshStandardMaterial color="#1a1a1a" roughness={0.2} />
         </mesh>
         <mesh position={[-2.5, -0.4, 0]} castShadow>
           <boxGeometry args={[0.2, 0.8, 1.8]} />
           <meshStandardMaterial color="#444" metalness={0.8} />
         </mesh>
         <mesh position={[2.5, -0.4, 0]} castShadow>
           <boxGeometry args={[0.2, 0.8, 1.8]} />
           <meshStandardMaterial color="#444" metalness={0.8} />
         </mesh>
      </group>

      {renderArtworks()}
    </group>
  );
}
