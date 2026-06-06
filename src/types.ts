/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Stage {
  MICRO_FILAMENT = 0,     // Scene 1: Micro-Filament Sync
  COLLECTIVE_SWARM = 1,   // Scene 2: Collective Swarm UI
  GEOPOLITICAL_LIQ = 2,   // Scene 3: Geopolitical Liquefaction
  PLANETARY_GRID = 3,     // Scene 4: Planetary Grid Singularity
  INTERSTELLAR_CONST = 4, // Scene 5: Interstellar Constellation
  MACRO_WARP = 5,         // Scene 6: Macro Galactic Warp
  ULTIMATE_NEXUS = 6      // Scene 7: The G.trans Ultimate Nexus
}

export interface NodePoint {
  id: string;
  name: string;
  lang: string;
  text: string;
  translation: string;
  flag: string;
  color: string;
  coords: [number, number, number];
}

export interface ConnectionLine {
  fromId: string;
  toId: string;
  progress: number;
  speed: number;
}
