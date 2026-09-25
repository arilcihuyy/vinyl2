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

    const targetScale = selected ? 1.14 : hovered ? 1.07 : 1;
    const targetRotation = selected
      ? 0.18
      : hovered
        ? state.pointer.x * 0.12
        : rotation[1];

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
      <mesh position={[0, -0.76, 0]} receiveShadow>
        <cylinderGeometry args={[0.78, 0.86, 0.12, 48]} />
        <meshStandardMaterial
          color={selected ? "#B54722" : "#CFC0A6"}
          roughness={0.74}
        />
      </mesh>
      {children}
    </group>
  );
}

function PatchbayKeyboard() {
  return (
    <group rotation={[-0.16, 0, 0]}>
      <RoundedBox args={[1.45, 0.26, 0.9]} radius={0.08} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#2B2824" roughness={0.56} />
      </RoundedBox>
      {Array.from({ length: 14 }, (_, index) => {
        const row = index < 7 ? 0 : 1;
        const column = index % 7;

        return (
          <mesh
            key={index}
            position={[-0.48 + column * 0.16, 0.2, row * 0.3 - 0.15]}
            castShadow
          >
            <boxGeometry args={[0.12, 0.12, 0.2]} />
            <meshStandardMaterial
              color="#FFF7E8"
              roughness={0.62}
            />
          </mesh>
        );
      })}
      <mesh position={[0, 0.16, -0.32]}>
        <boxGeometry args={[1.1, 0.03, 0.06]} />
        <meshStandardMaterial color="#726A60" roughness={0.58} />
      </mesh>
    </group>
  );
}

function SignalMixer() {
  return (
    <group rotation={[0.08, 0, 0]}>
      <RoundedBox args={[1.35, 0.32, 1.05]} radius={0.08} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#E2D3B8" roughness={0.7} />
      </RoundedBox>
      {[-0.42, -0.14, 0.14, 0.42].map((x) => (
        <group key={x} position={[x, 0.24, -0.12]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.09, 0.11, 0.18, 24]} />
            <meshStandardMaterial color="#2B2824" roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.11, 0]}>
            <boxGeometry args={[0.025, 0.02, 0.13]} />
            <meshStandardMaterial color="#FFF7E8" roughness={0.5} />
          </mesh>
        </group>
      ))}
      {[-0.32, 0, 0.32].map((x) => (
        <group key={x} position={[x, 0.19, 0.28]}>
          <mesh position={[0, 0, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.36, 12]} />
            <meshStandardMaterial color="#726A60" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.08, 0.04]}>
            <boxGeometry args={[0.12, 0.07, 0.07]} />
            <meshStandardMaterial color="#2B2824" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ChainLinks() {
  return (
    <group rotation={[0.2, 0, 0.18]}>
      {[-0.34, 0, 0.34].map((x, index) => (
        <mesh
          key={x}
          position={[x, index === 1 ? 0.16 : 0, 0]}
          rotation={[Math.PI / 2, index % 2 === 0 ? 0.25 : -0.25, 0]}
          castShadow
        >
          <torusGeometry args={[0.31, 0.095, 18, 48]} />
          <meshStandardMaterial
            color="#2B2824"
            roughness={0.34}
            metalness={0.28}
          />
        </mesh>
      ))}
    </group>
  );
}

function GameCartridge() {
  return (
    <group rotation={[0.12, -0.08, -0.1]}>
      <RoundedBox args={[0.92, 1.3, 0.34]} radius={0.09} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#2B2824" roughness={0.58} />
      </RoundedBox>
      <mesh position={[0, 0.1, 0.2]}>
        <boxGeometry args={[0.68, 0.72, 0.06]} />
        <meshStandardMaterial color="#E2D3B8" roughness={0.76} />
      </mesh>
      <mesh position={[0, 0.14, 0.245]}>
        <boxGeometry args={[0.48, 0.08, 0.03]} />
        <meshStandardMaterial color="#FFF7E8" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.51, 0.19]}>
        <boxGeometry args={[0.6, 0.12, 0.04]} />
        <meshStandardMaterial color="#726A60" roughness={0.7} />
      </mesh>
    </group>
  );
}

function CircuitBoard() {
  return (
    <group rotation={[-0.2, 0, 0]}>
      <RoundedBox args={[1.45, 0.14, 1.05]} radius={0.08} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#2B2824" roughness={0.65} />
      </RoundedBox>
      <mesh position={[0, 0.14, 0]} castShadow>
        <boxGeometry args={[0.42, 0.18, 0.42]} />
        <meshStandardMaterial color="#E2D3B8" roughness={0.52} />
      </mesh>
      {[-0.48, 0, 0.48].map((x) => (
        <mesh key={x} position={[x, 0.1, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.4, 12]} />
          <meshStandardMaterial color="#D8CAB7" roughness={0.44} metalness={0.24} />
        </mesh>
      ))}
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.09, -0.28]}>
          <boxGeometry args={[0.04, 0.04, 0.5]} />
          <meshStandardMaterial color="#FFF7E8" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function SpeakerAndRecord() {
  return (
    <group rotation={[0.08, 0.05, 0]}>
      <RoundedBox args={[1.12, 1.25, 0.7]} radius={0.09} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#D8C9B4" roughness={0.72} />
      </RoundedBox>
      {[0.28, -0.28].map((y) => (
        <group key={y} position={[0, y, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.27, 0.31, 0.12, 40]} />
            <meshStandardMaterial color="#2B2824" roughness={0.48} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.13, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#FFF7E8" roughness={0.5} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.73, 0.04, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.055, 16, 64]} />
        <meshStandardMaterial color="#2B2824" roughness={0.36} />
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

const objectById: Record<InterestId, () => ReactNode> = {
  programming: PatchbayKeyboard,
  ai: SignalMixer,
  web3: ChainLinks,
  gaming: GameCartridge,
  technology: CircuitBoard,
  music: SpeakerAndRecord,
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
      camera={{ position: [0, 1.25, 6.6], fov: 38 }}
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

        return (
          <InteractiveObject
            key={interest.id}
            id={interest.id}
            position={positions[interest.id]}
            selected={interest.id === selectedId}
            onSelect={onSelect}
          >
            <ObjectModel />
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
