import React, { useState } from 'react';
import { TrendAnalysisResult, UserQueryItem } from '../types';
import { Filter, CheckSquare, Square, TrendingUp, HelpCircle, ArrowRight, ShieldCheck, Flame, ArrowLeft } from 'lucide-react';

interface QueryFilterViewProps {
  analysis: TrendAnalysisResult;
  onProceedToQuestions: (selectedQueries: UserQueryItem[]) => void;
  onBackToSearch: () => void;
  isLoading?: boolean;
}

export const QueryFilterView: React.FC<QueryFilterViewProps> = ({
  analysis,
  onProceedToQuestions,
  onBackToSearch,
  isLoading = false,
}) => {
  const [queries, setQueries] = useState<UserQueryItem[]>(
    analysis.queries.map((q) => ({ ...q, selected: q.selected ?? true }))
  );
  const [filterType, setFilterType] = useState<'All' | 'HighVolume' | 'Breakout' | 'ProblemSolving'>('All');

  const toggleQuerySelect = (id: string) => {
    setQueries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, selected: !q.selected } : q))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setQueries((prev) => prev.map((q) => ({ ...q, selected: select })));
  };

  const filteredQueries = queries.filter((q) => {
    if (filterType === 'HighVolume') return q.searchVolumeLevel === 'Very High' || q.trendScore >= 90;
    if (filterType === 'Breakout') return q.growthStatus.includes('Breakout') || q.growthStatus.includes('Viral');
    if (filterType === 'ProblemSolving') return q.intent === 'Problem Solving' || q.intent === 'How-To / Tutorial';
    return true;
  });

  const selectedCount = queries.filter((q) => q.selected).length;

  const handleProceed = () => {
    const selected = queries.filter((q) => q.selected);
    if (selected.length === 0) {
      alert('Pilih setidaknya 1 kueri netizen untuk melanjutkan.');
      return;
    }
    onProceedToQuestions(selected);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBackToSearch}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-fit transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ganti Topik Riset</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            Terpilih: <strong className="text-slate-900">{selectedCount}</strong> dari {queries.length} kueri netizen
          </span>
          <button
            id="btn-proceed-to-questions"
            type="button"
            onClick={handleProceed}
            disabled={selectedCount === 0 || isLoading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
              selectedCount === 0 || isLoading
                ? 'bg-slate-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 active:scale-95'
            }`}
          >
            <span>Lanjut: Rumuskan Pertanyaan Logis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-lg mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              Google Trends Live &bull; {analysis.geo}
            </span>
            <span className="text-xs text-slate-300">{analysis.timeframe}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Kueri Netizen Organik Terverifikasi</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Topik: &quot;{analysis.topic}&quot;
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {analysis.summary}
        </p>

        {analysis.netizenDiscussionContext && (
          <div className="bg-white/10 rounded-xl p-3.5 text-xs text-slate-200 border border-white/10 mb-4">
            <span className="font-bold text-amber-300 mr-1.5">Konteks Diskusi Netizen:</span>
            {analysis.netizenDiscussionContext}
          </div>
        )}

        {/* Trending Keywords Badges */}
        {analysis.topTrendKeywords && analysis.topTrendKeywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10">
            <span className="text-[11px] text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Kata Kunci Terkait:
            </span>
            {analysis.topTrendKeywords.map((kw, i) => (
              <span
                key={i}
                className="bg-white/15 text-slate-200 text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-white/5"
              >
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Filter & Selection Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">Filter Tampilan:</span>
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setFilterType('All')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === 'All'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({queries.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('HighVolume')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === 'HighVolume'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Volume Tertinggi
            </button>
            <button
              type="button"
              onClick={() => setFilterType('Breakout')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === 'Breakout'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Breakout / Viral
            </button>
            <button
              type="button"
              onClick={() => setFilterType('ProblemSolving')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === 'ProblemSolving'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Masalah &amp; How-To
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => handleSelectAll(true)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1"
          >
            Pilih Semua
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => handleSelectAll(false)}
            className="text-xs text-slate-500 hover:text-slate-700 font-medium px-2 py-1"
          >
            Batal Semua
          </button>
        </div>
      </div>

      {/* Real User Queries List Cards */}
      <div className="space-y-3">
        {filteredQueries.map((item, index) => {
          const isSelected = item.selected;

          return (
            <div
              key={item.id || index}
              id={`query-card-${item.id}`}
              onClick={() => toggleQuerySelect(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-blue-50/40 border-blue-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 opacity-70'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className="pt-0.5 text-blue-600 shrink-0">
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">#{index + 1}</span>
                      <h2 className="text-sm font-bold text-slate-900">{item.query}</h2>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Search Volume Pill */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.searchVolumeLevel === 'Very High'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : item.searchVolumeLevel === 'Breakout / Rising'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {item.searchVolumeLevel}
                      </span>

                      {/* Growth Status */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500" />
                        {item.growthStatus}
                      </span>

                      {/* Intent */}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.intent}
                      </span>
                    </div>
                  </div>

                  {/* Netizen Pain Point / Search Motivation */}
                  <p className="text-xs text-slate-600 mt-1">
                    <span className="font-semibold text-slate-700">Keresahan Netizen:</span>{' '}
                    {item.netizenPainPoint}
                  </p>

                  {/* Trend Score Bar */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500">Skor Tren:</span>
                    <div className="flex-1 max-w-xs bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(10, item.trendScore))}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">{item.trendScore}/100</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {selectedCount} Kueri Terpilih Siap Diolah Menjadi Pertanyaan Logis
          </h2>
          <p className="text-xs text-slate-500">
            AI akan menyintesis kueri-kueri di atas menjadi sudut pandang pertanyaan bernas untuk struktur artikel EEAT.
          </p>
        </div>

        <button
          type="button"
          onClick={handleProceed}
          disabled={selectedCount === 0 || isLoading}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Lanjut: Rumuskan Pertanyaan Logis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
