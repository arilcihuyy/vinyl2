"use client";

import { ContactShadows, PresentationControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, type Group } from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function MonogramA() {
  return (
    <group position={[0, -0.39, 0]}>
      <mesh position={[-0.18, 0, 0]} rotation={[0, -0.58, 0]}>
        <boxGeometry args={[0.09, 0.035, 0.72]} />
        <meshStandardMaterial color="#FFF7E8" roughness={0.48} />
      </mesh>
      <mesh position={[0.18, 0, 0]} rotation={[0, 0.58, 0]}>
        <boxGeometry args={[0.09, 0.035, 0.72]} />
        <meshStandardMaterial color="#FFF7E8" roughness={0.48} />
      </mesh>
      <mesh position={[0, 0.018, 0.04]}>
        <boxGeometry args={[0.42, 0.035, 0.08]} />
        <meshStandardMaterial color="#FFF7E8" roughness={0.48} />
      </mesh>
    </group>
  );
}

function Turntable() {
  const groupRef = useRef<Group>(null);
  const reducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) {
      return;
    }

    groupRef.current.rotation.y = MathUtils.damp(
      groupRef.current.rotation.y,
      -0.35 + state.pointer.x * 0.12,
      5,
      delta,
    );
    groupRef.current.rotation.x = MathUtils.damp(
      groupRef.current.rotation.x,
      -0.14 - state.pointer.y * 0.05,
      5,
      delta,
    );
  });

  return (
    <PresentationControls
      cursor
      snap
      rotation={[0.04, -0.35, 0]}
      polar={[-0.18, 0.12]}
      azimuth={[-0.45, 0.45]}
    >
      <group ref={groupRef}>
        <RoundedBox args={[3.9, 0.38, 3.15]} radius={0.12} smoothness={4} position={[0, -0.9, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#CFC0A6" roughness={0.72} metalness={0.04} />
        </RoundedBox>

        <mesh position={[0, -0.65, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.48, 1.48, 0.18, 96]} />
          <meshStandardMaterial color="#22201D" roughness={0.34} metalness={0.12} />
        </mesh>

        {[0.56, 0.78, 1, 1.22].map((radius) => (
          <mesh key={radius} position={[0, -0.54, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.012, 8, 96]} />
            <meshStandardMaterial color="#6F675E" roughness={0.48} metalness={0.18} />
          </mesh>
        ))}

        <mesh position={[0, -0.52, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.045, 64]} />
          <meshStandardMaterial color="#B54722" roughness={0.58} />
        </mesh>
        <MonogramA />

        <group position={[1.45, -0.36, 0.62]} rotation={[0, -0.62, 0]}>
          <mesh position={[-0.42, 0.14, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.16, 0.32, 32]} />
            <meshStandardMaterial color="#2B2824" roughness={0.45} metalness={0.24} />
          </mesh>
          <mesh position={[-0.08, 0.2, -0.32]} rotation={[0.2, 0, -0.72]} castShadow>
            <boxGeometry args={[0.1, 0.1, 1.05]} />
            <meshStandardMaterial color="#AFA18B" roughness={0.35} metalness={0.38} />
          </mesh>
          <mesh position={[0.25, 0.18, -0.72]} rotation={[0.2, 0, -0.72]} castShadow>
            <boxGeometry args={[0.2, 0.16, 0.28]} />
            <meshStandardMaterial color="#2B2824" roughness={0.42} />
          </mesh>
        </group>

        {[-1.42, -1.13].map((x) => (
          <mesh key={x} position={[x, -0.63, 1.2]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.16, 32]} />
            <meshStandardMaterial color="#B54722" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </PresentationControls>
  );
}

export function HeroTurntable() {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, 2.8, 5.8], fov: 35 }}
      dpr={[1, 1.5]}
      frameloop={reducedMotion ? "demand" : "always"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows
      fallback={
        <div className="grid aspect-square w-full place-items-center rounded-full border border-cream/25 font-display text-8xl text-accent-light">
          A
        </div>
      }
    >
      <ambientLight intensity={1.65} />
      <directionalLight position={[4, 6, 4]} intensity={3.2} color="#FFF1D6" castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={1.1} color="#D8C9B4" />
      <Turntable />
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.48}
        scale={7}
        blur={2.8}
        far={4.5}
        color="#000000"
      />
    </Canvas>
  );
}
