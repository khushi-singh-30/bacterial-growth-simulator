/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Growth Curve Comparison Module
 * Section 7 Implementation:
 * Compares a Reference Control culture against pre-configured educational scenarios:
 * 1. Reduced Nutrient Broth (Low glucose)
 * 2. Suboptimal Temperature (Cold stress 22°C)
 * 3. Acidic Environment (pH 5.2)
 * 4. Inoculum from Late Stationary Phase (Extended Lag)
 * 5. Bacteriostatic Antibiotic Stress
 */

import React from 'react';
import { GitCompare, Check, Info, TrendingUp, Layers } from 'lucide-react';
import { GrowthParameters } from '../types/microbiology';
import { DEFAULT_PARAMETERS, calculateEnvironmentalFactors } from '../models/growthModel';

export interface ComparisonScenario {
  id: string;
  name: string;
  subtitle: string;
  parameters: Partial<GrowthParameters>;
  biologicalExplanation: string;
  lagImpact: string;
  growthRateImpact: string;
  yieldImpact: string;
}

export const COMPARISON_SCENARIOS: ComparisonScenario[] = [
  {
    id: 'low_nutrients',
    name: 'Scenario A: Minimal Nutrient Broth (Low Glucose)',
    subtitle: 'Carbon / Energy Source Limitation (25% substrate)',
    parameters: {
      nutrientLevel: 25,
      temperature: 37,
      pH: 7.0,
      oxygenLevel: 'aerobic'
    },
    biologicalExplanation: 'With limited carbon and nitrogen sources, the culture reaches substrate exhaustion far more rapidly. Monod kinetics dictate that the specific growth rate is lower, and the culture enters stationary phase early with a much lower maximum biomass density (carrying capacity K).',
    lagImpact: 'Slightly longer lag (~3.2h) as cells induce high-affinity ABC transport permeases.',
    growthRateImpact: 'Reduced exponential slope; doubling time increases from 30 min to ~52 min.',
    yieldImpact: 'Peak viable population drops from 10⁹ CFU/mL down to ~2.5 × 10⁷ CFU/mL.'
  },
  {
    id: 'cold_stress',
    name: 'Scenario B: Suboptimal Temperature (22°C Room Temp)',
    subtitle: 'Mesophilic Cold Slowdown',
    parameters: {
      temperature: 22,
      nutrientLevel: 100,
      pH: 7.0,
      oxygenLevel: 'aerobic'
    },
    biologicalExplanation: 'At 22°C, bacterial lipid membranes decrease in fluidity and enzyme catalytic turnover rates decline in accordance with Arrhenius thermodynamics (approximate Q10 effect). Cells remain healthy and viable, but all kinetic milestones are substantially delayed.',
    lagImpact: 'Significantly prolonged lag phase (~5.5h) due to slower translation and enzyme assembly.',
    growthRateImpact: 'Markedly flatter log slope; doubling time increases from 30 min to ~85 min.',
    yieldImpact: 'Final stationary cell density is nearly identical to control, but reached much later.'
  },
  {
    id: 'acid_stress',
    name: 'Scenario C: Acidic Medium (pH 5.2)',
    subtitle: 'Organic Acid / Metabolic Stress',
    parameters: {
      pH: 5.2,
      temperature: 37,
      nutrientLevel: 100,
      oxygenLevel: 'aerobic'
    },
    biologicalExplanation: 'In acidic environments, bacteria expend considerable ATP driving proton pumps (F1F0-ATPase) to maintain intracellular neutrality. This diversion of energy reduces growth yield and accelerates autolysin-mediated cell death.',
    lagImpact: 'Extended lag phase (~4.0h) while cells upregulate acid-tolerance response (ATR) proteins.',
    growthRateImpact: 'Moderate decrease in exponential growth rate (doubling time ~50 min).',
    yieldImpact: 'Accelerated death phase: viable cell count drops rapidly as acid denatures cell wall structures.'
  },
  {
    id: 'old_inoculum',
    name: 'Scenario D: Old Inoculum from Late Stationary Phase',
    subtitle: 'Depleted Ribosomes & Damaged Envelopes',
    parameters: {
      lagDuration: 6.0, // Long lag needed for repair
      temperature: 37,
      nutrientLevel: 100,
      pH: 7.0,
      oxygenLevel: 'aerobic'
    },
    biologicalExplanation: 'Cells harvested from an old stationary culture have degraded their ribosomes, exhausted internal ATP/polyphosphate pools, and sustained membrane oxidative damage. They require several hours to resynthesize ribosomal RNA and repair membranes before first division.',
    lagImpact: 'Drastically prolonged lag phase (over 6 hours) compared to 2.5 hours in control.',
    growthRateImpact: 'Once adaptation is complete, cells divide at normal maximal rate (identical log slope).',
    yieldImpact: 'Reaches standard carrying capacity (~10⁹ CFU/mL), but stationary phase onset is delayed.'
  }
];

interface ComparisonPanelProps {
  isComparisonActive: boolean;
  onToggleComparison: (active: boolean) => void;
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  referenceParams: GrowthParameters;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  isComparisonActive,
  onToggleComparison,
  activeScenarioId,
  onSelectScenario,
  referenceParams
}) => {
  const currentScenario = COMPARISON_SCENARIOS.find(s => s.id === activeScenarioId) || COMPARISON_SCENARIOS[0];

  const refEnv = calculateEnvironmentalFactors(referenceParams);
  const compParams = { ...referenceParams, ...currentScenario.parameters };
  const compEnv = calculateEnvironmentalFactors(compParams);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-800">
              Section 7: Dual Growth Curve Comparative Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Overlay a hypothetical stress or nutrient scenario over the reference control culture on the graph.
          </p>
        </div>

        {/* Toggle Comparison On/Off */}
        <button
          type="button"
          onClick={() => onToggleComparison(!isComparisonActive)}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
            isComparisonActive
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          {isComparisonActive ? 'Comparison Mode: ON' : 'Enable Dual Curve Comparison'}
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Scenario Selection Grid */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select Experimental Scenario to Compare:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {COMPARISON_SCENARIOS.map((scen) => {
              const isSelected = isComparisonActive && activeScenarioId === scen.id;
              return (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => {
                    onSelectScenario(scen.id);
                    if (!isComparisonActive) onToggleComparison(true);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all relative ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/40 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                  <div className="text-xs font-bold text-slate-900 pr-5">{scen.name.split(':')[1]}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{scen.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparative Scientific Metrics Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Direct Kinetic Metric Comparison (Supported by Mathematical Model)</span>
            <span className="text-[11px] text-slate-500 font-mono">Reference Control vs {currentScenario.name.split(':')[0]}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-mono text-[11px]">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Kinetic Parameter</th>
                  <th className="px-4 py-2.5 font-semibold text-emerald-700">Reference Control (Green)</th>
                  <th className="px-4 py-2.5 font-semibold text-amber-700">Modified Culture (Amber)</th>
                  <th className="px-4 py-2.5 font-semibold">Biological Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-800">Lag Phase Duration (λ)</td>
                  <td className="px-4 py-2.5 font-mono text-emerald-800 font-bold">{refEnv.effectiveLag.toFixed(2)} hours</td>
                  <td className="px-4 py-2.5 font-mono text-amber-800 font-bold">{compEnv.effectiveLag.toFixed(2)} hours</td>
                  <td className="px-4 py-2.5 text-slate-600">{currentScenario.lagImpact}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-800">Doubling Time (g)</td>
                  <td className="px-4 py-2.5 font-mono text-emerald-800 font-bold">{(refEnv.effectiveDoublingTime * 60).toFixed(0)} min</td>
                  <td className="px-4 py-2.5 font-mono text-amber-800 font-bold">{(compEnv.effectiveDoublingTime * 60).toFixed(0)} min</td>
                  <td className="px-4 py-2.5 text-slate-600">{currentScenario.growthRateImpact}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-800">Stationary Plateau (K)</td>
                  <td className="px-4 py-2.5 font-mono text-emerald-800 font-bold">10^{Math.log10(refEnv.effectiveMaxPop).toFixed(2)} CFU/mL</td>
                  <td className="px-4 py-2.5 font-mono text-amber-800 font-bold">10^{Math.log10(compEnv.effectiveMaxPop).toFixed(2)} CFU/mL</td>
                  <td className="px-4 py-2.5 text-slate-600">{currentScenario.yieldImpact}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-800">Death Rate Constant (kd)</td>
                  <td className="px-4 py-2.5 font-mono text-emerald-800 font-bold">{refEnv.effectiveDeathRate.toFixed(2)} h⁻¹</td>
                  <td className="px-4 py-2.5 font-mono text-amber-800 font-bold">{compEnv.effectiveDeathRate.toFixed(2)} h⁻¹</td>
                  <td className="px-4 py-2.5 text-slate-600">Rate of autolysis and viability loss under accumulated stress.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Biological Explanation */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <Info className="w-4 h-4 text-amber-600" />
            <span>Undergraduate Microbiology Mechanism: {currentScenario.name}</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed">
            {currentScenario.biologicalExplanation}
          </p>
        </div>
      </div>
    </div>
  );
};
