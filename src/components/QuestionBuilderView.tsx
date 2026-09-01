import React, { useState } from 'react';
import { FormulatedQuestion, UserQueryItem } from '../types';
import {
  HelpCircle,
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  MessageSquare,
  Cpu,
  Settings2,
  Trash2,
} from 'lucide-react';

interface QuestionBuilderViewProps {
  topic: string;
  initialQuestions: FormulatedQuestion[];
  selectedQueries: UserQueryItem[];
  onGenerateArticle: (params: {
    primaryQuestion: string;
    subQuestions: string[];
    targetAudience: string;
    tone: string;
    language: string;
    customInstructions: string;
  }) => void;
  onBackToQueries: () => void;
  isLoading: boolean;
  thinkingMode: boolean;
}

export const QuestionBuilderView: React.FC<QuestionBuilderViewProps> = ({
  topic,
  initialQuestions,
  selectedQueries,
  onGenerateArticle,
  onBackToQueries,
  isLoading,
  thinkingMode,
}) => {
  const [questions, setQuestions] = useState<FormulatedQuestion[]>(initialQuestions);
  const [primaryQuestionId, setPrimaryQuestionId] = useState<string>(
    initialQuestions[0]?.id || ''
  );
  const [newQuestionText, setNewQuestionText] = useState('');
  const [targetAudience, setTargetAudience] = useState('Praktisi, Pemula hingga Menengah yang mencari panduan terpercaya');
  const [tone, setTone] = useState('Otoritatif, Informatif, Edukatif, dan Empatik');
  const [language, setLanguage] = useState('Bahasa Indonesia');
  const [customInstructions, setCustomInstructions] = useState('');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const toggleSubQuestion = (id: string) => {
    if (id === primaryQuestionId) return; // Primary is always included
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, selected: !q.selected } : q))
    );
  };

  const handleSetPrimary = (id: string) => {
    setPrimaryQuestionId(id);
    // Ensure primary question is marked selected
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, selected: true } : q))
    );
  };

  const handleAddCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: FormulatedQuestion = {
      id: `custom-q-${Date.now()}`,
      question: newQuestionText.trim(),
      category: 'Dilema Netizen',
      rationale: 'Pertanyaan kustom yang ditambahkan pengguna untuk melengkapi perspektif artikel.',
      sourceQueries: ['Kueri Kustom Pengguna'],
      selected: true,
    };

    setQuestions((prev) => [...prev, newQ]);
    setNewQuestionText('');
  };

  const handleDeleteQuestion = (id: string) => {
    if (id === primaryQuestionId) {
      alert('Tidak dapat menghapus pertanyaan utama. Pilih pertanyaan lain sebagai utama terlebih dahulu.');
      return;
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleStartArticleGeneration = () => {
    const primaryObj = questions.find((q) => q.id === primaryQuestionId);
    if (!primaryObj) {
      alert('Pilih satu pertanyaan utama sebagai pilar artikel.');
      return;
    }

    const subQuestions = questions
      .filter((q) => q.id !== primaryQuestionId && q.selected)
      .map((q) => q.question);

    onGenerateArticle({
      primaryQuestion: primaryObj.question,
      subQuestions,
      targetAudience,
      tone,
      language,
      customInstructions,
    });
  };

  const selectedCount = questions.filter((q) => q.selected).length;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBackToQueries}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-fit transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Filter Kueri</span>
        </button>

        <div className="flex items-center gap-2">
          {thinkingMode && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
              <Cpu className="w-3 h-3 text-amber-600" />
              Thinking: HIGH
            </span>
          )}
          <button
            id="btn-generate-article"
            type="button"
            onClick={handleStartArticleGeneration}
            disabled={isLoading || !primaryQuestionId}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-lg ${
              isLoading || !primaryQuestionId
                ? 'bg-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyusun Artikel EEAT (High Thinking)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Hasilkan Artikel E-E-A-T Google</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Formulasi Logis Berbasis Kueri Netizen Terbanyak</span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">
          Rumusan Pertanyaan untuk Topik: &quot;{topic}&quot;
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Pilih 1 <strong>Pertanyaan Utama (Pillar)</strong> sebagai poros judul dan pembahasan, serta centang <strong>Sub-Pertanyaan</strong> yang wajib dijawab dalam artikel untuk kepuasan pencari (Search Intent).
        </p>

        {/* Source queries mini pill summary */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400">Sumber Kueri:</span>
          {selectedQueries.slice(0, 5).map((q, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono"
            >
              &quot;{q.query}&quot;
            </span>
          ))}
          {selectedQueries.length > 5 && (
            <span className="text-[11px] text-slate-400 font-semibold">
              +{selectedQueries.length - 5} kueri lainnya
            </span>
          )}
        </div>
      </div>

      {/* Questions Selection List */}
      <div className="space-y-3 mb-6">
        {questions.map((q, index) => {
          const isPrimary = q.id === primaryQuestionId;
          const isSelected = q.selected || isPrimary;

          return (
            <div
              key={q.id || index}
              id={`question-card-${q.id}`}
              className={`p-4 rounded-xl border transition-all ${
                isPrimary
                  ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : isSelected
                  ? 'bg-white border-slate-300 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Primary Radio / Checkbox Trigger */}
                  <div className="pt-0.5 shrink-0 flex flex-col items-center gap-1">
                    <button
                      type="button"
                      title={isPrimary ? 'Pertanyaan Utama (Pillar)' : 'Jadikan Pertanyaan Utama'}
                      onClick={() => handleSetPrimary(q.id)}
                      className="p-1 text-blue-600 hover:scale-110 transition-transform"
                    >
                      {isPrimary ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-blue-500" />
                      )}
                    </button>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      {isPrimary ? 'Pillar' : 'Sub'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isPrimary
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {isPrimary ? '★ PERTANYAAN UTAMA (PILLAR)' : q.category}
                      </span>

                      {!isPrimary && (
                        <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={q.selected}
                            onChange={() => toggleSubQuestion(q.id)}
                            className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-[11px] font-medium">Sertakan sebagai Sub-topik</span>
                        </label>
                      )}
                    </div>

                    <h2
                      className={`text-sm font-bold leading-snug cursor-pointer ${
                        isPrimary ? 'text-blue-950' : 'text-slate-900'
                      }`}
                      onClick={() => handleSetPrimary(q.id)}
                    >
                      {q.question}
                    </h2>

                    {/* Rationale Explanation */}
                    <div className="mt-2 text-xs text-slate-600 bg-white/80 border border-slate-200/60 rounded-lg p-2.5">
                      <strong className="text-slate-800">Alasan Kebutuhan Netizen (Rationale):</strong>{' '}
                      {q.rationale}
                    </div>

                    {/* Source Queries */}
                    {q.sourceQueries && q.sourceQueries.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        <span className="text-[10px] text-slate-400 font-semibold">Terkait kueri:</span>
                        {q.sourceQueries.map((sq, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                          >
                            {sq}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Delete button (if not primary) */}
                {!isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    title="Hapus pertanyaan ini"
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Question Form */}
      <form
        onSubmit={handleAddCustomQuestion}
        className="bg-white border border-dashed border-slate-300 rounded-xl p-4 mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Plus className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">Tambah Pertanyaan Kustom Netizen:</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            placeholder="Contoh: Berapa estimasi biaya dan waktu yang dibutuhkan sampai melihat hasil?"
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newQuestionText.trim()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
          >
            Tambah
          </button>
        </div>
      </form>

      {/* Advanced EEAT & Target Settings Accordion */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6 shadow-sm">
        <button
          type="button"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-slate-500" />
            <span>Pengaturan Target Audiens, Tone &amp; Instruksi Khusus EEAT</span>
          </div>
          <span className="text-blue-600 text-xs font-semibold">
            {showAdvancedSettings ? 'Tutup' : 'Sesuaikan'}
          </span>
        </button>

        {showAdvancedSettings && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-200 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Audiens Pembaca
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Gaya Bahasa (Tone of Voice)
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Instruksi Tambahan (Opsional)
              </label>
              <textarea
                rows={2}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Contoh: Tambahkan tabel komparasi detail biaya, sertakan disclaimer keamanan medis/finansial, dsb."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            1 Pertanyaan Utama + {questions.filter((q) => q.id !== primaryQuestionId && q.selected).length} Sub-Pertanyaan Siap
          </h3>
          <p className="text-xs text-blue-200 mt-0.5">
            AI akan menyusun artikel mendalam yang membedah seluruh aspek ini dengan standar Google E-E-A-T.
          </p>
        </div>

        <button
          id="btn-bottom-generate-article"
          type="button"
          onClick={handleStartArticleGeneration}
          disabled={isLoading || !primaryQuestionId}
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              <span>Memproses Reasoning EEAT...</span>
            </>
          ) : (
            <>
              <span>Hasilkan Artikel E-E-A-T Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
