/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Bacterial Growth Simulator: Exploring the Four Phases of the Bacterial Growth Curve
 * Subject: Microbiology (Course Code: BTY323)
 * Continuous Assessment (CA) Interactive Project
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header, ActiveTab } from './components/Header';
import { HomeScreenIntro } from './components/HomeScreenIntro';
import { GrowthChart } from './components/GrowthChart';
import { SimulationControls } from './components/SimulationControls';
import { MicroscopeViewer } from './components/MicroscopeViewer';
import { PhaseDetailCard } from './components/PhaseDetailCard';
import { GenerationCalculator } from './components/GenerationCalculator';
import { EnvironmentalPanel } from './components/EnvironmentalPanel';
import { ComparisonPanel, COMPARISON_SCENARIOS } from './components/ComparisonPanel';
import { QuizModule } from './components/QuizModule';
import { PredictChallenge } from './components/PredictChallenge';
import { ProjectInfoModal } from './components/ProjectInfoModal';

import { GrowthParameters, GrowthPhaseId, StudentDetails } from './types/microbiology';
import { DEFAULT_PARAMETERS, generateGrowthCurve, getGrowthStateAtTime } from './models/growthModel';
import { PHASES_DATA } from './data/microbiologyData';
import { BookOpen, Award, Compass, Calculator, GitCompare, Thermometer, ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation & Modal State
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<GrowthPhaseId>('lag');

  // Student Details State (Section 10)
  const [studentDetails, setStudentDetails] = useState<StudentDetails>({
    name: '',
    registrationNumber: '',
    courseCode: 'BTY323',
    courseTitle: 'Microbiology (B.Tech Biotechnology)',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    batch: 'Batch 2024-2028',
    instructor: 'Microbiology Faculty Advisor'
  });

  // Simulation Parameters & Playback State
  const [parameters, setParameters] = useState<GrowthParameters>(DEFAULT_PARAMETERS);
  const [currentTime, setCurrentTime] = useState<number>(0.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showTotalCells, setShowTotalCells] = useState<boolean>(false);

  // Comparison Mode State
  const [isComparisonActive, setIsComparisonActive] = useState<boolean>(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('low_nutrients');

  // Animation frame reference
  const lastTimeRef = useRef<number | null>(null);

  // Recalculate reference curve data whenever parameters change
  const referenceDataPoints = useMemo(() => {
    return generateGrowthCurve(parameters, 241);
  }, [parameters]);

  // Recalculate comparison curve if active
  const comparisonDataPoints = useMemo(() => {
    if (!isComparisonActive) return null;
    const scenario = COMPARISON_SCENARIOS.find(s => s.id === activeScenarioId) || COMPARISON_SCENARIOS[0];
    const compParams = { ...parameters, ...scenario.parameters };
    return generateGrowthCurve(compParams, 241);
  }, [isComparisonActive, activeScenarioId, parameters]);

  // Current state at currentTime
  const currentState = useMemo(() => {
    return getGrowthStateAtTime(currentTime, referenceDataPoints);
  }, [currentTime, referenceDataPoints]);

  // Synchronize selectedPhase with live phase if not explicitly browsing
  useEffect(() => {
    setSelectedPhase(currentState.phase);
  }, [currentState.phase]);

  // Animation playback loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current !== null) {
        const deltaSeconds = (timestamp - lastTimeRef.current) / 1000;
        // In 1x speed, 1 second of real time corresponds to 1 hour of culture growth (24 sec for full batch)
        const timeAdvance = deltaSeconds * 1.0 * playbackSpeed;

        setCurrentTime((prevTime) => {
          const nextTime = prevTime + timeAdvance;
          if (nextTime >= 24.0) {
            setIsPlaying(false);
            return 24.0;
          }
          return Math.round(nextTime * 100) / 100;
        });
      }

      lastTimeRef.current = timestamp;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, playbackSpeed]);

  // Playback Control Handlers
  const handlePlay = () => {
    if (currentTime >= 24.0) {
      setCurrentTime(0.0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0.0);
  };

  const handleResetAll = () => {
    setIsPlaying(false);
    setCurrentTime(0.0);
    setParameters(DEFAULT_PARAMETERS);
    setIsComparisonActive(false);
    setShowTotalCells(false);
    setSelectedPhase('lag');
  };

  const handleJumpToPhase = (phaseId: GrowthPhaseId) => {
    setIsPlaying(false);
    setSelectedPhase(phaseId);
    if (phaseId === 'lag') setCurrentTime(1.0);
    else if (phaseId === 'log') setCurrentTime(5.5);
    else if (phaseId === 'stationary') setCurrentTime(13.0);
    else if (phaseId === 'death') setCurrentTime(20.5);
  };

  const handleStartSimulationFromHero = () => {
    setActiveTab('simulator');
    setCurrentTime(0.0);
    setIsPlaying(true);
  };

  const currentScenarioObj = COMPARISON_SCENARIOS.find(s => s.id === activeScenarioId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Header with Navigation and Course Details */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenProjectInfo={() => setIsProjectInfoOpen(true)}
        onResetAll={handleResetAll}
        studentDetails={studentDetails}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Section 1: Home Screen Intro & Learning Objectives */}
        <HomeScreenIntro
          onStartSimulation={handleStartSimulationFromHero}
          onNavigateTab={setActiveTab}
          onResetAll={handleResetAll}
        />

        {/* Tab 1: Simulator & Graph (Primary Lab Experience) */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            {/* Interactive SVG Chart */}
            <GrowthChart
              dataPoints={referenceDataPoints}
              currentTime={currentTime}
              currentPhase={currentState.phase}
              onTimeChange={setCurrentTime}
              selectedPhase={selectedPhase}
              onSelectPhase={(p) => {
                setSelectedPhase(p);
                handleJumpToPhase(p);
              }}
              comparisonPoints={comparisonDataPoints}
              comparisonLabel={currentScenarioObj?.name.split(':')[0] || 'Modified Culture'}
              showTotalCells={showTotalCells}
            />

            {/* Interactive Simulation Controls & Telemetry */}
            <SimulationControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              playbackSpeed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              currentTime={currentTime}
              onTimeChange={setCurrentTime}
              currentState={currentState}
              onJumpToPhase={handleJumpToPhase}
              showTotalCells={showTotalCells}
              onToggleTotalCells={setShowTotalCells}
            />

            {/* Virtual Microscopy & Broth Culture Visualizer */}
            <MicroscopeViewer
              currentPhase={currentState.phase}
              population={currentState.population}
              log10Population={currentState.log10Population}
              time={currentTime}
            />

            {/* Quick Biological Insight Card for Active Phase */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PHASES_DATA[currentState.phase]?.borderColor }}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Active Physiological Regime:
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {PHASES_DATA[currentState.phase]?.name}
                  </span>
                </div>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  {PHASES_DATA[currentState.phase]?.populationKinetics}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedPhase(currentState.phase);
                  setActiveTab('phases');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Full Molecular Details</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Section 4 - Biological Explanation of the Four Phases */}
        {activeTab === 'phases' && (
          <div className="space-y-6">
            <PhaseDetailCard
              selectedPhase={selectedPhase}
              onSelectPhase={setSelectedPhase}
            />

            {/* Mini Context Chart for Reference */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Synchronized Reference Graph:</span>
                <span className="text-slate-400 font-mono text-[11px]">Click or drag marker to inspect</span>
              </div>
              <GrowthChart
                dataPoints={referenceDataPoints}
                currentTime={currentTime}
                currentPhase={currentState.phase}
                onTimeChange={setCurrentTime}
                selectedPhase={selectedPhase}
                onSelectPhase={setSelectedPhase}
                showTotalCells={false}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Section 5 - Generation Time Calculator */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <GenerationCalculator />
          </div>
        )}

        {/* Tab 4: Section 6 - Environmental Factors */}
        {activeTab === 'environmental' && (
          <div className="space-y-6">
            <EnvironmentalPanel
              parameters={parameters}
              onUpdateParameters={(newP) => setParameters(prev => ({ ...prev, ...newP }))}
              onResetEnvironmental={() => setParameters(DEFAULT_PARAMETERS)}
            />

            {/* Real-time Dynamic Growth Chart */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Dynamically Updated Growth Curve for Selected Parameters:</span>
                <span className="text-teal-700 font-mono text-[11px] font-semibold">
                  T = {parameters.temperature}°C | pH {parameters.pH.toFixed(1)} | {parameters.nutrientLevel}% Nutrients
                </span>
              </div>
              <GrowthChart
                dataPoints={referenceDataPoints}
                currentTime={currentTime}
                currentPhase={currentState.phase}
                onTimeChange={setCurrentTime}
                selectedPhase={selectedPhase}
                onSelectPhase={setSelectedPhase}
                showTotalCells={showTotalCells}
              />
            </div>
          </div>
        )}

        {/* Tab 5: Section 7 - Dual Curve Comparison Mode */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <ComparisonPanel
              isComparisonActive={isComparisonActive}
              onToggleComparison={setIsComparisonActive}
              activeScenarioId={activeScenarioId}
              onSelectScenario={setActiveScenarioId}
              referenceParams={parameters}
            />

            {/* Dual Overlay SVG Chart */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Dual Growth Curve Display (Reference vs Modified Scenario):</span>
                <span className="text-amber-700 font-mono text-[11px] font-semibold">
                  {isComparisonActive ? 'Overlay Active' : 'Enable toggle above to compare'}
                </span>
              </div>
              <GrowthChart
                dataPoints={referenceDataPoints}
                currentTime={currentTime}
                currentPhase={currentState.phase}
                onTimeChange={setCurrentTime}
                selectedPhase={selectedPhase}
                onSelectPhase={setSelectedPhase}
                comparisonPoints={comparisonDataPoints}
                comparisonLabel={currentScenarioObj?.name.split(':')[0] || 'Modified'}
                showTotalCells={false}
              />
            </div>
          </div>
        )}

        {/* Tab 6: Section 8 - Continuous Assessment Quiz (10 MCQs) */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <QuizModule />
          </div>
        )}

        {/* Tab 7: Section 9 - Virtual Laboratory Challenge */}
        {activeTab === 'challenge' && (
          <div className="space-y-6">
            <PredictChallenge />
          </div>
        )}
      </main>

      {/* Project Information & CA Report Export Modal (Section 10) */}
      <ProjectInfoModal
        isOpen={isProjectInfoOpen}
        onClose={() => setIsProjectInfoOpen(false)}
        studentDetails={studentDetails}
        onUpdateStudentDetails={(d) => setStudentDetails(prev => ({ ...prev, ...d }))}
        currentParams={parameters}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">
              Bacterial Growth Simulator
            </span>
            <span>—</span>
            <span>Course Code: BTY323 (Microbiology)</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => setIsProjectInfoOpen(true)}
              className="hover:text-teal-700 underline font-medium"
            >
              Print / Export CA Assignment Sheet
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className="hover:text-teal-700 underline font-medium"
            >
              Formula Cheat-Sheet
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className="hover:text-teal-700 underline font-medium"
            >
              Test Knowledge (10 MCQs)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
