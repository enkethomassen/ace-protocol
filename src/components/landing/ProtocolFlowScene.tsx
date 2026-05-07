'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

/*
  ACE Protocol — Premium 3D Flow Animation
  Lightweight R3F scene showing capital flow through the protocol.
  Nodes: Capital Entry → Reserve Shield → Investable Stream → Payment Routing
*/

function PulseRing({ radius, color, speed = 1 }: { radius: number; color: string; speed?: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const s = 1 + Math.sin(clock.getElapsedTime() * speed) * 0.08;
    ringRef.current.scale.set(s, s, s);
    (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(clock.getElapsedTime() * speed) * 0.08;
  });
  return (
    <mesh ref={ringRef} rotation-x={Math.PI / 2}>
      <ringGeometry args={[radius, radius + 0.03, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  );
}

function FlowParticle({ start, end, speed, delay, color }: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  speed: number;
  delay: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(
    start,
    new THREE.Vector3((start.x + end.x) / 2, Math.max(start.y, end.y) + 1.2, (start.z + end.z) / 2),
    end
  ), [start, end]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.getElapsedTime() * speed + delay) % 1);
    const pos = curve.getPoint(t);
    ref.current.position.copy(pos);
    const scale = Math.sin(t * Math.PI) * 0.5 + 0.5;
    ref.current.scale.setScalar(0.08 + scale * 0.06);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} />
    </mesh>
  );
}

function ConnectionCurve({ start, end, color }: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
}) {
  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      start,
      new THREE.Vector3((start.x + end.x) / 2, Math.max(start.y, end.y) + 1.2, (start.z + end.z) / 2),
      end
    );
    return curve.getPoints(50);
  }, [start, end]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.25} />
    </line>
  );
}

function Node({ position, color, label, sublabel, size = 0.35 }: {
  position: [number, number, number];
  color: string;
  label: string;
  sublabel: string;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.8) * 0.08;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={position}>
        {/* Glow ring */}
        <PulseRing radius={size + 0.15} color={color} speed={1.2} />
        {/* Core sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        {/* Label */}
        <Text
          position={[0, -size - 0.55, 0]}
          fontSize={0.22}
          color="#f5f1ff"
          anchorX="center"
          anchorY="top"
        >
          {label}
        </Text>
        <Text
          position={[0, -size - 0.82, 0]}
          fontSize={0.14}
          color="#8c85aa"
          anchorX="center"
          anchorY="top"
        >
          {sublabel}
        </Text>
      </group>
    </Float>
  );
}

function Scene() {
  const capPos = useMemo(() => new THREE.Vector3(0, 2.2, 0), []);
  const reservePos = useMemo(() => new THREE.Vector3(-2.5, -0.3, 0.5), []);
  const investPos = useMemo(() => new THREE.Vector3(2.5, -0.3, -0.5), []);
  const payPos = useMemo(() => new THREE.Vector3(0, -2.2, 0), []);

  const particles = useMemo(() => [
    // Capital → Reserve
    { start: capPos, end: reservePos, speed: 0.35, delay: 0.0, color: '#f4a935' },
    { start: capPos, end: reservePos, speed: 0.35, delay: 0.5, color: '#f4a935' },
    // Capital → Investable
    { start: capPos, end: investPos, speed: 0.4, delay: 0.2, color: '#10b981' },
    { start: capPos, end: investPos, speed: 0.4, delay: 0.7, color: '#10b981' },
    // Capital → Payments
    { start: capPos, end: payPos, speed: 0.3, delay: 0.1, color: '#0ea5e9' },
    { start: capPos, end: payPos, speed: 0.3, delay: 0.6, color: '#0ea5e9' },
    // Reserve → Payments (buffer flow)
    { start: reservePos, end: payPos, speed: 0.25, delay: 0.3, color: '#f4a935' },
    // Investable → Capital (yield return)
    { start: investPos, end: capPos, speed: 0.2, delay: 0.8, color: '#10b981' },
  ], [capPos, reservePos, investPos, payPos]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#f5f1ff" />
      <pointLight position={[-3, 3, 2]} intensity={1.2} color="#c084fc" distance={10} />
      <pointLight position={[3, -2, 2]} intensity={0.8} color="#22d3ee" distance={10} />

      <Node position={[0, 2.2, 0]} color="#c084fc" label="Capital Entry" sublabel="Deposit & inflow" size={0.32} />
      <Node position={[-2.5, -0.3, 0.5]} color="#f4a935" label="Reserve Shield" sublabel="Protected obligations" size={0.3} />
      <Node position={[2.5, -0.3, -0.5]} color="#10b981" label="Investable Surplus" sublabel="Yield strategies" size={0.3} />
      <Node position={[0, -2.2, 0]} color="#0ea5e9" label="Payment Routing" sublabel="Scheduled settlement" size={0.3} />

      <ConnectionCurve start={capPos} end={reservePos} color="#f4a935" />
      <ConnectionCurve start={capPos} end={investPos} color="#10b981" />
      <ConnectionCurve start={capPos} end={payPos} color="#0ea5e9" />
      <ConnectionCurve start={reservePos} end={payPos} color="#f4a935" />
      <ConnectionCurve start={investPos} end={capPos} color="#10b981" />

      {particles.map((p, i) => (
        <FlowParticle key={i} {...p} />
      ))}

      {/* Subtle floor reflection plane */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -3.5, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#07060d" transparent opacity={0.6} metalness={0.9} roughness={0.1} />
      </mesh>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

export function ProtocolFlowScene() {
  return (
    <div className="w-full h-full min-h-[420px] sm:min-h-[520px] lg:min-h-[600px]">
      <Canvas
        camera={{ position: [0, 0.5, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <fog attach="fog" args={['#07060d', 8, 18]} />
        <Scene />
      </Canvas>
    </div>
  );
}
