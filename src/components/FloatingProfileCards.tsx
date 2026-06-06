/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Stage } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Languages, User, Compass, ArrowRightLeft } from "lucide-react";

interface FloatingProfileCardsProps {
  currentStage: Stage;
  scrollProgress: number;
}

export const FloatingProfileCards: React.FC<FloatingProfileCardsProps> = ({
  currentStage,
  scrollProgress,
}) => {
  // We only render these floating profiles in Stage 1 and Stage 2 (which is scrollProgress < 0.28)
  if (scrollProgress >= 0.28) return null;

  // Local progress for Stage 1
  const stage1Progress = Math.min(1.0, scrollProgress / 0.14);
  // Local progress for Stage 2
  const stage2Progress = scrollProgress >= 0.14 ? Math.min(1.0, (scrollProgress - 0.14) / 0.14) : 0;

  // Dynamic animations driven by scroll:
  // Card A splits left, scales, and rotates
  const cardAX = -60 - stage1Progress * 150 - stage2Progress * 100;
  const cardAY = 20 - stage1Progress * 40 + stage2Progress * 40;
  const cardAZ = -stage1Progress * 100 - stage2Progress * 300;
  const cardARot = -5 - stage1Progress * 10 + stage2Progress * 15;

  // Card B splits right, scales, and rotates
  const cardBX = 60 + stage1Progress * 140 + stage2Progress * 100;
  const cardBY = -40 + stage1Progress * 50 - stage2Progress * 50;
  const cardBZ = -120 - stage1Progress * 150 - stage2Progress * 250;
  const cardBRot = 8 + stage1Progress * 12 - stage2Progress * 10;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-5 overflow-hidden flex items-center justify-center">
      
      {/* CARD A (Japan Node) */}
      <motion.div
        animate={{
          x: cardAX,
          y: cardAY,
          z: cardAZ,
          rotate: cardARot,
          scale: 1 - stage1Progress * 0.15 - stage2Progress * 0.4,
          opacity: 1 - stage2Progress * 0.8,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 120 }}
        className="absolute w-80 md:w-96 neo-card rounded-2xl p-6 border border-white/60 text-left pointer-events-none shadow-xl"
        style={{
          transformStyle: "preserve-3d",
          transform: "perspective(1000px)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
              <User size={18} className="text-neutral-600" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs text-neutral-800">SAYAKA SATO</h4>
              <p className="font-mono text-[9px] text-neutral-400">TOKYO RESEARCH DEPT</p>
            </div>
          </div>
          <span className="font-mono text-[8px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-150">
            JA_NODE_001
          </span>
        </div>

        {/* Unresolved / Resolved typography */}
        <div className="space-y-3">
          <div className="font-mono text-[10px] text-neutral-400 flex items-center gap-1.5 border-b border-neutral-100 pb-1.5">
            <Languages size={10} />
            <span>PRIMARY TELEMETRY INPUT</span>
          </div>
          <p className="font-sans font-bold text-[14px] text-neutral-800 leading-relaxed">
            「こんにちは。同じ地球にいながら、言語の壁に阻まれる時代はもう終わりました。」
          </p>
          
          <AnimatePresence>
            {stage1Progress > 0.4 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 bg-neutral-50 rounded-xl p-3 border border-neutral-150/40"
              >
                <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-wider block">
                  Decoded Output (G.trans Sync 100%)
                </span>
                <span className="font-display text-[12px] text-neutral-600 italic block mt-0.5">
                  &quot;Hello. Moving as one, the era of separate linguistic borders is finally over.&quot;
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* CARD B (Europe/US Node) */}
      <motion.div
        animate={{
          x: cardBX,
          y: cardBY,
          z: cardBZ,
          rotate: cardBRot,
          scale: 0.95 - stage1Progress * 0.12 - stage2Progress * 0.4,
          opacity: 1 - stage2Progress * 0.8,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 120 }}
        className="absolute w-80 md:w-96 neo-card rounded-2xl p-6 border border-white/60 text-left pointer-events-none shadow-xl"
        style={{
          transformStyle: "preserve-3d",
          transform: "perspective(1000px)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
              <User size={18} className="text-neutral-600" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs text-neutral-800">DR. ALEX DUPOND</h4>
              <p className="font-mono text-[9px] text-neutral-400">PARIS SPACETECH INC</p>
            </div>
          </div>
          <span className="font-mono text-[8px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-150">
            EU_NODE_002
          </span>
        </div>

        {/* Telemetry Input */}
        <div className="space-y-3">
          <div className="font-mono text-[10px] text-neutral-400 flex items-center gap-1.5 border-b border-neutral-100 pb-1.5">
            <Compass size={10} />
            <span>PRIMARY TELEMETRY INPUT</span>
          </div>
          <p className="font-sans font-bold text-[14px] text-neutral-800 leading-relaxed">
            &quot;Nous connectons le monde. Au-delà des langues, l&apos;esprit humain est enfin unifié.&quot;
          </p>

          <AnimatePresence>
            {stage1Progress > 0.45 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 bg-neutral-50 rounded-xl p-3 border border-neutral-150/40"
              >
                <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-wider block">
                  Decoded Output (G.trans Sync 100%)
                </span>
                <span className="font-display text-[12px] text-neutral-600 italic block mt-0.5">
                  「私たちは世界を繋ぐ。言語を超え、人間の精神はいま統合された。」
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Floating Laser Decoding Streams (Simulating filaments decodes in Scene 1) */}
      {currentStage === Stage.MICRO_FILAMENT && (
        <div className="absolute inset-x-0 w-full max-w-lg mx-auto flex flex-col gap-2 mt-4 pointer-events-none opacity-60">
          <div className="flex items-center justify-between font-mono text-[9px] text-neutral-400 tracking-wider">
            <span>JA STREAM TXD [こんにちは]</span>
            <span className="animate-pulse text-amber-600 font-bold">DECODING SCANLINE v1.4</span>
            <span>EN STREAM RXD [HELLO]</span>
          </div>
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-neutral-400 to-transparent relative overflow-hidden">
            <motion.div 
              animate={{ x: ["-100%", "100%"] }} 
              transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
              className="absolute left-0 top-0 h-full w-24 bg-neutral-800" 
            />
          </div>
        </div>
      )}

    </div>
  );
};
