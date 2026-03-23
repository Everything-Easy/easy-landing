import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
  className?: string;
}

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHaloRadiusBase;
  uniform float uHaloRadiusAmplitude;
  uniform float uHaloShapeAmplitude;
  uniform float uHaloRimWidth;
  uniform float uHaloScaleX;
  uniform float uHaloScaleY;
  uniform float uParticleBaseSize;
  uniform float uParticleActiveSize;
  uniform float uBlobScaleX;
  uniform float uBlobScaleY;
  uniform float uOuterOscFrequency;
  uniform float uOuterOscAmplitude;
  uniform float uHaloOuterStartOffset;
  uniform float uHaloOuterEndOffset;
  uniform float uParticleRotationSpeed;
  uniform float uParticleRotationJitter;
  uniform float uParticleOscillationFactor;
  uniform vec3 uColorBase;
  uniform vec3 uColorActive;

  varying vec2 vUv;
  varying float vSize;
  varying vec2 vPos;

  attribute vec3 aOffset;
  attribute float aRandom;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vUv = uv;

    // 1. ALIVE FLOW — organic drift
    vec3 pos = aOffset;
    float driftSpeed = uTime * 0.15;
    float dx = sin(driftSpeed + pos.y * 0.5) + sin(driftSpeed * 0.5 + pos.y * 2.0);
    float dy = cos(driftSpeed + pos.x * 0.5) + cos(driftSpeed * 0.5 + pos.x * 2.0);
    pos.x += dx * 0.25;
    pos.y += dy * 0.25;

    // 2. JELLYFISH HALO
    vec2 relToMouse = pos.xy - uMouse;
    vec2 haloScale = max(vec2(uHaloScaleX, uHaloScaleY), vec2(0.0001));
    float distFromMouse = length(relToMouse / haloScale);
    vec2 dirToMouse = normalize(relToMouse + vec2(0.0001, 0.0));

    float shapeFactor = noise(dirToMouse * 2.0 + vec2(0.0, uTime * 0.1));
    float breathCycle = sin(uTime * 0.8);
    float baseRadius = uHaloRadiusBase + breathCycle * uHaloRadiusAmplitude;
    float currentRadius = baseRadius + (shapeFactor * uHaloShapeAmplitude);

    float dist = distFromMouse;
    float rimInfluence = smoothstep(uHaloRimWidth, 0.0, abs(dist - currentRadius));

    vec2 pushDir = normalize(relToMouse + vec2(0.0001, 0.0));
    float pushAmt = (breathCycle * 0.5 + 0.5) * 0.5;
    pos.xy += pushDir * pushAmt * rimInfluence;
    pos.z += rimInfluence * 0.3 * sin(uTime);

    // 3. OUTER OSCILLATION
    float outerInfluence = smoothstep(baseRadius + uHaloOuterStartOffset, baseRadius + uHaloOuterEndOffset, dist);
    float outerOsc = sin(uTime * uOuterOscFrequency + pos.x * 0.6 + pos.y * 0.6);
    pos.xy += normalize(relToMouse + vec2(0.0001, 0.0)) * outerOsc * uOuterOscAmplitude * outerInfluence;

    // 4. SIZE & SCALE
    float baseSize = uParticleBaseSize + (sin(uTime + pos.x) * 0.003);
    float currentScale = baseSize + (rimInfluence * uParticleActiveSize);
    float stretch = rimInfluence * 0.02;

    vec3 transformed = position;
    transformed.x *= (currentScale + stretch) * uBlobScaleX;
    transformed.y *= currentScale * uBlobScaleY;

    vSize = rimInfluence;
    vPos = pos.xy;

    // 5. ROTATION
    float dirLen = max(length(relToMouse), 0.0001);
    vec2 dir = relToMouse / dirLen;
    float oscPhase = aRandom * 6.28318530718;
    float osc = 0.5 + 0.5 * sin(uTime * (0.25 + uParticleOscillationFactor * 0.35) + oscPhase);
    float speedScale = mix(0.55, 1.35, osc) * (0.8 + uParticleOscillationFactor * 0.2);
    float jitterScale = mix(0.7, 1.45, osc) * (0.85 + uParticleOscillationFactor * 0.15);
    float jitter = sin(uTime * uParticleRotationSpeed * speedScale + pos.x * 0.35 + pos.y * 0.35) * (uParticleRotationJitter * jitterScale);
    vec2 perp = vec2(-dir.y, dir.x);
    vec2 jitteredDir = normalize(dir + perp * jitter);
    mat2 rot = mat2(jitteredDir.x, jitteredDir.y, -jitteredDir.y, jitteredDir.x);
    transformed.xy = rot * transformed.xy;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos + transformed, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorBase;
  uniform vec3 uColorActive;

  varying vec2 vUv;
  varying float vSize;
  varying vec2 vPos;

  void main() {
    vec2 center = vec2(0.5);
    vec2 pos = abs(vUv - center) * 2.0;
    float d = pow(pow(pos.x, 2.6) + pow(pos.y, 2.6), 1.0 / 2.6);
    float alpha = 1.0 - smoothstep(0.8, 1.0, d);

    if (alpha < 0.01) discard;

    vec3 finalColor = mix(uColorBase, uColorActive, smoothstep(0.1, 0.8, vSize));
    float finalAlpha = alpha * mix(0.35, 0.9, vSize);

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

interface ParticlesSceneProps {
  colorBase: string;
  colorActive: string;
}

const ParticlesScene: React.FC<ParticlesSceneProps> = ({ colorBase, colorActive }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();

  const countX = 100;
  const countY = 55;
  const count = countX * countY;

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uHaloRadiusBase: { value: 2.4 },
      uHaloRadiusAmplitude: { value: 0.5 },
      uHaloShapeAmplitude: { value: 0.75 },
      uHaloRimWidth: { value: 1.8 },
      uHaloScaleX: { value: 1.3 },
      uHaloScaleY: { value: 1.0 },
      uHaloOuterStartOffset: { value: 0.4 },
      uHaloOuterEndOffset: { value: 2.2 },
      uOuterOscFrequency: { value: 2.6 },
      uOuterOscAmplitude: { value: 0.76 },
      uParticleBaseSize: { value: 0.016 },
      uParticleActiveSize: { value: 0.044 },
      uBlobScaleX: { value: 1.0 },
      uBlobScaleY: { value: 0.6 },
      uParticleRotationSpeed: { value: 0.1 },
      uParticleRotationJitter: { value: 0.2 },
      uParticleOscillationFactor: { value: 1.0 },
      uColorBase: { value: new THREE.Color(colorBase) },
      uColorActive: { value: new THREE.Color(colorActive) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  );

  // Update colors when props change
  useEffect(() => {
    material.uniforms.uColorBase.value.set(colorBase);
    material.uniforms.uColorActive.value.set(colorActive);
  }, [material, colorBase, colorActive]);

  // Initialize instanced attributes
  useEffect(() => {
    if (!meshRef.current) return;

    const offsets = new Float32Array(count * 3);
    const randoms = new Float32Array(count);

    const gridWidth = 40;
    const gridHeight = 22;
    const jitter = 0.25;

    let i = 0;
    for (let y = 0; y < countY; y++) {
      for (let x = 0; x < countX; x++) {
        const u = x / (countX - 1);
        const v = y / (countY - 1);

        let px = (u - 0.5) * gridWidth;
        let py = (v - 0.5) * gridHeight;

        px += (Math.random() - 0.5) * jitter;
        py += (Math.random() - 0.5) * jitter;

        offsets[i * 3] = px;
        offsets[i * 3 + 1] = py;
        offsets[i * 3 + 2] = 0;

        randoms[i] = Math.random();
        i++;
      }
    }

    meshRef.current.geometry.setAttribute(
      'aOffset',
      new THREE.InstancedBufferAttribute(offsets, 3),
    );
    meshRef.current.geometry.setAttribute(
      'aRandom',
      new THREE.InstancedBufferAttribute(randoms, 1),
    );
  }, [count, countX, countY]);

  // Mouse tracking
  const hovering = useRef(true);
  const globalPointer = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleLeave = () => { hovering.current = false; };
    const handleEnter = () => { hovering.current = true; };
    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      globalPointer.current = { x, y };
    };

    document.body.addEventListener('mouseleave', handleLeave);
    document.body.addEventListener('mouseenter', handleEnter);
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      document.body.removeEventListener('mouseleave', handleLeave);
      document.body.removeEventListener('mouseenter', handleEnter);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  useFrame((state) => {
    const { clock, pointer } = state;
    material.uniforms.uTime.value = clock.getElapsedTime();

    let targetX: number | null = null;
    let targetY: number | null = null;

    if (hovering.current) {
      const pointerSource = globalPointer.current ?? pointer;
      const baseX = (pointerSource.x * viewport.width) / 2;
      const baseY = (pointerSource.y * viewport.height) / 2;
      const t = clock.getElapsedTime();
      const jitterRadius = Math.min(viewport.width, viewport.height) * 0.065;
      const jitterX = (Math.sin(t * 0.35) + Math.sin(t * 0.77 + 1.2)) * 0.5;
      const jitterY = (Math.cos(t * 0.31) + Math.sin(t * 0.63 + 2.4)) * 0.5;
      targetX = baseX + jitterX * jitterRadius * 3;
      targetY = baseY + jitterY * jitterRadius * 3;
    }

    const current = material.uniforms.uMouse.value;
    const dragFactor = 0.015;

    if (targetX !== null && targetY !== null) {
      current.x += (targetX - current.x) * dragFactor;
      current.y += (targetY - current.y) * dragFactor;
    }
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
};

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  colors,
  className = '',
}) => {
  // Determine color scheme based on whether light or dark colors are passed
  const isDark = colors && colors.some(c => c.includes('255'));
  const colorBase = isDark ? '#ffffff' : '#000000';
  const colorActive = isDark ? '#cccccc' : '#333333';

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5] }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ParticlesScene colorBase={colorBase} colorActive={colorActive} />
      </Canvas>
    </div>
  );
};

export default FloatingParticles;
