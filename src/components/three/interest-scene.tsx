"use client";

import { ContactShadows, RoundedBox, useCursor } from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useRef, useState, type ReactNode } from "react";
import { MathUtils, type Group } from "three";
import type { Interest, InterestId } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type InteractiveObjectProps = {
  children: ReactNode;
  id: InterestId;
  position: [number, number, number];
  rotation?: [number, number, number];
  selected: boolean;
  onSelect: (id: InterestId) => void;
};

function InteractiveObject({
  children,
  id,
  position,
  rotation = [0, 0, 0],
  selected,
  onSelect,
}: InteractiveObjectProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  useCursor(hovered);

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) {
      return;
    }

    const targetScale = selected ? 1.16 : hovered ? 1.08 : 1;
    const targetY = selected ? position[1] + 0.36 : position[1];
    const targetRotation = selected
      ? 0.18
      : hovered
        ? state.pointer.x * 0.14
        : rotation[1];

    groupRef.current.position.y = MathUtils.damp(
      groupRef.current.position.y,
      targetY,
      7,
      delta,
    );
    groupRef.current.scale.setScalar(
      MathUtils.damp(groupRef.current.scale.x, targetScale, 8, delta),
    );
    groupRef.current.rotation.y = MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotation,
      7,
      delta,
    );
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(id);
  };

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={handlePointerOver}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Turntable riser pedestal with brass accent rim */}
      <mesh position={[0, -0.76, 0]} receiveShadow>
        <cylinderGeometry args={[0.78, 0.86, 0.12, 48]} />
        <meshStandardMaterial
          color={selected ? "#B54722" : "#CFC0A6"}
          roughness={0.7}
        />
      </mesh>
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.02, 48]} />
        <meshStandardMaterial
          color={selected ? "#E07348" : "#8A7965"}
          metalness={0.35}
          roughness={0.3}
        />
      </mesh>
      {children}
    </group>
  );
}

function VintageSynthesizer({ active }: { active: boolean }) {
  return (
    <group rotation={[-0.18, 0.1, 0]}>
      {/* Wood side panels */}
      <mesh position={[-0.78, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.28, 0.88]} />
        <meshStandardMaterial color="#6E371C" roughness={0.6} />
      </mesh>
      <mesh position={[0.78, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.28, 0.88]} />
        <meshStandardMaterial color="#6E371C" roughness={0.6} />
      </mesh>
      {/* Main metal chassis */}
      <RoundedBox args={[1.48, 0.22, 0.86]} radius={0.04} smoothness={2} castShadow receiveShadow>
        <meshStandardMaterial color="#22201D" roughness={0.5} />
      </RoundedBox>
      {/* Upper control faceplate */}
      <group position={[0, 0.14, -0.16]} rotation={[-0.22, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.42, 0.08, 0.44]} />
          <meshStandardMaterial color="#2E2B27" roughness={0.4} />
        </mesh>
        {/* Accent stripe */}
        <mesh position={[0, 0.042, -0.17]}>
          <boxGeometry args={[1.38, 0.005, 0.04]} />
          <meshStandardMaterial color="#B54722" roughness={0.5} />
        </mesh>
        {/* Knobs */}
        {[-0.55, -0.42, -0.29, -0.16, -0.03, 0.1, 0.23, 0.36, 0.49].map((x, i) => (
          <mesh key={x} position={[x, 0.05, 0.04]} castShadow>
            <cylinderGeometry args={[0.032, 0.036, 0.04, 16]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#B54722" : i % 3 === 1 ? "#E2D3B8" : "#8A7965"}
              roughness={0.4}
            />
          </mesh>
        ))}
        {/* Power / Status LED */}
        <mesh position={[0.62, 0.05, 0.12]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshBasicMaterial color={active ? "#4EBA6F" : "#1A4425"} />
        </mesh>
      </group>
      {/* Lower keyboard bed */}
      <group position={[0, 0.08, 0.22]}>
        {/* White keys */}
        {Array.from({ length: 11 }).map((_, i) => (
          <mesh key={`white-${i}`} position={[-0.62 + i * 0.124, 0.05, 0]} castShadow>
            <boxGeometry args={[0.112, 0.06, 0.34]} />
            <meshStandardMaterial color="#FFFBF0" roughness={0.3} />
          </mesh>
        ))}
        {/* Black keys */}
        {[0, 1, 3, 4, 5, 7, 8].map((k) => (
          <mesh key={`black-${k}`} position={[-0.558 + k * 0.124, 0.09, -0.06]} castShadow>
            <boxGeometry args={[0.07, 0.06, 0.2]} />
            <meshStandardMaterial color="#161514" roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function AnalogMixer({ active }: { active: boolean }) {
  const needleRef = useRef<Group>(null);
  useFrame(() => {
    if (needleRef.current && active) {
      needleRef.current.rotation.z = Math.sin(Date.now() * 0.008) * 0.25 - 0.2;
    }
  });

  return (
    <group rotation={[0.14, -0.05, 0]}>
      {/* Mixer wedge body */}
      <RoundedBox args={[1.36, 0.26, 1.1]} radius={0.06} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#2B2824" roughness={0.6} />
      </RoundedBox>
      {/* Wooden cheek trims */}
      <mesh position={[-0.7, 0.02, 0]}>
        <boxGeometry args={[0.05, 0.24, 1.12]} />
        <meshStandardMaterial color="#5A3825" roughness={0.6} />
      </mesh>
      <mesh position={[0.7, 0.02, 0]}>
        <boxGeometry args={[0.05, 0.24, 1.12]} />
        <meshStandardMaterial color="#5A3825" roughness={0.6} />
      </mesh>
      {/* Upper meter bridge */}
      <mesh position={[0, 0.16, -0.32]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[1.28, 0.16, 0.28]} />
        <meshStandardMaterial color="#1E1C19" roughness={0.5} />
      </mesh>
      {/* Dual VU meters */}
      {[-0.28, 0.28].map((x) => (
        <group key={x} position={[x, 0.24, -0.34]} rotation={[-0.2, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.34, 0.12, 0.02]} />
            <meshStandardMaterial color="#FFF4D6" roughness={0.5} />
          </mesh>
          <group ref={x < 0 ? needleRef : undefined} position={[0, -0.04, 0.015]}>
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.012, 0.08, 0.005]} />
              <meshBasicMaterial color="#B54722" />
            </mesh>
          </group>
        </group>
      ))}
      {/* 4 channel strips */}
      {[-0.45, -0.15, 0.15, 0.45].map((x) => (
        <group key={x} position={[x, 0.14, 0.12]}>
          {/* EQ Knobs */}
          {[-0.12, 0, 0.12].map((z, ki) => (
            <mesh key={z} position={[0, 0.02, z - 0.2]} castShadow>
              <cylinderGeometry args={[0.038, 0.042, 0.04, 16]} />
              <meshStandardMaterial
                color={ki === 0 ? "#4A6B82" : ki === 1 ? "#B54722" : "#D8CAB7"}
                roughness={0.4}
              />
            </mesh>
          ))}
          {/* Fader slot and knob */}
          <mesh position={[0, 0.005, 0.18]}>
            <boxGeometry args={[0.03, 0.005, 0.3]} />
            <meshStandardMaterial color="#11100E" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.025, 0.14]} castShadow>
            <boxGeometry args={[0.08, 0.04, 0.06]} />
            <meshStandardMaterial color="#E8DDCB" roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ReelToReelTapeDeck({ active }: { active: boolean }) {
  const leftReelRef = useRef<Group>(null);
  const rightReelRef = useRef<Group>(null);
  const reducedMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (!reducedMotion) {
      const speed = active ? 2.4 : 0.6;
      if (leftReelRef.current) leftReelRef.current.rotation.z += delta * speed;
      if (rightReelRef.current) rightReelRef.current.rotation.z += delta * speed;
    }
  });

  return (
    <group rotation={[0.05, 0, 0]}>
      {/* Main vertical cabinet */}
      <RoundedBox args={[1.42, 1.48, 0.32]} radius={0.06} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#2E2C28" roughness={0.55} />
      </RoundedBox>
      {/* Aluminum faceplate */}
      <mesh position={[0, 0.02, 0.17]}>
        <boxGeometry args={[1.34, 1.4, 0.02]} />
        <meshStandardMaterial color="#D8CAB7" roughness={0.35} metalness={0.35} />
      </mesh>
      {/* Left Supply Reel */}
      <group ref={leftReelRef} position={[-0.38, 0.32, 0.22]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.04, 32]} />
          <meshStandardMaterial color="#4A2F1E" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.01, 32]} />
          <meshStandardMaterial color="#BDB5A6" roughness={0.25} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
          <meshStandardMaterial color="#22201D" roughness={0.4} />
        </mesh>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.18, Math.sin(angle) * 0.18, 0.03]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.055, 0.055, 0.012, 16]} />
            <meshStandardMaterial color="#2E2C28" roughness={0.5} />
          </mesh>
        ))}
      </group>
      {/* Right Take-up Reel */}
      <group ref={rightReelRef} position={[0.38, 0.32, 0.22]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 32]} />
          <meshStandardMaterial color="#4A2F1E" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.01, 32]} />
          <meshStandardMaterial color="#BDB5A6" roughness={0.25} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
          <meshStandardMaterial color="#22201D" roughness={0.4} />
        </mesh>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.18, Math.sin(angle) * 0.18, 0.03]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.055, 0.055, 0.012, 16]} />
            <meshStandardMaterial color="#2E2C28" roughness={0.5} />
          </mesh>
        ))}
      </group>
      {/* Center Tape Head Housing */}
      <mesh position={[0, -0.06, 0.22]} castShadow>
        <boxGeometry args={[0.38, 0.16, 0.08]} />
        <meshStandardMaterial color="#1E1C19" roughness={0.4} />
      </mesh>
      {/* Lower VU and controls */}
      {[-0.26, 0.26].map((x) => (
        <mesh key={x} position={[x, -0.36, 0.19]}>
          <boxGeometry args={[0.3, 0.16, 0.02]} />
          <meshStandardMaterial color="#FFF5DC" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, -0.56, 0.2]} castShadow>
        <boxGeometry args={[0.84, 0.09, 0.05]} />
        <meshStandardMaterial color="#B54722" roughness={0.4} />
      </mesh>
    </group>
  );
}

function RetroWalkman({ active }: { active: boolean }) {
  const spoolRef = useRef<Group>(null);
  const reducedMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (!reducedMotion) {
      const speed = active ? 3.0 : 0.8;
      if (spoolRef.current) spoolRef.current.rotation.z += delta * speed;
    }
  });

  return (
    <group rotation={[0.1, -0.15, -0.05]}>
      {/* Signature Blue Body (Sony TPS style) */}
      <RoundedBox args={[0.96, 1.42, 0.38]} radius={0.08} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#2B4D6F" roughness={0.45} metalness={0.25} />
      </RoundedBox>
      {/* Silver Aluminum Top and Faceplate Plate */}
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[0.96, 0.18, 0.38]} />
        <meshStandardMaterial color="#C8C0B2" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Front Cassette Window Door */}
      <mesh position={[-0.04, -0.08, 0.2]} castShadow>
        <boxGeometry args={[0.68, 0.82, 0.04]} />
        <meshStandardMaterial color="#1B2B3A" roughness={0.5} />
      </mesh>
      {/* Clear Tinted Viewing Window */}
      <mesh position={[-0.04, -0.08, 0.22]}>
        <boxGeometry args={[0.54, 0.34, 0.02]} />
        <meshStandardMaterial color="#0A1218" roughness={0.2} transparent opacity={0.85} />
      </mesh>
      {/* Mini Cassette Spools visible inside window */}
      <group ref={spoolRef} position={[-0.16, -0.08, 0.24]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
          <meshStandardMaterial color="#FFF9E6" roughness={0.5} />
        </mesh>
      </group>
      <group position={[0.08, -0.08, 0.24]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
          <meshStandardMaterial color="#FFF9E6" roughness={0.5} />
        </mesh>
      </group>
      {/* Signature Orange HOT LINE Button */}
      <mesh position={[-0.32, 0.68, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />
        <meshStandardMaterial color="#D95A2B" roughness={0.4} />
      </mesh>
      {/* Top Transport Keys */}
      {[-0.06, 0.1, 0.26].map((x) => (
        <mesh key={x} position={[x, 0.72, 0]} castShadow>
          <boxGeometry args={[0.11, 0.06, 0.16]} />
          <meshStandardMaterial color="#888176" roughness={0.3} metalness={0.4} />
        </mesh>
      ))}
      {/* Dual Headphone Jacks */}
      {[-0.2, -0.32].map((x) => (
        <mesh key={x} position={[x, 0.71, 0.1]}>
          <cylinderGeometry args={[0.028, 0.028, 0.02, 12]} />
          <meshStandardMaterial color="#11100E" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function StudioMicrophone({ active }: { active: boolean }) {
  return (
    <group rotation={[0.08, -0.2, 0]}>
      {/* Heavy Desktop Circular Base */}
      <mesh position={[0, -0.58, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.48, 0.54, 0.1, 36]} />
        <meshStandardMaterial color="#2B2824" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Chrome Vertical Stem */}
      <mesh position={[0, -0.26, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.54, 20]} />
        <meshStandardMaterial color="#D0CAC0" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Mechanical Swivel Joint */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[0.16, 0.1, 0.14]} />
        <meshStandardMaterial color="#2B2824" roughness={0.4} />
      </mesh>
      {/* Vintage Dynamic Teardrop Ribbed Mic Head */}
      <group position={[0, 0.36, 0]} rotation={[0.15, 0, 0]}>
        {/* Inner acoustic core */}
        <mesh>
          <boxGeometry args={[0.42, 0.52, 0.36]} />
          <meshStandardMaterial color={active ? "#B54722" : "#1A222C"} roughness={0.7} />
        </mesh>
        {/* Chrome rib louvers / grille */}
        {[-0.2, -0.12, -0.04, 0.04, 0.12, 0.2].map((y) => (
          <mesh key={y} position={[0, y, 0]} castShadow>
            <boxGeometry args={[0.46, 0.035, 0.39]} />
            <meshStandardMaterial color="#DCD7CE" roughness={0.2} metalness={0.75} />
          </mesh>
        ))}
        {/* Center vertical chrome spine */}
        <mesh position={[0, 0, 0.19]} castShadow>
          <boxGeometry args={[0.05, 0.56, 0.04]} />
          <meshStandardMaterial color="#DCD7CE" roughness={0.2} metalness={0.75} />
        </mesh>
      </group>
    </group>
  );
}

function StudioMonitor({ active }: { active: boolean }) {
  const coneRef = useRef<Group>(null);
  const reducedMotion = useReducedMotion();

  useFrame(() => {
    if (!reducedMotion && coneRef.current) {
      const pulse = active ? Math.sin(Date.now() * 0.012) * 0.04 : 0;
      coneRef.current.position.z = 0.36 + pulse;
    }
  });

  return (
    <group rotation={[0.06, 0.08, 0]}>
      {/* Rich Walnut Cabinet */}
      <RoundedBox args={[1.16, 1.48, 0.72]} radius={0.07} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#5E3823" roughness={0.65} />
      </RoundedBox>
      {/* Front Matte Baffle */}
      <mesh position={[0, 0, 0.34]} castShadow>
        <boxGeometry args={[1.04, 1.36, 0.04]} />
        <meshStandardMaterial color="#1E1C1A" roughness={0.7} />
      </mesh>
      {/* Silk Dome Tweeter */}
      <group position={[0, 0.36, 0.36]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.03, 32]} />
          <meshStandardMaterial color="#2B2824" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <sphereGeometry args={[0.08, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#D8CAB7" roughness={0.3} metalness={0.4} />
        </mesh>
      </group>
      {/* Large Paper Cone Woofer */}
      <group ref={coneRef} position={[0, -0.22, 0.36]}>
        <mesh>
          <torusGeometry args={[0.34, 0.04, 16, 48]} />
          <meshStandardMaterial color="#141312" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.1, 0.08, 36, 1, true]} />
          <meshStandardMaterial color="#FFF9ED" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <sphereGeometry args={[0.1, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#2B2824" roughness={0.5} />
        </mesh>
      </group>
      {/* Bass Reflex Port */}
      <mesh position={[0.34, 0.44, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 24]} />
        <meshStandardMaterial color="#0A0908" roughness={0.9} />
      </mesh>
      {/* Front Badge */}
      <mesh position={[-0.28, 0.44, 0.365]}>
        <boxGeometry args={[0.14, 0.05, 0.01]} />
        <meshStandardMaterial color="#B54722" roughness={0.4} />
      </mesh>
    </group>
  );
}

const positions: Record<InterestId, [number, number, number]> = {
  programming: [-2.05, 0.08, 0.45],
  ai: [0, 0.08, -1.35],
  web3: [2.05, 0.08, 0.35],
  gaming: [-1.25, 0.08, -1.65],
  technology: [1.25, 0.08, -1.65],
  music: [0, 0.08, 1.35],
};

const objectById: Record<InterestId, ({ active }: { active: boolean }) => ReactNode> = {
  programming: VintageSynthesizer,
  ai: AnalogMixer,
  web3: ReelToReelTapeDeck,
  gaming: RetroWalkman,
  technology: StudioMicrophone,
  music: StudioMonitor,
};

type InterestSceneProps = {
  interests: Interest[];
  selectedId: InterestId;
  onSelect: (id: InterestId) => void;
};

export function InterestScene({ interests, selectedId, onSelect }: InterestSceneProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, 1.85, 6.1], fov: 38 }}
      dpr={[1, 1.4]}
      frameloop={reducedMotion ? "demand" : "always"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows
      fallback={
        <div className="grid aspect-square w-full place-items-center rounded-full border border-ink/25 font-display text-7xl text-accent">
          A
        </div>
      }
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 6, 4]} intensity={3.4} color="#FFF1D6" castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={1.2} color="#BDB09C" />
      {interests.map((interest) => {
        const ObjectModel = objectById[interest.id];
        const isSelected = interest.id === selectedId;

        return (
          <InteractiveObject
            key={interest.id}
            id={interest.id}
            position={positions[interest.id]}
            selected={isSelected}
            onSelect={onSelect}
          >
            <ObjectModel active={isSelected} />
          </InteractiveObject>
        );
      })}
      <ContactShadows
        position={[0, -0.72, 0]}
        opacity={0.34}
        scale={8}
        blur={2.4}
        far={4}
        color="#3A2D20"
      />
    </Canvas>
  );
}
