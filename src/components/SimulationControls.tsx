/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Controls for Bacterial Growth Simulator
 * Implements Section 3:
 * - Play / Pause / Resume / Reset
 * - Speed selection (0.5x, 1x, 2x, 4x)
 * - Time scrub slider (0 to 24h)
 * - Phase jump buttons
 * - Live scientific telemetry readout (Population, Log10, Phase, Rate)
 */

import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, Activity, Layers, Flame } from 'lucide-react';
import { GrowthDataPoint, GrowthPhaseId } from '../types/microbiology';
import { PHASES_DATA } from '../data/microbiologyData';

interface SimulationControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  currentTime: number;
  onTimeChange: (time: number) => void;
  currentState: GrowthDataPoint;
  onJumpToPhase: (phase: GrowthPhaseId) => void;
  showTotalCells: boolean;
  onToggleTotalCells: (val: boolean) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  playbackSpeed,
  onSpeedChange,
  currentTime,
  onTimeChange,
  currentState,
  onJumpToPhase,
  showTotalCells,
  onToggleTotalCells
}) => {
  const currentPhaseInfo = PHASES_DATA[currentState.phase];

  // Helper format for scientific notation
  const formatSci = (num: number) => {
    if (num === 0) return '0';
    const exp = Math.floor(Math.log10(num));
    const mantissa = (num / Math.pow(10, exp)).toFixed(2);
    return `${mantissa} × 10${getSuperscript(exp)}`;
  };

  const getSuperscript = (num: number) => {
    const map: Record<string, string> = {
      '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    return String(num).split('').map(c => map[c] || c).join('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
      {/* Real-time Telemetry Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Current Time */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Time Elapsed
            </span>
            <span className="font-mono text-[10px] text-slate-400">0–24 hrs</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-800">
            {currentTime.toFixed(1)} <span className="text-xs font-normal text-slate-500">hours</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            ≈ {(currentTime * 60).toFixed(0)} minutes
          </div>
        </div>

        {/* Current Phase */}
        <div className={`border rounded-lg p-3 ${currentPhaseInfo?.lightBg ? '' : 'bg-slate-50'}`}
          style={{
            backgroundColor: currentPhaseInfo?.lightBg || '#F8FAFC',
            borderColor: currentPhaseInfo?.borderColor || '#E2E8F0'
          }}
        >
          <div className="flex items-center justify-between text-xs font-semibold mb-1"
            style={{ color: currentPhaseInfo?.color || '#0F172A' }}
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Growth Phase
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Phase {currentState.phase === 'lag' ? 'I' : currentState.phase === 'log' ? 'II' : currentState.phase === 'stationary' ? 'III' : 'IV'}
            </span>
          </div>
          <div className="text-base font-bold truncate" style={{ color: currentPhaseInfo?.color || '#0F172A' }}>
            {currentPhaseInfo?.shortName || 'Lag Phase'}
          </div>
          <div className="text-[11px] font-medium text-slate-700 truncate mt-0.5">
            {currentState.phase === 'lag' && 'Enzyme induction & RNA synthesis'}
            {currentState.phase === 'log' && 'Exponential binary fission (g = const)'}
            {currentState.phase === 'stationary' && 'Division rate = Death rate (K)'}
            {currentState.phase === 'death' && 'Viable cell lysis & autolysis'}
          </div>
        </div>

        {/* Viable Population */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-medium mb-1">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" /> Viable Population (N)
            </span>
            <span className="font-mono text-[10px] text-emerald-700">CFU/mL</span>
          </div>
          <div className="text-lg font-bold font-mono text-emerald-900 tracking-tight">
            {formatSci(currentState.population)}
          </div>
          <div className="text-[11px] font-mono text-emerald-700 mt-0.5">
            log₁₀(N) = <span className="font-bold">{currentState.log10Population.toFixed(2)}</span>
          </div>
        </div>

        {/* Instantaneous Growth Rate or Kinetic Status */}
        <div className="bg-indigo-50/60 border border-indigo-200 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-indigo-800 font-medium mb-1">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-indigo-600" /> Kinetic Status
            </span>
            <span className="font-mono text-[10px] text-indigo-700">dN/dt</span>
          </div>
          <div className="text-sm font-bold font-mono text-indigo-900 mt-1">
            {currentState.phase === 'lag' && 'dN/dt ≈ 0 (Preparation)'}
            {currentState.phase === 'log' && '+ Exponential Growth'}
            {currentState.phase === 'stationary' && 'dN/dt = 0 (Equilibrium)'}
            {currentState.phase === 'death' && '- First-Order Decay'}
          </div>
          <div className="text-[11px] text-indigo-700 mt-0.5 font-mono">
            {currentState.phase === 'log' && `Rate: +${formatSci(currentState.growthRate)} cells/h`}
            {currentState.phase === 'death' && `Decay: ${formatSci(Math.abs(currentState.growthRate))} cells/h`}
            {currentState.phase === 'lag' && 'Biomass increasing, counts flat'}
            {currentState.phase === 'stationary' && 'Carrying capacity plateau'}
          </div>
        </div>
      </div>

      {/* Primary Timeline Slider */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
          <label htmlFor="time-slider" className="flex items-center gap-1.5">
            <span>Timeline Scrubber:</span>
            <span className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {currentTime.toFixed(1)} hours
            </span>
          </label>
          <span className="text-[11px] text-slate-500 font-normal">
            Drag to scrub simulation or jump below
          </span>
        </div>
        <input
          id="time-slider"
          type="range"
          min="0"
          max="24"
          step="0.1"
          value={currentTime}
          onChange={(e) => onTimeChange(parseFloat(e.target.value))}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>0h (Inoculation)</span>
          <span>4h</span>
          <span>8h</span>
          <span>12h</span>
          <span>16h</span>
          <span>20h</span>
          <span>24h (Terminal Batch)</span>
        </div>
      </div>

      {/* Main Control Button Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback Actions */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              type="button"
              onClick={onPlay}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              {currentTime > 0 && currentTime < 24 ? 'Resume' : 'Start Simulation'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onPause}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
            >
              <Pause className="w-4 h-4 fill-current" />
              Pause
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium transition-colors"
            title="Reset simulation to initial state (t = 0)"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            Reset
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium px-2 flex items-center gap-1">
            <FastForward className="w-3.5 h-3.5" /> Speed:
          </span>
          {[0.5, 1.0, 2.0, 4.0].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => onSpeedChange(spd)}
              className={`px-2 py-1 rounded font-mono font-medium transition-colors ${
                playbackSpeed === spd
                  ? 'bg-white text-teal-700 shadow-xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Jump-to-Phase Buttons */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-500 font-medium mr-1 hidden lg:inline">Jump to:</span>
          <button
            type="button"
            onClick={() => onJumpToPhase('lag')}
            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded font-medium transition-colors"
          >
            Lag (1h)
          </button>
          <button
            type="button"
            onClick={() => onJumpToPhase('log')}
            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-medium transition-colors"
          >
            Log (5h)
          </button>
          <button
            type="button"
            onClick={() => onJumpToPhase('stationary')}
            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded font-medium transition-colors"
          >
            Stationary (13h)
          </button>
          <button
            type="button"
            onClick={() => onJumpToPhase('death')}
            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded font-medium transition-colors"
          >
            Death (20h)
          </button>
        </div>

        {/* Total Cells Toggle (OD600) */}
        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={showTotalCells}
              onChange={(e) => onToggleTotalCells(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Show Total Cells / Turbidity (OD₆₀₀)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
