/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Mathematical model for closed batch bacterial growth kinetics
 * Implements modified Gompertz / Monod / Arrhenius principles
 * Subject: BTY323 Microbiology
 */

import { GrowthParameters, GrowthDataPoint, GrowthPhaseId } from '../types/microbiology';

export const DEFAULT_PARAMETERS: GrowthParameters = {
  initialPopulation: 1e3,      // 1,000 CFU/mL (log10 = 3.0)
  maxPopulation: 1e9,          // 1,000,000,000 CFU/mL (log10 = 9.0)
  lagDuration: 2.5,            // hours
  doublingTime: 0.5,           // 30 minutes = 0.5 hours (optimal for E. coli in rich broth)
  stationaryDuration: 8.0,     // hours in stationary equilibrium
  deathRate: 0.35,             // kd per hour
  temperature: 37,             // °C
  nutrientLevel: 100,          // 100% rich medium
  pH: 7.0,                     // physiological neutral
  oxygenLevel: 'aerobic'
};

/**
 * Computes environmental scaling factors:
 * temperatureFactor, nutrientFactor, phFactor, oxygenFactor
 */
export function calculateEnvironmentalFactors(params: GrowthParameters) {
  // 1. Temperature scaling (Ratkowsky cardinal model for mesophile)
  // Tmin = 8°C, Topt = 37°C, Tmax = 46°C
  const T = params.temperature;
  let tempFactor = 0;
  if (T <= 8 || T >= 48) {
    tempFactor = 0.02; // near zero growth, metabolic arrest
  } else if (T < 37) {
    // sub-optimal cold slowdown
    tempFactor = Math.pow((T - 8) / (37 - 8), 1.8);
  } else {
    // heat stress / denaturation
    tempFactor = Math.max(0.05, 1 - Math.pow((T - 37) / (48 - 37), 2));
  }

  // 2. Nutrient scaling (Monod model: mu = mu_max * S / (Ks + S))
  // S in 0 to 150%, Ks = 15%
  const S = Math.max(5, params.nutrientLevel);
  const Ks = 15;
  const nutrientFactor = (S / (Ks + S)) / (100 / (Ks + 100)); // normalized to 1.0 at S=100

  // 3. pH scaling (Gaussian bell-shaped enzyme activity model around pH 7.0)
  const phDiff = params.pH - 7.0;
  const phFactor = Math.exp(-(phDiff * phDiff) / (2 * 1.3 * 1.3));

  // 4. Oxygen availability
  let oxygenFactor = 1.0;
  if (params.oxygenLevel === 'facultative') oxygenFactor = 0.72; // switch to lower ATP yield fermentation
  if (params.oxygenLevel === 'anaerobic') oxygenFactor = 0.52;

  // Composite growth multiplier
  const compositeGrowthMultiplier = Math.max(0.04, tempFactor * nutrientFactor * phFactor * oxygenFactor);

  // Effective parameters
  const effectiveLag = params.lagDuration / Math.pow(compositeGrowthMultiplier, 0.6);
  const effectiveDoublingTime = params.doublingTime / compositeGrowthMultiplier;
  
  // Carrying capacity drops if nutrients are depleted or pH is hostile
  const carryingCapacityRatio = (params.nutrientLevel / 100) * (phFactor > 0.4 ? 1 : phFactor * 1.5);
  const effectiveMaxPop = Math.max(params.initialPopulation * 5, params.maxPopulation * Math.max(0.1, carryingCapacityRatio));

  // Accelerated death rate under heat stress (T > 42°C) or severe acid (pH < 5.0)
  let deathMultiplier = 1.0;
  if (T > 40) deathMultiplier += (T - 40) * 0.25;
  if (params.pH < 5.5) deathMultiplier += (5.5 - params.pH) * 0.4;
  if (params.pH > 8.5) deathMultiplier += (params.pH - 8.5) * 0.3;
  const effectiveDeathRate = params.deathRate * deathMultiplier;

  return {
    compositeGrowthMultiplier,
    tempFactor,
    nutrientFactor,
    phFactor,
    oxygenFactor,
    effectiveLag,
    effectiveDoublingTime,
    effectiveMaxPop,
    effectiveDeathRate
  };
}

/**
 * Generate 24-hour simulation curve data points with high temporal resolution
 */
export function generateGrowthCurve(params: GrowthParameters, numPoints: number = 241): GrowthDataPoint[] {
  const env = calculateEnvironmentalFactors(params);
  
  const logN0 = Math.log10(params.initialPopulation);
  const logNmax = Math.log10(env.effectiveMaxPop);
  
  // Specific growth rate in log10 space:
  // S_log = d(log10 N)/dt = log10(2) / g
  const slopeLog = Math.log10(2) / env.effectiveDoublingTime;
  
  // Time needed to go from logN0 to logNmax at slopeLog
  const deltaLog = logNmax - logN0;
  const logPhaseTimeSpan = deltaLog / slopeLog;
  
  const tLagEnd = env.effectiveLag;
  const tStatStart = tLagEnd + logPhaseTimeSpan;
  const tDeathStart = tStatStart + params.stationaryDuration;

  const points: GrowthDataPoint[] = [];
  const maxTime = 24.0;
  const dt = maxTime / (numPoints - 1);

  // Pre-calculate cumulative curve
  for (let i = 0; i < numPoints; i++) {
    const t = i * dt;
    
    // Smooth transitions using modified Baranyi/logistic kinetics
    // Phase 1: Lag phase transition factor (0 at t=0, approaching 1 after tLagEnd)
    const lagActivation = 1 / (1 + Math.exp(-3.5 * (t - tLagEnd)));
    
    // Phase 2: Logistic growth toward logNmax
    // Logistic term: log10 N increases toward logNmax
    const growthProgress = 1 / (1 + Math.exp(-slopeLog * (t - (tLagEnd + logPhaseTimeSpan * 0.5))));
    
    // Combine to get uninterrupted potential log curve
    let logViable = logN0 + deltaLog * growthProgress;
    
    // Ensure lag phase is flat at logN0 before tLagEnd
    if (t < tLagEnd) {
      const blend = t / tLagEnd;
      logViable = logN0 + (logViable - logN0) * Math.pow(blend, 3) * lagActivation;
    }

    // Phase 3 & 4: Stationary plateau and Death decline
    let deathDecay = 0;
    if (t > tDeathStart - 1.0) {
      // Smooth activation of death decline
      const deathActivation = 1 / (1 + Math.exp(-2.5 * (t - tDeathStart)));
      const timeInDeath = Math.max(0, t - tDeathStart);
      // First order death decay in log10 space: slope is -kd / ln(10)
      const deathSlope = (env.effectiveDeathRate / Math.LN10);
      deathDecay = deathSlope * timeInDeath * deathActivation;
    }

    logViable = Math.max(logN0 * 0.5, logViable - deathDecay);
    const viablePop = Math.pow(10, logViable);

    // Total cell count (OD600 / intact cells):
    // In death phase, intact corpses and ghosts remain, so total cell count only drops slightly (~12% autolysis)
    let logTotal = logViable;
    if (t > tDeathStart) {
      const timeInDeath = t - tDeathStart;
      const autolysisLoss = Math.min(0.25, timeInDeath * 0.035);
      logTotal = Math.max(logViable, logNmax - autolysisLoss);
    }
    const totalPop = Math.pow(10, logTotal);

    // Identify current phase
    let phase: GrowthPhaseId = 'lag';
    if (t < tLagEnd) {
      phase = 'lag';
    } else if (t < tStatStart) {
      phase = 'log';
    } else if (t < tDeathStart) {
      phase = 'stationary';
    } else {
      phase = 'death';
    }

    // Instantaneous growth rate dN/dt
    let instantRate = 0;
    if (phase === 'log') {
      instantRate = viablePop * (Math.LN2 / env.effectiveDoublingTime);
    } else if (phase === 'death') {
      instantRate = -viablePop * env.effectiveDeathRate;
    }

    points.push({
      time: Math.round(t * 100) / 100,
      population: Math.round(viablePop),
      log10Population: Math.round(logViable * 1000) / 1000,
      totalPopulation: Math.round(totalPop),
      log10TotalPopulation: Math.round(logTotal * 1000) / 1000,
      phase,
      growthRate: Math.round(instantRate)
    });
  }

  return points;
}

/**
 * Get state at any arbitrary time t (0 to 24)
 */
export function getGrowthStateAtTime(time: number, points: GrowthDataPoint[]): GrowthDataPoint {
  const clamped = Math.max(0, Math.min(24, time));
  if (points.length === 0) {
    return {
      time: 0,
      population: 1000,
      log10Population: 3,
      totalPopulation: 1000,
      log10TotalPopulation: 3,
      phase: 'lag',
      growthRate: 0
    };
  }

  // Find surrounding points
  const index = Math.min(
    points.length - 1,
    Math.max(0, Math.round((clamped / 24.0) * (points.length - 1)))
  );

  return points[index];
}

/**
 * Generation Time Math Solver
 * N_t = N_0 * 2^n
 * n = (log10(Nt) - log10(N0)) / log10(2)
 * g = t / n
 */
export function solveGenerationTime(
  n0Str: string,
  ntStr: string,
  tStr: string,
  timeUnit: 'hours' | 'minutes'
): { success: true; data: any } | { success: false; error: string } {
  const N0 = parseFloat(n0Str);
  const Nt = parseFloat(ntStr);
  const t = parseFloat(tStr);

  if (isNaN(N0) || N0 <= 0) {
    return { success: false, error: 'Initial population (N₀) must be a positive number greater than 0.' };
  }
  if (isNaN(Nt) || Nt <= 0) {
    return { success: false, error: 'Final population (Nₜ) must be a positive number greater than 0.' };
  }
  if (Nt <= N0) {
    return {
      success: false,
      error: 'Final population (Nₜ) must be strictly greater than initial population (N₀) during positive exponential growth.'
    };
  }
  if (isNaN(t) || t <= 0) {
    return { success: false, error: 'Elapsed time (t) must be a positive number greater than 0.' };
  }

  // Number of generations: n = (log10(Nt) - log10(N0)) / log10(2)
  const logN0 = Math.log10(N0);
  const logNt = Math.log10(Nt);
  const log2 = Math.log10(2); // ~0.30103
  const n = (logNt - logN0) / log2;

  // Generation time: g = t / n
  const g = t / n;

  // Specific growth rate mu = ln(Nt/N0) / t
  const mu = Math.log(Nt / N0) / (timeUnit === 'minutes' ? t / 60 : t); // per hour

  // Growth rate constant k = n / t
  const k = n / t;

  return {
    success: true,
    data: {
      generations: Math.round(n * 1000) / 1000,
      generationTime: Math.round(g * 100) / 100,
      growthRateConstant: Math.round(k * 1000) / 1000,
      specificGrowthRate: Math.round(mu * 1000) / 1000,
      timeUnit,
      nFormula: `n = [log₁₀(${Nt.toLocaleString()}) - log₁₀(${N0.toLocaleString()})] / log₁₀(2) = (${logNt.toFixed(4)} - ${logN0.toFixed(4)}) / 0.3010 = ${n.toFixed(3)} generations`,
      gFormula: `g = t / n = ${t} ${timeUnit} / ${n.toFixed(3)} = ${g.toFixed(2)} ${timeUnit} per generation`,
      verification: `Nₜ = ${N0.toLocaleString()} × 2^(${n.toFixed(3)}) ≈ ${Math.round(N0 * Math.pow(2, n)).toLocaleString()} CFU/mL`
    }
  };
}
