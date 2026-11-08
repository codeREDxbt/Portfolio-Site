"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const RED = 0xe5484d;

export default function SignalScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const particleCount = 900;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const t = i / particleCount;
      const angle = t * Math.PI * 18;
      const radius = 1.15 + Math.sin(t * Math.PI * 6) * 0.55;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (t - 0.5) * 3.2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: RED,
      size: 0.018,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);

    const knotGeometry = new THREE.TorusKnotGeometry(1.08, 0.18, 120, 10, 2, 3);
    const knotMaterial = new THREE.MeshBasicMaterial({
      color: RED,
      wireframe: true,
      transparent: true,
      opacity: 0.13,
    });
    const knot = new THREE.Mesh(knotGeometry, knotMaterial);
    group.add(knot);

    const coreGeometry = new THREE.IcosahedronGeometry(0.46, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0.18 });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let visible = true;
    const clock = new THREE.Clock();

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(Math.max(width, 1), Math.max(height, 1));
      camera.aspect = Math.max(width, 1) / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.28;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.22;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    resize();
    observer.observe(mount);
    window.addEventListener("resize", resize);
    mount.addEventListener("pointermove", onPointerMove);

    renderer.setAnimationLoop(() => {
      if (!visible) return;
      const elapsed = clock.getElapsedTime();
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;
      group.rotation.y = elapsed * 0.12 + currentX;
      group.rotation.x = Math.sin(elapsed * 0.24) * 0.08 + currentY;
      particles.rotation.y = elapsed * 0.07;
      knot.rotation.z = elapsed * 0.06;
      renderer.render(scene, camera);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", onPointerMove);
      renderer.setAnimationLoop(null);
      particleGeometry.dispose();
      particleMaterial.dispose();
      knotGeometry.dispose();
      knotMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div aria-hidden="true" className="relative h-[280px] w-full md:h-[520px]">
      <div className="absolute right-0 top-10 h-64 w-64 rounded-full border border-red/30" />
      <div className="absolute right-12 top-24 h-40 w-40 rounded-full border border-red/45" />
      <div className="absolute right-24 top-36 h-16 w-16 rounded-full bg-red/15 blur-sm" />
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
