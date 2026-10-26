/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Generation Time Calculator Component
 * Section 5 Implementation:
 * - Mathematical derivation of n = log2(Nt/N0) and g = t/n
 * - Input validation (rejects <=0, Nt <= N0, t <= 0)
 * - Flexible time unit selector (hours / minutes)
 * - Step-by-step arithmetic breakdown
 * - Organism presets for fast testing
 */

import React, { useState } from 'react';
import { Calculator, AlertTriangle, CheckCircle, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { solveGenerationTime } from '../models/growthModel';
import { BACTERIAL_PRESETS } from '../data/microbiologyData';

export const GenerationCalculator: React.FC = () => {
  const [n0, setN0] = useState<string>('1000');
  const [nt, setNt] = useState<string>('64000');
  const [timeVal, setTimeVal] = useState<string>('2');
  const [timeUnit, setTimeUnit] = useState<'hours' | 'minutes'>('hours');
  const [customError, setCustomError] = useState<string | null>(null);

  // Compute result using model
  const solverOutput = solveGenerationTime(n0, nt, timeVal, timeUnit);

  const applyPreset = (presetName: string) => {
    if (presetName === 'E. coli') {
      setN0('1000');
      setNt('64000'); // 6 generations
      setTimeVal('120');
      setTimeUnit('minutes');
    } else if (presetName === 'S. aureus') {
      setN0('5000');
      setNt('80000'); // 4 generations
      setTimeVal('120');
      setTimeUnit('minutes');
    } else if (presetName === 'B. subtilis') {
      setN0('2000');
      setNt('128000'); // 6 generations
      setTimeVal('156');
      setTimeUnit('minutes');
    } else if (presetName === 'M. tuberculosis') {
      setN0('1000');
      setNt('16000'); // 4 generations
      setTimeVal('72');
      setTimeUnit('hours');
    }
    setCustomError(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-800">
              Section 5: Bacterial Generation Time & Growth Rate Calculator
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compute the number of generations (n), doubling time (g), and specific growth rate (µ) during exponential growth.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-500">Presets:</span>
          {['E. coli', 'S. aureus', 'B. subtilis', 'M. tuberculosis'].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => applyPreset(name)}
              className="text-[11px] px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-medium transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Input Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Initial Population N0 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Population (N₀) <span className="text-slate-400 font-normal">[cells or CFU/mL]</span>
            </label>
            <input
              type="number"
              min="1"
              step="any"
              value={n0}
              onChange={(e) => {
                setN0(e.target.value);
                setCustomError(null);
              }}
              placeholder="e.g. 1000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Inoculum density at the start of log phase (t = 0).
            </span>
          </div>

          {/* Final Population Nt */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Final Population (Nₜ) <span className="text-slate-400 font-normal">[cells or CFU/mL]</span>
            </label>
            <input
              type="number"
              min="1"
              step="any"
              value={nt}
              onChange={(e) => {
                setNt(e.target.value);
                setCustomError(null);
              }}
              placeholder="e.g. 64000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Population measured at the end of time interval t.
            </span>
          </div>

          {/* Elapsed Time & Unit */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Elapsed Time (t) & Unit
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0.01"
                step="any"
                value={timeVal}
                onChange={(e) => {
                  setTimeVal(e.target.value);
                  setCustomError(null);
                }}
                placeholder="e.g. 2"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value as 'hours' | 'minutes')}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="hours">Hours</option>
                <option value="minutes">Minutes</option>
              </select>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Duration of balanced exponential growth.
            </span>
          </div>
        </div>

        {/* Validation Errors Display */}
        {!solverOutput.success && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Input Error: </span>
              {solverOutput.error}
            </div>
          </div>
        )}

        {/* Mathematical Results Showcase */}
        {solverOutput.success && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Card 1: Number of Generations */}
              <div className="bg-teal-50/70 border border-teal-200 rounded-lg p-3">
                <div className="text-xs font-semibold text-teal-800 flex items-center justify-between">
                  <span>Generations (n)</span>
                  <span className="font-mono text-[10px] text-teal-600">doublings</span>
                </div>
                <div className="text-2xl font-bold font-mono text-teal-950 mt-1">
                  {solverOutput.data.generations}
                </div>
                <div className="text-[11px] text-teal-700 mt-0.5">
                  Number of binary fission cycles
                </div>
              </div>

              {/* Card 2: Generation Time (g) */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3">
                <div className="text-xs font-semibold text-emerald-800 flex items-center justify-between">
                  <span>Generation Time (g)</span>
                  <span className="font-mono text-[10px] text-emerald-600">{timeUnit}</span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-950 mt-1">
                  {solverOutput.data.generationTime}{' '}
                  <span className="text-xs font-medium text-emerald-700">{timeUnit}</span>
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Time required for population to double
                </div>
              </div>

              {/* Card 3: Growth Rate Constant (k) */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3">
                <div className="text-xs font-semibold text-indigo-800 flex items-center justify-between">
                  <span>Mean Growth Rate (k)</span>
                  <span className="font-mono text-[10px] text-indigo-600">gen / {timeUnit.slice(0, -1)}</span>
                </div>
                <div className="text-2xl font-bold font-mono text-indigo-950 mt-1">
                  {solverOutput.data.growthRateConstant}
                </div>
                <div className="text-[11px] text-indigo-700 mt-0.5">
                  Generations per unit time (k = 1/g)
                </div>
              </div>

              {/* Card 4: Specific Growth Rate (mu) */}
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-3">
                <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span>Specific Growth Rate (µ)</span>
                  <span className="font-mono text-[10px] text-slate-600">hr⁻¹</span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {solverOutput.data.specificGrowthRate}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Instantaneous kinetic coefficient
                </div>
              </div>
            </div>

            {/* Step-by-Step Mathematical Derivation Card (Crucial for CA Assignment) */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-teal-400 font-sans font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Step-by-Step Derivation & Verification
                </span>
                <span className="text-slate-400 font-mono text-[11px]">BTY323 Formula Standards</span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="p-2 bg-slate-800/80 rounded border border-slate-700/80">
                  <div className="text-teal-300 font-bold mb-0.5">1. Fundamental Binary Fission Equation:</div>
                  <div>Nₜ = N₀ × 2ⁿ</div>
                </div>

                <div className="p-2 bg-slate-800/80 rounded border border-slate-700/80">
                  <div className="text-teal-300 font-bold mb-0.5">2. Solving for Number of Generations (n):</div>
                  <div>log₁₀(Nₜ) = log₁₀(N₀) + n · log₁₀(2)</div>
                  <div>n = [log₁₀(Nₜ) - log₁₀(N₀)] / log₁₀(2)</div>
                  <div className="text-emerald-400 font-semibold mt-1">
                    ↳ {solverOutput.data.nFormula}
                  </div>
                </div>

                <div className="p-2 bg-slate-800/80 rounded border border-slate-700/80">
                  <div className="text-teal-300 font-bold mb-0.5">3. Calculating Generation Time (g):</div>
                  <div>g = t / n</div>
                  <div className="text-emerald-400 font-semibold mt-1">
                    ↳ {solverOutput.data.gFormula}
                  </div>
                </div>

                <div className="p-2 bg-slate-800/80 rounded border border-slate-700/80">
                  <div className="text-teal-300 font-bold mb-0.5">4. Mathematical Verification:</div>
                  <div className="text-indigo-300">
                    {solverOutput.data.verification}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scientific Assumptions Callout */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Important Theoretical Assumption for CA Practical Exams:</span>
            <p className="text-amber-800 leading-relaxed">
              These equations strictly assume that all cells in the population are dividing synchronously or under balanced exponential growth throughout the entire elapsed interval (t). This mathematical relationship is <strong>only valid during the Log Phase</strong>; it does not hold true during Lag, Stationary, or Death phases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
