import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const DEFAULTS = {
  deep: 0x3b82f6,
  light: 0x93c5fd,
};

const createLabelSprite = (text, { fontSize = 36, color = "#1f2937" } = {}) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const font = `600 ${fontSize}px Inter, Arial, sans-serif`;

  context.font = font;
  const metrics = context.measureText(text);
  const padding = 16;
  canvas.width = Math.ceil(metrics.width + padding * 2);
  canvas.height = Math.ceil(fontSize + padding * 1.6);

  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  const scaleFactor = 0.012;
  sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);
  return sprite;
};

const ThreeBarChart = ({ bars = [], className = "", autoRotate = true }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const barsGroupRef = useRef(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const draggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: -0.06, y: 0.12 });

  const renderScene = () => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;
    renderer.render(scene, camera);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 7, 10.5);
    camera.lookAt(0, 2.7, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.75);
    keyLight.position.set(6, 10, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
    fillLight.position.set(-6, 6, 6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
    rimLight.position.set(0, 8, -8);
    scene.add(rimLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.4));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    const { width, height } = container.getBoundingClientRect();
    if (width && height) {
      sizeRef.current = { width, height };
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    renderScene();

    return () => {
      if (barsGroupRef.current) {
        scene.remove(barsGroupRef.current);
      }
      renderer.dispose();
      container.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (!container || !renderer || !camera) return undefined;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (!width || !height) return;
      sizeRef.current = { width, height };
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderScene();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const handlePointerDown = (event) => {
      draggingRef.current = true;
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
      container.setPointerCapture?.(event.pointerId);
    };

    const handlePointerUp = (event) => {
      draggingRef.current = false;
      container.releasePointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event) => {
      if (!draggingRef.current || !barsGroupRef.current) return;
      const deltaX = event.clientX - lastPointerRef.current.x;
      const deltaY = event.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: event.clientX, y: event.clientY };

      const nextY = rotationRef.current.y + deltaX * 0.004;
      const nextX = rotationRef.current.x + deltaY * 0.003;

      rotationRef.current = {
        x: Math.min(0.2, Math.max(-0.35, nextX)),
        y: nextY,
      };

      barsGroupRef.current.rotation.x = rotationRef.current.x;
      barsGroupRef.current.rotation.y = rotationRef.current.y;
      renderScene();
    };

    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useEffect(() => {
    let frameId;

    const animate = () => {
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const group = barsGroupRef.current;
      if (!renderer || !scene || !camera) return;

      if (group && autoRotate && !draggingRef.current) {
        rotationRef.current.y += 0.0022;
        group.rotation.y = rotationRef.current.y;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    if (autoRotate) {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [autoRotate]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (barsGroupRef.current) {
      barsGroupRef.current.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      scene.remove(barsGroupRef.current);
    }

    const group = new THREE.Group();
    const barCount = Math.max(bars.length, 1);
    const barWidth = Math.min(0.7, 5.6 / barCount);
    const barDepth = Math.max(0.5, barWidth * 0.9);
    const gap = Math.max(0.22, barWidth * 0.55);

    const maxStack = Math.max(
      ...bars.map((bar) => (bar.deepMinutes || 0) + (bar.lightMinutes || 0)),
      1
    );
    const maxHeight = 5.4;

    const totalWidth = barCount * (barWidth + gap) - gap;
    const startX = -totalWidth / 2 + barWidth / 2;

    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(totalWidth + 1.2, 0.12, barDepth + 1.2),
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.9,
        metalness: 0,
      })
    );
    platform.position.set(0, -0.06, -0.1);
    group.add(platform);

    const deepBase = new THREE.MeshStandardMaterial({
      color: DEFAULTS.deep,
      roughness: 0.25,
      metalness: 0.08,
    });
    const lightBase = new THREE.MeshStandardMaterial({
      color: DEFAULTS.light,
      roughness: 0.3,
      metalness: 0.06,
    });

    bars.forEach((bar, index) => {
      const deepMinutes = bar.deepMinutes || 0;
      const lightMinutes = bar.lightMinutes || 0;
      const deepHeight = deepMinutes ? (deepMinutes / maxStack) * maxHeight : 0;
      const lightHeight = lightMinutes ? (lightMinutes / maxStack) * maxHeight : 0;
      const totalHeight = deepHeight + lightHeight;

      const opacity = bar.muted ? 0.35 : 1;
      const transparent = opacity < 1;
      const x = startX + index * (barWidth + gap);

      if (deepHeight > 0) {
        const geometry = new THREE.BoxGeometry(barWidth, deepHeight, barDepth);
        const material = deepBase.clone();
        material.transparent = transparent;
        material.opacity = opacity;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, deepHeight / 2, 0);
        group.add(mesh);

        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geometry),
          new THREE.LineBasicMaterial({
            color: 0x1e3a8a,
            transparent,
            opacity: opacity * 0.4,
          })
        );
        edges.position.copy(mesh.position);
        group.add(edges);
      }

      if (lightHeight > 0) {
        const geometry = new THREE.BoxGeometry(barWidth, lightHeight, barDepth);
        const material = lightBase.clone();
        material.transparent = transparent;
        material.opacity = opacity;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, deepHeight + lightHeight / 2, 0);
        group.add(mesh);

        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geometry),
          new THREE.LineBasicMaterial({
            color: 0x3b82f6,
            transparent,
            opacity: opacity * 0.35,
          })
        );
        edges.position.copy(mesh.position);
        group.add(edges);
      }

      const valueText = bar.tooltip || "0h";
      const valueSprite = createLabelSprite(valueText, {
        fontSize: 32,
        color: bar.isPeak ? "#0f172a" : "#64748b",
      });
      valueSprite.position.set(x, totalHeight + 0.5, 0);
      group.add(valueSprite);

      const daySprite = createLabelSprite(bar.day || "", {
        fontSize: 28,
        color: bar.isPeak ? "#0f172a" : "#94a3b8",
      });
      daySprite.position.set(x, -0.6, 0);
      group.add(daySprite);
    });

    group.rotation.y = rotationRef.current.y;
    group.rotation.x = rotationRef.current.x;

    scene.add(group);
    barsGroupRef.current = group;
    renderScene();
  }, [bars]);

  return (
    <div
      ref={containerRef}
      className={`${className} cursor-grab active:cursor-grabbing`}
    />
  );
};

export default ThreeBarChart;
