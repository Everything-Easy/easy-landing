import React, { useEffect, useRef, useCallback } from 'react';
import { FEATURE_ICON_KEYS, precomputeAllShapes } from './morphingParticlesShapes';

interface MorphingParticlesProps {
  activeFeature: number;
  className?: string;
}

const PARTICLE_COUNT = 2500;
const SAMPLE_CANVAS_SIZE = 400;
const INITIAL_SHAPE_COUNT = Math.floor(PARTICLE_COUNT * 0.18);
const MAX_SHAPE_COUNT = Math.floor(PARTICLE_COUNT * 0.30);
const RECRUIT_INTERVAL = 60; // frames between recruiting new particles

const MorphingParticles: React.FC<MorphingParticlesProps> = ({
  activeFeature,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  const posXRef = useRef(new Float32Array(PARTICLE_COUNT));
  const posYRef = useRef(new Float32Array(PARTICLE_COUNT));
  const homeXRef = useRef(new Float32Array(PARTICLE_COUNT));
  const homeYRef = useRef(new Float32Array(PARTICLE_COUNT));
  const targetXRef = useRef(new Float32Array(PARTICLE_COUNT));
  const targetYRef = useRef(new Float32Array(PARTICLE_COUNT));
  const velXRef = useRef(new Float32Array(PARTICLE_COUNT));
  const velYRef = useRef(new Float32Array(PARTICLE_COUNT));
  // Per-particle drift parameters
  const driftPhaseXRef = useRef(new Float32Array(PARTICLE_COUNT));
  const driftPhaseYRef = useRef(new Float32Array(PARTICLE_COUNT));
  const driftFreqRef = useRef(new Float32Array(PARTICLE_COUNT));
  const driftAmpRef = useRef(new Float32Array(PARTICLE_COUNT));
  // Shape assignment
  const isShapeRef = useRef(new Uint8Array(PARTICLE_COUNT));
  const delayRef = useRef(new Float32Array(PARTICLE_COUNT));
  const colorProgressRef = useRef(new Float32Array(PARTICLE_COUNT));
  const baseSizeRef = useRef(new Float32Array(PARTICLE_COUNT));

  const shapesRef = useRef<Map<string, Float32Array> | null>(null);
  const activeFeatureRef = useRef(activeFeature);
  const sizeRef = useRef({ w: 0, h: 0 });
  const isVisibleRef = useRef(true);
  const timeRef = useRef(0);
  const frameCountRef = useRef(0);
  // Track all shape target points for progressive recruitment
  const allShapeTargetsRef = useRef<Array<{ x: number; y: number }>>([]);
  const currentShapeCountRef = useRef(0);

  const initParticles = useCallback((w: number, h: number) => {
    const hx = homeXRef.current;
    const hy = homeYRef.current;
    const px = posXRef.current;
    const py = posYRef.current;
    const tx = targetXRef.current;
    const ty = targetYRef.current;
    const dpx = driftPhaseXRef.current;
    const dpy = driftPhaseYRef.current;
    const df = driftFreqRef.current;
    const da = driftAmpRef.current;
    const bs = baseSizeRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      hx[i] = x;
      hy[i] = y;
      px[i] = x;
      py[i] = y;
      tx[i] = x;
      ty[i] = y;

      // Each particle has unique drift character
      dpx[i] = Math.random() * Math.PI * 2;
      dpy[i] = Math.random() * Math.PI * 2;
      df[i] = 0.3 + Math.random() * 0.6;
      da[i] = 12 + Math.random() * 20;

      bs[i] = 0.7 + Math.random() * 0.9;
    }
  }, []);

  const assignShape = useCallback((featureIndex: number) => {
    const shapes = shapesRef.current;
    if (!shapes) return;

    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) return;

    const key = FEATURE_ICON_KEYS[featureIndex];
    const shapePoints = shapes.get(key);
    if (!shapePoints) return;

    const hx = homeXRef.current;
    const hy = homeYRef.current;
    const tx = targetXRef.current;
    const ty = targetYRef.current;
    const isShape = isShapeRef.current;
    const delay = delayRef.current;

    // Reset all to home
    isShape.fill(0);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      tx[i] = hx[i];
      ty[i] = hy[i];
    }

    // Map ALL shape points to canvas coords (for progressive recruitment)
    const size = Math.min(w, h) * 0.75;
    const offsetX = w * 0.55 - size * 0.5; // offset right so it doesn't overlap text
    const offsetY = (h - size) / 2;

    const allTargets: Array<{ x: number; y: number }> = [];
    const maxPoints = Math.floor(shapePoints.length / 2);
    for (let i = 0; i < maxPoints; i++) {
      const sx = shapePoints[i * 2];
      const sy = shapePoints[i * 2 + 1];
      const scatter = 3 + Math.random() * 3;
      allTargets.push({
        x: offsetX + (sx * 0.5 + 0.5) * size + (Math.random() - 0.5) * scatter,
        y: offsetY + (sy * 0.5 + 0.5) * size + (Math.random() - 0.5) * scatter,
      });
    }
    // Shuffle targets so recruitment is spatially uniform (not top-to-bottom)
    for (let i = allTargets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTargets[i], allTargets[j]] = [allTargets[j], allTargets[i]];
    }
    allShapeTargetsRef.current = allTargets;

    // Assign initial batch
    const cx = w * 0.55;
    const cy = h / 2;
    const assigned = new Set<number>();

    const initialCount = Math.min(INITIAL_SHAPE_COUNT, allTargets.length);
    for (let t = 0; t < initialCount; t++) {
      const target = allTargets[t];
      let bestIdx = -1;
      let bestDist = Infinity;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (assigned.has(i)) continue;
        const dx = hx[i] - target.x;
        const dy = hy[i] - target.y;
        const dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }

      if (bestIdx >= 0) {
        assigned.add(bestIdx);
        isShape[bestIdx] = 1;
        tx[bestIdx] = target.x;
        ty[bestIdx] = target.y;

        const dx = hx[bestIdx] - cx;
        const dy = hy[bestIdx] - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.sqrt(cx * cx + cy * cy);
        delay[bestIdx] = (dist / maxDist) * 35 + Math.random() * 12;
      }
    }

    currentShapeCountRef.current = initialCount;

    // Non-shape particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (!isShape[i]) {
        delay[i] = Math.random() * 5;
      }
    }
  }, []);

  // Progressive recruitment — add more particles to shape over time
  const recruitMore = useCallback(() => {
    const allTargets = allShapeTargetsRef.current;
    const current = currentShapeCountRef.current;
    if (current >= allTargets.length || current >= MAX_SHAPE_COUNT) return;

    const hx = homeXRef.current;
    const hy = homeYRef.current;
    const tx = targetXRef.current;
    const ty = targetYRef.current;
    const isShape = isShapeRef.current;
    const delay = delayRef.current;

    // Recruit 2-4 particles at a time
    const batch = 2 + Math.floor(Math.random() * 3);
    const end = Math.min(current + batch, allTargets.length, MAX_SHAPE_COUNT);

    for (let t = current; t < end; t++) {
      const target = allTargets[t];
      let bestIdx = -1;
      let bestDist = Infinity;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (isShape[i]) continue;
        const dx = hx[i] - target.x;
        const dy = hy[i] - target.y;
        const dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }

      if (bestIdx >= 0) {
        isShape[bestIdx] = 1;
        tx[bestIdx] = target.x;
        ty[bestIdx] = target.y;
        delay[bestIdx] = Math.random() * 10;
      }
    }

    currentShapeCountRef.current = end;
  }, []);

  const animate = useCallback(() => {
    if (!isVisibleRef.current) {
      animRef.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    timeRef.current += 0.016;
    frameCountRef.current += 1;
    const t = timeRef.current;

    // Progressive recruitment
    if (frameCountRef.current % RECRUIT_INTERVAL === 0) {
      recruitMore();
    }

    const px = posXRef.current;
    const py = posYRef.current;
    const tx = targetXRef.current;
    const ty = targetYRef.current;
    const vx = velXRef.current;
    const vy = velYRef.current;
    const dpx = driftPhaseXRef.current;
    const dpy = driftPhaseYRef.current;
    const df = driftFreqRef.current;
    const da = driftAmpRef.current;
    const bs = baseSizeRef.current;
    const isShape = isShapeRef.current;
    const delay = delayRef.current;
    const colorProgress = colorProgressRef.current;

    const stiffness = 0.012;
    const damping = 0.92;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (delay[i] > 0) delay[i] -= 1;
      const active = delay[i] <= 0;

      // Continuous organic drift — ALL particles always float with layered noise
      const freq = df[i];
      const amp = da[i];
      const phx = dpx[i];
      const phy = dpy[i];
      const driftX = Math.sin(t * freq + phx) * amp +
                     Math.sin(t * freq * 0.53 + phx * 2.1) * amp * 0.6 +
                     Math.sin(t * freq * 0.21 + phx * 0.7) * amp * 0.9 +
                     Math.cos(t * freq * 0.13 + phx * 3.3) * amp * 0.4;
      const driftY = Math.cos(t * freq * 0.67 + phy) * amp +
                     Math.cos(t * freq * 0.37 + phy * 1.8) * amp * 0.6 +
                     Math.cos(t * freq * 0.27 + phy * 0.5) * amp * 0.9 +
                     Math.sin(t * freq * 0.17 + phy * 2.7) * amp * 0.4;

      // Shape particles drift less — keeps contours defined while still breathing
      const driftScale = isShape[i] ? 0.4 : 1.0;
      const finalTargetX = tx[i] + driftX * driftScale;
      const finalTargetY = ty[i] + driftY * driftScale;

      if (active) {
        const dx = finalTargetX - px[i];
        const dy = finalTargetY - py[i];
        vx[i] += dx * stiffness;
        vy[i] += dy * stiffness;
        vx[i] *= damping;
        vy[i] *= damping;
        px[i] += vx[i];
        py[i] += vy[i];

        if (isShape[i]) {
          colorProgress[i] = Math.min(1, colorProgress[i] + 0.025);
        } else {
          colorProgress[i] = Math.max(0, colorProgress[i] - 0.01);
        }
      } else {
        // Pre-delay: still drift organically at visible speed
        px[i] += driftX * 0.15;
        py[i] += driftY * 0.15;
      }

      // Draw
      const screenX = px[i] * dpr;
      const screenY = py[i] * dpr;
      const cp = colorProgress[i];
      const radius = (bs[i] + cp * 0.5) * dpr;

      if (cp > 0.05) {
        // Shape particle → accent blue (#3279F9)
        const r = Math.round(255 - cp * (255 - 50));
        const g = Math.round(255 - cp * (255 - 121));
        const b = 249;
        const alpha = 0.12 + cp * 0.6;
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.13)';
      }

      ctx.beginPath();
      ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    animRef.current = requestAnimationFrame(animate);
  }, [recruitMore]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      sizeRef.current = { w, h };

      initParticles(w, h);

      if (!shapesRef.current) {
        shapesRef.current = precomputeAllShapes(SAMPLE_CANVAS_SIZE, MAX_SHAPE_COUNT);
      }

      assignShape(activeFeatureRef.current);
    };

    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 },
    );
    observer.observe(container);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    handleResize();
    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [animate, initParticles, assignShape]);

  useEffect(() => {
    activeFeatureRef.current = activeFeature;
    colorProgressRef.current.fill(0);
    frameCountRef.current = 0;
    assignShape(activeFeature);
  }, [activeFeature, assignShape]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default MorphingParticles;
