"use client";

import { ContactShadows, PresentationControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CylinderGeometry,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  type CanvasTexture,
} from "three";
import { createTurntableLabelTexture } from "./turntable-label-texture";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { vinylCrackle } from "@/lib/vinyl-crackle";

/**
 * Vinyl Disc with concentric grooves and center record label
 */
function VinylRecord({
  labelTexture,
  isSpinning,
}: {
  labelTexture: CanvasTexture;
  isSpinning: boolean;
}) {
  const vinylRef = useRef<Group>(null);
  const spinSpeedRef = useRef(0);

  useFrame((_, delta) => {
    if (!vinylRef.current) return;
    const targetSpeed = isSpinning ? 3.48 : 0; // ~33.3 RPM
    spinSpeedRef.current = MathUtils.damp(spinSpeedRef.current, targetSpeed, 3.5, delta);
    vinylRef.current.rotation.y += spinSpeedRef.current * delta;
  });

  return (
    <group ref={vinylRef} position={[0, 0.16, 0]}>
      {/* Heavy Platter Base (Cast Aluminum rim with strobe dots) */}
      <mesh position={[0, -0.07, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.56, 1.56, 0.12, 64]} />
        <meshStandardMaterial color="#B0ABA4" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Rubber Slipmat */}
      <mesh position={[0, -0.005, 0]} receiveShadow>
        <cylinderGeometry args={[1.52, 1.52, 0.02, 64]} />
        <meshStandardMaterial color="#1E1C1A" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Vinyl Disc Body (Glossy Obsidian LP) */}
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.48, 1.48, 0.02, 64]} />
        <meshStandardMaterial
          color="#0B0907"
          roughness={0.16}
          metalness={0.4}
        />
      </mesh>

      {/* Realistic Vinyl Micro-Groove Rings */}
      {[0.58, 0.72, 0.86, 1.0, 1.15, 1.30, 1.42].map((radius, i) => (
        <mesh key={i} position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius, 64]} />
          <meshStandardMaterial
            color="#181512"
            roughness={0.28}
            metalness={0.5}
            side={DoubleSide}
          />
        </mesh>
      ))}

      {/* Center Label Sticker */}
      <mesh position={[0, 0.028, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.52, 64]} />
        <meshStandardMaterial
          map={labelTexture}
          roughness={0.4}
          metalness={0.1}
          side={DoubleSide}
        />
      </mesh>

      {/* Center Spindle (Chrome) */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.22, 24]} />
        <meshStandardMaterial color="#E8ECEF" roughness={0.1} metalness={0.95} />
      </mesh>
    </group>
  );
}

/**
 * Mechanical Tonearm Assembly with animated landing onto the vinyl
 */
function TonearmAssembly({ isPlaying }: { isPlaying: boolean }) {
  const armPivotRef = useRef<Group>(null);
  const armLiftRef = useRef<Group>(null);

  // Tonearm angles: Rest post vs playing position on record
  const targetArmY = isPlaying ? 0.38 : -0.22;
  const targetArmTiltX = isPlaying ? 0.02 : -0.06;

  useFrame((_, delta) => {
    if (armPivotRef.current) {
      armPivotRef.current.rotation.y = MathUtils.damp(
        armPivotRef.current.rotation.y,
        targetArmY,
        2.5,
        delta,
      );
    }
    if (armLiftRef.current) {
      armLiftRef.current.rotation.x = MathUtils.damp(
        armLiftRef.current.rotation.x,
        targetArmTiltX,
        3.0,
        delta,
      );
    }
  });

  return (
    <group position={[1.42, 0.22, -0.92]}>
      {/* Tonearm Base & Gimbal Bearing Housing */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.22, 0.24, 0.12, 32]} />
        <meshStandardMaterial color="#88827C" roughness={0.25} metalness={0.85} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.14, 24]} />
        <meshStandardMaterial color="#D0CAC2" roughness={0.15} metalness={0.9} />
      </mesh>

      {/* Anti-skate dial knob */}
      <mesh position={[0.14, 0.12, 0.12]}>
        <cylinderGeometry args={[0.045, 0.045, 0.06, 16]} />
        <meshStandardMaterial color="#2B2825" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Tonearm Rest Post & Safety Clip */}
      <group position={[-0.28, 0, 0.28]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.22, 16]} />
          <meshStandardMaterial color="#504A44" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.21, 0]}>
          <boxGeometry args={[0.07, 0.04, 0.07]} />
          <meshStandardMaterial color="#22201D" roughness={0.4} />
        </mesh>
      </group>

      {/* Arm Pivot Base (Rotates horizontally across the record) */}
      <group ref={armPivotRef} position={[0, 0.22, 0]} rotation={[0, -0.22, 0]}>
        {/* Arm Lift Hinge (Tilts vertically onto the groove) */}
        <group ref={armLiftRef} rotation={[-0.06, 0, 0]}>
          {/* Counterweight at the rear */}
          <mesh position={[0, 0, -0.42]}>
            <cylinderGeometry args={[0.11, 0.11, 0.22, 32]} />
            <meshStandardMaterial color="#35312C" roughness={0.35} metalness={0.65} />
          </mesh>
          <mesh position={[0, 0, -0.42]}>
            <cylinderGeometry args={[0.115, 0.115, 0.04, 32]} />
            <meshStandardMaterial color="#DCD7CF" roughness={0.2} metalness={0.85} />
          </mesh>

          {/* S-Shaped Tone Arm Wand (Chrome Tube) */}
          <group position={[0, 0, 0]}>
            {/* Rear straight section */}
            <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.44, 20]} />
              <meshStandardMaterial color="#ECE8E1" roughness={0.15} metalness={0.92} />
            </mesh>

            {/* S-Curve offset section */}
            <mesh position={[-0.14, 0, 0.72]} rotation={[Math.PI / 2, 0, 0.32]}>
              <cylinderGeometry args={[0.022, 0.022, 0.62, 20]} />
              <meshStandardMaterial color="#ECE8E1" roughness={0.15} metalness={0.92} />
            </mesh>

            {/* Forearm angled section extending to stylus */}
            <mesh position={[-0.26, -0.04, 1.42]} rotation={[Math.PI / 2, 0, -0.18]}>
              <cylinderGeometry args={[0.022, 0.022, 0.82, 20]} />
              <meshStandardMaterial color="#ECE8E1" roughness={0.15} metalness={0.92} />
            </mesh>

            {/* Headshell (Matte Charcoal with Gold Logo) */}
            <group position={[-0.32, -0.06, 1.86]} rotation={[0, -0.22, 0]}>
              <mesh>
                <boxGeometry args={[0.12, 0.045, 0.24]} />
                <meshStandardMaterial color="#211E1B" roughness={0.4} metalness={0.3} />
              </mesh>
              {/* Gold Cartridge Body (Audiophile Pickup) */}
              <mesh position={[0, -0.038, 0.02]}>
                <boxGeometry args={[0.09, 0.04, 0.16]} />
                <meshStandardMaterial color="#C59E47" roughness={0.25} metalness={0.8} />
              </mesh>
              {/* Stylus needle cantilever */}
              <mesh position={[0, -0.065, 0.07]} rotation={[0.4, 0, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.04, 12]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.95} />
              </mesh>
              {/* Finger lift lever */}
              <mesh position={[0.075, 0.015, -0.02]} rotation={[0, 0, 0.4]}>
                <cylinderGeometry args={[0.008, 0.008, 0.08, 12]} />
                <meshStandardMaterial color="#C59E47" roughness={0.2} metalness={0.8} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

/**
 * 3D Retro Turntable Plinth & Analog Controls
 */
function TurntableUnit({
  isPlaying,
  onTogglePlay,
}: {
  isPlaying: boolean;
  onTogglePlay: () => void;
}) {
  const labelTexture = useMemo(() => createTurntableLabelTexture(), []);

  return (
    <group position={[0, -0.3, 0]}>
      {/* 1. Heavy Wooden Plinth Base (Walnut Wood Grain) */}
      <RoundedBox
        args={[4.4, 0.44, 3.8]}
        radius={0.08}
        smoothness={4}
        position={[0, -0.14, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#382417" roughness={0.65} metalness={0.1} />
      </RoundedBox>

      {/* 2. Brushed Aluminum Metal Top Deck Plate */}
      <RoundedBox
        args={[4.28, 0.05, 3.68]}
        radius={0.04}
        smoothness={4}
        position={[0, 0.1, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#C2B8AC" roughness={0.32} metalness={0.78} />
      </RoundedBox>

      {/* 3. Anti-Vibration Chrome Dampening Feet (4 corners) */}
      {[
        [-1.9, -0.42, -1.6],
        [1.9, -0.42, -1.6],
        [-1.9, -0.42, 1.6],
        [1.9, -0.42, 1.6],
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 0.12, 24]} />
            <meshStandardMaterial color="#DDD8D1" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.06, 24]} />
            <meshStandardMaterial color="#12100E" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 4. Left Recessed Well for Platter */}
      <group position={[-0.45, 0, 0]}>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[1.68, 1.68, 0.03, 64]} />
          <meshStandardMaterial color="#1C1A18" roughness={0.8} />
        </mesh>
        {/* Vinyl Record & Platter */}
        <VinylRecord labelTexture={labelTexture} isSpinning={isPlaying} />
      </group>

      {/* 5. Tonearm Assembly */}
      <TonearmAssembly isPlaying={isPlaying} />

      {/* 6. Stroboscope Target Prism Light Tower (Front Left) */}
      <group position={[-1.85, 0.2, 1.4]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.14, 0.18, 24]} />
          <meshStandardMaterial color="#8C867F" roughness={0.3} metalness={0.85} />
        </mesh>
        {/* Amber Strobe Lamp Window */}
        <mesh position={[0.07, 0.02, -0.05]} rotation={[0, -0.6, 0]}>
          <boxGeometry args={[0.08, 0.08, 0.04]} />
          <meshStandardMaterial
            color={isPlaying ? "#FFA338" : "#553512"}
            emissive={isPlaying ? "#FF8800" : "#000000"}
            emissiveIntensity={isPlaying ? 1.6 : 0}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* 7. Retro Power / Speed Selector Switch */}
      <group
        position={[-1.5, 0.16, 1.45]}
        onClick={(e) => {
          e.stopPropagation();
          onTogglePlay();
        }}
      >
        <mesh>
          <cylinderGeometry args={[0.14, 0.16, 0.08, 32]} />
          <meshStandardMaterial color="#22201D" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.06, 32]} />
          <meshStandardMaterial color="#CDC7BF" roughness={0.2} metalness={0.85} />
        </mesh>
        {/* Toggle Indicator Line */}
        <mesh
          position={[0, 0.095, 0]}
          rotation={[0, isPlaying ? Math.PI / 4 : -Math.PI / 4, 0]}
        >
          <boxGeometry args={[0.02, 0.01, 0.18]} />
          <meshStandardMaterial color="#E85D26" roughness={0.3} />
        </mesh>
      </group>

      {/* 8. Pitch Adjustment Slider (Right Edge) */}
      <group position={[1.75, 0.13, 0.4]}>
        {/* Slider Well */}
        <mesh>
          <boxGeometry args={[0.22, 0.02, 1.0]} />
          <meshStandardMaterial color="#262320" roughness={0.7} />
        </mesh>
        {/* Center line markings */}
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.04, 0.01, 0.9]} />
          <meshStandardMaterial color="#E0DCD6" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Slider Knob */}
        <mesh position={[0, 0.04, isPlaying ? 0.1 : -0.1]}>
          <boxGeometry args={[0.14, 0.06, 0.12]} />
          <meshStandardMaterial color="#322E2B" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* 9. Vintage Engraved Logo Badge */}
      <group position={[0.7, 0.13, 1.45]}>
        <mesh>
          <boxGeometry args={[0.9, 0.02, 0.28]} />
          <meshStandardMaterial color="#C59E47" roughness={0.25} metalness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

export function HeroTurntable() {
  const [isPlaying, setIsPlaying] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleToggle = () => {
    vinylCrackle.playMechanicalClick();
    if (!isPlaying) {
      vinylCrackle.playNeedleDrop();
      vinylCrackle.start(0.08);
      setIsPlaying(true);
    } else {
      vinylCrackle.stop();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      vinylCrackle.stop();
    };
  }, []);

  return (
    <div className="relative h-full w-full select-none cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 3.8, 4.6], fov: 42 }}
        shadows
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[4, 7, 5]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-5, 3, -3]} intensity={0.9} color="#FFE6CC" />
        <pointLight position={[0, 3, 0]} intensity={0.6} color="#FFF8F0" />

        <PresentationControls
          global={false}
          cursor
          speed={1.4}
          zoom={0.95}
          rotation={[0.32, -0.45, 0]}
          polar={[-0.2, 0.7]}
          azimuth={[-1.2, 1.2]}
        >
          <TurntableUnit isPlaying={isPlaying} onTogglePlay={handleToggle} />
        </PresentationControls>

        <ContactShadows
          position={[0, -0.76, 0]}
          opacity={0.65}
          scale={7}
          blur={2.4}
          far={3}
        />
      </Canvas>

      {/* Floating Retro Turntable Status & Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 rounded-full border border-cream/20 bg-charcoal/80 px-3 py-1.5 backdrop-blur-md font-catalog text-xs text-cream shadow-lg">
          <span
            className={`size-2.5 rounded-full transition-colors ${
              isPlaying ? "bg-amber-400 shadow-[0_0_8px_#F59E0B]" : "bg-cream/30"
            }`}
          />
          <span className="font-semibold tracking-wider">
            {isPlaying ? "33⅓ RPM • PLAYING" : "TURNTABLE • IDLE"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className="flex min-h-11 items-center gap-2 rounded-full border border-cream/30 bg-accent px-4 text-xs font-bold tracking-wider text-cream shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-accent"
        >
          {isPlaying ? "LIFT TONEARM" : "DROP NEEDLE"}
        </button>
      </div>
    </div>
  );
}
