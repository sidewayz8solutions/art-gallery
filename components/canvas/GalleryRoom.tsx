'use client';

import { MeshReflectorMaterial, useTexture } from '@react-three/drei';
import { ArtFrame } from './ArtFrame';
import { Artwork } from '@/types/schema';
import * as THREE from 'three';

const SIGN_IMAGE_URL =
  'https://gvzjlvwqyvbmbczmqggk.supabase.co/storage/v1/object/public/gallery-images/background.JPEG';

function Column({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Plinth (Base) */}
      <mesh position={[0, 0.75, 0]} receiveShadow>
        <boxGeometry args={[2, 1.5, 2]} />
        <meshStandardMaterial color="white" roughness={0.6} />
      </mesh>
      {/* Shaft (The main column body) */}
      <mesh position={[0, 12, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 21, 32]} />
        <meshStandardMaterial color="white" roughness={0.4} />
      </mesh>
      {/* Capital (Top part) */}
      <mesh position={[0, 23.25, 0]} receiveShadow>
        <boxGeometry args={[2.2, 1.5, 2.2]} />
        <meshStandardMaterial color="white" roughness={0.6} />
      </mesh>
    </group>
  );
}

interface GalleryRoomProps {
  artworks?: Artwork[];
}

function SignPlane() {
  const signTexture = useTexture(SIGN_IMAGE_URL, (txt) => {
    txt.colorSpace = THREE.SRGBColorSpace;
  });
  const ROOM_DEPTH = 160;
  return (
    <mesh position={[0, 14, -ROOM_DEPTH / 2 + 0.6]}>
      <planeGeometry args={[14, 8]} />
      <meshBasicMaterial map={signTexture} transparent toneMapped={false} />
    </mesh>
  );
}

export function GalleryRoom({ artworks = [] }: GalleryRoomProps) {
  const SPACING = 14;
  const WIDTH = 40;
  const WALL_HEIGHT = 28;
  const ROOM_DEPTH = 160;

  const renderArtworks = () => {
    return artworks.map((art, i) => {
      const isLeft = i % 2 === 0;
      const row = Math.floor(i / 2);
      const zPos = 50 - row * SPACING;

      return (
        <ArtFrame
          key={art.id}
          artwork={art}
          position={[isLeft ? -WIDTH / 2 + 3 : WIDTH / 2 - 3, 7, zPos]}
          rotation={[0, isLeft ? Math.PI / 2 : -Math.PI / 2, 0]}
        />
      );
    });
  };

  return (
    <group>
      {/* --- 1. BLACK MARBLE REFLECTIVE FLOOR --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[WIDTH, ROOM_DEPTH]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={4}
          roughness={0.2}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.8}
          mirror={0.9}
        />
      </mesh>

      {/* --- 2. IMPOSING WALLS --- */}
      <mesh position={[0, WALL_HEIGHT / 2, -ROOM_DEPTH / 2]} receiveShadow>
        <boxGeometry args={[WIDTH, WALL_HEIGHT, 1]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>
      <mesh position={[-WIDTH / 2, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[ROOM_DEPTH, WALL_HEIGHT, 1]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>
      <mesh position={[WIDTH / 2, WALL_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[ROOM_DEPTH, WALL_HEIGHT, 1]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>

      {/* --- 3. ORNATE COLUMNS --- */}
      {Array.from({ length: Math.floor(ROOM_DEPTH / SPACING) }).map((_, i) => {
        const z = 65 - i * SPACING;
        return (
          <group key={i}>
            <Column position={[-WIDTH / 2 + 2.5, 0, z]} />
            <Column position={[WIDTH / 2 - 2.5, 0, z]} />
          </group>
        );
      })}

      {/* --- 4. STUDIO NOUVEAU SIGN ON BACK WALL --- */}
      <SignPlane />

      {/* --- 5. VAULTED CEILING & LIGHTS --- */}
      <mesh position={[0, WALL_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#0a0a0a" side={THREE.DoubleSide} />
      </mesh>

      {/* Central Light Strips */}
      {Array.from({ length: 10 }).map((_, i) => (
        <group key={i} position={[0, WALL_HEIGHT - 1, 50 - i * 15]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[WIDTH - 8, 1.5]} />
            <meshBasicMaterial color="white" toneMapped={false} />
          </mesh>
          <rectAreaLight
            width={WIDTH - 8}
            height={4}
            color="white"
            intensity={15}
            rotation={[-Math.PI / 2, 0, 0]}
          />
        </group>
      ))}

      {renderArtworks()}
    </group>
  );
}
