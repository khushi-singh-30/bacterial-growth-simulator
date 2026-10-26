/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Quiz Module (Microbiology CA Level)
 * Section 8 Implementation:
 * - 10 multiple-choice questions covering all growth curve concepts
 * - Instant feedback with deep scientific explanations
 * - Score counter and progress indicator
 * - Comprehensive end-of-quiz score card, question review, and Restart Quiz
 */

import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight, 
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/microbiologyData';

export const QuizModule: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: number }>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];

  // Calculate score
  const score = Object.entries(userAnswers).reduce((acc, [qIdStr, optIdx]) => {
    const q = QUIZ_QUESTIONS.find(item => item.id === parseInt(qIdStr, 10));
    if (q && q.correctIndex === optIdx) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: selectedOption
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setIsQuizCompleted(false);
  };

  // Performance classification
  const getFeedbackMessage = () => {
    if (percentage >= 90) {
      return {
        title: 'Outstanding Performance! (Distinction)',
        desc: 'Exceptional mastery of bacterial kinetics, physiological adaptation, and mathematical growth laws for BTY323.',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50 border-emerald-200'
      };
    }
    if (percentage >= 70) {
      return {
        title: 'Good Understanding! (Proficient)',
        desc: 'Solid grasp of core growth phases. Review the differences between optical density (OD600) and viable plate counts (CFU).',
        color: 'text-teal-700',
        bg: 'bg-teal-50 border-teal-200'
      };
    }
    return {
      title: 'Needs Further Review',
      desc: 'Re-examine Section 4 (Phase Explanations) and Section 5 (Generation Time Math) before taking your university CA assessment.',
      color: 'text-amber-700',
      bg: 'bg-amber-50 border-amber-200'
    };
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-800">
              Section 8: BTY323 Microbiology Continuous Assessment Quiz
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Test your knowledge of bacterial growth kinetics, generation time, and physiological phases with 10 university-grade questions.
          </p>
        </div>

        {!isQuizCompleted && (
          <div className="flex items-center gap-3 text-xs font-mono self-start sm:self-auto">
            <span className="bg-slate-200/80 px-2.5 py-1 rounded-md text-slate-700 font-bold">
              Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-teal-700 font-bold bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Current Score: {score}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        {!isQuizCompleted ? (
          <div className="space-y-5">
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-teal-600 h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="font-mono text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Topic: {currentQ.subtopic}
                </span>
                <span className="font-mono">Single Best Answer</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {currentQuestionIndex + 1}. {currentQ.question}
              </h3>

              {/* Options List */}
              <div className="space-y-2.5 pt-1">
                {currentQ.options.map((option, idx) => {
                  let optionStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                  if (selectedOption === idx && !isAnswerSubmitted) {
                    optionStyle = 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/20 font-medium';
                  }

                  if (isAnswerSubmitted) {
                    if (idx === currentQ.correctIndex) {
                      optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                    } else if (selectedOption === idx) {
                      optionStyle = 'bg-red-50 border-red-500 text-red-950 line-through';
                    } else {
                      optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start justify-between gap-3 ${optionStyle}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </div>

                      {isAnswerSubmitted && idx === currentQ.correctIndex && (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Scientific Explanation Reveal */}
              {isAnswerSubmitted && (
                <div
                  className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
                    selectedOption === currentQ.correctIndex
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-red-50/80 border-red-200 text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                    {selectedOption === currentQ.correctIndex ? (
                      <span className="text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> Correct Answer!
                      </span>
                    ) : (
                      <span className="text-red-700 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Incorrect Choice
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed font-sans">
                    <strong>Scientific Rationale: </strong>
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  Choose one option and click Submit Answer
                </span>

                {!isAnswerSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    <span>
                      {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Final Results'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Final Score Card & Full Question Review */
          <div className="space-y-6">
            <div className={`p-6 rounded-xl border text-center space-y-3 ${getFeedbackMessage().bg}`}>
              <Award className="w-12 h-12 mx-auto text-teal-600" />
              <h3 className="text-2xl font-bold text-slate-900">
                Continuous Assessment Score: {score} / 10
              </h3>
              <div className="text-3xl font-extrabold font-mono text-teal-700">
                {percentage}%
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <div className={`text-sm font-bold ${getFeedbackMessage().color}`}>
                  {getFeedbackMessage().title}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {getFeedbackMessage().desc}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart Quiz
                </button>
              </div>
            </div>

            {/* Question-by-Question Review */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Detailed Review of All 10 Questions:
              </h4>

              <div className="space-y-3">
                {QUIZ_QUESTIONS.map((q) => {
                  const userChoice = userAnswers[q.id];
                  const isCorrect = userChoice === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                        isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/40 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-slate-800">
                          {q.id}. {q.question}
                        </div>
                        {isCorrect ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                            <CheckCircle className="w-4 h-4" /> +1 Mark
                          </span>
                        ) : (
                          <span className="text-red-700 font-bold flex items-center gap-1 shrink-0">
                            <XCircle className="w-4 h-4" /> 0 Marks
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] space-y-1 text-slate-600">
                        <div>
                          Your answer:{' '}
                          <span className={isCorrect ? 'text-emerald-800 font-medium' : 'text-red-800 font-medium'}>
                            {userChoice !== undefined ? q.options[userChoice] : 'Not answered'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="text-emerald-800 font-semibold">
                            Correct answer: {q.options[q.correctIndex]}
                          </div>
                        )}
                        <p className="text-slate-500 italic pt-1 border-t border-slate-100">
                          Rationale: {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
