// components/gallery-3d.tsx
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sphere } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type Artwork3D = {
  id: number;
  title: string;
  image_url: string;
};

type ViewMode = 'rings' | 'spiral';

// ============================================
// РАСПРЕДЕЛЕНИЕ КАРТОЧЕК ПО СФЕРЕ
// ============================================
function generateSpherePositions(count: number): [number, number, number][] {
  const result: [number, number, number][] = [];
  const radius = 7;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radiusAtY * radius;
    const z = Math.sin(theta) * radiusAtY * radius;
    const yPos = y * radius;

    result.push([x, yPos, z]);
  }

  return result;
}

// ============================================
// РАСПРЕДЕЛЕНИЕ КАРТОЧЕК ПО СПИРАЛИ
// ============================================
function generateSpiralPositions(count: number): [number, number, number][] {
  const result: [number, number, number][] = [];
  const radius = 5;
  const height = 14;
  const turns = 2.5;

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const angle = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * height;
    const r = radius * (1 - t * 0.4); // сужается к верху

    result.push([Math.cos(angle) * r, y, Math.sin(angle) * r]);
  }

  return result;
}

// ============================================
// КАРТОЧКА
// ============================================
function Card({
  artwork,
  basePosition,
  baseScale,
  scrollOffset,
  onHover,
}: {
  artwork: Artwork3D;
  basePosition: [number, number, number];
  baseScale: number;
  scrollOffset: React.MutableRefObject<number>;
  onHover: (hovering: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(artwork.image_url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, [artwork.image_url]);

  useFrame(() => {
    if (!groupRef.current) return;

    const range = 14;
    let y = basePosition[1] + scrollOffset.current;
    while (y > range) y -= range * 2;
    while (y < -range) y += range * 2;

    groupRef.current.position.set(basePosition[0], y, basePosition[2]);
    groupRef.current.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef} position={basePosition}>
      <mesh
        onClick={() => router.push(`/artwork/${artwork.id}`)}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(false);
        }}
        scale={hovered ? baseScale * 1.2 : baseScale}
      >
        <planeGeometry args={[1.8, 2.4]} />
        {texture ? (
          <meshBasicMaterial
            map={texture}
            transparent
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        ) : (
          <meshStandardMaterial color="#6C63FF" transparent opacity={0.5} />
        )}
      </mesh>

      {hovered && (
        <Html center style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          <div className="rounded-full bg-black/80 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            {artwork.title}
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================
// ЦЕНТРАЛЬНЫЙ ШАР
// ============================================
function CenterOrb() {
  const groupRef = useRef<THREE.Group>(null);

  const dots = useMemo(() => {
    const result: Array<[number, number, number]> = [];
    const count = 80;
    const radius = 0.9;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radiusAtY * radius;
      const z = Math.sin(theta) * radiusAtY * radius;
      result.push([x, y * radius, z]);
    }
    return result;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial
            color={
              i % 3 === 0 ? '#B794F6' : i % 3 === 1 ? '#6C63FF' : '#4FD1C5'
            }
            toneMapped={false}
          />
        </mesh>
      ))}

      <Sphere args={[0.4, 32, 32]}>
        <meshBasicMaterial
          color="#B794F6"
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </Sphere>

      <pointLight
        position={[0, 0, 0]}
        color="#6C63FF"
        intensity={6}
        distance={15}
      />
      <pointLight
        position={[0, 0, 0]}
        color="#B794F6"
        intensity={4}
        distance={20}
      />
    </group>
  );
}

// ============================================
// ГРУППА КАРТОЧЕК
// ============================================
function CardsGroup({
  artworks,
  mode,
  onHover,
}: {
  artworks: Artwork3D[];
  mode: ViewMode;
  onHover: (hovering: boolean) => void;
}) {
  const scrollOffset = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      velocityRef.current += e.deltaY * 0.0008;
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // 🎯 Позиции зависят от режима
  const positions = useMemo(
    () =>
      mode === 'rings'
        ? generateSpherePositions(artworks.length)
        : generateSpiralPositions(artworks.length),
    [artworks.length, mode],
  );

  const scales = useMemo(
    () => artworks.map(() => 0.5 + Math.random() * 0.5),
    [artworks.length],
  );

  useFrame(() => {
    scrollOffset.current += velocityRef.current;
    velocityRef.current *= 0.95;
  });

  return (
    <group>
      {artworks.map((artwork, i) => (
        <Card
          key={artwork.id}
          artwork={artwork}
          basePosition={positions[i]}
          baseScale={scales[i]}
          scrollOffset={scrollOffset}
          onHover={onHover}
        />
      ))}
    </group>
  );
}

// ============================================
// ГЛАВНЫЙ КОМПОНЕНТ
// ============================================
export function Gallery3D({ artworks }: { artworks: Artwork3D[] }) {
  const [mode, setMode] = useState<ViewMode>('rings');
  const [hovering, setHovering] = useState(false);

  if (artworks.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-white/60">
        Пока нет работ в галактике 😢
      </div>
    );
  }

  return (
    <div
      className={`relative h-screen w-full ${hovering ? 'cursor-pointer' : ''}`}
    >
      <div className="absolute left-1/2 top-24 z-10 -translate-x-1/2">
        <div className="glass flex gap-1 rounded-full p-1">
          <button
            onClick={() => setMode('rings')}
            className={`relative rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
              mode === 'rings' ? 'text-white' : 'text-white/50'
            }`}
          >
            {mode === 'rings' && (
              <motion.div
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full border border-white/20 bg-gradient-to-r from-[#6C63FF]/30 to-[#B794F6]/30"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">СФЕРА</span>
          </button>
          <button
            onClick={() => setMode('spiral')}
            className={`relative rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
              mode === 'spiral' ? 'text-white' : 'text-white/50'
            }`}
          >
            {mode === 'spiral' && (
              <motion.div
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full border border-white/20 bg-gradient-to-r from-[#6C63FF]/30 to-[#B794F6]/30"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">СПИРАЛЬ</span>
          </button>
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 0.1], fov: 80 }}>
        <ambientLight intensity={1} />

        <CenterOrb />
        <CardsGroup artworks={artworks} mode={mode} onHover={setHovering} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.3}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(Math.PI * 2) / 3}
        />
      </Canvas>

      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm text-white/40"
        >
          Скролль, чтобы лететь
        </motion.div>
      </div>
    </div>
  );
}