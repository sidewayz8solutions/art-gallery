/* eslint-disable react-hooks/immutability */
'use client';

import { useTexture, Text } from '@react-three/drei';
import { ArtFrame } from './ArtFrame';
import { Artwork } from '@/types/schema';
import * as THREE from 'three';
import { ReactNode, ErrorInfo, Component } from 'react';

interface GalleryRoomProps {
  artworks?: Artwork[];
}

// Error boundary for texture loading
class TextureErrorBoundary extends Component<
  { children: ReactNode; fallback: (textures: { walls: null; floor: null; ceiling: null }) => ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: (textures: { walls: null; floor: null; ceiling: null }) => ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Texture loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback({ walls: null, floor: null, ceiling: null });
    }
    return this.props.children;
  }
}

// Component to safely load room textures
function RoomTextures({ children }: { children: (textures: { walls: THREE.Texture; floor: THREE.Texture; ceiling: THREE.Texture }) => ReactNode }) {
  const TEXTURE_URLS = {
    walls: 'https://gvzjlvwqyvbmbczmqggk.supabase.co/storage/v1/object/public/gallery-images/Onyx.png',
    floor: 'https://gvzjlvwqyvbmbczmqggk.supabase.co/storage/v1/object/public/gallery-images/Wood.png',
    ceiling: 'https://gvzjlvwqyvbmbczmqggk.supabase.co/storage/v1/object/public/gallery-images/ceiling.png',
  };

  const textures = useTexture(TEXTURE_URLS);

  // Configure textures
  textures.floor.wrapS = textures.floor.wrapT = THREE.RepeatWrapping;
  textures.floor.repeat.set(8, 30);
  textures.floor.colorSpace = THREE.SRGBColorSpace;

  textures.walls.wrapS = textures.walls.wrapT = THREE.RepeatWrapping;
  textures.walls.repeat.set(2, 4);
  textures.walls.colorSpace = THREE.SRGBColorSpace;

  textures.ceiling.wrapS = textures.ceiling.wrapT = THREE.RepeatWrapping;
  textures.ceiling.repeat.set(10, 30);
  textures.ceiling.colorSpace = THREE.SRGBColorSpace;

  return <>{children(textures)}</>;
}

export function GalleryRoom({ artworks = [] }: GalleryRoomProps) {
  // --- ROOM SETUP ---
  const SPACING = 15;
  const WIDTH = 40;
  const WALL_HEIGHT = 20;
  const ROOM_DEPTH = 150;

  const renderArtworks = () => {
    return artworks.map((art, i) => {
      const isLeft = i % 2 === 0;
      const row = Math.floor(i / 2);
      const zPos = 50 - (row * SPACING);

      return (
        <ArtFrame
          key={art.id}
          artwork={art}
          // Y=7 keeps them at eye level
          position={[isLeft ? -WIDTH / 2 + 0.6 : WIDTH / 2 - 0.6, 7, zPos]}
          rotation={[0, isLeft ? Math.PI / 2 : -Math.PI / 2, 0]}
        />
      );
    });
  };

  // Render room with fallback colors if textures fail
  const renderRoomWithFallback = (textures: { walls: THREE.Texture | null; floor: THREE.Texture | null; ceiling: THREE.Texture | null }) => (
    <group>
      {/* --- 1. WOOD FLOORS --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial
          map={textures.floor || undefined}
          color={textures.floor ? undefined : '#2a1f0f'} // Dark brown fallback
          roughness={0.8} // Wood is matte/rough
          metalness={0.1}
        />
      </mesh>

      {/* --- 2. ONYX WALLS --- */}
      <mesh position={[0, WALL_HEIGHT / 2, -ROOM_DEPTH / 2]}> {/* Back */}
        <boxGeometry args={[WIDTH, WALL_HEIGHT, 1]} />
        <meshStandardMaterial 
          map={textures.walls || undefined} 
          color={textures.walls ? undefined : '#1a1a1a'} // Dark gray fallback
          roughness={0.1} 
          metalness={0.2} 
        />
      </mesh>

      <Text position={[0, 12, -ROOM_DEPTH / 2 + 0.6]} fontSize={3} color="white">
        STUDIO NOUVEAU
      </Text>

      <mesh position={[-WIDTH / 2, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}> {/* Left */}
        <boxGeometry args={[ROOM_DEPTH, WALL_HEIGHT, 1]} />
        <meshStandardMaterial 
          map={textures.walls || undefined} 
          color={textures.walls ? undefined : '#1a1a1a'} // Dark gray fallback
          roughness={0.1} 
          metalness={0.2} 
        />
      </mesh>

      <mesh position={[WIDTH / 2, WALL_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]}> {/* Right */}
        <boxGeometry args={[ROOM_DEPTH, WALL_HEIGHT, 1]} />
        <meshStandardMaterial 
          map={textures.walls || undefined} 
          color={textures.walls ? undefined : '#1a1a1a'} // Dark gray fallback
          roughness={0.1} 
          metalness={0.2} 
        />
      </mesh>

      {/* --- 3. OFFICE CEILING --- */}
      <mesh position={[0, WALL_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial 
          map={textures.ceiling || undefined} 
          color={textures.ceiling ? undefined : '#2a2a2a'} // Medium gray fallback
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Lighting Panels (Office Lights) */}
      {Array.from({ length: 15 }).map((_, i) => (
        <group key={i} position={[0, WALL_HEIGHT - 0.1, 60 - (i * 10)]}>
          <rectAreaLight width={WIDTH - 10} height={2} color="white" intensity={15} rotation={[-Math.PI / 2, 0, 0]} />
        </group>
      ))}

      {renderArtworks()}
    </group>
  );

  return (
    <TextureErrorBoundary fallback={renderRoomWithFallback}>
      <RoomTextures>
        {(textures) => renderRoomWithFallback(textures)}
      </RoomTextures>
    </TextureErrorBoundary>
  );
}
