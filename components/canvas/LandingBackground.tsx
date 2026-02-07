'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Image } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function ParallaxImage({ url }: { url: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const { x, y } = state.pointer;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.1, 0.1);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -y * 0.1, 0.1);
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Image url={url} scale={[6, 3.5]} transparent opacity={1} toneMapped={false} />
      </Float>
    </group>
  );
}

export default function LandingBackground() {
  // Use cover.jpeg (or upload as studio-nouveau.jpeg if you prefer — avoid spaces in filenames)
  const BG_IMAGE_URL =
    'https://gvzjlvwqyvbmbczmqggk.supabase.co/storage/v1/object/public/gallery-images/cover.jpeg';

  return (
    <div className="w-full h-full relative bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.8} />
        <Sparkles count={40} scale={5} size={2} speed={0.4} opacity={0.5} color="#ffffff" />
        <Suspense fallback={null}>
          <ParallaxImage url={BG_IMAGE_URL} />
        </Suspense>
      </Canvas>
    </div>
  );
}
