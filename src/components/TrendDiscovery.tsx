import React, { useState } from 'react';
import { Search, Sparkles, Globe, Calendar, ArrowRight, Check, Compass, Flame, ShieldAlert, Cpu } from 'lucide-react';
import { TOPIC_PRESETS, GEO_OPTIONS, TIMEFRAME_OPTIONS, TopicPreset } from '../data/presets';

interface TrendDiscoveryProps {
  onStartAnalysis: (params: {
    topic: string;
    geo: string;
    timeframe: string;
    intentFocus: string;
    autoGenerateArticle: boolean;
  }) => void;
  isLoading: boolean;
  thinkingMode: boolean;
}

export const TrendDiscovery: React.FC<TrendDiscoveryProps> = ({
  onStartAnalysis,
  isLoading,
  thinkingMode,
}) => {
  const [topic, setTopic] = useState('');
  const [geo, setGeo] = useState('ID');
  const [timeframe, setTimeframe] = useState('today 1-m');
  const [intentFocus, setIntentFocus] = useState('All');
  const [autoGenerateArticle, setAutoGenerateArticle] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onStartAnalysis({
      topic: topic.trim(),
      geo,
      timeframe,
      intentFocus,
      autoGenerateArticle,
    });
  };

  const handleSelectPreset = (preset: TopicPreset) => {
    setTopic(preset.topic);
    if (preset.geo) setGeo(preset.geo);
  };

  const intentTabs = [
    { id: 'All', label: 'Semua Kueri Netizen' },
    { id: 'Problem Solving', label: 'Masalah & Kebingungan' },
    { id: 'How-To / Tutorial', label: 'Panduan Praktis (How-To)' },
    { id: 'Informational', label: 'Eksplorasi & Konseptual' },
    { id: 'Comparative', label: 'Perbandingan & Rekomendasi' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Riset Tren Organik &bull; Generator Konten EEAT Google</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Temukan Apa yang Dicari Netizen, Bangun Artikel Standar E-E-A-T
        </h1>
        <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
          Masukkan topik Anda untuk menarik data tren pencarian Google, memfilter hanya kueri ketikan manusia asli, merumuskan pertanyaan logis, dan menyusun artikel komprehensif berbobot tinggi.
        </p>
      </div>

      {/* Main Search Box */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-5 sm:p-7 transition-all">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="topic-input" className="block text-sm font-bold text-slate-800 mb-2">
              Topik Riset atau Niche Pembahasan
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="topic-input"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Kecerdasan buatan untuk guru, Mobil listrik di Indonesia, Diet intermittent fasting..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                required
              />
            </div>
          </div>

          {/* Filters & Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Region Selector */}
            <div>
              <label htmlFor="geo-select" className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                Target Wilayah Pencarian (Geo)
              </label>
              <select
                id="geo-select"
                value={geo}
                onChange={(e) => setGeo(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                {GEO_OPTIONS.map((g) => (
                  <option key={g.code} value={g.code}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeframe Selector */}
            <div>
              <label htmlFor="timeframe-select" className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Rentang Waktu Data Tren
              </label>
              <select
                id="timeframe-select"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                {TIMEFRAME_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Intent Filters */}
          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              Fokus Niat Pencarian Netizen (Search Intent)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {intentTabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`intent-tab-${tab.id.replace(/\s+/g, '-').toLowerCase()}`}
                  type="button"
                  onClick={() => setIntentFocus(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    intentFocus === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-pilot toggle & Thinking notice */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 font-medium select-none">
              <input
                id="checkbox-auto-generate"
                type="checkbox"
                checked={autoGenerateArticle}
                onChange={(e) => setAutoGenerateArticle(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Mode Otomatis Penuh (Langsung hasilkan artikel setelah filter kueri)</span>
            </label>

            {thinkingMode && (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Cpu className="w-3.5 h-3.5 text-amber-600" />
                <span>Thinking Mode: gemini-3.1-pro-preview (HIGH)</span>
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <button
            id="btn-submit-trends-search"
            type="submit"
            disabled={isLoading || !topic.trim()}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${
              isLoading || !topic.trim()
                ? 'bg-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menganalisis Google Trends & Kueri Netizen...</span>
              </>
            ) : (
              <>
                <span>Mulai Riset Google Trends & Filter Kueri</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Recommended Presets */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800">Contoh Topik Hangat yang Banyak Dicari Netizen:</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOPIC_PRESETS.map((p) => (
            <div
              key={p.id}
              id={`preset-${p.id}`}
              onClick={() => handleSelectPreset(p)}
              className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-150 group"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {p.category}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{p.geo}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {p.topic}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Value Proposition Features Banner */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 border border-slate-200/80 rounded-xl p-5 text-center sm:text-left">
        <div className="space-y-1">
          <div className="text-xs font-bold text-blue-700 flex items-center justify-center sm:justify-start gap-1">
            <Search className="w-3.5 h-3.5" /> 1. Google Trends Live
          </div>
          <p className="text-[11px] text-slate-600">Menangkap lonjakan minat dan topik viral aktual di masyarakat.</p>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold text-indigo-700 flex items-center justify-center sm:justify-start gap-1">
            <Flame className="w-3.5 h-3.5" /> 2. Real User Typed Only
          </div>
          <p className="text-[11px] text-slate-600">Menyaring kueri ketikan manusia asli, membuang bot dan keyword sampah.</p>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold text-emerald-700 flex items-center justify-center sm:justify-start gap-1">
            <Check className="w-3.5 h-3.5" /> 3. Pertanyaan Logis
          </div>
          <p className="text-[11px] text-slate-600">Merumuskan pertanyaan bernas yang mewakili keresahan terdalam netizen.</p>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold text-amber-700 flex items-center justify-center sm:justify-start gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> 4. Standar E-E-A-T
          </div>
          <p className="text-[11px] text-slate-600">Experience, Expertise, Authoritativeness, dan Trustworthiness teruji.</p>
        </div>
      </div>
    </div>
  );
};
