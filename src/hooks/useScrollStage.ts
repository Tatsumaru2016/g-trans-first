import { useCallback, useRef, useSyncExternalStore } from "react";
import { Stage } from "../types";

function getScrollY() {
  const root = document.getElementById("root");
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    root?.scrollTop ||
    0
  );
}

function getMaxScroll() {
  const root = document.getElementById("root");
  const sectionHeight =
    document.getElementById("scrolly-sections")?.offsetHeight ?? 0;
  const docHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    sectionHeight,
  );
  const viewport = window.innerHeight;
  const rootMax =
    root && root.scrollHeight > viewport ? root.scrollHeight - viewport : 0;

  return Math.max(docHeight - viewport, rootMax, 1);
}

function subscribe(onStoreChange: () => void) {
  let frame = 0;
  const root = document.getElementById("root");

  const tick = () => {
    onStoreChange();
    frame = requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", onStoreChange, { passive: true });
  window.addEventListener("wheel", onStoreChange, { passive: true });
  window.addEventListener("resize", onStoreChange);
  root?.addEventListener("scroll", onStoreChange, { passive: true });
  onStoreChange();
  frame = requestAnimationFrame(tick);

  return () => {
    window.removeEventListener("scroll", onStoreChange);
    window.removeEventListener("wheel", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
    root?.removeEventListener("scroll", onStoreChange);
    cancelAnimationFrame(frame);
  };
}

function readScrollProgress() {
  return Math.min(getScrollY() / getMaxScroll(), 1);
}

function readStageFromProgress(progress: number): Stage {
  if (progress < 0.14) return Stage.MICRO_FILAMENT;
  if (progress < 0.28) return Stage.COLLECTIVE_SWARM;
  if (progress < 0.42) return Stage.GEOPOLITICAL_LIQ;
  if (progress < 0.57) return Stage.PLANETARY_GRID;
  if (progress < 0.71) return Stage.INTERSTELLAR_CONST;
  if (progress < 0.85) return Stage.MACRO_WARP;
  return Stage.ULTIMATE_NEXUS;
}

export function useScrollStage() {
  const velocityRef = useRef(0);
  const lastScrollY = useRef(0);

  const scrollProgress = useSyncExternalStore(
    subscribe,
    readScrollProgress,
    () => 0,
  );

  const currentStage = useSyncExternalStore(
    subscribe,
    () => readStageFromProgress(readScrollProgress()),
    () => Stage.MICRO_FILAMENT,
  );

  const scrollY = getScrollY();
  velocityRef.current = Math.min(
    20,
    Math.abs(scrollY - lastScrollY.current) * 0.08,
  );
  lastScrollY.current = scrollY;

  const navigateToStage = useCallback((index: number) => {
    window.scrollTo({
      top: (index / 6) * getMaxScroll(),
      behavior: "smooth",
    });
  }, []);

  return {
    scrollProgress,
    currentStage,
    scrollVelocity: velocityRef.current,
    navigateToStage,
  };
}
