import React from 'react';
import { Search, Filter, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  maxReachedStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onSelectStep,
  maxReachedStep,
}) => {
  const steps = [
    { number: 1, title: 'Input & Riset Tren', subtitle: 'Google Trends Data', icon: Search },
    { number: 2, title: 'Filter Kueri Netizen', subtitle: 'Real User Typed Queries', icon: Filter },
    { number: 3, title: 'Bangun Pertanyaan', subtitle: 'Logical Intent Synthesis', icon: HelpCircle },
    { number: 4, title: 'Artikel EEAT Google', subtitle: 'Experience, Expertise, Auth, Trust', icon: FileText },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Progress" className="flex items-center justify-between">
          <ol className="flex items-center w-full justify-between gap-2 sm:gap-4">
            {steps.map((step, index) => {
              const isCompleted = step.number < currentStep || maxReachedStep > step.number;
              const isCurrent = step.number === currentStep;
              const isClickable = step.number <= maxReachedStep;
              const Icon = step.icon;

              return (
                <li
                  key={step.number}
                  className={`flex-1 relative ${index !== steps.length - 1 ? 'pr-2 sm:pr-4' : ''}`}
                >
                  <button
                    id={`step-nav-${step.number}`}
                    type="button"
                    disabled={!isClickable}
                    onClick={() => isClickable && onSelectStep(step.number)}
                    className={`w-full text-left flex items-center gap-2.5 p-2 rounded-xl transition-all duration-200 group ${
                      isCurrent
                        ? 'bg-blue-50/80 border border-blue-200'
                        : isClickable
                        ? 'hover:bg-slate-50 cursor-pointer border border-transparent'
                        : 'opacity-50 cursor-not-allowed border border-transparent'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors shrink-0 ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isCompleted && !isCurrent ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0 hidden md:block">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-400">LANGKAH {step.number}</span>
                      </div>
                      <p
                        className={`text-xs font-semibold truncate ${
                          isCurrent ? 'text-blue-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{step.subtitle}</p>
                    </div>

                    {/* Mobile minimal text */}
                    <div className="min-w-0 md:hidden">
                      <p
                        className={`text-xs font-semibold truncate ${
                          isCurrent ? 'text-blue-900' : 'text-slate-600'
                        }`}
                      >
                        {step.title.split(' ')[0]}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};
