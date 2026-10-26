/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive SVG Bacterial Growth Curve Chart
 * Features:
 * - 4 distinct phase colored zones (Lag, Log, Stationary, Death)
 * - Logarithmic Y-axis with standard microbiology labels (10^2 to 10^10 CFU/mL)
 * - Moving animated time & population cursor with pulse ring
 * - Interactive click/scrub directly on the canvas
 * - Comparison overlay mode (Reference vs Modified culture)
 * - Viable CFU/mL vs Total Turbidity (OD600) curve toggle
 * - Hover inspector tooltip with exact coordinates
 */

import React, { useRef, useState } from 'react';
import { GrowthDataPoint, GrowthPhaseId } from '../types/microbiology';
import { PHASES_DATA } from '../data/microbiologyData';

interface GrowthChartProps {
  dataPoints: GrowthDataPoint[];
  currentTime: number;
  currentPhase: GrowthPhaseId;
  onTimeChange: (time: number) => void;
  selectedPhase: GrowthPhaseId | null;
  onSelectPhase: (phase: GrowthPhaseId) => void;
  comparisonPoints?: GrowthDataPoint[] | null;
  comparisonLabel?: string;
  showTotalCells?: boolean;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  dataPoints,
  currentTime,
  currentPhase,
  onTimeChange,
  selectedPhase,
  onSelectPhase,
  comparisonPoints,
  comparisonLabel = 'Modified Culture',
  showTotalCells = false
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<GrowthDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // SVG Coordinate System & Dimensions
  const width = 860;
  const height = 440;
  const padding = { top: 40, right: 40, bottom: 65, left: 75 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Domain limits
  const minTime = 0;
  const maxTime = 24;
  const minLog = 2; // 10^2 = 100 CFU/mL
  const maxLog = 10; // 10^10 = 10 billion CFU/mL

  // Coordinate scales
  const xScale = (t: number) => padding.left + ((t - minTime) / (maxTime - minTime)) * graphWidth;
  const yScale = (logN: number) => padding.top + graphHeight - ((logN - minLog) / (maxLog - minLog)) * graphHeight;

  // Determine phase boundaries from data
  let lagEnd = 2.5;
  let logEnd = 9.5;
  let statEnd = 17.5;

  const firstLog = dataPoints.find(p => p.phase === 'log');
  if (firstLog) lagEnd = firstLog.time;
  const firstStat = dataPoints.find(p => p.phase === 'stationary');
  if (firstStat) logEnd = firstStat.time;
  const firstDeath = dataPoints.find(p => p.phase === 'death');
  if (firstDeath) statEnd = firstDeath.time;

  // Phase region boxes
  const phaseRegions = [
    { id: 'lag', name: 'Lag Phase', start: 0, end: lagEnd, color: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
    { id: 'log', name: 'Log (Exponential) Phase', start: lagEnd, end: logEnd, color: '#D1FAE5', border: '#10B981', text: '#065F46' },
    { id: 'stationary', name: 'Stationary Phase', start: logEnd, end: statEnd, color: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
    { id: 'death', name: 'Death (Decline) Phase', start: statEnd, end: 24, color: '#FEE2E2', border: '#EF4444', text: '#991B1B' },
  ];

  // Build SVG path for main curve (viable CFU)
  const buildSvgPath = (points: GrowthDataPoint[], logKey: 'log10Population' | 'log10TotalPopulation' = 'log10Population') => {
    if (!points || points.length === 0) return '';
    return points.reduce((acc, pt, index) => {
      const x = xScale(pt.time);
      const y = yScale(pt[logKey]);
      if (index === 0) return `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      return `${acc} L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, '');
  };

  const mainCurvePath = buildSvgPath(dataPoints, 'log10Population');
  const totalCurvePath = showTotalCells ? buildSvgPath(dataPoints, 'log10TotalPopulation') : '';
  const comparisonCurvePath = comparisonPoints ? buildSvgPath(comparisonPoints, 'log10Population') : '';

  // Get current cursor coordinates
  const currentClampedTime = Math.max(0, Math.min(24, currentTime));
  const currentIndex = Math.min(
    dataPoints.length - 1,
    Math.max(0, Math.round((currentClampedTime / 24) * (dataPoints.length - 1)))
  );
  const currentPoint = dataPoints[currentIndex] || dataPoints[0];
  const cursorX = xScale(currentPoint.time);
  const cursorY = yScale(currentPoint.log10Population);

  // Interaction handlers
  const handlePointerAction = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * width;
    
    // Convert svgX to time
    const ratio = Math.max(0, Math.min(1, (svgX - padding.left) / graphWidth));
    const newTime = Math.round(ratio * 24 * 10) / 10;
    onTimeChange(newTime);
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(true);
    handlePointerAction(e);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const svgX = (clientX / rect.width) * width;

    if (isDragging) {
      handlePointerAction(e);
    }

    // Tooltip calculation
    if (svgX >= padding.left && svgX <= padding.left + graphWidth) {
      const ratio = (svgX - padding.left) / graphWidth;
      const targetTime = ratio * 24;
      const idx = Math.min(
        dataPoints.length - 1,
        Math.max(0, Math.round((targetTime / 24) * (dataPoints.length - 1)))
      );
      setHoveredPoint(dataPoints[idx]);
      setTooltipPos({ x: clientX, y: clientY });
    } else {
      setHoveredPoint(null);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerLeave = () => {
    setIsDragging(false);
    setHoveredPoint(null);
  };

  // Y-axis tick marks
  const yTicks = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  // X-axis tick marks (every 2 hours)
  const xTicks = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

  return (
    <div className="relative bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 select-none">
      {/* Top Legend & Phase Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Growth Phases:
          </span>
          {phaseRegions.map((region) => {
            const isCurrent = currentPhase === region.id;
            const isSelected = selectedPhase === region.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => onSelectPhase(region.id as GrowthPhaseId)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'ring-2 ring-offset-1 ring-slate-800 shadow-sm font-semibold'
                    : isCurrent
                    ? 'font-semibold border-slate-400'
                    : 'opacity-85 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: region.color,
                  borderColor: region.border,
                  color: region.text
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: region.border }}
                />
                {region.name.split(' ')[0]} {region.id === 'log' ? '(Exp)' : ''}
                {isCurrent && (
                  <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.2 rounded-full font-mono">
                    LIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend for Curves */}
        <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1 bg-emerald-600 rounded-full inline-block" />
            <span>Viable Count (CFU/mL)</span>
          </div>
          {showTotalCells && (
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-1 bg-indigo-400 rounded-full border-dashed inline-block" />
              <span>Total Cell Turbidity (OD₆₀₀)</span>
            </div>
          )}
          {comparisonPoints && (
            <div className="flex items-center gap-1.5 text-amber-700">
              <span className="w-4 h-1 bg-amber-600 rounded-full inline-block" />
              <span>{comparisonLabel}</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden touch-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair drop-shadow-sm"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        >
          <defs>
            {/* Gradients for curve line */}
            <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset={`${(lagEnd / 24) * 100}%`} stopColor="#D97706" />
              <stop offset={`${((lagEnd + 0.5) / 24) * 100}%`} stopColor="#059669" />
              <stop offset={`${(logEnd / 24) * 100}%`} stopColor="#059669" />
              <stop offset={`${((logEnd + 0.5) / 24) * 100}%`} stopColor="#2563EB" />
              <stop offset={`${(statEnd / 24) * 100}%`} stopColor="#2563EB" />
              <stop offset={`${((statEnd + 0.5) / 24) * 100}%`} stopColor="#DC2626" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>

            {/* Shaded Area Under Curve */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.01" />
            </linearGradient>

            {/* Glow Filter for Active Cursor */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Phase Background Shading */}
          {phaseRegions.map((region) => {
            const xStart = xScale(region.start);
            const xEnd = xScale(region.end);
            const regionWidth = Math.max(0, xEnd - xStart);
            const isSelected = selectedPhase === region.id;
            const isCurrent = currentPhase === region.id;

            return (
              <g key={`bg-${region.id}`}>
                <rect
                  x={xStart}
                  y={padding.top}
                  width={regionWidth}
                  height={graphHeight}
                  fill={region.color}
                  fillOpacity={isSelected ? 0.8 : isCurrent ? 0.65 : 0.4}
                  stroke={region.border}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeDasharray={isSelected ? 'none' : '4 4'}
                  className="transition-all duration-200"
                />
                {/* Phase Title on Top of Region */}
                <text
                  x={xStart + regionWidth / 2}
                  y={padding.top + 16}
                  textAnchor="middle"
                  fill={region.text}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.02em"
                  className="pointer-events-none"
                >
                  {region.name}
                </text>
              </g>
            );
          })}

          {/* Grid Lines - Horizontal (Log Population) */}
          {yTicks.map((logVal) => {
            const y = yScale(logVal);
            return (
              <g key={`y-grid-${logVal}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + graphWidth}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray={logVal % 2 === 0 ? 'none' : '2 3'}
                />
                <text
                  x={padding.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  fill="#475569"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="500"
                >
                  10
                  <tspan dy="-6" fontSize="9">
                    {logVal}
                  </tspan>
                </text>
              </g>
            );
          })}

          {/* Grid Lines - Vertical (Time in hours) */}
          {xTicks.map((t) => {
            const x = xScale(t);
            return (
              <g key={`x-grid-${t}`}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + graphHeight}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={padding.top + graphHeight + 20}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="500"
                >
                  {t}h
                </text>
              </g>
            );
          })}

          {/* Axes Lines */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + graphHeight}
            stroke="#64748B"
            strokeWidth="1.5"
          />
          <line
            x1={padding.left}
            y1={padding.top + graphHeight}
            x2={padding.left + graphWidth}
            y2={padding.top + graphHeight}
            stroke="#64748B"
            strokeWidth="1.5"
          />

          {/* Y-Axis Scientific Label */}
          <text
            x={-(padding.top + graphHeight / 2)}
            y={20}
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#0F172A"
            fontSize="12"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
          >
            Bacterial Population (log₁₀ CFU/mL)
          </text>

          {/* X-Axis Scientific Label */}
          <text
            x={padding.left + graphWidth / 2}
            y={height - 14}
            textAnchor="middle"
            fill="#0F172A"
            fontSize="12"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
          >
            Incubation Time (hours) — Closed Batch Culture
          </text>

          {/* Total Cells (OD600) Curve (if enabled) */}
          {showTotalCells && totalCurvePath && (
            <path
              d={totalCurvePath}
              fill="none"
              stroke="#6366F1"
              strokeWidth="2.5"
              strokeDasharray="5 4"
              opacity="0.8"
            />
          )}

          {/* Comparison Curve (if enabled) */}
          {comparisonPoints && comparisonCurvePath && (
            <path
              d={comparisonCurvePath}
              fill="none"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              opacity="0.9"
            />
          )}

          {/* Main Growth Curve Path */}
          <path
            d={mainCurvePath}
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Shaded Area Under Primary Curve */}
          {mainCurvePath && (
            <path
              d={`${mainCurvePath} L ${xScale(24)} ${yScale(minLog)} L ${xScale(0)} ${yScale(minLog)} Z`}
              fill="url(#areaGradient)"
              className="pointer-events-none"
            />
          )}

          {/* Vertical Time Scrubber Line */}
          <line
            x1={cursorX}
            y1={padding.top}
            x2={cursorX}
            y2={padding.top + graphHeight}
            stroke="#0F172A"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.75"
          />

          {/* Moving Marker at Current Simulation Position */}
          <g transform={`translate(${cursorX}, ${cursorY})`}>
            {/* Animated Pulsing Outer Ring */}
            <circle
              r="12"
              fill={PHASES_DATA[currentPhase]?.color || '#059669'}
              fillOpacity="0.25"
              className="animate-ping"
            />
            {/* Inner Solid Marker */}
            <circle
              r="6.5"
              fill={PHASES_DATA[currentPhase]?.color || '#059669'}
              stroke="#FFFFFF"
              strokeWidth="2.5"
              filter="url(#glow)"
            />
          </g>

          {/* Floating Telemetry Tag Above Cursor */}
          <g transform={`translate(${cursorX}, ${Math.max(padding.top + 28, cursorY - 14)})`}>
            <rect
              x="-48"
              y="-22"
              width="96"
              height="20"
              rx="4"
              fill="#0F172A"
              fillOpacity="0.9"
            />
            <text
              x="0"
              y="-8"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="600"
            >
              {currentPoint.time.toFixed(1)}h | 10
              <tspan dy="-3" fontSize="8">
                {currentPoint.log10Population.toFixed(1)}
              </tspan>
            </text>
          </g>
        </svg>

        {/* Hover Inspector Tooltip */}
        {hoveredPoint && tooltipPos && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900/95 text-white text-xs rounded-lg p-2.5 shadow-xl border border-slate-700 font-sans backdrop-blur-sm -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`
            }}
          >
            <div className="font-semibold text-teal-300 border-b border-slate-700 pb-1 mb-1.5 flex items-center justify-between gap-3">
              <span>Time: {hoveredPoint.time} hours</span>
              <span className="capitalize font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">
                {hoveredPoint.phase} Phase
              </span>
            </div>
            <div className="space-y-0.5 font-mono text-[11px]">
              <div>
                Viable CFU/mL: <span className="text-emerald-300">{hoveredPoint.population.toExponential(2)}</span>
              </div>
              <div>
                log₁₀(N): <span className="text-amber-300">{hoveredPoint.log10Population.toFixed(3)}</span>
              </div>
              {showTotalCells && (
                <div>
                  Total Cells: <span className="text-indigo-300">{hoveredPoint.totalPopulation.toExponential(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helpful Microbiology Graph Note */}
      <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
        <span>
          💡 Click or drag anywhere along the graph to scrub time directly. Phase background boxes highlight physiological regimes.
        </span>
        <span className="hidden sm:inline font-mono text-slate-400">
          Scale: Semi-logarithmic (Log₁₀ CFU/mL vs Hours)
        </span>
      </div>
    </div>
  );
};
