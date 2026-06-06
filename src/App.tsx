/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { Stage } from "./types";
import { SpatialCanvas } from "./components/SpatialCanvas";
import { GTransHUD } from "./components/GTransHUD";
import { FloatingProfileCards } from "./components/FloatingProfileCards";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, Orbit, Compass, Activity, ArrowUpRight } from "lucide-react";

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<Stage>(Stage.MICRO_FILAMENT);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);

  // Stage details dictionary (Editorial Copy)
  const stageDetails = [
    {
      id: 0,
      num: "01",
      titleJP: "微細輝線の同期",
      titleEN: "Micro-Filament Sync",
      headline: "一つの意志が、言語の壁に架け梯子を渡す。",
      subline: "Two glassmorphic node profiles sit at different depths along the Z-axis. Upon scrolling, high-fidelity vacuum filaments shoot from the void. Monospace telemetry streams collide and decode instantly.",
      meta: [
        { label: "Ley-lines Synchronized", value: "28 FILAMENTS" },
        { label: "Translation Decoders", value: "142 STREAMS" },
        { label: "SDF Path Tolerance", value: "0.245 μm" },
        { label: "Wave Carrier Freq", value: "624.4 THz" }
      ]
    },
    {
      id: 1,
      num: "02",
      titleJP: "集合コンソール流動",
      titleEN: "The Collective Swarm",
      headline: "カオスは高次のシステムへ再構築される。",
      subline: "Dolly backward to reveal a floating 3D bento grid interface. Elastic spring-physics absorb scattered multi-language text particles, formatting them into organic human conversations.",
      meta: [
        { label: "Refractive Index", value: "0.85 (GLASS)" },
        { label: "Bento sub-systems", value: "8 ACTIVE" },
        { label: "Volume density", value: "1,200 CELL" },
        { label: "Entropy Index", value: "0.012% (STABLE)" }
      ]
    },
    {
      id: 2,
      num: "03",
      titleJP: "硬質国境の液状化と融解",
      titleEN: "Geopolitical Liquefaction",
      headline: "分断という無機質な構造壁が、溶け落ちる。",
      subline: "The camera pushes inches close to the 'Wall of Nations'. Rigid national borders and lines melt under organic fluid shaders into glistening liquid-metal droplets, blending into global synergy.",
      meta: [
        { label: "Melting Point", value: "1,840° / CORE" },
        { label: "Fluid Viscosity", value: "0.32 Pa·s" },
        { label: "Lattice Tension", value: "0.04 N/m" },
        { label: "SDF Fluid Speed", value: "14.28 rad/s" }
      ]
    },
    {
      id: 3,
      num: "04",
      titleJP: "地球特異点の接続",
      titleEN: "Planetary Grid Singularity",
      headline: "一つの惑星を、数百万の光芒で覆い尽くす。",
      subline: "Dolly zoom (Vertigo effect). The entire global network wraps onto a rotating 3D Celestial Globe styled like a luxury silver-and-brass astrolabe. Connection arcs saturate the planet coordinates.",
      meta: [
        { label: "Astrolabe Radius", value: "2.3 METERS" },
        { label: "Connection Arcs", value: "15 LINES" },
        { label: "Geodesic Speed", value: "0.024 rpm" },
        { label: "Core Luminosity", value: "1.45 kcd/m²" }
      ]
    },
    {
      id: 4,
      num: "05",
      titleJP: "星間共感ハイウェイ",
      titleEN: "Interstellar Constellation",
      headline: "地球を超え、星空ですら言葉の壁は消え失せる。",
      subline: "Dolly out deep. The Earth shrinks into a single node within an alignment of white-porcelain planetary spheres. Interplanetary light runways transmit monospace telemetry streams instantly.",
      meta: [
        { label: "Planets Integrated", value: "6 SPHERES" },
        { label: "Transit Bounds", value: "4.2 LY (PROXIMA)" },
        { label: "Wavelength Speed", value: "99.85% / MAX" },
        { label: "Carrier Index", value: "84.2 GHz" }
      ]
    },
    {
      id: 5,
      num: "06",
      titleJP: "銀河超越超空間ワープ",
      titleEN: "Macro Galactic Warp",
      headline: "次元を引き伸ばし、光速データトンネルを疾駆する。",
      subline: "Warp protocol initialized. The compute shader stretches stellar coordinates and lexical pieces along the Z-axis. Experience the breathtaking sensation of flying through infinite language streams.",
      meta: [
        { label: "Relativistic Stretch", value: "x2.8 Z-AXIS" },
        { label: "Velocity Curve", value: "0.98c (HYPER)" },
        { label: "Simulated Stars", value: "450 AXES" },
        { label: "Tunnel Length", value: "80.0 LIGHTSEC" }
      ]
    },
    {
      id: 6,
      num: "07",
      titleJP: "万物調和：G.trans ネクサス",
      titleEN: "The Ultimate Nexus",
      headline: "すべての境界を消去し、一つに調和する。",
      subline: "Deceleration. Swirling stars form a giant, fluid rotating 3D Torus ring centered on the glowing G.trans monument. Millions of lanes shoot through, creating a synchronized loop of cosmic connection.",
      meta: [
        { label: "Nexus Monument", value: "SOLID GLASS" },
        { label: "Intersections", value: "INFINITE / SEC" },
        { label: "Torus Particles", value: "350 SYSTEMS" },
        { label: "System Status", value: "SYNCHRONIZED" }
      ]
    }
  ];

  // Monitor Window Scroll Updates
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
          
          setScrollProgress(progress);

          // Calculate scrolling velocity for real-time chromatic aberration
          const deltaY = Math.abs(scrollY - lastScrollY.current);
          scrollVelocity.current = Math.min(20, deltaY * 0.08); // cap for visual aesthetics
          lastScrollY.current = scrollY;

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Monitor Cursor Coordinates for Raycasting parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleStageChange = (stage: Stage) => {
    setCurrentStage(stage);
  };

  const handleNavigateToStage = (index: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (index / 6) * maxScroll;
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth"
    });
  };

  // Map chromatic aberration based on scroll speed
  const aberrationOffset = scrollVelocity.current > 0.5 ? `${scrollVelocity.current * 0.4}px` : "0px";

  return (
    <div className="relative min-h-[700vh] w-full bg-[#FAF9F5] selection:bg-neutral-100 overflow-visible">
      
      {/* Dynamic Chromatic Aberration & Glow Overlay Reactor */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none transition-all duration-300 pointer-events-none z-45"
        style={{
          boxShadow: scrollVelocity.current > 1.5 
            ? `inset 0 0 40px rgba(124, 117, 107, ${Math.min(0.12, scrollVelocity.current * 0.01)})` 
            : "none"
        }}
      />

      {/* Analog Retro Shaders */}
      <div className="film-grain" />
      <div className="crt-overlay" />

      {/* Custom Creative Technologist Cursor Circle */}
      <motion.div
        animate={{
          x: (mousePos.x + 0.5) * window.innerWidth - 6,
          y: (mousePos.y + 0.5) * window.innerHeight - 6,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-neutral-900 z-50 pointer-events-none mix-blend-difference hidden md:block"
      />
      <motion.div
        animate={{
          x: (mousePos.x + 0.5) * window.innerWidth - 24,
          y: (mousePos.y + 0.5) * window.innerHeight - 24,
          scale: scrollVelocity.current > 1.2 ? 1.4 : 1,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 30 }}
        className="fixed top-0 left-0 w-12 h-12 rounded-full border border-neutral-400/40 z-50 pointer-events-none mix-blend-difference hidden md:block"
      />

      {/* 3D Spatial Canvas Framework */}
      <div className="fixed inset-0 w-full h-full z-0 block">
        <SpatialCanvas 
          scrollProgress={scrollProgress} 
          mousePos={mousePos}
          onStageChange={handleStageChange}
        />
      </div>

      {/* Persistent HUD & Left Navigation Indicatings */}
      <GTransHUD 
        currentStage={currentStage} 
        scrollProgress={scrollProgress}
        stageDetails={stageDetails}
        onNavigateToStage={handleNavigateToStage}
      />

      {/* Floating Glassmorphic 3D cards overlays */}
      <FloatingProfileCards 
        currentStage={currentStage}
        scrollProgress={scrollProgress}
      />

      {/* ---------------- 7 INVISIBLE HEIGHT STAGES TO SUPPORT NATURAL SCROLL ---------------- */}
      <div className="relative z-1 pointer-events-none">
        
        {/* Section 1: Micro-Filament Sync */}
        <section className="h-[100vh]" />

        {/* Section 2: Collective Bento */}
        <section className="h-[100vh]" />

        {/* Section 3: Geopolitical Melt */}
        <section className="h-[100vh]" />

        {/* Section 4: Celestial Globe */}
        <section className="h-[100vh]" />

        {/* Section 5: Planetary Hwy */}
        <section className="h-[100vh]" />

        {/* Section 6: Galactic Warp */}
        <section className="h-[100vh]" />

        {/* Section 7: G.trans Climax Center */}
        <section className="h-[100vh] relative">
          
          {/* Final climax grand scale call-to-action layout overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
            <AnimatePresence>
              {scrollProgress > 0.95 && (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ type: "spring", damping: 30, stiffness: 100, delay: 0.2 }}
                  className="w-full max-w-xl text-center bg-white/70 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-neutral-200/50 shadow-2xl flex flex-col items-center gap-6 pointer-events-auto"
                >
                  <div className="w-12 h-12 rounded-full border border-neutral-300/60 bg-neutral-50 flex items-center justify-center shadow-inner">
                    <Orbit size={20} className="text-neutral-750 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>

                  <div className="space-y-4">
                    <span className="font-mono text-[10px] bg-neutral-900 text-[#FAF9F5] px-3 py-1 rounded-full tracking-widest uppercase">
                      THE ULTIMATE NEXUS REACHED
                    </span>
                    <h1 className="font-display font-black text-4xl md:text-5xl text-neutral-900 tracking-tighter leading-none">
                      Connecting the Universe.<br />
                      <span className="text-neutral-500 font-light">G.trans</span>
                    </h1>
                    <p className="font-sans text-neutral-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                      All linguistic walls have completely dissolved. The universe is unified under an infinite, fluidly morphing space system. Start your borderless connection today.
                    </p>
                  </div>

                  {/* Buttons and triggers */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-2">
                    <button
                      onClick={() => alert("G.trans Spatial Network is fully synchronized. Ready for data streams.")}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-semibold font-mono tracking-wider bg-neutral-900 text-[#FAF9F5] hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 hover:shadow-neutral-900/10 cursor-pointer pointer-events-auto"
                      id="launch-node-btn"
                    >
                      LAUNCH UNIVERSAL NODE
                      <ArrowRight size={13} />
                    </button>
                    
                    <button
                      onClick={() => handleNavigateToStage(0)}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-semibold font-mono tracking-wider border border-neutral-350 bg-transparent text-neutral-700 hover:bg-neutral-100/50 transition-all active:scale-95 cursor-pointer pointer-events-auto"
                      id="reset-journey-btn"
                    >
                      ASCEND JOURNEY AGAIN
                    </button>
                  </div>

                  {/* Live network stats footer */}
                  <div className="w-full mt-4 pt-6 border-t border-neutral-200/50 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Sparkles size={11} className="text-neutral-500" />
                      COGNITIVE RANGE: INFINITE
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <Activity size={11} className="text-neutral-500" />
                      COSMIC CONVERGENCE: 100%
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </section>

      </div>

    </div>
  );
}
