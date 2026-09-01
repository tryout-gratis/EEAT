import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { TrendDiscovery } from './components/TrendDiscovery';
import { QueryFilterView } from './components/QueryFilterView';
import { QuestionBuilderView } from './components/QuestionBuilderView';
import { EEATArticleStudio } from './components/EEATArticleStudio';
import { HistoryModal } from './components/HistoryModal';
import {
  TrendAnalysisResult,
  UserQueryItem,
  FormulatedQuestion,
  GeneratedArticle,
  ResearchHistoryItem,
} from './types';
import {
  analyzeTopicTrends,
  generateEEATArticle,
  improveArticleContent,
  checkServerHealth,
} from './services/api';
import { AlertTriangle, Sparkles, Loader2 } from 'lucide-react';

const STORAGE_KEY = 'trendeeat_history_v1';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(1);
  const [thinkingMode, setThinkingMode] = useState<boolean>(true);

  const [topic, setTopic] = useState<string>('');
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysisResult | null>(null);
  const [selectedQueries, setSelectedQueries] = useState<UserQueryItem[]>([]);
  const [formulatedQuestions, setFormulatedQuestions] = useState<FormulatedQuestion[]>([]);
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [isImproving, setIsImproving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [history, setHistory] = useState<ResearchHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (
    topicName: string,
    analysis?: TrendAnalysisResult,
    article?: GeneratedArticle
  ) => {
    try {
      const newItem: ResearchHistoryItem = {
        id: `hist-${Date.now()}`,
        topic: topicName,
        createdAt: new Date().toISOString(),
        queriesCount: analysis?.queries?.length || 0,
        hasArticle: !!article,
        analysis,
        article,
      };

      setHistory((prev) => {
        const filtered = prev.filter((item) => item.topic.toLowerCase() !== topicName.toLowerCase());
        const updated = [newItem, ...filtered].slice(0, 30);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.warn('Failed to save to history', e);
    }
  };

  // Step 1 -> Analyze Trends
  const handleStartAnalysis = async (params: {
    topic: string;
    geo: string;
    timeframe: string;
    intentFocus: string;
    autoGenerateArticle: boolean;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingMessage(
      thinkingMode
        ? 'Menghubungkan ke Google Trends & Search (Gemini 3.1 Pro High Thinking)...'
        : 'Menganalisis tren pencarian Google & memfilter kueri netizen...'
    );

    try {
      setTopic(params.topic);
      const result = await analyzeTopicTrends({
        topic: params.topic,
        geo: params.geo,
        timeframe: params.timeframe,
        intentFocus: params.intentFocus,
        thinkingMode,
      });

      setTrendAnalysis(result);
      setSelectedQueries(result.queries || []);
      setFormulatedQuestions(result.formulatedQuestions || []);

      if (params.autoGenerateArticle && result.formulatedQuestions.length > 0) {
        // Auto-pilot flow: directly generate article with top question
        setLoadingMessage('Menyusun artikel komprehensif standar E-E-A-T Google (High Reasoning)...');
        const primaryQ = result.formulatedQuestions[0].question;
        const subQs = result.formulatedQuestions.slice(1).map((q) => q.question);

        const articleResult = await generateEEATArticle({
          topic: params.topic,
          primaryQuestion: primaryQ,
          subQuestions: subQs,
          queries: result.queries.map((q) => q.query),
          thinkingMode,
        });

        setGeneratedArticle(articleResult);
        setCurrentStep(4);
        setMaxReachedStep(4);
        saveToHistory(params.topic, result, articleResult);
      } else {
        // Step-by-step flow
        setCurrentStep(2);
        setMaxReachedStep(Math.max(maxReachedStep, 2));
        saveToHistory(params.topic, result);
      }
    } catch (error: any) {
      console.error('Analysis failed:', error);
      setErrorMessage(error.message || 'Gagal menganalisis tren. Pastikan topik valid.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Step 2 -> Proceed to Questions
  const handleProceedToQuestions = (selected: UserQueryItem[]) => {
    setSelectedQueries(selected);
    setCurrentStep(3);
    setMaxReachedStep(Math.max(maxReachedStep, 3));
  };

  // Step 3 -> Generate EEAT Article
  const handleGenerateArticle = async (params: {
    primaryQuestion: string;
    subQuestions: string[];
    targetAudience: string;
    tone: string;
    language: string;
    customInstructions: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingMessage(
      thinkingMode
        ? 'Menyusun artikel mendalam standar Google E-E-A-T (High Thinking Reasoning Mode)...'
        : 'Menulis artikel komprehensif dan menghasilkan evaluasi E-E-A-T...'
    );

    try {
      const result = await generateEEATArticle({
        topic,
        primaryQuestion: params.primaryQuestion,
        subQuestions: params.subQuestions,
        queries: selectedQueries.map((q) => q.query),
        targetAudience: params.targetAudience,
        tone: params.tone,
        language: params.language,
        thinkingMode,
        customInstructions: params.customInstructions,
      });

      setGeneratedArticle(result);
      setCurrentStep(4);
      setMaxReachedStep(4);
      saveToHistory(topic, trendAnalysis || undefined, result);
    } catch (error: any) {
      console.error('Article generation failed:', error);
      setErrorMessage(error.message || 'Gagal menghasilkan artikel. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Step 4 -> Improve Article Content
  const handleImproveArticle = async (instruction: string, dimension?: string) => {
    if (!generatedArticle) return;
    setIsImproving(true);
    setErrorMessage(null);

    try {
      const result = await improveArticleContent({
        article: generatedArticle,
        instruction,
        dimensionToBoost: dimension || 'all',
        thinkingMode,
      });

      const updatedArticle: GeneratedArticle = {
        ...generatedArticle,
        markdownContent: result.updatedMarkdownContent,
        eeatAudit: result.updatedEeatAudit || generatedArticle.eeatAudit,
      };

      setGeneratedArticle(updatedArticle);
      saveToHistory(topic, trendAnalysis || undefined, updatedArticle);
    } catch (error: any) {
      console.error('Improvement failed:', error);
      setErrorMessage(error.message || 'Gagal memperbarui artikel.');
    } finally {
      setIsImproving(false);
    }
  };

  // Reset to New Research
  const handleNewResearch = () => {
    setCurrentStep(1);
    setTopic('');
    setTrendAnalysis(null);
    setSelectedQueries([]);
    setFormulatedQuestions([]);
    setGeneratedArticle(null);
    setErrorMessage(null);
  };

  // Load item from History
  const handleSelectHistoryItem = (item: ResearchHistoryItem) => {
    setTopic(item.topic);
    if (item.analysis) {
      setTrendAnalysis(item.analysis);
      setSelectedQueries(item.analysis.queries || []);
      setFormulatedQuestions(item.analysis.formulatedQuestions || []);
    }
    if (item.article) {
      setGeneratedArticle(item.article);
      setCurrentStep(4);
      setMaxReachedStep(4);
    } else if (item.analysis) {
      setCurrentStep(2);
      setMaxReachedStep(2);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* App Header */}
      <Header
        thinkingMode={thinkingMode}
        onToggleThinkingMode={setThinkingMode}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNewResearch={handleNewResearch}
        historyCount={history.length}
        currentStep={currentStep}
      />

      {/* Interactive Step Progress Stepper */}
      <StepIndicator
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        maxReachedStep={maxReachedStep}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mt-4 px-4 sm:px-6 w-full">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-start gap-3 text-xs shadow-sm">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold block text-sm mb-0.5">Terjadi Kendala</strong>
              <p>{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-800 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-8 max-w-md w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 text-white">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Sedang Memproses Riset</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {loadingMessage || 'Mohon tunggu sejenak...'}
              </p>
            </div>

            {thinkingMode && (
              <div className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200/80 rounded-lg p-2.5 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>High Thinking Mode aktif untuk kualitas analitis maksimal</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1 pb-16">
        {currentStep === 1 && (
          <TrendDiscovery
            onStartAnalysis={handleStartAnalysis}
            isLoading={isLoading}
            thinkingMode={thinkingMode}
          />
        )}

        {currentStep === 2 && trendAnalysis && (
          <QueryFilterView
            analysis={trendAnalysis}
            onProceedToQuestions={handleProceedToQuestions}
            onBackToSearch={() => setCurrentStep(1)}
            isLoading={isLoading}
          />
        )}

        {currentStep === 3 && (
          <QuestionBuilderView
            topic={topic}
            initialQuestions={formulatedQuestions}
            selectedQueries={selectedQueries}
            onGenerateArticle={handleGenerateArticle}
            onBackToQueries={() => setCurrentStep(2)}
            isLoading={isLoading}
            thinkingMode={thinkingMode}
          />
        )}

        {currentStep === 4 && generatedArticle && (
          <EEATArticleStudio
            article={generatedArticle}
            onBackToQuestions={() => setCurrentStep(3)}
            onUpdateArticle={(art) => setGeneratedArticle(art)}
            onImproveArticle={handleImproveArticle}
            isImproving={isImproving}
          />
        )}
      </main>

      {/* History Drawer Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
      />
    </div>
  );
}
