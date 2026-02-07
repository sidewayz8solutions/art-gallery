'use client';

import { MeshReflectorMaterial, Text } from '@react-three/drei';
import { ArtFrame } from './ArtFrame';
import { Artwork } from '@/types/schema';
import * as THREE from 'three';

interface GalleryRoomProps {
  artworks?: Artwork[];
}

export function GalleryRoom({ artworks = [] }: GalleryRoomProps) {
  const ROOM_SIZE = 44; // Grand hall scale
  const WALL_HEIGHT = 18;
  const HALF_ROOM = ROOM_SIZE / 2;
  const WALL_Z = -HALF_ROOM;
  const WALL_X = HALF_ROOM;

  const renderArtworks = () => {
    if (artworks.length === 0) return null;

    const backWallX = [-10, 0, 10];
    const sideWallZ = [-14, -6, 2, 10];
    const rowsY = [5, 11];

    const slots: Array<{ position: [number, number, number]; rotation: [number, number, number] }> = [];

    // Back wall: 3 columns x 2 rows = 6
    rowsY.forEach((y) => {
      backWallX.forEach((x) => {
        slots.push({ position: [x, y, WALL_Z + 0.8], rotation: [0, 0, 0] });
      });
    });

    // Left wall: 4 columns x 2 rows = 8
    rowsY.forEach((y) => {
      sideWallZ.forEach((z) => {
        slots.push({ position: [-WALL_X + 0.8, y, z], rotation: [0, Math.PI / 2, 0] });
      });
    });

    // Right wall: 4 columns x 2 rows = 8
    rowsY.forEach((y) => {
      sideWallZ.forEach((z) => {
        slots.push({ position: [WALL_X - 0.8, y, z], rotation: [0, -Math.PI / 2, 0] });
      });
    });

    // Extra hero slot for a 23rd piece (center, high on back wall)
    slots.push({ position: [0, 14.5, WALL_Z + 0.8], rotation: [0, 0, 0] });

    return (
      <>
        {slots.slice(0, artworks.length).map((slot, index) => (
          <ArtFrame
            key={artworks[index]?.id ?? `art-${index}`}
            artwork={artworks[index]}
            position={slot.position}
            rotation={slot.rotation}
          />
        ))}
      </>
    );
  };

  return (
    <group>
      {/* --- 1. FLOOR (Polished Dark Stone) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, -2]} receiveShadow>
        <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={1.1}
          roughness={0.35}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#2a2a2a"
          metalness={0.35}
          mirror={0.6}
        />
      </mesh>

      {/* --- 2. WALLS (Dark Marble Simulation) --- */}
      {/* Back Wall */}
      <mesh position={[0, WALL_HEIGHT / 2, WALL_Z]} receiveShadow>
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
        position={[0, 16.2, WALL_Z + 0.3]} 
        fontSize={2} 
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        STUDIO NOUVEAU
      </Text>

      {/* Left Wall */}
      <mesh position={[-WALL_X, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[ROOM_SIZE, WALL_HEIGHT, 0.5]} />
        <meshPhysicalMaterial color="#0f0f0f" roughness={0.2} clearcoat={1} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[WALL_X, WALL_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
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
        <boxGeometry args={[22, 22, 0.7]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      
      {/* The Light Source (The Glass) */}
      <mesh position={[0, WALL_HEIGHT - 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      
      {/* Actual Light coming from Skylight */}
      <rectAreaLight 
        width={20} 
        height={20} 
        color={"white"} 
        intensity={9} 
        position={[0, WALL_HEIGHT - 1.8, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
      />

      {/* --- 4. GRAND HALL COLUMNS --- */}
      <group>
        {[-14, -6, 2, 10].map((z) => (
          <group key={`col-left-${z}`}>
            {/* Base */}
            <mesh position={[-WALL_X + 3.5, 0.9, z]} castShadow receiveShadow>
              <cylinderGeometry args={[1.6, 1.9, 1.2, 48]} />
              <meshStandardMaterial color="#2b2b2b" roughness={0.35} metalness={0.15} />
            </mesh>
            {/* Plinth */}
            <mesh position={[-WALL_X + 3.5, 1.8, z]} castShadow receiveShadow>
              <cylinderGeometry args={[1.2, 1.4, 0.8, 48]} />
              <meshStandardMaterial color="#202020" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Shaft */}
            <mesh position={[-WALL_X + 3.5, 8, z]} castShadow receiveShadow>
              <cylinderGeometry args={[0.75, 0.95, 12, 64]} />
              <meshStandardMaterial color="#1c1c1c" roughness={0.25} metalness={0.15} />
            </mesh>
            {/* Fluting rings */}
            <mesh position={[-WALL_X + 3.5, 5, z]} castShadow receiveShadow>
              <torusGeometry args={[0.95, 0.05, 16, 64]} />
              <meshStandardMaterial color="#151515" roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[-WALL_X + 3.5, 9.5, z]} castShadow receiveShadow>
              <torusGeometry args={[0.9, 0.05, 16, 64]} />
              <meshStandardMaterial color="#151515" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Capital */}
            <mesh position={[-WALL_X + 3.5, 14.2, z]} castShadow receiveShadow>
              <cylinderGeometry args={[1.5, 1.1, 1.2, 48]} />
              <meshStandardMaterial color="#262626" roughness={0.25} metalness={0.2} />
            </mesh>
            <mesh position={[-WALL_X + 3.5, 15.1, z]} castShadow receiveShadow>
              <boxGeometry args={[3.2, 0.6, 3.2]} />
              <meshStandardMaterial color="#111" roughness={0.3} />
            </mesh>
          </group>
        ))}
        {[-14, -6, 2, 10].map((z) => (
          <group key={`col-right-${z}`}>
            {/* Base */}
            <mesh position={[WALL_X - 3.5, 0.9, z]} castShadow receiveShadow>
              <cylinderGeometry args={[1.6, 1.9, 1.2, 48]} />
              <meshStandardMaterial color="#2b2b2b" roughness={0.35} metalness={0.15} />
            </mesh>
            {/* Plinth */}
            <mesh position={[WALL_X - 3.5, 1.8, z]} castShadow receiveShadow>
              <cylinderGeometry args={[1.2, 1.4, 0.8, 48]} />
              <meshStandardMaterial color="#202020" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Shaft */}
            <mesh position={[WALL_X - 3.5, 8, z]} castShadow receiveShadow>
              <cylinderGeometry args={[0.75, 0.95, 12, 64]} />
              <meshStandardMaterial color="#1c1c1c" roughness={0.25} metalness={0.15} />
            </mesh>
            {/* Fluting rings */}
            <mesh position={[WALL_X - 3.5, 5, z]} castShadow receiveShadow>
              <torusGeometry args={[0.95, 0.05, 16, 64]} />
              <meshStandardMaterial color="#151515" roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[WALL_X - 3.5, 9.5, z]} castShadow receiveShadow>
              <torusGeometry args={[0.9, 0.05, 16, 64]} />
              <meshStandardMaterial color="#151515" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Capital */}
            <mesh position={[WALL_X - 3.5, 14.2, z]} castShadow receiveShadow>
              <cylinderGeometry args={[1.5, 1.1, 1.2, 48]} />
              <meshStandardMaterial color="#262626" roughness={0.25} metalness={0.2} />
            </mesh>
            <mesh position={[WALL_X - 3.5, 15.1, z]} castShadow receiveShadow>
              <boxGeometry args={[3.2, 0.6, 3.2]} />
              <meshStandardMaterial color="#111" roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* --- 5. GRAND HALL LIGHTING ACCENTS --- */}
      <spotLight position={[-12, 14, 10]} angle={0.6} intensity={3} penumbra={0.5} color="#f5e6c8" />
      <spotLight position={[12, 14, 10]} angle={0.6} intensity={3} penumbra={0.5} color="#f5e6c8" />

      {renderArtworks()}
    </group>
  );
}
