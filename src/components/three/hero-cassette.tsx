"use client";

import { ContactShadows, PresentationControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Group,
  MathUtils,
  MeshStandardMaterial,
} from "three";
import { createCassetteLabelTexture } from "./cassette-label-texture";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Spool Hub with internal teeth / gear cogs characteristic of analog cassette tapes.
 */
function CassetteSpool({
  tapeRadius,
  rotationRef,
}: {
  tapeRadius: number;
  rotationRef: React.MutableRefObject<number>;
}) {
  const hubRef = useRef<Group>(null);

  useFrame(() => {
    if (hubRef.current) {
      hubRef.current.rotation.z = rotationRef.current;
    }
  });

  return (
    <group ref={hubRef}>
      {/* Magnetic Tape Ribbon Roll (Dark Glossy Chocolate Brown) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[tapeRadius, tapeRadius, 0.22, 64]} />
        <meshStandardMaterial
          color="#1F120A"
          roughness={0.25}
          metalness={0.25}
        />
      </mesh>

      {/* White Plastic Hub Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.25, 48]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Spindle Center Hole (Negative Space) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.165, 0.165, 0.27, 32]} />
        <meshStandardMaterial color="#0A0908" roughness={0.9} />
      </mesh>

      {/* 6 Drive Teeth inside the hub */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * 0.20;
        const y = Math.sin(angle) * 0.20;
        return (
          <mesh
            key={i}
            position={[x, y, 0]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.075, 0.05, 0.26]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.05} />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * Metallic Corner Screw
 */
function CassetteScrew({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.046, 0.046, 0.39, 16]} />
        <meshStandardMaterial
          color="#C2B7AA"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      {/* Screw head slot groove */}
      <mesh position={[0, 0, 0.196]}>
        <boxGeometry args={[0.075, 0.015, 0.01]} />
        <meshStandardMaterial color="#2E2822" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, -0.196]}>
        <boxGeometry args={[0.075, 0.015, 0.01]} />
        <meshStandardMaterial color="#2E2822" roughness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * Complete 3D Cassette Tape Model
 */
function CassetteModel({
  onRewindComplete,
  isHovered,
  setIsHovered,
}: {
  onRewindComplete?: () => void;
  isHovered: boolean;
  setIsHovered: (val: boolean) => void;
}) {
  const rootGroupRef = useRef<Group>(null);
  const cassetteBodyRef = useRef<Group>(null);
  const reducedMotion = useReducedMotion();

  // Entrance & animation states
  const entranceProgress = useRef(0);
  const spoolRotation = useRef(0);
  const [textures] = useState(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      return {
        a: createCassetteLabelTexture("A"),
        b: createCassetteLabelTexture("B"),
      };
    }
    return null;
  });

  useEffect(() => {
    return () => {
      textures?.a.dispose();
      textures?.b.dispose();
    };
  }, [textures]);

  const textureA = textures?.a ?? null;
  const textureB = textures?.b ?? null;

  // Frame Loop: Handles Tape Rewind Entrance & Interactive Cursor Dynamics
  useFrame((state, delta) => {
    if (!rootGroupRef.current || !cassetteBodyRef.current) return;

    const dt = Math.min(delta, 0.1);

    if (reducedMotion) {
      cassetteBodyRef.current.position.set(0, 0, 0);
      cassetteBodyRef.current.rotation.set(0, 0, 0);
      return;
    }

    // 1. Entrance Rewind Animation Phase
    if (entranceProgress.current < 1) {
      entranceProgress.current += dt * 0.48;
      if (entranceProgress.current >= 1) {
        entranceProgress.current = 1;
        onRewindComplete?.();
      }

      const p = entranceProgress.current;
      // Fast rewind rotation (spools spinning backwards fast, easing to zero)
      const rewindSpeed = MathUtils.lerp(50, 0, Math.pow(p, 2.2));
      spoolRotation.current -= rewindSpeed * dt;

      // Entrance swoop & settle
      const startRotX = -0.42;
      const startRotY = 0.65;
      const startZ = -1.5;

      const ease = 1 - Math.pow(1 - p, 3);
      rootGroupRef.current.position.z = MathUtils.lerp(startZ, 0, ease);
      rootGroupRef.current.rotation.x = MathUtils.lerp(startRotX, 0, ease);
      rootGroupRef.current.rotation.y = MathUtils.lerp(startRotY, 0, ease);
    } else {
      // 2. Interactive Playback / Idle Spin
      const playbackSpeed = isHovered ? 4.8 : 0.95;
      spoolRotation.current += playbackSpeed * dt;

      // Subtle levitation / floating breathing effect
      const floatY = Math.sin(state.clock.elapsedTime * 1.6) * 0.055;
      rootGroupRef.current.position.y = MathUtils.damp(
        rootGroupRef.current.position.y,
        floatY,
        4,
        dt,
      );

      // Interactive Cursor Parallax Tilt
      const targetRotY = state.pointer.x * 0.28;
      const targetRotX = -state.pointer.y * 0.2;
      cassetteBodyRef.current.rotation.y = MathUtils.damp(
        cassetteBodyRef.current.rotation.y,
        targetRotY,
        5,
        dt,
      );
      cassetteBodyRef.current.rotation.x = MathUtils.damp(
        cassetteBodyRef.current.rotation.x,
        targetRotX,
        5,
        dt,
      );
    }
  });

  // Materials
  const shellMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#181614",
        roughness: 0.25,
        metalness: 0.18,
      }),
    [],
  );

  const windowGlassMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#F0E4D2",
        roughness: 0.08,
        metalness: 0.05,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      }),
    [],
  );

  return (
    <PresentationControls
      cursor
      snap
      rotation={[0.04, -0.16, 0]}
      polar={[-0.22, 0.22]}
      azimuth={[-0.45, 0.45]}
    >
      <group ref={rootGroupRef}>
        <group ref={cassetteBodyRef} scale={0.82} position={[0, 0.08, 0]}>
          {/* Invisible interactive Hitbox to guarantee reliable raycasting and hover */}
          <mesh
            visible={false}
            position={[0, 0, 0]}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              setIsHovered(true);
            }}
            onPointerOut={() => setIsHovered(false)}
          >
            <boxGeometry args={[4.2, 2.7, 0.6]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          {/* Hollow Cassette Shell Body: Top, Bottom, Left, Right Sections */}
          {/* Top Frame */}
          <RoundedBox
            args={[3.85, 0.76, 0.36]}
            radius={0.08}
            smoothness={3}
            position={[0, 0.85, 0]}
            castShadow
            receiveShadow
          >
            <primitive object={shellMaterial} attach="material" />
          </RoundedBox>

          {/* Bottom Frame */}
          <RoundedBox
            args={[3.85, 0.72, 0.36]}
            radius={0.08}
            smoothness={3}
            position={[0, -0.74, 0]}
            castShadow
            receiveShadow
          >
            <primitive object={shellMaterial} attach="material" />
          </RoundedBox>

          {/* Left Frame */}
          <mesh position={[-1.48, 0.06, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.89, 0.95, 0.36]} />
            <primitive object={shellMaterial} attach="material" />
          </mesh>

          {/* Right Frame */}
          <mesh position={[1.48, 0.06, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.89, 0.95, 0.36]} />
            <primitive object={shellMaterial} attach="material" />
          </mesh>

          {/* Bottom Tapered Reader Section (Tape Head Access) */}
          <RoundedBox
            args={[2.65, 0.44, 0.4]}
            radius={0.05}
            smoothness={3}
            position={[0, -1.04, 0]}
            castShadow
            receiveShadow
          >
            <primitive object={shellMaterial} attach="material" />
          </RoundedBox>

          {/* Bottom Tape Opening Cutout */}
          <mesh position={[0, -1.22, 0]}>
            <boxGeometry args={[1.65, 0.14, 0.34]} />
            <meshStandardMaterial color="#0A0908" roughness={0.9} />
          </mesh>

          {/* Exposed Magnetic Tape Strip at Bottom */}
          <mesh position={[0, -1.2, 0]}>
            <boxGeometry args={[1.58, 0.045, 0.14]} />
            <meshStandardMaterial
              color="#22120A"
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>

          {/* Center Bronze Shield & Felt Pressure Pad */}
          <mesh position={[0, -1.16, 0]}>
            <boxGeometry args={[0.26, 0.05, 0.18]} />
            <meshStandardMaterial
              color="#B4783E"
              roughness={0.35}
              metalness={0.75}
            />
          </mesh>
          <mesh position={[0, -1.19, 0]}>
            <boxGeometry args={[0.14, 0.025, 0.12]} />
            <meshStandardMaterial color="#8E857A" roughness={0.9} />
          </mesh>

          {/* Drive Capstan Guide Holes in Bottom Section */}
          {[-0.85, 0.85].map((x) => (
            <mesh
              key={x}
              position={[x, -1.04, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.09, 0.09, 0.42, 24]} />
              <meshStandardMaterial color="#0A0908" roughness={0.95} />
            </mesh>
          ))}

          {/* Brass Guide Rollers (Left & Right Bottom Corners) */}
          {[-1.12, 1.12].map((x) => (
            <mesh
              key={x}
              position={[x, -1.04, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.065, 0.065, 0.42, 24]} />
              <meshStandardMaterial
                color="#D49B48"
                metalness={0.85}
                roughness={0.25}
              />
            </mesh>
          ))}

          {/* Top Notch Tabs (Write Protect Tabs) */}
          {[-1.68, 1.68].map((x) => (
            <mesh key={x} position={[x, 1.2, 0]}>
              <boxGeometry args={[0.22, 0.1, 0.3]} />
              <meshStandardMaterial color="#0E0D0B" roughness={0.7} />
            </mesh>
          ))}

          {/* Central Transparent Viewing Window Panes (Front & Back) */}
          <mesh position={[0, 0.06, 0.181]}>
            <planeGeometry args={[2.08, 0.95]} />
            <primitive object={windowGlassMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.06, -0.181]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[2.08, 0.95]} />
            <primitive object={windowGlassMaterial} attach="material" />
          </mesh>

          {/* Internal Tape Spools: Now completely in the hollow opening, illuminated cleanly! */}
          <group position={[-0.85, 0.06, 0]}>
            <CassetteSpool
              tapeRadius={0.57}
              rotationRef={spoolRotation}
            />
          </group>
          <group position={[0.85, 0.06, 0]}>
            <CassetteSpool
              tapeRadius={0.42}
              rotationRef={spoolRotation}
            />
          </group>

          {/* Diagonal Tape Paths Connecting Spools to Rollers */}
          <mesh
            position={[-0.98, -0.48, 0]}
            rotation={[0, 0, -0.4]}
          >
            <boxGeometry args={[0.02, 0.92, 0.2]} />
            <meshStandardMaterial
              color="#1F120A"
              roughness={0.25}
              metalness={0.25}
            />
          </mesh>
          <mesh
            position={[0.98, -0.48, 0]}
            rotation={[0, 0, 0.4]}
          >
            <boxGeometry args={[0.02, 0.92, 0.2]} />
            <meshStandardMaterial
              color="#1F120A"
              roughness={0.25}
              metalness={0.25}
            />
          </mesh>

          {/* Front Label (Side A) */}
          {textureA && (
            <mesh position={[0, 0.08, 0.184]}>
              <planeGeometry args={[3.55, 2.02]} />
              <meshStandardMaterial
                map={textureA}
                roughness={0.72}
                metalness={0.04}
                transparent
                alphaTest={0.05}
              />
            </mesh>
          )}

          {/* Back Label (Side B) */}
          {textureB && (
            <mesh
              position={[0, 0.08, -0.184]}
              rotation={[0, Math.PI, 0]}
            >
              <planeGeometry args={[3.55, 2.02]} />
              <meshStandardMaterial
                map={textureB}
                roughness={0.72}
                metalness={0.04}
                transparent
                alphaTest={0.05}
              />
            </mesh>
          )}

          {/* 5 Precision Screws (4 corners + 1 top-middle) */}
          <CassetteScrew position={[-1.72, 1.02, 0]} />
          <CassetteScrew position={[1.72, 1.02, 0]} />
          <CassetteScrew position={[-1.72, -0.96, 0]} />
          <CassetteScrew position={[1.72, -0.96, 0]} />
          <CassetteScrew position={[0, 1.06, 0]} />
        </group>
      </group>
    </PresentationControls>
  );
}

/**
 * HeroCassette Canvas Container with Studio Lighting and Shadows
 */
export function HeroCassette() {
  const reducedMotion = useReducedMotion();
  const [isRewinding, setIsRewinding] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative size-full cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0.1, 5.8], fov: 38 }}
        dpr={[1, 1.75]}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        shadows
        fallback={
          <div className="grid aspect-square w-full place-items-center rounded-2xl border border-cream/20 bg-charcoal-soft font-catalog text-sm text-cream/70">
            [ CASSETTE ARCHIVE // ARIL ]
          </div>
        }
      >
        {/* Warm Studio Lighting */}
        <ambientLight intensity={2.0} />
        {/* Warm Key Light */}
        <directionalLight
          position={[4.5, 5, 4.5]}
          intensity={3.8}
          color="#FFF4E0"
          castShadow
        />
        {/* Amber Rim Light */}
        <directionalLight
          position={[-4.5, -2, 2.5]}
          intensity={1.4}
          color="#D49A6A"
        />
        {/* Soft Backlight */}
        <directionalLight
          position={[0, 3, -4]}
          intensity={1.8}
          color="#FFE9C4"
        />
        {/* Interior Spool Accent Light */}
        <pointLight position={[0, 0.1, 1.2]} intensity={1.2} color="#FFF8EB" distance={3.5} />

        <CassetteModel
          onRewindComplete={() => setIsRewinding(false)}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
        />

        {/* Soft Depth Contact Shadow underneath */}
        <ContactShadows
          position={[0, -1.55, 0]}
          opacity={0.65}
          scale={7.2}
          blur={2.5}
          far={3.8}
          color="#000000"
        />
      </Canvas>

      {/* Floating Retro Status HUD */}
      <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-2.5 rounded-full border border-cream/15 bg-charcoal/85 px-3.5 py-1.5 shadow-lg backdrop-blur-md">
        <span
          className={`size-2 rounded-full transition-colors duration-300 ${
            isRewinding
              ? "animate-pulse bg-accent-light"
              : isHovered
                ? "bg-emerald-400"
                : "bg-amber-400"
          }`}
          aria-hidden="true"
        />
        <span className="font-catalog text-[0.68rem] font-bold tracking-[0.14em] text-cream/90">
          {isRewinding
            ? "TAPE REWINDING..."
            : isHovered
              ? "PLAYING // HOVER ACTIVE"
              : "READY // DRAG OR HOVER TAPE"}
        </span>
      </div>
    </div>
  );
}
