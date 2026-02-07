'use client';

import { MeshReflectorMaterial, Text } from '@react-three/drei';
import { ArtFrame } from './ArtFrame';
import { Artwork } from '@/types/schema';
import * as THREE from 'three';

interface GalleryRoomProps {
  artworks?: Artwork[];
}

// Long marble hall: narrow width, great length
const HALL_WIDTH = 20;
const HALL_LENGTH = 100;
const WALL_HEIGHT = 14;
const HALF_WIDTH = HALL_WIDTH / 2;
const HALF_LENGTH = HALL_LENGTH / 2;

// Painting positions along each wall (12 per side = 24 slots)
const LEFT_WALL_Z = [-42, -35, -28, -21, -14, -7, 0, 7, 14, 21, 28, 35];
const RIGHT_WALL_Z = [-42, -35, -28, -21, -14, -7, 0, 7, 14, 21, 28, 35];
const PAINTING_Y = 4;
const WALL_OFFSET = 0.6;

// Ornate column positions (between painting bays)
const COLUMN_Z = [-38.5, -31.5, -24.5, -17.5, -10.5, -3.5, 3.5, 10.5, 17.5, 24.5, 31.5];

function OrnateColumn({ x }: { x: number }) {
  return (
    <group>
      {COLUMN_Z.map((z) => (
        <group key={`col-${x}-${z}`}>
          {/* Base */}
          <mesh position={[x, 0.9, z]} castShadow receiveShadow>
            <cylinderGeometry args={[1, 1.3, 1, 32]} />
            <meshStandardMaterial color="#3a3530" roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Plinth */}
          <mesh position={[x, 1.75, z]} castShadow receiveShadow>
            <cylinderGeometry args={[0.85, 1, 0.5, 32]} />
            <meshStandardMaterial color="#2d2a26" roughness={0.25} metalness={0.15} />
          </mesh>
          {/* Shaft - fluted appearance with rings */}
          <mesh position={[x, 7, z]} castShadow receiveShadow>
            <cylinderGeometry args={[0.6, 0.75, 10, 48]} />
            <meshStandardMaterial color="#2a2724" roughness={0.2} metalness={0.2} />
          </mesh>
          {/* Decorative ring lower */}
          <mesh position={[x, 3.5, z]} castShadow receiveShadow>
            <torusGeometry args={[0.78, 0.06, 12, 48]} />
            <meshStandardMaterial color="#4a4035" roughness={0.25} metalness={0.4} />
          </mesh>
          {/* Decorative ring upper */}
          <mesh position={[x, 9.8, z]} castShadow receiveShadow>
            <torusGeometry args={[0.72, 0.06, 12, 48]} />
            <meshStandardMaterial color="#4a4035" roughness={0.25} metalness={0.4} />
          </mesh>
          {/* Capital */}
          <mesh position={[x, 12.5, z]} castShadow receiveShadow>
            <cylinderGeometry args={[1.2, 0.8, 1, 48]} />
            <meshStandardMaterial color="#35302a" roughness={0.2} metalness={0.25} />
          </mesh>
          {/* Capital crown */}
          <mesh position={[x, 13.4, z]} castShadow receiveShadow>
            <cylinderGeometry args={[1.35, 1.2, 0.4, 48]} />
            <meshStandardMaterial color="#2d2a26" roughness={0.25} metalness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function GalleryRoom({ artworks = [] }: GalleryRoomProps) {
  const slots: Array<{ position: [number, number, number]; rotation: [number, number, number]; isLeft: boolean }> = [];

  LEFT_WALL_Z.forEach((z) => {
    slots.push({ position: [-HALF_WIDTH + WALL_OFFSET, PAINTING_Y, z], rotation: [0, Math.PI / 2, 0], isLeft: true });
  });
  RIGHT_WALL_Z.forEach((z) => {
    slots.push({ position: [HALF_WIDTH - WALL_OFFSET, PAINTING_Y, z], rotation: [0, -Math.PI / 2, 0], isLeft: false });
  });

  const displaySlots = slots.slice(0, artworks.length);

  return (
    <group>
      {/* --- 1. FLOOR (Polished Light Marble) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[HALL_WIDTH, HALL_LENGTH]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={1.2}
          roughness={0.25}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#c9c4bd"
          metalness={0.2}
          mirror={0.6}
        />
      </mesh>

      {/* --- 2. WALLS (Light Marble) --- */}
      {/* Left wall */}
      <mesh position={[-HALF_WIDTH, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[HALL_LENGTH, WALL_HEIGHT, 0.5]} />
        <meshPhysicalMaterial color="#e8e4de" roughness={0.15} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      {/* Right wall */}
      <mesh position={[HALF_WIDTH, WALL_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[HALL_LENGTH, WALL_HEIGHT, 0.5]} />
        <meshPhysicalMaterial color="#e8e4de" roughness={0.15} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, WALL_HEIGHT / 2, -HALF_LENGTH]} receiveShadow>
        <boxGeometry args={[HALL_WIDTH, WALL_HEIGHT, 0.5]} />
        <meshPhysicalMaterial color="#e8e4de" roughness={0.15} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      {/* Front wall */}
      <mesh position={[0, WALL_HEIGHT / 2, HALF_LENGTH]} receiveShadow>
        <boxGeometry args={[HALL_WIDTH, WALL_HEIGHT, 0.5]} />
        <meshPhysicalMaterial color="#e8e4de" roughness={0.15} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>

      {/* --- 3. CEILING --- */}
      <mesh position={[0, WALL_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[HALL_WIDTH, HALL_LENGTH]} />
        <meshStandardMaterial color="#d8d4ce" side={THREE.DoubleSide} />
      </mesh>

      {/* --- 4. SKYLIGHT STRIP (runs down the hall) --- */}
      <mesh position={[0, WALL_HEIGHT - 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, HALL_LENGTH - 4]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <rectAreaLight
        width={6}
        height={HALL_LENGTH}
        color="white"
        intensity={4}
        position={[0, WALL_HEIGHT - 1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* --- 5. ORNATE COLUMNS --- */}
      <OrnateColumn x={-HALF_WIDTH + 2.5} />
      <OrnateColumn x={HALF_WIDTH - 2.5} />

      {/* --- 6. BRANDING --- */}
      <Text position={[0, 12, -HALF_LENGTH + 1]} fontSize={1.8} color="#2a2520" anchorX="center" anchorY="middle">
        STUDIO NOUVEAU
      </Text>

      {/* --- 7. PAINTINGS (each with own frame & lights) --- */}
      {displaySlots.map((slot, index) => (
        <ArtFrame
          key={artworks[index]?.id ?? `art-${index}`}
          artwork={artworks[index]}
          position={slot.position}
          rotation={slot.rotation}
          isLeftWall={slot.isLeft}
        />
      ))}
    </group>
  );
}
