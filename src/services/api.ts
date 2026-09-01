import { TrendAnalysisResult, GeneratedArticle, EEATAudit } from '../types';

export interface AnalyzeParams {
  topic: string;
  geo?: string;
  timeframe?: string;
  intentFocus?: string;
  thinkingMode?: boolean;
}

export interface GenerateArticleParams {
  topic: string;
  primaryQuestion: string;
  subQuestions: string[];
  queries: string[];
  targetAudience?: string;
  tone?: string;
  language?: string;
  thinkingMode?: boolean;
  customInstructions?: string;
}

export interface ImproveArticleParams {
  article: GeneratedArticle;
  instruction: string;
  dimensionToBoost?: string;
  thinkingMode?: boolean;
}

export interface ImproveArticleResult {
  updatedMarkdownContent: string;
  improvementSummary: string;
  updatedEeatAudit: EEATAudit;
}

export async function checkServerHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (error) {
    console.error('Server health check error:', error);
    return { status: 'error', hasApiKey: false };
  }
}

export async function analyzeTopicTrends(params: AnalyzeParams): Promise<TrendAnalysisResult> {
  const res = await fetch('/api/trends/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Terjadi kesalahan saat menganalisis tren Google.');
  }

  return data.data;
}

export async function generateEEATArticle(params: GenerateArticleParams): Promise<GeneratedArticle> {
  const res = await fetch('/api/article/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Terjadi kesalahan saat membuat artikel EEAT.');
  }

  return data.data;
}

export async function improveArticleContent(params: ImproveArticleParams): Promise<ImproveArticleResult> {
  const res = await fetch('/api/article/improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Gagal memperbarui artikel.');
  }

  return data.data;
}
