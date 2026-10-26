/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Project Information & Student CA Report Helper
 * Section 10 Implementation:
 * - Project Metadata (Course BTY323, Title, Objectives)
 * - Editable Student Credits (Name, Reg No, Batch, Date, Instructor)
 * - Printable Continuous Assessment (CA) Submission Sheet
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  User, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  Download,
  X
} from 'lucide-react';
import { StudentDetails, GrowthParameters } from '../types/microbiology';

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentDetails: StudentDetails;
  onUpdateStudentDetails: (details: Partial<StudentDetails>) => void;
  currentParams: GrowthParameters;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({
  isOpen,
  onClose,
  studentDetails,
  onUpdateStudentDetails,
  currentParams
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Project Information & Student CA Submission
              </h2>
              <span className="text-xs text-slate-500 font-mono">BTY323 - Microbiology Continuous Assessment</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Official Course & Project Specifications */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Official Project Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Project Title:</span>
                <span className="font-semibold text-slate-800">
                  Bacterial Growth Simulator: Exploring the Four Phases of the Bacterial Growth Curve
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Course & Code:</span>
                <span className="font-semibold text-slate-800">BTY323 — Microbiology (B.Tech Biotechnology)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Project Type:</span>
                <span className="font-semibold text-slate-800">AI-Assisted Interactive Educational Laboratory Simulator</span>
              </div>
              <div>
                <span className="text-slate-500 block">Academic Purpose:</span>
                <span className="font-semibold text-slate-800">
                  To provide an interactive virtual laboratory enabling undergraduate students to visualize, analyze, and mathematically model closed batch bacterial growth kinetics.
                </span>
              </div>
            </div>
          </div>

          {/* Student Editable Profile (Section 10 Requirement) */}
          <div className="border border-teal-200 bg-teal-50/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
              <User className="w-4 h-4 text-teal-600" />
              <span>Student Academic Credentials (Fill Before Exporting)</span>
            </div>
            <p className="text-xs text-teal-700">
              Enter your student details below so they appear on your generated CA assignment submission sheet.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Student Full Name:
                </label>
                <input
                  type="text"
                  value={studentDetails.name}
                  onChange={(e) => onUpdateStudentDetails({ name: e.target.value })}
                  placeholder="e.g. Khushi Sharma"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Registration / Roll Number:
                </label>
                <input
                  type="text"
                  value={studentDetails.registrationNumber}
                  onChange={(e) => onUpdateStudentDetails({ registrationNumber: e.target.value })}
                  placeholder="e.g. 12104592"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Section / Batch:
                </label>
                <input
                  type="text"
                  value={studentDetails.batch}
                  onChange={(e) => onUpdateStudentDetails({ batch: e.target.value })}
                  placeholder="e.g. B.Tech Biotech - Batch 2024-2028"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Course Instructor / Faculty Name:
                </label>
                <input
                  type="text"
                  value={studentDetails.instructor}
                  onChange={(e) => onUpdateStudentDetails({ instructor: e.target.value })}
                  placeholder="e.g. Dr. A. Sharma"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Core Learning Objectives Verified */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Continuous Assessment (CA) Learning Outcomes Verified:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {[
                'Identification of all 4 physiological phases (Lag, Log, Stationary, Death)',
                'Understanding biochemical events (RpoS, enzyme induction, binary fission)',
                'Derivation of generation time: g = t / n and n = log₂(Nₜ / N₀)',
                'Distinguishing viable counts (CFU/mL) from optical density turbidity (OD₆₀₀)',
                'Modeling environmental effects (Ratkowsky temperature & Monod kinetics)',
                'Comparative multi-curve interpretation and experimental forecasting'
              ].map((outcome, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Viva & Submission Guide */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs text-slate-600">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Recommended Screenshots for Written CA Report:
            </span>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>Full 24-hour bacterial growth curve with all 4 phase color zones labeled.</li>
              <li>Generation Time Calculator showing worked-out arithmetic for <em>E. coli</em>.</li>
              <li>Dual comparison graph contrasting Control (37°C) vs Cold Stress (22°C) or Low Nutrients.</li>
              <li>Microscopic virtual inspection showing dividing septa in Log phase vs lysing cells in Death phase.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between z-10">
          <span className="text-xs text-slate-500">
            BTY323 Microbiology CA Project
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF Report</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
