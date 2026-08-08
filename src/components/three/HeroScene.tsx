import { useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { Float, Html, Icosahedron, Line, Torus, Sphere } from "@react-three/drei";
import * as THREE from "three";

const TECH_TAGS = ["React", "Next.js", "TypeScript", "Tailwind", "Node.js", "MongoDB"];

function Core() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const { x, y } = state.pointer;
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.6, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.4, 0.05);
    }
    if (rings.current) {
      // Continuous, never-stopping spin for the orbit rings.
      rings.current.rotation.z += delta * 0.45;
      rings.current.rotation.y += delta * 0.18;
    }
    if (inner.current) {
      inner.current.rotation.y += delta * 0.35;
      inner.current.rotation.x += delta * 0.12;
    }
  });

  return (
    <group ref={group}>
      {/* Glowing wireframe shell */}
      <Icosahedron args={[1.55, 1]}>
        <meshBasicMaterial wireframe color="#5ee7f5" transparent opacity={0.35} />
      </Icosahedron>

      {/* Inner faceted core */}
      <Icosahedron ref={inner as never} args={[1.02, 0]}>
        <meshStandardMaterial
          color="#7c5cff"
          roughness={0.15}
          metalness={0.85}
          emissive="#2a1a6b"
          emissiveIntensity={0.7}
        />
      </Icosahedron>

      {/* Orbit rings — always rotating */}
      <group ref={rings}>
        <Torus args={[2.15, 0.008, 12, 128]} rotation={[Math.PI / 2.4, 0, 0]}>
          <meshBasicMaterial color="#5ee7f5" transparent opacity={0.55} />
        </Torus>
        <Torus args={[2.5, 0.006, 12, 128]} rotation={[Math.PI / 1.7, 0.5, 0]}>
          <meshBasicMaterial color="#c084fc" transparent opacity={0.45} />
        </Torus>
        <TechTags />
      </group>

      <OrbitDots />
    </group>
  );
}

function TechTags() {
  // Sit on the same ring as the first Torus (radius 2.15) and share its
  // exact orientation, so the tags stay visually "attached" to the wire ring
  // as it spins, instead of drifting on their own independent rotation.
  const radius = 2.15;
  return (
    <group rotation={[Math.PI / 2.4, 0, 0]}>
      {TECH_TAGS.map((tag, i) => {
        const angle = (i / TECH_TAGS.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <group key={tag} position={[x, y, 0]}>
            {/* No distanceFactor: keeps a fixed CSS pixel size regardless of
                how close the tag orbits to the camera, so it no longer grows
                as it swings toward the front. */}
            <Html center occlude={false} zIndexRange={[10, 0]}>
              <span
                className="whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm"
                style={{
                  background: "rgba(10, 12, 20, 0.55)",
                  borderColor: "rgba(94, 231, 245, 0.35)",
                  color: "#bff2fa",
                }}
              >
                {tag}
              </span>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function OrbitDots() {
  const g = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (g.current) g.current.rotation.z += d * 0.4;
  });
  const dots = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return [Math.cos(a) * 2.15, Math.sin(a) * 2.15, 0] as [number, number, number];
  });
  return (
    <group ref={g} rotation={[Math.PI / 2.4, 0, 0]}>
      {dots.map((p, i) => (
        <Sphere key={i} args={[0.035, 10, 10]} position={p}>
          <meshBasicMaterial color={i % 3 === 0 ? "#c084fc" : "#5ee7f5"} />
        </Sphere>
      ))}
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 220;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  useFrame((state, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * 0.03;
    // Subtle mouse parallax — the field drifts opposite the cursor,
    // giving a sense of depth without being distracting.
    const targetX = -state.pointer.x * 0.4;
    const targetY = -state.pointer.y * 0.25;
    ref.current.rotation.x += (targetY - ref.current.rotation.x) * 0.02;
    ref.current.position.x += (targetX - ref.current.position.x) * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#7fe7ff" transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

function Grid() {
  const lines: [number, number, number][][] = [];
  for (let i = -5; i <= 5; i++) {
    lines.push([
      [i, -2.6, -5],
      [i, -2.6, 5],
    ]);
    lines.push([
      [-5, -2.6, i],
      [5, -2.6, i],
    ]);
  }
  return (
    <group>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color="#3ec8e0" transparent opacity={0.12} lineWidth={1} />
      ))}
    </group>
  );
}

/**
 * Reads a mutable scroll-progress ref (0 → 1, how far the Hero section has
 * scrolled past) every frame and eases the whole scene's zoom + tilt to
 * match — no React re-renders on scroll, so this stays smooth.
 */
function ScrollDrivenGroup({
  scrollProgress,
  children,
  ...props
}: ThreeElements["group"] & { scrollProgress?: React.RefObject<number> | undefined }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current) return;
    const p = scrollProgress?.current ?? 0;
    const targetScale = 1 - p * 0.22;
    const targetRotX = p * 0.35;
    const targetZ = -p * 1.1;
    g.current.scale.x += (targetScale - g.current.scale.x) * 0.06;
    g.current.scale.y += (targetScale - g.current.scale.y) * 0.06;
    g.current.scale.z += (targetScale - g.current.scale.z) * 0.06;
    g.current.rotation.x += (targetRotX - g.current.rotation.x) * 0.06;
    g.current.position.z += (targetZ - g.current.position.z) * 0.06;
  });
  return (
    <group ref={g} {...props}>
      {children}
    </group>
  );
}

export default function HeroScene({
  scrollProgress,
  ...props
}: ThreeElements["group"] & { scrollProgress?: React.RefObject<number> }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 4, 5]} intensity={45} color="#5ee7f5" />
      <pointLight position={[-5, -3, 2]} intensity={35} color="#c084fc" />
      <ScrollDrivenGroup scrollProgress={scrollProgress} {...props}>
        <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.7}>
          <Core />
        </Float>
        <Particles />
        <Grid />
      </ScrollDrivenGroup>
    </Canvas>
  );
}
