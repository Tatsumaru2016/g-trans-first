/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Stage } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, 
  Cpu, 
  Workflow, 
  Layers, 
  Radio, 
  Compass, 
  Share2, 
  VolumeX, 
  Volume2,
  ChevronDown
} from "lucide-react";

interface GTransHUDProps {
  currentStage: Stage;
  scrollProgress: number;
  stageDetails: Array<{
    id: number;
    num: string;
    titleJP: string;
    titleEN: string;
    headline: string;
    subline: string;
    meta: Array<{ label: string; value: string }>;
  }>;
  onNavigateToStage: (index: number) => void;
}

export const GTransHUD: React.FC<GTransHUDProps> = ({
  currentStage,
  scrollProgress,
  stageDetails,
  onNavigateToStage,
}) => {
  const [soundEnabled, setSoundEnabled] = React.useState(false);

  // Quick helper to format percentages
  const pct = Math.round(scrollProgress * 100);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-6 md:p-10 font-sans selection:bg-neutral-200">
      
      {/* ----------------- TOP BAR (HUD HEADER) ----------------- */}
      <header className="w-full flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex flex-col">
            <span className="font-display font-bold text-2xl tracking-tighter text-neutral-900">
              G<span className="text-neutral-500 font-light">.trans</span>
            </span>
            <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
              Morphing Spatial UI v1.07
            </span>
          </div>
        </div>

        {/* System Matrix metrics */}
        <div className="hidden lg:flex items-center gap-8 font-mono text-[10px] text-neutral-500">
          <div className="flex flex-col">
            <span className="text-neutral-400">NETWORK INDEX</span>
            <span className="text-neutral-800 font-medium">OMEGA-77 NEXUS</span>
          </div>
          <div className="flex flex-col">
            <span className="text-neutral-400">LATENCY</span>
            <span className="text-neutral-850 font-medium">0.82ms (SYNCHRONIZED)</span>
          </div>
          <div className="flex flex-col">
            <span className="text-neutral-400">TRANSLATION ENGINE</span>
            <span className="text-green-600 font-medium font-bold">● ACTIVE (REAL-TIME)</span>
          </div>
        </div>

        {/* Audio helper control and stats */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full neo-card border border-neutral-200/50 text-neutral-700 pointer-events-auto hover:bg-neutral-100/50 transition-all active:scale-95"
            title="Toggle Ambient Grid Audio"
            id="toggle-audio-btn"
          >
            {soundEnabled ? (
              <>
                <Volume2 size={13} className="text-neutral-800 animate-pulse" />
                <span className="text-[10px] tracking-tight">GRID AUDIO: ON</span>
              </>
            ) : (
              <>
                <VolumeX size={13} className="text-neutral-400" />
                <span className="text-[10px] tracking-tight text-neutral-400">GRID AUDIO: MUTED</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ----------------- CORE CENTER SPACE (Editorial Panels on Sides) ----------------- */}
      <main className="w-full h-full flex items-center justify-between my-auto relative">
        
        {/* Navigation Indicator / Timeline (Left) */}
        <nav className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto hidden md:flex">
          <div className="font-mono text-[9px] text-neutral-400 tracking-widest uppercase mb-2">
            SPATIAL TRANSIT
          </div>
          {stageDetails.map((stage, idx) => {
            const isActive = idx === currentStage;
            return (
              <button
                key={stage.id}
                onClick={() => onNavigateToStage(idx)}
                className="group flex items-center gap-3 text-left focus:outline-none focus:ring-0"
                id={`nav-dot-${idx}`}
              >
                <div className="relative flex items-center justify-center">
                  {/* Outer circle rings */}
                  <motion.div 
                    animate={{
                      scale: isActive ? 1.5 : 1,
                      borderColor: isActive ? "#7C756B" : "rgba(124, 117, 107, 0.15)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-4 h-4 rounded-full border flex items-center justify-center transition-colors group-hover:border-neutral-400"
                  >
                    {isActive ? (
                      <motion.div 
                        layoutId="activeDot"
                        className="w-1.5 h-1.5 rounded-full bg-neutral-800"
                      />
                    ) : (
                      <div className="w-1 h-1 rounded-full bg-neutral-300 opacity-60 group-hover:opacity-100 transition-opacity" />
                    )}
                  </motion.div>
                </div>

                <div className="flex flex-col">
                  <span className={`font-mono text-[10px] tracking-widest ${isActive ? 'text-neutral-800 font-bold' : 'text-neutral-450 group-hover:text-neutral-700'} transition-colors`}>
                    {stage.num}
                  </span>
                  <span className={`font-display text-[11px] font-medium tracking-tight ${isActive ? 'text-neutral-800 font-medium' : 'text-neutral-400 group-hover:text-neutral-600'} transition-all`}>
                    {stage.titleEN}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Rich Glassmorphic Editorial Panel (Right) - Key info displays */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-sm md:max-w-md pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-neutral-200/40 shadow-2xl shadow-neutral-900/5 relative overflow-hidden"
              id={`stage-card-${currentStage}`}
            >
              {/* Radial dynamic background glow */}
              <div className="absolute -right-20 -top-20 w-44 h-44 rounded-full bg-stone-300/10 blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-pulse" />
                  PHASE // {stageDetails[currentStage].num}
                </span>
                <span className="font-mono text-[11px] text-neutral-400">
                  REF_07-M99
                </span>
              </div>

              {/* Titles */}
              <div className="mb-4">
                <h3 className="font-display text-[13px] text-neutral-500 font-medium tracking-wide uppercase">
                  {stageDetails[currentStage].titleEN}
                </h3>
                <h2 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 leading-tight mt-1">
                  {stageDetails[currentStage].titleJP}
                </h2>
              </div>

              {/* Dynamic Divider */}
              <div className="w-full h-[1px] bg-neutral-250/50 my-5" />

              {/* Sub-Headline & Core Text */}
              <div className="space-y-4">
                <p className="font-display text-neutral-800 text-[14px] font-semibold leading-relaxed">
                  {stageDetails[currentStage].headline}
                </p>
                <p className="font-sans text-neutral-500 text-xs leading-relaxed font-light">
                  {stageDetails[currentStage].subline}
                </p>
              </div>

              {/* System Metadata table (Neomorphic grid look) */}
              <div className="grid grid-cols-2 gap-3 mt-6 font-mono text-[10px]">
                {stageDetails[currentStage].meta.map((item, idx) => (
                  <div key={idx} className="bg-neutral-50/50 border border-neutral-150/40 rounded-xl p-2.5">
                    <span className="block text-neutral-400 text-[8px] uppercase tracking-wider">{item.label}</span>
                    <span className="block text-neutral-700 font-bold mt-0.5">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Bottom status message */}
              <div className="mt-6 flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-neutral-100 pt-4">
                <span className="flex items-center gap-1.5">
                  <Radio size={10} className="text-neutral-500 animate-ping" />
                  STREAMS DECODED: {(currentStage + 1) * 14}K
                </span>
                <span>Z-PLANE: {-(currentStage * 15)}m</span>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll helper mouse animation (Bottom Center-ish) */}
        {scrollProgress < 0.95 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
            <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest animate-bounce">
              SCROLL DOWN TO PLUNGE
            </span>
            <div className="w-5 h-8 border-2 border-neutral-350/40 rounded-full flex justify-center p-1">
              <motion.div 
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
                className="w-1 h-2 bg-neutral-600 rounded-full"
              />
            </div>
          </div>
        )}

      </main>

      {/* ----------------- FOOTER CONTROLS / HUD FOOTER ----------------- */}
      <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto border-t border-neutral-200/30 pt-4">
        
        {/* Left indicators */}
        <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-1.5">
            <Globe size={13} className="text-neutral-400" />
            <span>GLOBAL SPATIAL HARMONY</span>
          </div>
          <span className="text-neutral-350">|</span>
          <span>© 2026 G.TRANS INC.</span>
        </div>

        {/* Progress scroller tracking visual pill */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-neutral-400">DEPTH TRACKER</span>
            <span className="font-bold text-neutral-800">{pct}%</span>
          </div>
          
          <div className="relative w-36 h-2 bg-neutral-200/50 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-neutral-800 rounded-full transition-all duration-150"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

      </footer>
    </div>
  );
};
