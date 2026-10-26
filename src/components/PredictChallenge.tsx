/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Virtual Laboratory Challenge: "Predict the Next Phase"
 * Section 9 Implementation:
 * - 4 interactive microbiological scenarios
 * - Partial curve visualization up to the decision cutoff
 * - Interactive prediction buttons (Lag, Log, Stationary, Death)
 * - Immediate feedback with detailed debriefing
 */

import React, { useState } from 'react';
import { Target, CheckCircle, XCircle, ArrowRight, RotateCcw, AlertCircle, Compass } from 'lucide-react';
import { CHALLENGE_SCENARIOS, PHASES_DATA } from '../data/microbiologyData';
import { GrowthPhaseId } from '../types/microbiology';

export const PredictChallenge: React.FC = () => {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [userPrediction, setUserPrediction] = useState<GrowthPhaseId | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [challengeHistory, setChallengeHistory] = useState<{ [id: number]: boolean }>({});

  const scenario = CHALLENGE_SCENARIOS[activeScenarioIndex];

  const handlePredict = (phaseId: GrowthPhaseId) => {
    if (isAnswerSubmitted) return;
    setUserPrediction(phaseId);
    setIsAnswerSubmitted(true);
    const isCorrect = phaseId === scenario.correctNextPhase;
    setChallengeHistory(prev => ({
      ...prev,
      [scenario.id]: isCorrect
    }));
  };

  const handleNext = () => {
    if (activeScenarioIndex < CHALLENGE_SCENARIOS.length - 1) {
      setActiveScenarioIndex(prev => prev + 1);
      setUserPrediction(null);
      setIsAnswerSubmitted(false);
    } else {
      setActiveScenarioIndex(0);
      setUserPrediction(null);
      setIsAnswerSubmitted(false);
    }
  };

  const isCurrentCorrect = userPrediction === scenario.correctNextPhase;

  // Mini partial SVG curve generator
  const renderMiniPartialGraph = () => {
    // 0 to 24h coordinates
    const w = 320;
    const h = 130;
    const pad = { left: 35, right: 20, top: 20, bottom: 25 };
    const gw = w - pad.left - pad.right;
    const gh = h - pad.top - pad.bottom;

    const xS = (t: number) => pad.left + (t / 24) * gw;
    const yS = (logVal: number) => pad.top + gh - ((logVal - 2) / 8) * gh;

    // Cutoff time for this scenario
    const cutoff = scenario.partialTimeCutoff;

    // Synthesize partial points up to cutoff
    const pts = [];
    for (let t = 0; t <= cutoff; t += 0.2) {
      let logN = 3.0;
      if (t > 2.5) {
        logN = Math.min(9.0, 3.0 + (t - 2.5) * 0.9);
      }
      if (t > 9.5) {
        logN = 9.0;
      }
      pts.push({ x: xS(t), y: yS(logN) });
    }

    const pathData = pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

    return (
      <div className="bg-slate-900 rounded-lg p-2.5 border border-slate-800 shadow-inner">
        <div className="text-[10px] text-teal-400 font-mono mb-1 flex items-center justify-between">
          <span>Observed Batch Kinetics: 0h to {cutoff.toFixed(1)}h</span>
          <span className="text-amber-400 font-bold">Cutoff Decision Point ❓</span>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
          {/* Axes */}
          <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + gh} stroke="#475569" strokeWidth="1" />
          <line x1={pad.left} y1={pad.top + gh} x2={pad.left + gw} y2={pad.top + gh} stroke="#475569" strokeWidth="1" />

          {/* Cutoff dashed vertical line */}
          <line
            x1={xS(cutoff)}
            y1={pad.top}
            x2={xS(cutoff)}
            y2={pad.top + gh}
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Partial Observed Curve */}
          <path d={pathData} fill="none" stroke="#10B981" strokeWidth="2.5" />

          {/* Big Question Mark at Cutoff */}
          <circle cx={xS(cutoff)} cy={pts[pts.length - 1]?.y || pad.top + gh} r="5" fill="#F59E0B" />
          <text
            x={Math.min(gw + pad.left - 20, xS(cutoff) + 15)}
            y={pts[pts.length - 1]?.y || pad.top + 20}
            fill="#FBBF24"
            fontSize="14"
            fontWeight="bold"
            fontFamily="JetBrains Mono"
          >
            ???
          </text>

          {/* Label axes */}
          <text x={pad.left} y={pad.top - 5} fill="#94A3B8" fontSize="8" fontFamily="JetBrains Mono">
            log₁₀(N)
          </text>
          <text x={pad.left + gw / 2} y={h - 5} fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono">
            Time (hours)
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">
              Section 9: Virtual Laboratory Challenge — "Predict the Next Phase"
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyze partial experimental data and physiological clues to deduce the upcoming biological phase.
          </p>
        </div>

        {/* Scenario Progress Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {CHALLENGE_SCENARIOS.map((scen, idx) => (
            <button
              key={scen.id}
              type="button"
              onClick={() => {
                setActiveScenarioIndex(idx);
                setUserPrediction(null);
                setIsAnswerSubmitted(false);
              }}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                activeScenarioIndex === idx
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Scenario {idx + 1}
              {challengeHistory[scen.id] !== undefined && (
                <span className="ml-1 text-[10px]">
                  {challengeHistory[scen.id] ? '✓' : '✗'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Context & Laboratory Scenario */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-[11px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Challenge Case #{scenario.id}: {scenario.title}
              </span>
              <p className="text-sm text-slate-800 mt-2 leading-relaxed font-medium">
                {scenario.context}
              </p>
            </div>

            {/* Clues Box */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-3 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Laboratory Clues & Sensor Readings:
              </span>
              <ul className="space-y-1 text-xs text-slate-600">
                {scenario.clues.map((clue, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>{clue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prediction Action Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Based on these data, what is the NEXT growth phase?
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['lag', 'log', 'stationary', 'death'] as GrowthPhaseId[]).map((phaseId) => {
                  const p = PHASES_DATA[phaseId];
                  const isSelected = userPrediction === phaseId;

                  return (
                    <button
                      key={phaseId}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handlePredict(phaseId)}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all text-center ${
                        isSelected
                          ? 'ring-2 ring-indigo-500 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                      }`}
                      style={{
                        backgroundColor: isSelected ? p.lightBg : undefined,
                        color: isSelected ? p.color : undefined,
                        borderColor: isSelected ? p.borderColor : undefined
                      }}
                    >
                      {p.shortName}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Partial Curve Graphic */}
          <div className="lg:col-span-5 space-y-3">
            {renderMiniPartialGraph()}

            <div className="text-[11px] text-slate-500 italic text-center">
              The curve is truncated at t = {scenario.partialTimeCutoff}h. Deduce where the population will go next!
            </div>
          </div>
        </div>

        {/* Feedback & Debriefing Section */}
        {isAnswerSubmitted && (
          <div
            className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
              isCurrentCorrect
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : 'bg-red-50/80 border-red-300 text-red-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-2">
                {isCurrentCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>Excellent Prediction! Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>
                      Incorrect. The next phase is the {PHASES_DATA[scenario.correctNextPhase].shortName}.
                    </span>
                  </>
                )}
              </span>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <span>
                  {activeScenarioIndex < CHALLENGE_SCENARIOS.length - 1 ? 'Next Scenario' : 'Repeat Challenge'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs leading-relaxed font-sans pt-1">
              <strong>Microbiological Debrief: </strong>
              {scenario.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
