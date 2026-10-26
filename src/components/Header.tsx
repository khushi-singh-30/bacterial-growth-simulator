/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Header and Navigation Component
 * Features:
 * - University & Course branding (BTY323 Microbiology)
 * - Navigation tabs across modules
 * - Project Info / Student Details modal trigger
 * - Reset All action
 */

import React from 'react';
import { 
  Dna, 
  BookOpen, 
  Calculator, 
  Thermometer, 
  GitCompare, 
  Award, 
  HelpCircle, 
  RotateCcw,
  User,
  FlaskConical,
  Compass
} from 'lucide-react';
import { StudentDetails } from '../types/microbiology';

export type ActiveTab = 'simulator' | 'phases' | 'calculator' | 'environmental' | 'comparison' | 'quiz' | 'challenge';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenProjectInfo: () => void;
  onResetAll: () => void;
  studentDetails: StudentDetails;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenProjectInfo,
  onResetAll,
  studentDetails
}) => {
  const navTabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'simulator', label: 'Simulator & Graph', icon: FlaskConical },
    { id: 'phases', label: 'Four Phases', icon: BookOpen },
    { id: 'calculator', label: 'Generation Calc', icon: Calculator },
    { id: 'environmental', label: 'Environmental Factors', icon: Thermometer },
    { id: 'comparison', label: 'Compare Curves', icon: GitCompare },
    { id: 'quiz', label: 'CA Quiz (10 MCQs)', icon: Award },
    { id: 'challenge', label: 'Predict Challenge', icon: Compass }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner with University Course Details */}
      <div className="bg-slate-900 text-slate-100 text-[11px] py-1.5 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-teal-400">COURSE: BTY323</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300 font-medium hidden sm:inline">Microbiology (B.Tech Biotechnology)</span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-teal-300 font-medium">Continuous Assessment (CA) Project</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenProjectInfo}
            className="hover:text-teal-300 text-slate-300 transition-colors flex items-center gap-1 font-medium"
          >
            <User className="w-3.5 h-3.5 text-teal-400" />
            <span>{studentDetails.name ? studentDetails.name : 'Student Details & CA Report'}</span>
          </button>
        </div>
      </div>

      {/* Main Title & Nav Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Title & Microbe Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
              Bacterial Growth Simulator
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Exploring the Four Phases of the Bacterial Growth Curve in Closed Batch Culture
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={onOpenProjectInfo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>About / CA Info</span>
          </button>

          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-600 transition-colors"
            title="Reset simulation and parameters to standard conditions"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset System</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 sm:space-x-2 py-1.5 min-w-max">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
