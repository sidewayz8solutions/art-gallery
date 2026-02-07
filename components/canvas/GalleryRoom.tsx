'use client';

import { useMemo } from 'react';
import { MeshReflectorMaterial, useTexture } from '@react-three/drei';
import { ArtFrame } from './ArtFrame';
import { Artwork } from '@/types/schema';
import * as THREE from 'three';

// ============================================================================
// Constants & Configuration
// ============================================================================

const SIGN_IMAGE_URL =
  'https://gvzjlvwqyvbmbczmqggk.supabase.co/storage/v1/object/public/gallery-images/background.JPEG';

// Column configuration for easy customization
const COLUMN_CONFIG = {
  plinth: {
    dimensions: [2, 1.5, 2] as [number, number, number],
    color: '#ffffff',
    roughness: 0.6,
  },
  shaft: {
    radius: 0.8,
    height: 21,
    segments: 32,
    color: '#ffffff',
    roughness: 0.4,
  },
  capital: {
    dimensions: [2.2, 1.5, 2.2] as [number, number, number],
    color: '#ffffff',
    roughness: 0.6,
  },
};

// Sign plane configuration for easy customization
const SIGN_PLANE_CONFIG = {
  width: 14,
  height: 8,
  positionY: 14,
  offsetFromWall: 0.6,
  defaultColor: '#ffffff',
  opacity: 1,
};

// Reusable material instance to reduce memory allocations
const COLUMN_MATERIAL = new THREE.MeshStandardMaterial({
  color: COLUMN_CONFIG.plinth.color,
  roughness: COLUMN_CONFIG.plinth.roughness,
});

// ============================================================================
// Components
// ============================================================================

interface ColumnProps {
  /** Position in 3D space [x, y, z] */
  position?: [number, number, number];
}

function Column({ position = [1, 1, 1] }: ColumnProps) {
  // Memoize geometry to prevent recreation on re-renders
  const plinthGeometry = useMemo(
    () => new THREE.BoxGeometry(...COLUMN_CONFIG.plinth.dimensions), 
    []
  );

  const shaftGeometry = useMemo(
    () => new THREE.CylinderGeometry(
      COLUMN_CONFIG.shaft.radius,
      COLUMN_CONFIG.shaft.radius,
      COLUMN_CONFIG.shaft.height,
      COLUMN_CONFIG.shaft.segments
    ),
    []
  );

  const capitalGeometry = useMemo(
    () => new THREE.BoxGeometry(...COLUMN_CONFIG.capital.dimensions),
    []
  );

  return (
    <group position={position}>
      {/* Plinth (Base) */}
      <mesh geometry={plinthGeometry} position={[0, 0.75, 0]} receiveShadow>
        <primitive object={COLUMN_MATERIAL} attach="material" />
      </mesh>

      {/* Shaft (The main column body) */}
      <mesh geometry={shaftGeometry} position={[0, 12, 0]} receiveShadow>
        <meshStandardMaterial
          color={COLUMN_CONFIG.shaft.color}
          roughness={COLUMN_CONFIG.shaft.roughness}
        />
      </mesh>

      {/* Capital (Top part) */}
      <mesh geometry={capitalGeometry} position={[0, 23.25, 0]} receiveShadow>
        <primitive object={COLUMN_MATERIAL} attach="material" />
      </mesh>
    </group>
  );
}

interface GalleryRoomProps {
  artworks?: Artwork[];
}

interface SignPlaneProps {
  /** Room depth for positioning (should match GalleryRoom's ROOM_DEPTH) */
  roomDepth?: number;
  /** Optional custom texture URL to override default */
  textureUrl?: string;
  /** Callback when texture loads successfully */
  onLoad?: () => void;
  /** Callback when texture fails to load */
  onError?: (error: Error) => void;
}

/**
 * SignPlane displays the studio logo/sign on the back wall of the gallery.
 * Uses useTexture for efficient texture loading with proper color space handling.
 * 
 * @example
 * <SignPlane roomDepth={160} />
 */
function SignPlane({
  roomDepth = 160,
  textureUrl = SIGN_IMAGE_URL,
  onLoad,
  onError,
}: SignPlaneProps) {
  // Memoize the texture to prevent reloading on re-renders
  const signTexture = useTexture(textureUrl, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    onLoad?.();
  });

  // Memoize geometry to avoid recreation on re-renders
  const planeGeometry = useMemo(
    () => new THREE.PlaneGeometry(SIGN_PLANE_CONFIG.width, SIGN_PLANE_CONFIG.height),
    []
  );

  // Memoize material to prevent recreation
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: signTexture,
        transparent: true,
        opacity: SIGN_PLANE_CONFIG.opacity,
        toneMapped: false,
      }),
    [signTexture]
  );

  // Calculate position once (reactive to roomDepth changes)
  const position: [number, number, number] = [
    0,
    SIGN_PLANE_CONFIG.positionY,
    -roomDepth / 2 + SIGN_PLANE_CONFIG.offsetFromWall,
  ];

  return (
    <mesh geometry={planeGeometry} position={position}>
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export function GalleryRoom({ artworks = [] }: GalleryRoomProps) {
  const SPACING = 14;
  const WIDTH = 40;
  const WALL_HEIGHT = 28;
  const ROOM_DEPTH = 160;

  const lightTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(0, 0, 0);
    return target;
  }, []);

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
      <SignPlane roomDepth={ROOM_DEPTH} />

      {/* --- 5. VAULTED CEILING & LIGHTS --- */}
      <mesh position={[0, WALL_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#a0a0a0" side={THREE.DoubleSide} />
        <spotLight
          position={[0, 0, 0]}
          target={lightTarget}
          intensity={10}
          angle={0.5}
          penumbra={0.6}
          color="#fff8e7"
          castShadow
          distance={8}
        />
        <spotLight
          position={[0, 0, 0]}
          target={lightTarget}
          intensity={10}
          angle={0.5}
          penumbra={0.6}
          color="#fff8e7"
          castShadow
          distance={8}
        />
        <spotLight
          position={[0, 0, 0]}
          target={lightTarget}
          intensity={10}
          angle={0.5}
          penumbra={0.6}
          color="#fff8e7"
          castShadow
          distance={8}
        />
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
