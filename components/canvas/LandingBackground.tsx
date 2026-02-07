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

    // Gentle parallax tilt and movement
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -y * 0.05, 0.1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.05, 0.1);
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x * 0.05, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y * 0.05, 0.1);
  });

  return (
    <group ref={meshRef}>
      {/* Slower, gentler float */}
      <Float speed={1} rotationIntensity={0.02} floatIntensity={0.05}>
        {/* --- FIX IS HERE --- 
           Drastically reduced scale from [16, 9] to [8, 4.5].
           This makes the image much smaller, allowing the text to be seen.
        */}
        <Image 
          url={url} 
          scale={[8, 4.5]} 
          transparent
          opacity={0.8} // Slightly more transparent so text pops
          toneMapped={false}
        />
      </Float>
    </group>
  );
}

export default function LandingBackground() {
  // Keep your existing URL
  const BG_IMAGE_URL = "https://gvzjlvwqyvbmbczmqggk.supabase.co/storage/v1/object/public/gallery-images/Studio%20Nouveau.jpeg"; 

  return (
    <div className="absolute inset-0 z-0 bg-black">
      {/* Moved camera back slightly to z=10 for better perspective */}
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.5} />
        
        {/* Subtle particles */}
        <Sparkles 
          count={30} 
          scale={10} 
          size={1.5} 
          speed={0.3} 
          opacity={0.3} 
          color="#ffffff" 
        />

        <Suspense fallback={null}>
          <ParallaxImage url={BG_IMAGE_URL} />
        </Suspense>
      </Canvas>
    </div>
  );
}
