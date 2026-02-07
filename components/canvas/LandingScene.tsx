'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Float, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { EffectComposer, DepthOfField, Vignette } from '@react-three/postprocessing';
import { Artwork } from '@/types/schema';

// A single floating hero frame
function HeroFrame({ artwork }: { artwork: Artwork }) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Load texture
  const texture = useTexture(artwork.image_url);
  const aspectRatio = texture.image.width / texture.image.height;
  const height = 4;
  const width = height * aspectRatio;

  // Gentle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      // Slow sine wave rotation for a "breathing" effect
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.15;
      meshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef} rotation={[0, -0.2, 0]}>
        {/* Frame Box */}
        <mesh>
          <boxGeometry args={[width + 0.3, height + 0.3, 0.2]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Artwork Canvas */}
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        
        {/* Glass Reflection Layer (Adds that "premium" shine) */}
        <mesh position={[0, 0, 0.12]}>
          <planeGeometry args={[width, height]} />
          <meshPhysicalMaterial 
            transparent 
            opacity={0.1} 
            roughness={0} 
            metalness={0.9} 
            clearcoat={1} 
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function LandingScene({ artwork }: { artwork: Artwork }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      className="w-full h-full"
    >
      <color attach="background" args={['#050505']} />
      
      {/* 1. Dramatic Lighting */}
      <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={10} castShadow />
      <spotLight position={[-5, 0, 5]} angle={0.5} penumbra={1} intensity={2} color="#4a4a4a" />
      <Environment preset="city" blur={2} />

      {/* 2. Atmosphere (Particles) */}
      <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.5} color="#ffffff" />

      {/* 3. The Hero Object */}
      <Suspense fallback={null}>
        {artwork && <HeroFrame artwork={artwork} />}
        
        {/* Floor Shadow for grounding */}
        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
      </Suspense>

      {/* 4. Post Processing for "Depth" */}
      <EffectComposer disableNormalPass>
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
}
