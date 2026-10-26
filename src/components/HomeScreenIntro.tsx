/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Home Screen Hero & Learning Objectives Banner
 * Section 1 Implementation:
 * - Title & Subtitle
 * - Closed Batch Culture Introduction
 * - 5 Explicit Learning Objectives for BTY323 CA
 * - Interactive action buttons (Start, Learn, Quiz, Calculator)
 */

import React from 'react';
import { 
  Play, 
  BookOpen, 
  Award, 
  Calculator, 
  CheckCircle2, 
  Compass, 
  Sparkles,
  Layers
} from 'lucide-react';
import { ActiveTab } from './Header';

interface HomeScreenIntroProps {
  onStartSimulation: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onResetAll: () => void;
}

export const HomeScreenIntro: React.FC<HomeScreenIntroProps> = ({
  onStartSimulation,
  onNavigateTab,
  onResetAll
}) => {
  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-teal-50/40 rounded-2xl border border-slate-200/90 shadow-xs p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Title, Subtitle, Intro & Primary CTAs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100/70 border border-teal-300 text-teal-800 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Undergraduate Virtual Microbiology Laboratory — BTY323</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bacterial Growth Simulator
            </h2>
            <p className="text-sm sm:text-base font-medium text-teal-800">
              Explore how bacterial populations grow, stabilize, and decline.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            When bacteria are inoculated into a finite volume of liquid medium in a <strong>closed batch culture</strong> (with no addition of fresh nutrients or removal of metabolic wastes), the population follows a classic sigmoidal dynamic across four sequential phases: <strong>Lag, Log (Exponential), Stationary, and Death</strong>.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onStartSimulation}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:shadow"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Simulation</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('phases')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Learn the 4 Phases</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('quiz')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Quiz Mode</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('calculator')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
            >
              <Calculator className="w-4 h-4 text-teal-600" />
              <span>Generation Calculator</span>
            </button>
          </div>
        </div>

        {/* Right Column: 5 Formal Learning Objectives Card */}
        <div className="lg:col-span-5 bg-white/90 border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal-600" /> Continuous Assessment Objectives
            </span>
            <span className="text-[10px] font-mono text-slate-400">BTY323 Syllabus</span>
          </div>

          <p className="text-[11px] text-slate-500">
            By interacting with this virtual laboratory, students will achieve the following competency outcomes:
          </p>

          <ol className="space-y-2 text-xs text-slate-700">
            {[
              'Identify the four phases of the bacterial growth curve with precision.',
              'Explain the physiological and molecular events occurring in each phase.',
              'Interpret a semi-logarithmic bacterial growth curve (log₁₀ CFU/mL vs. time).',
              'Understand the quantitative relationship between population doubling and elapsed time.',
              'Demonstrate how temperature, pH, nutrients, and oxygen influence bacterial growth.'
            ].map((objective, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{objective}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
