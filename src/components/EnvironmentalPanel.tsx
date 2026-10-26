/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Environmental Factors Experimentation Panel
 * Section 6 Requirements:
 * - Temperature (Cardinal points: psychrophile, mesophile, thermophile zones)
 * - Nutrient / Substrate availability (Monod kinetics S / (Ks + S))
 * - pH regulation (acidic, neutral, alkaline)
 * - Oxygen availability (Aerobic, Facultative Anaerobe, Anaerobe)
 * - Realistic biological response curves & scientific educational disclaimer
 */

import React from 'react';
import { Thermometer, Utensils, Droplets, Wind, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { GrowthParameters } from '../types/microbiology';
import { calculateEnvironmentalFactors } from '../models/growthModel';

interface EnvironmentalPanelProps {
  parameters: GrowthParameters;
  onUpdateParameters: (newParams: Partial<GrowthParameters>) => void;
  onResetEnvironmental: () => void;
}

export const EnvironmentalPanel: React.FC<EnvironmentalPanelProps> = ({
  parameters,
  onUpdateParameters,
  onResetEnvironmental
}) => {
  const env = calculateEnvironmentalFactors(parameters);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-800">
              Section 6: Environmental Influences on Bacterial Kinetics
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Alter cultivation variables to observe real-time mathematical shifts in lag duration, doubling time, and carrying capacity.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetEnvironmental}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          Reset to Standard (37°C, pH 7.0, 100% Rich)
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Environmental Parameter Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Temperature */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-rose-500" /> Temperature
              </span>
              <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {parameters.temperature}°C
              </span>
            </div>

            <input
              type="range"
              min="4"
              max="50"
              step="1"
              value={parameters.temperature}
              onChange={(e) => onUpdateParameters({ temperature: parseInt(e.target.value, 10) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>4°C (Fridge)</span>
              <span className="text-rose-600 font-bold">37°C (Optimum)</span>
              <span>50°C (Denature)</span>
            </div>

            <p className="text-[11px] text-slate-600 leading-tight">
              {parameters.temperature < 15 && 'Severe cold: Membrane lipids solidify; transport stalls; prolonged lag phase.'}
              {parameters.temperature >= 15 && parameters.temperature < 32 && 'Suboptimal: Enzymatic reactions slow down by Arrhenius factor Q10.'}
              {parameters.temperature >= 32 && parameters.temperature <= 39 && 'Optimal mesophilic regime: Enzymes operate at maximum turnover rate.'}
              {parameters.temperature > 39 && parameters.temperature <= 45 && 'Thermal stress: Heat-shock proteins activated; efficiency decreases.'}
              {parameters.temperature > 45 && 'Lethal heat: Irreversible denaturation of proteins and ribosomal disruption.'}
            </p>
          </div>

          {/* 2. Nutrient Availability */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-500" /> Nutrients (Carbon/Energy)
              </span>
              <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {parameters.nutrientLevel}%
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={parameters.nutrientLevel}
              onChange={(e) => onUpdateParameters({ nutrientLevel: parseInt(e.target.value, 10) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% (Minimal)</span>
              <span className="text-amber-700 font-bold">100% (Standard LB)</span>
              <span>150% (Enriched)</span>
            </div>

            <p className="text-[11px] text-slate-600 leading-tight">
              {parameters.nutrientLevel < 40 && 'Nutrient starvation: Premature entry into stationary phase; low carrying capacity.'}
              {parameters.nutrientLevel >= 40 && parameters.nutrientLevel <= 110 && 'Standard Monod substrate saturation; maximum biomass yield per gram.'}
              {parameters.nutrientLevel > 110 && 'Excess substrate: Prolongs exponential phase and yields higher maximum OD600.'}
            </p>
          </div>

          {/* 3. pH Level */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-emerald-600" /> Medium pH
              </span>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                pH {parameters.pH.toFixed(1)}
              </span>
            </div>

            <input
              type="range"
              min="4.0"
              max="9.5"
              step="0.1"
              value={parameters.pH}
              onChange={(e) => onUpdateParameters({ pH: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>4.0 (Acid)</span>
              <span className="text-emerald-700 font-bold">7.0 (Neutral)</span>
              <span>9.5 (Alkali)</span>
            </div>

            <p className="text-[11px] text-slate-600 leading-tight">
              {parameters.pH < 5.5 && 'Acid stress: Disruption of transmembrane ΔpH gradient; proton pumping costs ATP.'}
              {parameters.pH >= 5.5 && parameters.pH <= 7.8 && 'Optimal neutrophilic range: Enzyme active-site ionization states are ideal.'}
              {parameters.pH > 7.8 && 'Alkaline stress: Impairs oxidative phosphorylation and cation uptake.'}
            </p>
          </div>

          {/* 4. Oxygen Availability */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-blue-500" /> Aeration / O₂
              </span>
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 capitalize">
                {parameters.oxygenLevel}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 pt-1">
              {(['aerobic', 'facultative', 'anaerobic'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => onUpdateParameters({ oxygenLevel: level })}
                  className={`text-[10px] py-1.5 px-1 rounded font-medium capitalize transition-colors border ${
                    parameters.oxygenLevel === level
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {level === 'facultative' ? 'Facultative' : level}
                </button>
              ))}
            </div>

            <div className="text-[10px] text-slate-400 font-mono text-center">
              Aerobic: ~32 ATP / glucose vs Fermentation: 2 ATP
            </div>

            <p className="text-[11px] text-slate-600 leading-tight">
              {parameters.oxygenLevel === 'aerobic' && 'Full oxidative phosphorylation: maximum ATP yield and fastest growth.'}
              {parameters.oxygenLevel === 'facultative' && 'Facultative switch: Bacteria switch to mixed acid fermentation with lower yield.'}
              {parameters.oxygenLevel === 'anaerobic' && 'Anaerobic fermentation only: slower doubling time and organic acid accumulation.'}
            </p>
          </div>
        </div>

        {/* Real-Time Kinetic Impact Summary */}
        <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4">
          <div className="flex items-center justify-between border-b border-teal-200/80 pb-2 mb-3">
            <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" /> Simulated Model Kinetic Output
            </span>
            <span className="text-[11px] text-teal-700 font-mono">
              Composite Multiplier: {(env.compositeGrowthMultiplier * 100).toFixed(1)}% of optimal
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-white/80 p-2.5 rounded-lg border border-teal-100">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Effective Lag</span>
              <span className="text-base font-bold text-slate-900">{env.effectiveLag.toFixed(2)}h</span>
              <span className="text-[10px] text-slate-500 block">
                {env.effectiveLag > parameters.lagDuration ? '↑ Prolonged adaptation' : 'Normal'}
              </span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-lg border border-teal-100">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Doubling Time (g)</span>
              <span className="text-base font-bold text-slate-900">
                {(env.effectiveDoublingTime * 60).toFixed(0)} min
              </span>
              <span className="text-[10px] text-slate-500 block">
                ({env.effectiveDoublingTime.toFixed(2)} hours)
              </span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-lg border border-teal-100">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Carrying Capacity (K)</span>
              <span className="text-base font-bold text-slate-900">
                10^{Math.log10(env.effectiveMaxPop).toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block">CFU/mL plateau</span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-lg border border-teal-100">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Death Rate (kd)</span>
              <span className="text-base font-bold text-slate-900">{env.effectiveDeathRate.toFixed(2)} h⁻¹</span>
              <span className="text-[10px] text-slate-500 block">Autolysis kinetics</span>
            </div>
          </div>
        </div>

        {/* Mandatory Scientific Accuracy Disclaimer from User Brief */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Microbiology Educational Note:</strong> The kinetic responses simulated above are based on generalized mathematical formulations of the <em>Ratkowsky cardinal temperature model</em> and <em>Monod substrate kinetics</em> for a representative mesophilic neutrophile (such as <em>Escherichia coli</em>). Real bacterial species possess diverse cardinal temperatures (e.g. psychrophiles thrive below 15°C, thermophiles above 55°C) and extreme pH tolerances (acidophiles, alkaliphiles).
          </p>
        </div>
      </div>
    </div>
  );
};
