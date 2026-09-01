import React from 'react';
import { Sparkles, Brain, History, RefreshCw, Layers, ShieldCheck, Flame } from 'lucide-react';

interface HeaderProps {
  thinkingMode: boolean;
  onToggleThinkingMode: (val: boolean) => void;
  onOpenHistory: () => void;
  onNewResearch: () => void;
  historyCount: number;
  currentStep: number;
}

export const Header: React.FC<HeaderProps> = ({
  thinkingMode,
  onToggleThinkingMode,
  onOpenHistory,
  onNewResearch,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewResearch}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
            <Flame className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">TrendEEAT</span>
              <span className="text-[11px] font-semibold tracking-wide bg-blue-50 text-blue-700 border border-blue-200/70 px-2 py-0.5 rounded-full">
                Google Search & Trends AI
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Filter Kueri Netizen &bull; Bangun Pertanyaan &bull; Artikel Standar E-E-A-T
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Thinking Mode Toggle */}
          <button
            id="btn-toggle-thinking"
            type="button"
            onClick={() => onToggleThinkingMode(!thinkingMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
              thinkingMode
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title={
              thinkingMode
                ? 'High Thinking Aktif: Menggunakan gemini-3.1-pro-preview dengan ThinkingLevel.HIGH untuk analisis mendalam'
                : 'Klik untuk mengaktifkan High Thinking Mode (Reasoning Maksimal)'
            }
          >
            <Brain className={`w-4 h-4 ${thinkingMode ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden md:inline">High Thinking</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                thinkingMode ? 'bg-amber-200/80 text-amber-900' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {thinkingMode ? 'HIGH ON' : 'OFF'}
            </span>
          </button>

          {/* History Button */}
          <button
            id="btn-open-history"
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Riwayat</span>
            {historyCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-blue-600 text-white rounded-full text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Reset / New Research */}
          <button
            id="btn-new-research"
            type="button"
            onClick={onNewResearch}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Riset Baru</span>
          </button>
        </div>
      </div>
    </header>
  );
};
