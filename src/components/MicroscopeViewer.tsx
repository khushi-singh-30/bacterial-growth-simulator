/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synchronized Microscopic Field & Culture Flask Turbidity Visualizer
 * Shows real-time morphological & cultural changes matching the active growth phase:
 * - Lag: Sparse cells, swelling, metabolic synthesis glowing
 * - Log: Rapid binary fission, visible dividing septa, healthy green rods
 * - Stationary: High density, crowded, coccoid shrinking, stress granules
 * - Death: Autolysis, cell ghosts, membrane rupture, debris
 */

import React, { useMemo } from 'react';
import { Microscope, FlaskConical, Info } from 'lucide-react';
import { GrowthPhaseId } from '../types/microbiology';
import { PHASES_DATA } from '../data/microbiologyData';

interface MicroscopeViewerProps {
  currentPhase: GrowthPhaseId;
  population: number;
  log10Population: number;
  time: number;
}

export const MicroscopeViewer: React.FC<MicroscopeViewerProps> = ({
  currentPhase,
  population,
  log10Population,
  time
}) => {
  const phaseInfo = PHASES_DATA[currentPhase];

  // Generate deterministic pseudo-random bacterial cells based on density
  const cells = useMemo(() => {
    // Number of cells rendered in field (scaled visually between 6 and 48)
    const normalizedCount = Math.round(
      Math.max(6, Math.min(48, (log10Population - 2) * 6.5))
    );

    const generated = [];
    for (let i = 0; i < normalizedCount; i++) {
      // Deterministic pseudo-random distribution
      const seed = (i * 9301 + 49297) % 233280;
      const rnd1 = seed / 233280;
      const rnd2 = ((seed * 9301 + 49297) % 233280) / 233280;
      const rnd3 = ((seed * 1337 + 7919) % 233280) / 233280;

      // Position within circular lens (r < 85)
      const angle = rnd1 * Math.PI * 2;
      const radius = Math.sqrt(rnd2) * 80;
      const x = 100 + Math.cos(angle) * radius;
      const y = 100 + Math.sin(angle) * radius;
      const rotation = rnd3 * 360;

      // Behavior flags based on phase
      const isDividing = currentPhase === 'log' && i % 3 === 0;
      const isGhost = currentPhase === 'death' && i % 2 === 0;
      const hasGranules = currentPhase === 'stationary';

      generated.push({
        id: i,
        x,
        y,
        rotation,
        isDividing,
        isGhost,
        hasGranules,
        scale: currentPhase === 'lag' ? 1.25 : currentPhase === 'stationary' ? 0.85 : 1.0
      });
    }
    return generated;
  }, [log10Population, currentPhase]);

  // Broth turbidity color & opacity based on population
  const turbidityOpacity = Math.min(0.85, Math.max(0.08, (log10Population - 2.5) / 7.5));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <Microscope className="w-4 h-4 text-teal-600" />
          <span>Synchronized Virtual Microscopy & Culture Flask</span>
        </div>
        <span
          className="text-xs px-2.5 py-0.5 rounded-full font-semibold border"
          style={{
            backgroundColor: phaseInfo.lightBg,
            borderColor: phaseInfo.borderColor,
            color: phaseInfo.color
          }}
        >
          {phaseInfo.shortName}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Viewport 1: High Magnification Phase-Contrast Microscope (1000x Oil Immersion) */}
        <div className="flex flex-col items-center bg-slate-900 rounded-xl p-3 border border-slate-800 shadow-inner">
          <div className="text-[11px] font-mono text-slate-300 mb-2 flex items-center justify-between w-full px-2">
            <span className="text-teal-400 font-semibold">1000× Oil Immersion Lens</span>
            <span className="text-slate-400">Bacillus morphology</span>
          </div>

          {/* Circular Lens Reticle */}
          <div className="relative w-48 h-48 rounded-full border-4 border-slate-700 bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Subtle lens glare */}
            <div className="absolute inset-0 bg-radial from-teal-900/10 via-transparent to-black pointer-events-none" />

            {/* Crosshair Reticle Lines */}
            <div className="absolute w-full h-[1px] bg-teal-500/15 pointer-events-none" />
            <div className="absolute h-full w-[1px] bg-teal-500/15 pointer-events-none" />
            <div className="absolute w-24 h-24 rounded-full border border-teal-500/10 pointer-events-none" />

            {/* Bacterial Cells SVG */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {cells.map((cell) => {
                if (cell.isGhost) {
                  // Death phase lysing ghost cell
                  return (
                    <g
                      key={cell.id}
                      transform={`translate(${cell.x}, ${cell.y}) rotate(${cell.rotation}) scale(${cell.scale})`}
                    >
                      <rect
                        x="-7"
                        y="-3"
                        width="14"
                        height="6"
                        rx="3"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                        opacity="0.5"
                      />
                      {/* Fragmented debris */}
                      <circle cx="-5" cy="4" r="0.8" fill="#F87171" opacity="0.6" />
                      <circle cx="6" cy="-4" r="0.6" fill="#F87171" opacity="0.5" />
                    </g>
                  );
                }

                if (cell.isDividing) {
                  // Log phase actively dividing cell with septum
                  return (
                    <g
                      key={cell.id}
                      transform={`translate(${cell.x}, ${cell.y}) rotate(${cell.rotation}) scale(${cell.scale})`}
                    >
                      {/* Left daughter */}
                      <rect
                        x="-10"
                        y="-3.5"
                        width="10"
                        height="7"
                        rx="3.5"
                        fill="#10B981"
                        stroke="#059669"
                        strokeWidth="1"
                      />
                      {/* Right daughter */}
                      <rect
                        x="0"
                        y="-3.5"
                        width="10"
                        height="7"
                        rx="3.5"
                        fill="#10B981"
                        stroke="#059669"
                        strokeWidth="1"
                      />
                      {/* Constriction septum line (FtsZ) */}
                      <line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#064E3B" strokeWidth="1.2" />
                    </g>
                  );
                }

                // Regular rod cell
                const fillColor =
                  currentPhase === 'lag'
                    ? '#F59E0B' // Amber
                    : currentPhase === 'stationary'
                    ? '#3B82F6' // Blue
                    : currentPhase === 'death'
                    ? '#EF4444' // Red
                    : '#10B981'; // Emerald

                const strokeColor =
                  currentPhase === 'lag'
                    ? '#B45309'
                    : currentPhase === 'stationary'
                    ? '#1D4ED8'
                    : currentPhase === 'death'
                    ? '#B91C1C'
                    : '#047857';

                return (
                  <g
                    key={cell.id}
                    transform={`translate(${cell.x}, ${cell.y}) rotate(${cell.rotation}) scale(${cell.scale})`}
                  >
                    <rect
                      x="-8"
                      y="-3.5"
                      width="16"
                      height="7"
                      rx="3.5"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="1"
                      opacity={currentPhase === 'death' ? 0.6 : 0.9}
                    />
                    {/* Intracellular granules or active synthesis dots */}
                    {cell.hasGranules && (
                      <circle cx="3" cy="0" r="1.2" fill="#1E3A8A" />
                    )}
                    {currentPhase === 'lag' && (
                      <circle cx="0" cy="0" r="1.5" fill="#FEF3C7" className="animate-pulse" />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[10px] text-slate-400 mt-2 text-center">
            {currentPhase === 'lag' && 'Enlarged solitary rods synthesizing RNA & inducible enzymes'}
            {currentPhase === 'log' && 'Vigorous binary fission; constant doubling; septum formation'}
            {currentPhase === 'stationary' && 'Dense coccoid morphology; starvation granules; sporulation'}
            {currentPhase === 'death' && 'Lysis of cell envelope; ghost cells; autolytic debris'}
          </div>
        </div>

        {/* Viewport 2: Culture Broth Turbidity & Shake Flask */}
        <div className="flex flex-col items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-200">
          <div className="text-[11px] font-mono text-slate-600 mb-1 flex items-center justify-between w-full px-2">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-teal-600" /> Shake Flask Culture (LB Broth)
            </span>
            <span className="text-slate-500 font-mono">37°C @ 180 RPM</span>
          </div>

          {/* Erlenmeyer Flask Graphic */}
          <div className="relative w-36 h-36 flex items-center justify-center my-1">
            <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-sm">
              <defs>
                <clipPath id="flaskClip">
                  <polygon points="40,25 60,25 85,95 15,95" />
                </clipPath>
              </defs>

              {/* Glass Flask Outline */}
              <polygon
                points="40,20 60,20 60,28 88,96 12,96 40,28"
                fill="none"
                stroke="#64748B"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Flask Neck Rim */}
              <ellipse cx="50" cy="20" rx="12" ry="2.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />

              {/* Liquid Culture Medium */}
              <g clipPath="url(#flaskClip)">
                {/* Clear broth base (Amber broth) */}
                <rect x="0" y="45" width="100" height="65" fill="#FEF08A" opacity="0.6" />
                {/* Turbidity layer (cloudiness caused by bacterial cell mass scattering light) */}
                <rect
                  x="0"
                  y="45"
                  width="100"
                  height="65"
                  fill="#78350F"
                  opacity={turbidityOpacity * 0.75}
                  className="transition-all duration-300"
                />
                {/* Meniscus wave */}
                <ellipse cx="50" cy="52" rx="28" ry="4" fill="#FDE047" opacity="0.5" />
              </g>

              {/* Graduation markings */}
              <line x1="26" y1="80" x2="34" y2="80" stroke="#94A3B8" strokeWidth="1.2" />
              <line x1="30" y1="68" x2="36" y2="68" stroke="#94A3B8" strokeWidth="1.2" />
              <line x1="34" y1="56" x2="38" y2="56" stroke="#94A3B8" strokeWidth="1.2" />
            </svg>
          </div>

          {/* Physical Observations Card */}
          <div className="w-full bg-white border border-slate-200 rounded-lg p-2.5 space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Visual Appearance:</span>
              <span className="font-semibold text-slate-800">
                {currentPhase === 'lag' && 'Optically Clear (OD < 0.05)'}
                {currentPhase === 'log' && 'Rapidly Clouding (Turbid)'}
                {currentPhase === 'stationary' && 'Densely Opaque / Silky'}
                {currentPhase === 'death' && 'Precipitate & Flocculent'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 font-mono text-[11px]">
              <span>Estimated OD₆₀₀:</span>
              <span className="font-semibold text-indigo-700">
                {currentPhase === 'lag' && '0.04 AU'}
                {currentPhase === 'log' && `${(0.05 + (time - 2.5) * 0.35).toFixed(2)} AU`}
                {currentPhase === 'stationary' && '2.80 AU (Max)'}
                {currentPhase === 'death' && '2.35 AU (Ghosts scatter light)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Key CA Observation: </span>
          Notice that during the <strong>Lag Phase</strong>, the broth appears crystal clear to the naked eye, even though the bacteria inside are actively firing transcriptional and translational engines to prepare for division.
        </div>
      </div>
    </div>
  );
};
