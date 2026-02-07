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
    const { x, y } = state.pointer;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -y * 0.05, 0.1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.05, 0.1);
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x * 0.1, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y * 0.1, 0.1);
  });

  return (
    <group ref={meshRef}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
        <Image url={url} scale={[9, 5]} transparent opacity={0.95} toneMapped={false} />
      </Float>
    </group>
  );
}

export default function LandingBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.5} />
        <Sparkles count={30} scale={10} size={1.5} speed={0.2} opacity={0.3} color="#ffffff" />
        <Suspense fallback={null}>
          <ParallaxImage url={BG_IMAGE_URL} />
        </Suspense>
      </Canvas>
    </div>
  );
}
