'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Image } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

const BG_IMAGE_URL =
  'https://gvzjlvwqyvbmbczmqggk.supabase.co/storage/v1/object/public/gallery-images/background.JPEG';

function ParallaxImage({ url }: { url: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

  // PARALLAX LOGIC
    const { x, y } = state.pointer;

  // Smooth tilt
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -y * 0.1, 0.1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.1, 0.1);

  // Smooth movement
  meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x * 0.2, 0.1);
  meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y * 0.2, 0.1);
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* The Image Plane */}
        {/* Reduced scale to show full borders */}
        <Image
          url={url}
          scale={[11, 6.2]}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </Float>
    </group>
  );
}

export default function LandingBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 0, 7], fov: 75 }}>
        <color attach="background" args={['#000']} />

        {/* Ambient light for general visibility */}
        <ambientLight intensity={0.5} />

        {/* Particles for Depth */}
        <Sparkles
          count={50}
          scale={10}
          size={2}
          speed={0.4}
          opacity={0.5}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          <ParallaxImage url={BG_IMAGE_URL} />
        </Suspense>
      </Canvas>
    </div>
  );
}
