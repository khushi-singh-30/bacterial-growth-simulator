/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Deep Biological Explanation of the Four Growth Phases
 * Section 4 Requirements:
 * - Phase name & Graph region
 * - Main biological events (molecular, cellular, biochemical)
 * - Pattern of population change (kinetics, slope, dN/dt)
 * - Typical environmental conditions
 * - Simple real-world / laboratory example
 * - One important examination point (frequently asked viva/exam questions)
 */

import React from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Globe, 
  GraduationCap, 
  Flame, 
  Dna,
  ArrowRight
} from 'lucide-react';
import { GrowthPhaseId } from '../types/microbiology';
import { PHASES_DATA } from '../data/microbiologyData';

interface PhaseDetailCardProps {
  selectedPhase: GrowthPhaseId;
  onSelectPhase: (phase: GrowthPhaseId) => void;
}

export const PhaseDetailCard: React.FC<PhaseDetailCardProps> = ({
  selectedPhase,
  onSelectPhase
}) => {
  const currentInfo = PHASES_DATA[selectedPhase];
  const phasesList: GrowthPhaseId[] = ['lag', 'log', 'stationary', 'death'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Tab Bar for 4 Phases */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 sm:p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Section 4: Comprehensive Biological Analysis
          </div>
          <div className="flex items-center gap-1.5">
            {phasesList.map((pId) => {
              const p = PHASES_DATA[pId];
              const isActive = selectedPhase === pId;
              return (
                <button
                  key={pId}
                  type="button"
                  onClick={() => onSelectPhase(pId)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 border ${
                    isActive
                      ? 'shadow-xs font-bold border-slate-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                  style={{
                    backgroundColor: isActive ? p.lightBg : undefined,
                    color: isActive ? p.color : undefined,
                    borderColor: isActive ? p.borderColor : undefined
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.borderColor }}
                  />
                  {p.shortName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area for the Selected Phase */}
      <div className="p-5 space-y-5">
        {/* Title & Graph Boundaries */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentInfo.borderColor }}
              />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {currentInfo.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Graph Region: t = {currentInfo.timeRange[0]}h to {currentInfo.timeRange[1]}h on standard batch curve
            </p>
          </div>

          <div
            className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5"
            style={{
              backgroundColor: currentInfo.lightBg,
              borderColor: currentInfo.borderColor,
              color: currentInfo.color
            }}
          >
            <span>Standard Kinetics:</span>
            <span className="font-mono">
              {selectedPhase === 'lag' && 'µ ≈ 0 | dN/dt ≈ 0'}
              {selectedPhase === 'log' && 'µ = µ_max (constant)'}
              {selectedPhase === 'stationary' && 'µ = k_d | dN/dt = 0'}
              {selectedPhase === 'death' && 'dN/dt = -k_d · N'}
            </span>
          </div>
        </div>

        {/* 2-Column Grid of Biological Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Main Biological Events */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Dna className="w-4 h-4 text-teal-600" />
              <span>Main Biological & Biochemical Events</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
              {currentInfo.biologicalEvents.map((event, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                    style={{ color: currentInfo.borderColor }}
                  />
                  <span>{event}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Kinetics, Environment, Example */}
          <div className="space-y-4">
            {/* Pattern of Population Change */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" /> Pattern of Population Change
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {currentInfo.populationKinetics}
              </p>
            </div>

            {/* Typical Environmental Conditions */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" /> Typical Environmental Conditions
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentInfo.environmentalConditions}
              </p>
            </div>

            {/* Real-World or Laboratory Example */}
            <div className="bg-teal-50/60 border border-teal-200/80 rounded-lg p-3">
              <div className="text-xs font-bold text-teal-900 mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-teal-600" /> Real-World & Laboratory Example
              </div>
              <p className="text-xs text-teal-800 leading-relaxed">
                {currentInfo.realWorldExample}
              </p>
            </div>
          </div>
        </div>

        {/* Examination Highlight Card (Crucial for B.Tech CA Assessment) */}
        <div className="bg-amber-50/80 border-l-4 border-amber-500 rounded-r-lg p-4">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Crucial University Examination Question & Viva Point
              </div>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                {currentInfo.examPoint}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Phase Navigation Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Click any phase button above to explore its molecular biology.</span>
          <div className="flex items-center gap-2">
            {selectedPhase !== 'death' && (
              <button
                type="button"
                onClick={() => {
                  const nextIdx = phasesList.indexOf(selectedPhase) + 1;
                  if (nextIdx < phasesList.length) {
                    onSelectPhase(phasesList[nextIdx]);
                  }
                }}
                className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold"
              >
                <span>Next Phase</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
