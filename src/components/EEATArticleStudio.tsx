import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { GeneratedArticle, EEATAudit } from '../types';
import { EEATAuditPanel } from './EEATAuditPanel';
import {
  FileText,
  ShieldCheck,
  Search,
  HelpCircle,
  Copy,
  Check,
  Download,
  Edit3,
  Eye,
  Sparkles,
  RefreshCw,
  Share2,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  ArrowLeft,
  ExternalLink,
  Code,
} from 'lucide-react';

interface EEATArticleStudioProps {
  article: GeneratedArticle;
  onBackToQuestions: () => void;
  onUpdateArticle: (updatedArticle: GeneratedArticle) => void;
  onImproveArticle: (instruction: string, dimension?: string) => Promise<void>;
  isImproving: boolean;
}

export const EEATArticleStudio: React.FC<EEATArticleStudioProps> = ({
  article,
  onBackToQuestions,
  onUpdateArticle,
  onImproveArticle,
  isImproving,
}) => {
  const [activeTab, setActiveTab] = useState<'article' | 'eeat' | 'seo' | 'faq'>('article');
  const [isEditingMarkdown, setIsEditingMarkdown] = useState(false);
  const [editableMarkdown, setEditableMarkdown] = useState(article.markdownContent);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [customImprovePrompt, setCustomImprovePrompt] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Trigger celebration confetti on mount
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSaveMarkdownEdit = () => {
    onUpdateArticle({
      ...article,
      markdownContent: editableMarkdown,
      seoMeta: {
        ...article.seoMeta,
        wordCount: editableMarkdown.trim().split(/\s+/).length,
      },
    });
    setIsEditingMarkdown(false);
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([article.markdownContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${article.seoMeta.slug || 'artikel-eeat-google'}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleQuickImprove = async (instruction: string, dimension?: string) => {
    await onImproveArticle(instruction, dimension);
  };

  // Generate JSON-LD Schema for FAQs
  const jsonLdFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBackToQuestions}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-fit transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pertanyaan</span>
        </button>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Markdown */}
          <button
            id="btn-copy-markdown"
            type="button"
            onClick={() => handleCopy(article.markdownContent, 'markdown')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            {copiedType === 'markdown' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Salin Markdown</span>
              </>
            )}
          </button>

          {/* Download File */}
          <button
            id="btn-download-md"
            type="button"
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download .MD</span>
          </button>

          {/* Edit / Preview Toggle */}
          <button
            id="btn-toggle-edit-mode"
            type="button"
            onClick={() => {
              if (isEditingMarkdown) {
                handleSaveMarkdownEdit();
              } else {
                setEditableMarkdown(article.markdownContent);
                setIsEditingMarkdown(true);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            {isEditingMarkdown ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Simpan &amp; Tinjau</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Teks</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Meta Top Info Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Artikel Teroptimasi Google E-E-A-T
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {article.seoMeta.wordCount} Kata &bull; ~{article.seoMeta.estimatedReadTimeMinutes} Menit Baca
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span>Model: {article.modelUsed}</span>
            {article.thinkingMode && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                High Thinking
              </span>
            )}
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
          {article.seoMeta.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <div>
            <strong className="text-slate-800">Pertanyaan Poros (Pillar):</strong> &quot;{article.primaryQuestion}&quot;
          </div>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-6 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('article')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'article'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Artikel Lengkap</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('eeat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'eeat'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Skor E-E-A-T ({article.eeatAudit.overallScore}/100)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'seo'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>SEO &amp; Pratinjau Google SERP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faq')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'faq'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQ Schema Netizen ({article.faqs?.length || 0})</span>
        </button>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'article' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Article Content */}
          <div className="lg:col-span-3">
            {isEditingMarkdown ? (
              <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" /> Mode Editor Markdown
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Ketik langsung teks markdown di bawah
                  </span>
                </div>
                <textarea
                  rows={28}
                  value={editableMarkdown}
                  onChange={(e) => setEditableMarkdown(e.target.value)}
                  className="w-full font-mono text-xs text-slate-900 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditableMarkdown(article.markdownContent);
                      setIsEditingMarkdown(false);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveMarkdownEdit}
                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
                <article className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2 prose-h3:text-lg prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-table:border prose-table:border-slate-200 prose-th:bg-slate-100 prose-th:p-2.5 prose-td:p-2.5 prose-td:border-t prose-td:border-slate-200">
                  <ReactMarkdown>{article.markdownContent}</ReactMarkdown>
                </article>
              </div>
            )}
          </div>

          {/* Quick AI Refine & Quick Links Sidebar */}
          <div className="space-y-4">
            {/* Quick Refine Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Refine &amp; Tingkatkan EEAT</span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isImproving}
                  onClick={() =>
                    handleQuickImprove(
                      'Tambahkan studi kasus praktis dan contoh pengalaman lapangan nyata',
                      'experience'
                    )
                  }
                  className="w-full text-left p-2.5 text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-xl transition-all font-medium disabled:opacity-50"
                >
                  + Tambah Studi Kasus (Experience)
                </button>

                <button
                  type="button"
                  disabled={isImproving}
                  onClick={() =>
                    handleQuickImprove(
                      'Perdalam penjelasan teknis, framework konseptual, dan langkah analitis',
                      'expertise'
                    )
                  }
                  className="w-full text-left p-2.5 text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-xl transition-all font-medium disabled:opacity-50"
                >
                  + Pertajam Kedalaman Teknis (Expertise)
                </button>

                <button
                  type="button"
                  disabled={isImproving}
                  onClick={() =>
                    handleQuickImprove(
                      'Sertakan referensi standar industri, rujukan regulasi/data, dan disclaimer objektif',
                      'authoritativeness'
                    )
                  }
                  className="w-full text-left p-2.5 text-xs bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-xl transition-all font-medium disabled:opacity-50"
                >
                  + Perkuat Referensi &amp; Data (Authority)
                </button>

                <button
                  type="button"
                  disabled={isImproving}
                  onClick={() =>
                    handleQuickImprove(
                      'Tambahkan tabel checklist aksi langsung dan pro-kontra transparan',
                      'trustworthiness'
                    )
                  }
                  className="w-full text-left p-2.5 text-xs bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 rounded-xl transition-all font-medium disabled:opacity-50"
                >
                  + Tambah Tabel Checklist &amp; Transparansi
                </button>
              </div>

              {/* Custom improve input */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Instruksi Kustom:
                </label>
                <textarea
                  rows={2}
                  value={customImprovePrompt}
                  onChange={(e) => setCustomImprovePrompt(e.target.value)}
                  placeholder="Contoh: Buat kesimpulan lebih persuasif..."
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                />
                <button
                  type="button"
                  disabled={isImproving || !customImprovePrompt.trim()}
                  onClick={() => {
                    handleQuickImprove(customImprovePrompt.trim());
                    setCustomImprovePrompt('');
                  }}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  {isImproving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memperbarui...</span>
                    </>
                  ) : (
                    <span>Terapkan Instruksi</span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Skor Total EEAT:</span>
                <span className="font-bold text-emerald-600">{article.eeatAudit.overallScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jumlah Kata:</span>
                <span className="font-bold text-slate-800">{article.seoMeta.wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimasi Baca:</span>
                <span className="font-bold text-slate-800">{article.seoMeta.estimatedReadTimeMinutes} menit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Keyword Utama:</span>
                <span className="font-bold text-blue-700">{article.seoMeta.primaryKeyword}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: EEAT Audit */}
      {activeTab === 'eeat' && (
        <EEATAuditPanel
          audit={article.eeatAudit}
          onQuickImprove={(dim) =>
            handleQuickImprove(`Tingkatkan dimensi ${dim} artikel secara mendalam`, dim)
          }
          isImproving={isImproving}
        />
      )}

      {/* Tab: SEO & SERP Preview */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* Simulated Google Search Result */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Simulasi Tampilan Google Search (SERP)</h3>
                <p className="text-xs text-slate-500">
                  Pratinjau bagaimana artikel ini akan terlihat oleh pencari di hasil pencarian Google.
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSerpDevice('desktop')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    serpDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setSerpDevice('mobile')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    serpDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Google SERP Snippet Box */}
            <div className={`p-4 rounded-xl border border-slate-200 bg-white font-sans ${serpDevice === 'mobile' ? 'max-w-md mx-auto shadow-md' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  G
                </div>
                <div className="leading-tight">
                  <span className="text-xs text-slate-800 block font-medium">www.situsanda.com</span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    https://www.situsanda.com › {article.seoMeta.slug}
                  </span>
                </div>
              </div>

              <h4 className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug my-1">
                {article.seoMeta.title}
              </h4>

              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                {article.seoMeta.metaDescription}
              </p>

              {/* Rich snippet FAQ accordion inside SERP simulation */}
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                <span className="font-semibold text-slate-700">FAQ Terkait:</span>
                {article.faqs.slice(0, 2).map((f, i) => (
                  <div key={i} className="text-slate-700">
                    &bull; {f.question}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Meta Details Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Metadata Teknis SEO</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="block font-bold text-slate-500 mb-1">Title Tag (SERP Title)</span>
                <span className="font-medium text-slate-900">{article.seoMeta.title}</span>
                <span className="block text-[10px] text-slate-400 mt-1">
                  Panjang: {article.seoMeta.title.length} karakter (Optimal 50-60)
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="block font-bold text-slate-500 mb-1">URL Slug</span>
                <span className="font-mono text-blue-700">/{article.seoMeta.slug}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 md:col-span-2">
                <span className="block font-bold text-slate-500 mb-1">Meta Description</span>
                <span className="font-medium text-slate-900">{article.seoMeta.metaDescription}</span>
                <span className="block text-[10px] text-slate-400 mt-1">
                  Panjang: {article.seoMeta.metaDescription.length} karakter (Optimal 140-160)
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="block font-bold text-slate-500 mb-1">Keyword Utama (Focus Keyword)</span>
                <span className="font-bold text-slate-900 bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {article.seoMeta.primaryKeyword}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="block font-bold text-slate-500 mb-1">Keyword Sekunder (LSI)</span>
                <div className="flex flex-wrap gap-1">
                  {article.seoMeta.secondaryKeywords?.map((kw, i) => (
                    <span key={i} className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: FAQ Schema */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Pertanyaan yang Sering Diajukan Netizen (FAQ Schema)
                </h3>
                <p className="text-xs text-slate-500">
                  Dirumuskan langsung dari kueri pencarian netizen terbanyak untuk memenangkan Google FAQ Rich Results.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(jsonLdFaqSchema, null, 2), 'faq-json')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                {copiedType === 'faq-json' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>JSON-LD Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Code className="w-3.5 h-3.5" />
                    <span>Salin Schema JSON-LD</span>
                  </>
                )}
              </button>
            </div>

            {/* Accordion FAQ list */}
            <div className="space-y-3">
              {article.faqs.map((faq, index) => {
                const isExpanded = expandedFaqIndex === index;

                return (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-50/70 hover:bg-slate-100 transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                          Q{index + 1}
                        </span>
                        {faq.question}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-white text-xs text-slate-700 leading-relaxed border-t border-slate-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* JSON-LD Schema Snippet Box */}
          <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 shadow-sm font-mono text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 font-bold">Schema.org JSON-LD Script:</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                Untuk disisipkan di &lt;head&gt;
              </span>
            </div>
            <pre className="overflow-x-auto p-3 bg-black/40 rounded-xl text-[11px] leading-relaxed text-emerald-300">
              {JSON.stringify(jsonLdFaqSchema, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
