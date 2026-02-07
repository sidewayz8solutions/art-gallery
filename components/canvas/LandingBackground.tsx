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
    // Get mouse position (0 in center, -1 left, 1 right)
    const { x, y } = state.pointer;

    // Smoothly interpolate current rotation to target rotation
    // This makes the image tilt towards the mouse
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -y * 0.1, 0.1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.1, 0.1);

    // Slight position shift for depth
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x * 0.5, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y * 0.5, 0.1);
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* The Image Plane */}
        {/* Scale 15 ensures it covers the screen even when tilted */}
        <Image
          url={url}
          scale={[16, 9]} // 16:9 Aspect Ratio scale
          transparent
          opacity={0.8} // Slightly see-through to blend with black bg
          toneMapped={false}
        />
      </Float>
    </group>
  );
}

export default function LandingBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
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
