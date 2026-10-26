/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TypeScript definitions for Bacterial Growth Simulator (BTY323 Microbiology)
 */

export type GrowthPhaseId = 'lag' | 'log' | 'stationary' | 'death';

export interface PhaseInfo {
  id: GrowthPhaseId;
  name: string;
  shortName: string;
  color: string;
  lightBg: string;
  borderColor: string;
  badgeClass: string;
  timeRange: [number, number]; // in hours [start, end]
  biologicalEvents: string[];
  populationKinetics: string;
  environmentalConditions: string;
  realWorldExample: string;
  examPoint: string;
}

export interface GrowthParameters {
  initialPopulation: number; // N0 (CFU/mL), e.g. 1e3
  maxPopulation: number;     // K carrying capacity (CFU/mL), e.g. 1e9
  lagDuration: number;       // hours
  doublingTime: number;      // generation time g (hours)
  stationaryDuration: number;// hours
  deathRate: number;         // death rate constant kd (1/hour)
  temperature: number;       // °C (default 37°C)
  nutrientLevel: number;     // 0 to 100% (default 100%)
  pH: number;                // 3.0 to 10.0 (default 7.0)
  oxygenLevel: 'aerobic' | 'facultative' | 'anaerobic';
}

export interface GrowthDataPoint {
  time: number;              // hours
  population: number;        // viable CFU/mL
  log10Population: number;   // log10(viable CFU/mL)
  totalPopulation: number;   // total cells (viable + dead intact cells)
  log10TotalPopulation: number;
  phase: GrowthPhaseId;
  growthRate: number;        // dN/dt (instantaneous)
}

export interface CalculatorState {
  initialPopulation: string; // N0
  finalPopulation: string;   // Nt
  elapsedTime: string;       // t
  timeUnit: 'hours' | 'minutes';
}

export interface CalculatorResult {
  generations: number;       // n
  generationTime: number;    // g
  growthRateConstant: number;// k (generations per hour)
  specificGrowthRate: number;// mu (hr^-1)
  timeUnit: 'hours' | 'minutes';
  nFormula: string;
  gFormula: string;
  verification: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  subtopic: string;
}

export interface ChallengeScenario {
  id: number;
  title: string;
  context: string;
  partialTimeCutoff: number; // where graph stops
  currentPhase: GrowthPhaseId;
  correctNextPhase: GrowthPhaseId;
  clues: string[];
  explanation: string;
}

export interface StudentDetails {
  name: string;
  registrationNumber: string;
  courseCode: string;
  courseTitle: string;
  date: string;
  batch: string;
  instructor: string;
}
