'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * "Signal Ribbons" — the hero's 3D instrument: five additive light ribbons
 * flowing through space, bending toward the pointer, flaring when the channel
 * readout retunes (`codered:retune`) and when the boot wordmark docks
 * (`codered:dock`). A few hundred line vertices — far cheaper than the old
 * 10.8k-point terrain. Offscreen frames are fully gated.
 */

const RIBBON_VERTEX = /* glsl */ `
float envelopeSafe(float e) { return e * e; }

uniform float uTime;
uniform float uSeed;
uniform float uPulseT;
uniform vec2 uPointer;
varying float vFade;

void main() {
  vec3 pos = position;
  float t = uTime;

  // layered carrier waves — slow, calm idle
  float wave = sin(pos.x * 0.55 + t * 0.6 + uSeed * 7.0) * 0.34;
  wave += sin(pos.x * 0.23 - t * 0.34 + uSeed * 3.0) * 0.42;
  wave += sin(pos.x * 1.4 + t * 1.1 + uSeed * 11.0) * 0.08;

  // pointer bend — ribbons lean gently toward the cursor
  float bend = uPointer.x * exp(-abs(pos.x - uPointer.x * 8.0) * 0.22) * 0.5;

  // traveling pulse — a hot wave crossing the band on retune/dock
  float pulse = 0.0;
  if (uPulseT >= 0.0 && uPulseT <= 1.4) {
    float center = mix(-12.0, 12.0, uPulseT / 1.4);
    pulse = exp(-pow(pos.x - center, 2.0) * 0.3) * envelopeSafe(1.0 - uPulseT / 1.4);
  }

  pos.y += wave + bend + pulse * 0.85;
  pos.z += wave * 0.35 + pulse * 0.5;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float endFade = 1.0 - smoothstep(7.5, 11.0, abs(pos.x));
  float distFade = 1.0 - smoothstep(6.0, 16.0, max(-mv.z, 0.001));
  vFade = endFade * distFade * (0.78 + pulse * 2.4);
}
`;

const RIBBON_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vFade;

void main() {
  if (vFade <= 0.001) discard;
  gl_FragColor = vec4(uColor, vFade * uOpacity);
}
`;

const RIBBONS: Array<{ y: number; z: number; seed: number; opacity: number }> = [
  { y: -1.15, z: -1.6, seed: 0.13, opacity: 0.6 },
  { y: -0.45, z: -0.8, seed: 0.37, opacity: 0.85 },
  { y: 0.2, z: 0.0, seed: 0.58, opacity: 1.0 },
  { y: 0.85, z: -0.9, seed: 0.79, opacity: 0.8 },
  { y: 1.5, z: -1.8, seed: 0.95, opacity: 0.55 },
];

const SEGMENTS = 220;
const SPAN = 22;

function makeGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(229,72,77,0.85)');
    gradient.addColorStop(0.4, 'rgba(229,72,77,0.25)');
    gradient.addColorStop(1, 'rgba(229,72,77,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

export default function RibbonField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'default',
      });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    camera.position.set(0, 1.7, 8.2);
    camera.lookAt(0, 0.1, 0);

    let lightTheme = false;
    const uniformsList: Array<Record<string, THREE.IUniform>> = [];
    const ribbons: THREE.Line[] = [];

    const darkA = new THREE.Color(0xe5484d);
    const darkB = new THREE.Color(0x7a2e31);
    const lightA = new THREE.Color(0xc2252b);
    const lightB = new THREE.Color(0xb08d68);

    for (const config of RIBBONS) {
      const positions = new Float32Array(SEGMENTS * 3);
      for (let i = 0; i < SEGMENTS; i += 1) {
        positions[i * 3] = -SPAN / 2 + (i / (SEGMENTS - 1)) * SPAN;
        positions[i * 3 + 1] = config.y;
        positions[i * 3 + 2] = config.z;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const uniforms: Record<string, THREE.IUniform> = {
        uTime: { value: 0 },
        uSeed: { value: config.seed },
        uPulseT: { value: -1 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uColor: { value: darkA.clone().lerp(darkB, config.seed) },
        uOpacity: { value: config.opacity },
      };
      uniformsList.push(uniforms);

      const material = new THREE.ShaderMaterial({
        vertexShader: RIBBON_VERTEX,
        fragmentShader: RIBBON_FRAGMENT,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const ribbon = new THREE.Line(geometry, material);
      scene.add(ribbon);
      ribbons.push(ribbon);
    }

    // soft origin glow — the "locked channel" beacon
    const glowTexture = makeGlowTexture();
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Sprite(glowMaterial);
    glow.position.set(4.6, 0.4, -1.2);
    glow.scale.set(3.4, 3.4, 1);
    scene.add(glow);

    let visible = true;
    let pulseStart = -1;
    let pointerX = 0;
    let pointerTarget = 0;
    let mountRect = mount.getBoundingClientRect();
    const clock = new THREE.Clock();

    const firePulse = () => {
      pulseStart = clock.getElapsedTime();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!visible) return;
      pointerTarget = ((event.clientX - mountRect.left) / mountRect.width) * 2 - 1;
    };

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      mountRect = mount.getBoundingClientRect();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersectionObserver.observe(mount);

    const applyTheme = () => {
      lightTheme = document.documentElement.dataset.theme === 'light';
      uniformsList.forEach((uniforms, index) => {
        const seed = RIBBONS[index].seed;
        (uniforms.uColor.value as THREE.Color)
          .copy(lightTheme ? lightA : darkA)
          .lerp(lightTheme ? lightB : darkB, seed);
        uniforms.uOpacity.value = RIBBONS[index].opacity * (lightTheme ? 0.75 : 1);
      });
    };
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    applyTheme();

    window.addEventListener('codered:dock', firePulse);
    window.addEventListener('codered:retune', firePulse);
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    renderer.setAnimationLoop(() => {
      if (!visible) return;
      const elapsed = clock.getElapsedTime();

      pointerX += (pointerTarget - pointerX) * 0.05;
      const pulseT = pulseStart >= 0 ? elapsed - pulseStart : -1;

      for (const uniforms of uniformsList) {
        uniforms.uTime.value = elapsed;
        uniforms.uPulseT.value = pulseT > 1.4 ? -1 : pulseT;
        (uniforms.uPointer.value as THREE.Vector2).set(pointerX, 0);
      }

      const pulseGlow = pulseT >= 0 && pulseT <= 1.4 ? (1 - pulseT / 1.4) * 0.4 : 0;
      glowMaterial.opacity = (lightTheme ? 0.4 : 0.55) + Math.sin(elapsed * 1.6) * 0.06 + pulseGlow;

      renderer.render(scene, camera);
    });

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('codered:dock', firePulse);
      window.removeEventListener('codered:retune', firePulse);
      window.removeEventListener('pointermove', onPointerMove);
      renderer.setAnimationLoop(null);
      for (const ribbon of ribbons) {
        ribbon.geometry.dispose();
        (ribbon.material as THREE.Material).dispose();
      }
      glowTexture.dispose();
      glowMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
