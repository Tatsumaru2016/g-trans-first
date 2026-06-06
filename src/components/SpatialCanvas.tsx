/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Stage } from "../types";

interface SpatialCanvasProps {
  scrollProgress: number; // 0 to 1
  mousePos: { x: number; y: number };
  onStageChange: (stage: Stage) => void;
}

export const SpatialCanvas: React.FC<SpatialCanvasProps> = ({
  scrollProgress,
  mousePos,
  onStageChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References for Three.js objects
  const stateRef = useRef({
    lerpedProgress: 0,
    velocity: 0,
    prevProgress: 0,
    stage: Stage.MICRO_FILAMENT,
    mouseX: 0,
    mouseY: 0,
  });

  // Keep mouse in ref to avoid re-initializing
  useEffect(() => {
    // Smoothen mouse input
    gsap.to(stateRef.current, {
      mouseX: mousePos.x,
      mouseY: mousePos.y,
      duration: 1.2,
      ease: "power2.out",
    });
  }, [mousePos]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#FAF9F5"); // Off-white ivory void
    scene.fog = new THREE.FogExp2("#FAF9F5", 0.012);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight("#FAF9F5", 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight("#FFFFFF", 1.5);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight("#E8DFD8", 0.8);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Soft colored point lights for luxury atmospheric gradient mesh
    const bulb1 = new THREE.PointLight("#E8DFD8", 1.8, 40);
    bulb1.position.set(5, 5, 5);
    scene.add(bulb1);

    const bulb2 = new THREE.PointLight("#DDD1C4", 1.2, 40);
    bulb2.position.set(-5, 5, -5);
    scene.add(bulb2);

    // ==========================================
    // CREATING SCENE GEOMETRIES & ASSETS
    // ==========================================

    // ----- Scene 1 & 2: Filament lines and text nodes -----
    const filamentGroup = new THREE.Group();
    scene.add(filamentGroup);

    const filamentsCount = 28;
    const filamentLines: THREE.Line[] = [];
    const filamentSpeeds: number[] = [];

    for (let i = 0; i < filamentsCount; i++) {
      const points: THREE.Vector3[] = [];
      const steps = 30;
      const xOffset = (Math.random() - 0.5) * 6;
      const yOffset = (Math.random() - 0.5) * 6;

      for (let j = 0; j < steps; j++) {
        const z = 15 - (j / steps) * 40;
        // Introduce wavy bezier curvature
        const waveX = Math.sin(j * 0.15 + i) * 1.5 + xOffset;
        const waveY = Math.cos(j * 0.15 + i) * 1.5 + yOffset;
        points.push(new THREE.Vector3(waveX, waveY, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? "#7C756B" : "#AFA99E",
        transparent: true,
        opacity: 0.15,
        blending: THREE.NormalBlending,
      });

      const line = new THREE.Line(geometry, material);
      filamentGroup.add(line);
      filamentLines.push(line);
      filamentSpeeds.push(0.5 + Math.random() * 1.5);
    }

    // Glowing data flow nodes on filaments
    const flowCount = 60;
    const flowGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const flowMat = new THREE.MeshBasicMaterial({
      color: "#6b6154",
      transparent: true,
      opacity: 0.8,
    });
    const flowInstanced = new THREE.InstancedMesh(flowGeo, flowMat, flowCount);
    const flowProgress: number[] = [];
    const flowSpeeds: number[] = [];
    const flowLineIndices: number[] = [];

    const dummyMatrix = new THREE.Object3D();

    for (let i = 0; i < flowCount; i++) {
      flowProgress.push(Math.random());
      flowSpeeds.push(0.004 + Math.random() * 0.008);
      flowLineIndices.push(Math.floor(Math.random() * filamentsCount));
    }
    filamentGroup.add(flowInstanced);

    // ----- Scene 2: 3D Bento Grid Structure -----
    const bentoGroup = new THREE.Group();
    scene.add(bentoGroup);

    const bentoPanels: THREE.Mesh[] = [];
    const bentoOriginalPositions: THREE.Vector3[] = [];
    const bentoPanelCount = 8;

    // Define translucent glassmorphic meshes for Bento
    const bentoGeo = new THREE.BoxGeometry(1, 1, 1);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: "#F6F5F0",
      transparent: true,
      opacity: 0.6,
      roughness: 0.05,
      metalness: 0.04,
      transmission: 0.85,
      thickness: 0.5,
      ior: 1.45,
      side: THREE.DoubleSide,
    });

    const wireframeMat = new THREE.MeshBasicMaterial({
      color: "#9A9286",
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const bentoLayouts = [
      { size: [2.5, 1.8, 0.4], pos: [-2, 1.2, -5] },
      { size: [1.8, 1.8, 0.4], pos: [0.5, 1.2, -5] },
      { size: [1.2, 1.8, 0.4], pos: [2.3, 1.2, -5] },
      { size: [1.5, 1.2, 0.4], pos: [-2.5, -0.5, -5] },
      { size: [2.8, 1.2, 0.4], pos: [-0.1, -0.5, -5] },
      { size: [1.5, 1.2, 0.4], pos: [2.3, -0.5, -5] },
      { size: [3.4, 0.8, 0.4], pos: [-1.2, -1.7, -5] },
      { size: [2.0, 0.8, 0.4], pos: [1.8, -1.7, -5] },
    ];

    bentoLayouts.forEach((layout, index) => {
      const panelGeometry = new THREE.BoxGeometry(
        layout.size[0],
        layout.size[1],
        layout.size[2]
      );
      const mainBox = new THREE.Mesh(panelGeometry, glassMat);
      const wireframeBox = new THREE.Mesh(panelGeometry, wireframeMat);
      mainBox.add(wireframeBox);

      const targetPos = new THREE.Vector3(
        layout.pos[0],
        layout.pos[1],
        layout.pos[2]
      );
      mainBox.position.copy(targetPos);
      bentoOriginalPositions.push(targetPos.clone());

      bentoGroup.add(mainBox);
      bentoPanels.push(mainBox);
    });

    // ----- Scene 3: Geopolitical Lattice (Wall of Nations) -----
    const wallGroup = new THREE.Group();
    scene.add(wallGroup);

    const wallGridSize = 25;
    const wallNodesCount = wallGridSize * wallGridSize;
    const wallGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const wallMatDefault = new THREE.MeshPhysicalMaterial({
      color: "#6b6154",
      roughness: 0.1,
      metalness: 0.9,
    });
    const wallInstanced = new THREE.InstancedMesh(
      wallGeo,
      wallMatDefault,
      wallNodesCount
    );

    // Store grid structures
    const wallGridPoints: {
      origX: number;
      origY: number;
      origZ: number;
      currX: number;
      currY: number;
      currZ: number;
      velY: number;
    }[] = [];

    const spacingX = 0.45;
    const spacingY = 0.45;

    for (let r = 0; r < wallGridSize; r++) {
      for (let c = 0; c < wallGridSize; c++) {
        const x = (c - wallGridSize / 2) * spacingX;
        const y = (r - wallGridSize / 2) * spacingY;
        const z = -6;

        wallGridPoints.push({
          origX: x,
          origY: y,
          origZ: z,
          currX: x,
          currY: y,
          currZ: z,
          velY: 0,
        });

        dummyMatrix.position.set(x, y, z);
        dummyMatrix.updateMatrix();
        wallInstanced.setMatrixAt(r * wallGridSize + c, dummyMatrix.matrix);
      }
    }
    wallInstanced.instanceMatrix.needsUpdate = true;
    wallGroup.add(wallInstanced);

    // Custom Lattice Connectors for World Mesh
    const latticeLines: THREE.Line[] = [];
    const latticeCount = 120;
    const latticeLineMat = new THREE.LineBasicMaterial({
      color: "#A29A8E",
      transparent: true,
      opacity: 0,
    });

    for (let i = 0; i < latticeCount; i++) {
      const idxA = Math.floor(Math.random() * wallNodesCount);
      let idxB = idxA + (Math.random() > 0.5 ? 1 : wallGridSize);
      if (idxB >= wallNodesCount) idxB = idxA - 1;

      const pA = wallGridPoints[idxA];
      const pB = wallGridPoints[idxB];

      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pA.origX, pA.origY, pA.origZ),
        new THREE.Vector3(pB.origX, pB.origY, pB.origZ),
      ]);
      const lLine = new THREE.Line(lineGeo, latticeLineMat.clone());
      wallGroup.add(lLine);
      latticeLines.push(lLine);
    }

    // ----- Scene 4: Celestial Wireframe Earth Globe -----
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner glowing sphere (celestial core)
    const globeSphereGeo = new THREE.SphereGeometry(2.3, 36, 18);
    const globeSphereMat = new THREE.MeshPhysicalMaterial({
      color: "#FFFFFF",
      roughness: 0.15,
      metalness: 0.2,
      transmission: 0.9,
      thickness: 1.0,
      transparent: true,
      opacity: 0.12,
    });
    const globeSphere = new THREE.Mesh(globeSphereGeo, globeSphereMat);
    globeGroup.add(globeSphere);

    // Outer wireframe mesh (silver constraints)
    const globeWireMat = new THREE.MeshBasicMaterial({
      color: "#968F83",
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const globeWire = new THREE.Mesh(globeSphereGeo, globeWireMat);
    globeGroup.add(globeWire);

    // Astrolabe Rotating Rings
    const loopRingGeo = new THREE.RingGeometry(2.8, 2.85, 64);
    const loopRingMat = new THREE.MeshBasicMaterial({
      color: "#6B6051",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const loopRing = new THREE.Mesh(loopRingGeo, loopRingMat);
    loopRing.rotation.x = Math.PI / 2.3;
    globeGroup.add(loopRing);

    const loopRing2 = new THREE.Mesh(loopRingGeo, loopRingMat);
    loopRing2.rotation.y = Math.PI / 4;
    globeGroup.add(loopRing2);

    // Arch networks representing connections (Data Arcs)
    const activeArcsGroup = new THREE.Group();
    globeGroup.add(activeArcsGroup);

    const arcsCount = 15;
    const arcCurves: THREE.CatmullRomCurve3[] = [];
    const arcPointMeshes: THREE.Mesh[] = [];

    const arcMat = new THREE.LineBasicMaterial({
      color: "#4C443C",
      transparent: true,
      opacity: 0.5,
    });

    for (let i = 0; i < arcsCount; i++) {
      // Pick random coordinates on a sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.3;

      const pA = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      const thetaB = theta + (Math.random() - 0.5) * 1.5;
      const phiB = phi + (Math.random() - 0.5) * 1.5;
      const pB = new THREE.Vector3(
        r * Math.sin(phiB) * Math.cos(thetaB),
        r * Math.sin(phiB) * Math.sin(thetaB),
        r * Math.cos(phiB)
      );

      // Midpoint extruded outwards to create arcs
      const pMid = new THREE.Vector3()
        .addVectors(pA, pB)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(2.3 + 0.6 + Math.random() * 0.6);

      const curve = new THREE.CatmullRomCurve3([pA, pMid, pB]);
      arcCurves.push(curve);

      const curvePoints = curve.getPoints(24);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const curveLine = new THREE.Line(curveGeo, arcMat);
      activeArcsGroup.add(curveLine);

      // Small light pulse on arc
      const trackerGeo = new THREE.SphereGeometry(0.05, 6, 6);
      const trackerMat = new THREE.MeshBasicMaterial({ color: "#61574A" });
      const trackerNode = new THREE.Mesh(trackerGeo, trackerMat);
      activeArcsGroup.add(trackerNode);
      arcPointMeshes.push(trackerNode);
    }

    // ----- Scene 5: Interstellar Constellation -----
    const spaceGroup = new THREE.Group();
    scene.add(spaceGroup);

    const planetCount = 6;
    const planets: THREE.Mesh[] = [];
    const planetLabels: string[] = ["Earth", "Mars", "Jupiter", "Saturn", "Neptune", "Proxima"];
    const planetColors: string[] = ["#DDD1C4", "#D5C8B9", "#EAE6DF", "#CCC1B0", "#DFD4C4", "#C6B9AA"];
    const planetSizes: number[] = [1.2, 0.6, 2.0, 1.6, 1.4, 0.5];

    // Align planets linearly representing a spatial grid alignment in deep space
    for (let i = 0; i < planetCount; i++) {
      const pGeo = new THREE.SphereGeometry(planetSizes[i], 32, 16);
      const pMat = new THREE.MeshPhysicalMaterial({
        color: planetColors[i],
        roughness: 0.1,
        metalness: 0.05,
        transmission: 0.8,
        thickness: 0.5,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(pGeo, pMat);
      // Line them up along X and Z-axis
      mesh.position.set((i - (planetCount - 1) / 2) * 5.5, (Math.sin(i) * 0.4), -i * 3);

      // Add a thin orbits around larger ones
      if (planetSizes[i] > 1.2) {
        const ringGeo = new THREE.RingGeometry(planetSizes[i]*1.3, planetSizes[i]*1.35, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: "#8E8679", side: THREE.DoubleSide, opacity: 0.2, transparent: true });
        const pRing = new THREE.Mesh(ringGeo, ringMat);
        pRing.rotation.x = Math.PI / 2.1;
        mesh.add(pRing);
      }

      spaceGroup.add(mesh);
      planets.push(mesh);
    }

    // Interstellar lasers spanning between planets (Highways)
    const interstellarHighwayMat = new THREE.LineBasicMaterial({
      color: "#5B5145",
      transparent: true,
      opacity: 0,
    });
    const highwayLines: THREE.Line[] = [];
    for (let i = 0; i < planetCount - 1; i++) {
      const pA = planets[i].position;
      const pB = planets[i + 1].position;
      const hGeo = new THREE.BufferGeometry().setFromPoints([pA, pB]);
      const hLine = new THREE.Line(hGeo, interstellarHighwayMat.clone());
      spaceGroup.add(hLine);
      highwayLines.push(hLine);
    }

    // ----- Scene 6: Macro Galactic Warp Tunnel -----
    const warpGroup = new THREE.Group();
    scene.add(warpGroup);

    const warpStarsCount = 450;
    const warpPositions = new Float32Array(warpStarsCount * 3);
    const warpColors = new Float32Array(warpStarsCount * 3);
    const warpSizes = new Float32Array(warpStarsCount);

    const originalZCoordinates: number[] = [];

    for (let i = 0; i < warpStarsCount; i++) {
      // Cylindrical distribution along Z
      const radius = 2.0 + Math.random() * 8.0;
      const angle = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 80; // stretch deep along Z

      warpPositions[i * 3] = Math.cos(angle) * radius;
      warpPositions[i * 3 + 1] = Math.sin(angle) * radius;
      warpPositions[i * 3 + 2] = z;
      originalZCoordinates.push(z);

      // Grayscale subtle luxury accents
      const intensity = 0.4 + Math.random() * 0.6;
      warpColors[i * 3] = intensity; // R
      warpColors[i * 3 + 1] = intensity * 0.95; // G
      warpColors[i * 3 + 2] = intensity * 0.9; // B

      warpSizes[i] = 1.0 + Math.random() * 3.5;
    }

    const warpGeometry = new THREE.BufferGeometry();
    warpGeometry.setAttribute("position", new THREE.BufferAttribute(warpPositions, 3));
    warpGeometry.setAttribute("color", new THREE.BufferAttribute(warpColors, 3));

    // Simple procedural circular particle shader
    const warpTexture = (() => {
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
      return new THREE.CanvasTexture(canvas);
    })();

    const warpPointsMat = new THREE.PointsMaterial({
      size: 0.12,
      map: warpTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0, // initially invisible
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const warpPoints = new THREE.Points(warpGeometry, warpPointsMat);
    warpGroup.add(warpPoints);

    // ----- Scene 7: The G.trans Torus Ring Climax -----
    const nexusGroup = new THREE.Group();
    scene.add(nexusGroup);

    // Large swirling Torus Ring
    const torusGeo = new THREE.TorusGeometry(3.5, 0.4, 16, 100);
    const torusMat = new THREE.MeshPhysicalMaterial({
      color: "#FAF9F5",
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      thickness: 0.8,
      transparent: true,
      opacity: 0.22,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    nexusGroup.add(torusMesh);

    // Wireframe outline for celestial look
    const torusWireMat = new THREE.MeshBasicMaterial({
      color: "#9F978A",
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const torusWire = new THREE.Mesh(torusGeo, torusWireMat);
    nexusGroup.add(torusWire);

    // Central Glassmorphic Typographical Monument Frame
    // We render an intricate, luxurious architectural glass plate to serve as the physical base of G.trans
    const monumentGeo = new THREE.BoxGeometry(4.2, 1.2, 0.2);
    const monumentMat = new THREE.MeshPhysicalMaterial({
      color: "#FFFFFF",
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.95,
      thickness: 1.2,
      transparent: true,
      opacity: 0.8,
      ior: 1.6,
    });
    const monumentMesh = new THREE.Mesh(monumentGeo, monumentMat);
    monumentMesh.position.set(0, 0, 0);
    nexusGroup.add(monumentMesh);

    // Outer framing coordinates
    const monumentBorderGeo = new THREE.BoxGeometry(4.35, 1.35, 0.25);
    const monumentBorderMat = new THREE.MeshBasicMaterial({
      color: "#5c5449",
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const monumentBorder = new THREE.Mesh(monumentBorderGeo, monumentBorderMat);
    monumentMesh.add(monumentBorder);

    // Spiral swirling particles orbiting torus
    const ringParticlesCount = 350;
    const ringGeo = new THREE.BufferGeometry();
    const ringPositions = new Float32Array(ringParticlesCount * 3);
    const ringSpeeds: number[] = [];
    const ringAngles: number[] = [];
    const ringRadii: number[] = [];

    for (let i = 0; i < ringParticlesCount; i++) {
      const angle = (i / ringParticlesCount) * Math.PI * 2;
      const radius = 3.2 + (Math.random() - 0.5) * 0.8;
      const y = (Math.random() - 0.5) * 1.2;

      ringPositions[i * 3] = Math.cos(angle) * radius;
      ringPositions[i * 3 + 1] = y;
      ringPositions[i * 3 + 2] = Math.sin(angle) * radius;

      ringSpeeds.push(0.003 + Math.random() * 0.005);
      ringAngles.push(angle);
      ringRadii.push(radius);
    }
    ringGeo.setAttribute("position", new THREE.BufferAttribute(ringPositions, 3));
    const ringMat = new THREE.PointsMaterial({
      size: 0.08,
      color: "#746B5F",
      transparent: true,
      opacity: 0,
      map: warpTexture,
      depthWrite: false,
    });
    const ringPoints = new THREE.Points(ringGeo, ringMat);
    nexusGroup.add(ringPoints);

    // ==========================================
    // RAYCASTING & INTERACTION
    // ==========================================
    const raycaster = new THREE.Raycaster();
    const ndcMouse = new THREE.Vector2();

    const checkInteractions = () => {
      // Map screen cursor coordinates to normalized device coordinates (-1 to +1)
      ndcMouse.x = stateRef.current.mouseX * 2;
      ndcMouse.y = stateRef.current.mouseY * 2;

      raycaster.setFromCamera(ndcMouse, camera);

      if (stateRef.current.stage === Stage.ULTIMATE_NEXUS) {
        const intersects = raycaster.intersectObject(monumentMesh);
        if (intersects.length > 0) {
          // Hover distortion of glass frame
          gsap.to(monumentMesh.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 0.5 });
          gsap.to(torusMesh.rotation, { z: "+=0.002" });
        } else {
          gsap.to(monumentMesh.scale, { x: 1, y: 1, z: 1, duration: 0.8 });
        }
      }
    };


    // ==========================================
    // INITIAL HIDDEN POSITIONS FOR OFF-SCREEN MESHES
    // ==========================================
    bentoGroup.position.set(0, 0, -20);
    bentoGroup.scale.set(0.1, 0.1, 0.1);

    wallGroup.position.set(0, 0, -30);

    globeGroup.position.set(0, 0, -40);
    globeGroup.scale.set(0.1, 0.1, 0.1);

    spaceGroup.position.set(0, 0, -60);
    spaceGroup.scale.set(0.1, 0.1, 0.1);

    nexusGroup.position.set(0, 0, -50);
    nexusGroup.scale.set(0.01, 0.01, 0.01);


    // ==========================================
    // SCENE TIMELINE AND LERP TRANSITIONS
    // ==========================================
    // The core scrollytelling frame render loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const state = stateRef.current;
      // Spring elastic interpolation
      const prev = state.lerpedProgress;
      state.lerpedProgress += (scrollProgress - state.lerpedProgress) * 0.075;
      const progress = state.lerpedProgress;

      // Calculate instantaneous scroll speed to feed into chromatic shader thresholds
      state.velocity = Math.abs(progress - prev);

      // Determine active stage based on thresholds
      let activeStage: Stage;
      if (progress < 0.14) activeStage = Stage.MICRO_FILAMENT;
      else if (progress < 0.28) activeStage = Stage.COLLECTIVE_SWARM;
      else if (progress < 0.42) activeStage = Stage.GEOPOLITICAL_LIQ;
      else if (progress < 0.57) activeStage = Stage.PLANETARY_GRID;
      else if (progress < 0.71) activeStage = Stage.INTERSTELLAR_CONST;
      else if (progress < 0.85) activeStage = Stage.MACRO_WARP;
      else activeStage = Stage.ULTIMATE_NEXUS;

      if (activeStage !== state.stage) {
        state.stage = activeStage;
        onStageChange(activeStage);
      }

      // Parallax mouse follow offset based on screen inputs
      const parallaxX = state.mouseX * 0.45;
      const parallaxY = state.mouseY * 0.45;

      // ----------------------------------------------------
      // LERP BEHAVIORS PER STAGE
      // ----------------------------------------------------

      // Default Group Rotations for constant movement
      filamentGroup.rotation.y += 0.001;
      bentoGroup.rotation.y = Math.sin(progress * 2) * 0.15 + parallaxX * 0.05;
      bentoGroup.rotation.x = parallaxY * 0.05;

      globeGroup.rotation.y += 0.002 + parallaxX * 0.002;
      globeGroup.rotation.x = parallaxY * 0.1;

      spaceGroup.rotation.y = progress * 0.8 + parallaxX * 0.05;
      warpGroup.rotation.z += 0.0008;

      nexusGroup.rotation.y = progress * 1.5 + parallaxX * 0.15;
      nexusGroup.rotation.x = Math.sin(progress * 2) * 0.1 + parallaxY * 0.15;

      // 1. Scene 1 & 2 Filament nodes flow
      const flowPositions = flowInstanced.instanceMatrix.array;
      for (let i = 0; i < flowCount; i++) {
        flowProgress[i] += flowSpeeds[i];
        if (flowProgress[i] > 1.0) flowProgress[i] = 0;

        const lineIdx = flowLineIndices[i];
        const line = filamentLines[lineIdx];
        const lineGeo = line.geometry;
        const pts = lineGeo.attributes.position.array;
        const totalPts = pts.length / 3;

        // Linear interpolation along vertices of curves
        const exactPt = flowProgress[i] * (totalPts - 1);
        const baseIdx = Math.floor(exactPt);
        const fract = exactPt - baseIdx;

        const xA = pts[baseIdx * 3];
        const yA = pts[baseIdx * 3 + 1];
        const zA = pts[baseIdx * 3 + 2];

        const nextIdx = Math.min(baseIdx + 1, totalPts - 1);
        const xB = pts[nextIdx * 3];
        const yB = pts[nextIdx * 3 + 1];
        const zB = pts[nextIdx * 3 + 2];

        const flowingX = xA + (xB - xA) * fract;
        const flowingY = yA + (yB - yA) * fract;
        const flowingZ = zA + (zB - zA) * fract;

        dummyMatrix.position.set(flowingX, flowingY, flowingZ);
        dummyMatrix.updateMatrix();
        flowInstanced.setMatrixAt(i, dummyMatrix.matrix);
      }
      flowInstanced.instanceMatrix.needsUpdate = true;

      // 2. Stage Interpolations
      if (progress < 0.14) {
        // --- STAGE 1: Micro-Filament Sync ---
        const localT = progress / 0.14; // 0 to 1

        // Camera deep spatial tracking along Z-axis
        camera.position.set(parallaxX, parallaxY, 10 - localT * 4);
        camera.lookAt(0, 0, 0);

        filamentGroup.position.set(0, 0, 0);
        filamentGroup.scale.set(1, 1, 1);
        filamentLines.forEach((l) => {
          (l.material as THREE.LineBasicMaterial).opacity = 0.18 + Math.sin(localT * Math.PI) * 0.12;
        });

        // Hide rest
        bentoGroup.position.set(0, 0, -30);
        bentoGroup.scale.set(0.01, 0.01, 0.01);
      } 
      else if (progress < 0.28) {
        // --- STAGE 2: Collective Swarm UI ---
        const localT = (progress - 0.14) / 0.14; // 0 to 1

        // Dolly zoom back to display Bento Console spatial plane
        const camZ = 6 + localT * 4.5;
        camera.position.set(parallaxX, parallaxY, camZ);
        camera.lookAt(0, 0, 0);

        // Move filament lines away gracefully
        filamentGroup.position.set(0, 0, localT * 20);
        filamentLines.forEach((l) => {
          (l.material as THREE.LineBasicMaterial).opacity = 0.18 * (1 - localT);
        });

        // Pull Bento elements into display viewport with elegant elastic bounds
        const bentoZIndex = -5 + localT * 5; // move from -5 to 0
        const bentoScale = 0.1 + localT * 0.9;
        bentoGroup.position.set(0, 0, bentoZIndex);
        bentoGroup.scale.set(bentoScale, bentoScale, bentoScale);

        // Update wireframe mesh opacities
        bentoPanels.forEach((p, idx) => {
          const wire = p.children[0] as THREE.Mesh;
          const wMat = wire.material as THREE.MeshBasicMaterial;
          wMat.opacity = 0.35 * localT;
          (p.material as THREE.MeshPhysicalMaterial).opacity = 0.6 * localT;
        });

        // Warm light color shifting slightly
        bulb1.intensity = 1.8 + localT * 0.5;

        // Hide Scene 3
        wallGroup.position.set(0, 0, -40);
        latticeLines.forEach((l) => {
          (l.material as THREE.LineBasicMaterial).opacity = 0;
        });
      } 
      else if (progress < 0.42) {
        // --- STAGE 3: Geopolitical Liquefaction ---
        const localT = (progress - 0.28) / 0.14; // 0 to 1

        // Move camera inches close to lattice to initiate maximum blur (DoF mockup)
        const camZ = 10.5 - localT * 6.5; // moves from 10.5 down to 4
        camera.position.set(parallaxX, parallaxY, camZ);
        camera.lookAt(0, 0, 0);

        // Fade Bento panels and translate them outward
        bentoGroup.position.set(0, 0, localT * 4);
        bentoPanels.forEach((p, idx) => {
          const pOrig = bentoOriginalPositions[idx];
          p.position.set(
            pOrig.x * (1 + localT * 2),
            pOrig.y * (1 + localT * 2),
            pOrig.z
          );
          (p.material as THREE.MeshPhysicalMaterial).opacity = 0.6 * (1 - localT);
          const wire = p.children[0] as THREE.Mesh;
          (wire.material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - localT);
        });

        // Bring the Wall of Nations into focus
        const wallZ = -10 + localT * 8.5; // moves from -10 to -1.5
        wallGroup.position.set(0, 0, wallZ);

        // SDF Fluid Liquefaction melt simulation: points begin to liquefy downwards
        // Generate dripping liquid metals
        const meltFactor = Math.max(0, localT - 0.3) * 1.4;

        for (let r = 0; r < wallGridSize; r++) {
          for (let c = 0; c < wallGridSize; c++) {
            const idx = r * wallGridSize + c;
            const pt = wallGridPoints[idx];

            // Add sine fluid warp to mesh simulation
            const wave = Math.sin(pt.origX * 1.5 + localT * 8.0) * 0.08 * meltFactor;
            const noise = Math.cos(pt.origY * 2.0 + localT * 10.0) * 0.05 * meltFactor;
            const gravityMelt = pt.origY > 0 ? -0.45 * meltFactor * (pt.origY) : -0.2 * meltFactor;

            pt.currY = pt.origY + wave + spaceGroup.position.y + gravityMelt;
            pt.currX = pt.origX + noise;

            dummyMatrix.position.set(pt.currX, pt.currY, pt.origZ);
            // Change colors of dripping nodes dynamically
            dummyMatrix.scale.set(
              1.0 + meltFactor * 0.4,
              1.0 - meltFactor * 0.3,
              1.0 + meltFactor * 0.2
            );
            dummyMatrix.updateMatrix();
            wallInstanced.setMatrixAt(idx, dummyMatrix.matrix);
          }
        }
        wallInstanced.instanceMatrix.needsUpdate = true;

        // Animate grid connector opacities
        latticeLines.forEach((l, idx) => {
          const pGeo = l.geometry;
          const points = pGeo.attributes.position.array as Float32Array;
          // Dynamically link lines to flowing nodes
          const pA = wallGridPoints[idx % wallNodesCount];
          const pB = wallGridPoints[(idx * 2) % wallNodesCount];

          points[0] = pA.currX;
          points[1] = pA.currY;
          points[2] = pA.origZ;
          points[3] = pB.currX;
          points[4] = pB.currY;
          points[5] = pB.origZ;
          pGeo.attributes.position.needsUpdate = true;

          (l.material as THREE.LineBasicMaterial).opacity = 0.45 * localT * (1 - meltFactor * 0.5);
        });

        // Hide Scene 4
        globeGroup.position.set(0, 0, -35);
        globeGroup.scale.set(0.01, 0.01, 0.01);
      } 
      else if (progress < 0.57) {
        // --- STAGE 4: Planetary Grid Singularity ---
        const localT = (progress - 0.42) / 0.15; // 0 to 1

        // Non-linear Dolly Zoom (Vertigo-esque Camera push back and zoom)
        const camZ = 4 + localT * 5.5; // cam position repositions smoothly back to 9.5
        camera.position.set(parallaxX, parallaxY, camZ);
        camera.lookAt(0, 0, 0);

        // Dissolve / scale out the liquid dripping lattice wall of stage 3
        wallGroup.position.set(0, 0, localT * 8);
        wallGroup.scale.set(1 - localT, 1 - localT, 1 - localT);
        latticeLines.forEach((l) => {
          (l.material as THREE.LineBasicMaterial).opacity = 0.25 * (1 - localT);
        });

        // Astrolabe globe is centered and expands dynamically
        const globeZ = -15 + localT * 15; // slides from -15 to 0
        const globeS = 0.1 + localT * 0.9;
        globeGroup.position.set(0, 0, globeZ);
        globeGroup.scale.set(globeS, globeS, globeS);

        // Astrolabe slow orbiting mesh loops
        loopRing.rotation.z = localT * 1.5;
        loopRing2.rotation.z = -localT * 2.2;

        globeWireMat.opacity = 0.28 * localT;
        globeSphereMat.opacity = 0.12 * localT;

        // Drive connection arc point pulses
        for (let i = 0; i < arcsCount; i++) {
          const mesh = arcPointMeshes[i];
          const curve = arcCurves[i];
          // Wrap path lookup periodically
          const arcP = (progress * 5 + i * 0.12) % 1.0;
          const pos = curve.getPointAt(arcP);
          mesh.position.copy(pos);
          mesh.scale.setScalar(0.7 + Math.sin(progress * 15 + i) * 0.3);
        }

        // Hide Scene 5
        spaceGroup.position.set(0, 0, -50);
        spaceGroup.scale.set(0.01, 0.01, 0.01);
      } 
      else if (progress < 0.71) {
        // --- STAGE 5: Interstellar Constellation ---
        const localT = (progress - 0.57) / 0.14; // 0 to 1

        // Dolly zoom back further to deep space coordinates
        const camZ = 9.5 + localT * 6.5; // move from 9.5 to 16
        camera.position.set(parallaxX, parallaxY + localT * 1.5, camZ);
        camera.lookAt(0, 0, 0);

        // Astro-globe shrinks into a single planetary node
        globeGroup.scale.set(1 - localT * 0.7, 1 - localT * 0.7, 1 - localT * 0.7);
        // Slowly align with the deep space system mesh
        globeGroup.position.set(-8.5, 0, -localT * 5);

        // Bring porcelain planet constellations into composition focus
        const spaceZ = -30 + localT * 30; // slide from -30 to 0
        const spaceS = 0.1 + localT * 0.9;
        spaceGroup.position.set(0, 0.5, spaceZ);
        spaceGroup.scale.set(spaceS, spaceS, spaceS);

        // Animate interstellar lasers highway transparency
        highwayLines.forEach((h) => {
          (h.material as THREE.LineBasicMaterial).opacity = 0.38 * localT;
        });

        // Hide warp particles
        warpPointsMat.opacity = 0;
      } 
      else if (progress < 0.85) {
        // --- STAGE 6: Macro Galactic Warp Tunnel ---
        const localT = (progress - 0.71) / 0.14; // 0 to 1

        // Rapid dolly-out directly along the core Z axis
        camera.position.set(parallaxX, parallaxY, 16 + localT * 18);
        camera.lookAt(0, 0, 0);

        // Porcelain planets dissolve into spatial elements
        spaceGroup.scale.set(1 - localT, 1 - localT, 1 - localT);
        spaceGroup.position.set(0, 0, localT * 15);
        globeGroup.scale.setScalar(0.3 * (1 - localT));

        // Activate hyper-drive galactic particles warp
        warpPointsMat.opacity = Math.min(1.0, localT * 1.3);

        const posAttr = warpGeometry.attributes.position;
        const positions = posAttr.array as Float32Array;

        // High mathematical coordinates stretch simulating relativistic warp
        for (let i = 0; i < warpStarsCount; i++) {
          const baseZ = originalZCoordinates[i];
          // Translate stars toward viewport based on local time
          let currZ = baseZ + localT * 150.0;
          // Wrap particles cleanly to maintain the seamless tunnel
          if (currZ > 40) currZ = -40 + ((currZ - 40) % 80);
          positions[i * 3 + 2] = currZ;

          // Stretch particle geometry shapes based on velocity acceleration
          // Z stretch factors
          warpSizes[i] = (1.0 + Math.random() * 3.5) * (1.0 + localT * 4.5);
        }
        posAttr.needsUpdate = true;
        warpPoints.scale.set(1, 1, 1 + localT * 2.8); // physical stretch of mesh along Z

        // High tone exposure spike for flash impact
        renderer.toneMappingExposure = 1.0 + Math.sin(localT * Math.PI) * 0.45;

        // Hide finale elements
        nexusGroup.scale.setScalar(0.01);
        ringMat.opacity = 0;
      } 
      else {
        // --- STAGE 7: The G.trans Ultimate Nexus ---
        const localT = (progress - 0.85) / 0.15; // 0 to 1

        // Smooth stabilization deceleration coordinates
        camera.position.set(parallaxX * 0.6, parallaxY * 0.6, 12 - localT * 2);
        camera.lookAt(0, 0, 0);

        // Stabilize tone exposure mapping
        renderer.toneMappingExposure = 1.0;

        // Dissolve warp tunnel
        warpPointsMat.opacity = 1 - localT;

        // Torus Climax materializes beautifully
        const nexusS = 0.01 + localT * 0.99;
        nexusGroup.position.set(0, 0.4, 0);
        nexusGroup.scale.set(nexusS, nexusS, nexusS);

        // Animate swirling ring point particles around Torus
        const pArr = ringPoints.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < ringParticlesCount; i++) {
          ringAngles[i] += ringSpeeds[i] * (1.0 + parallaxX * 0.1);
          const rad = ringRadii[i] + Math.sin(progress * 4 + i) * 0.05;
          pArr[i * 3] = Math.cos(ringAngles[i]) * rad;
          pArr[i * 3 + 1] = Math.sin(progress * 2 + i) * 0.4;
          pArr[i * 3 + 2] = Math.sin(ringAngles[i]) * rad;
        }
        ringPoints.geometry.attributes.position.needsUpdate = true;

        ringMat.opacity = 0.85 * localT;
        torusWireMat.opacity = 0.15 * localT;
        torusMat.opacity = 0.22 * localT;
        monumentMat.opacity = 0.85 * localT;
        monumentBorderMat.opacity = 0.35 * localT;

        // Perform raycast checking
        checkInteractions();
      }

      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // REACTION TO WINDOW RESIZE
    // ==========================================
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(containerRef.current);

    // Cleanups on component unmounting
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (renderer) renderer.dispose();
      flowGeo.dispose();
      flowMat.dispose();
      bentoGeo.dispose();
      glassMat.dispose();
      wireframeMat.dispose();
      wallGeo.dispose();
      wallMatDefault.dispose();
      globeSphereGeo.dispose();
      globeSphereMat.dispose();
      globeWireMat.dispose();
      loopRingGeo.dispose();
      loopRingMat.dispose();
      arcMat.dispose();
      warpGeometry.dispose();
      warpPointsMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      monumentGeo.dispose();
      monumentMat.dispose();
      monumentBorderMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, [onStageChange]);

  // Synchronize dynamic progress updates manually to the ref
  useEffect(() => {
    // Keep target progress stored in our animation coordinate system
  }, [scrollProgress]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full overflow-hidden select-none pointer-events-auto"
      style={{ zIndex: 0 }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
