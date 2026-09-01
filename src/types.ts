export type IntentType = 'Informational' | 'Commercial' | 'Problem Solving' | 'How-To / Tutorial' | 'Trending News' | 'Comparative';

export interface UserQueryItem {
  id: string;
  query: string;
  searchVolumeLevel: 'Very High' | 'High' | 'Moderate' | 'Breakout / Rising';
  trendScore: number; // 0 - 100
  intent: IntentType;
  isRealUserTyped: boolean;
  netizenPainPoint: string;
  growthStatus: 'Breakout +500%' | 'Rising' | 'Steady High' | 'Viral';
  selected?: boolean;
}

export interface FormulatedQuestion {
  id: string;
  question: string;
  category: 'Pillar / Utama' | 'Solutif / How-To' | 'Kritis / Mitos' | 'Dilema Netizen' | 'Prediktif / Masa Depan';
  rationale: string; // Kenapa pertanyaan ini penting bagi netizen
  sourceQueries: string[]; // Queries yang mendasari pertanyaan ini
  selected: boolean;
}

export interface EEATDimensionScore {
  score: number; // 0 - 100
  status: 'Excellent' | 'Good' | 'Needs Improvement';
  highlights: string[];
  recommendations: string[];
}

export interface EEATAudit {
  overallScore: number; // 0 - 100
  experience: EEATDimensionScore;
  expertise: EEATDimensionScore;
  authoritativeness: EEATDimensionScore;
  trustworthiness: EEATDimensionScore;
  keyEEATElementsIncluded: string[];
}

export interface SEOMetadata {
  title: string;
  metaDescription: string;
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  targetAudience: string;
  estimatedReadTimeMinutes: number;
  wordCount: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface GeneratedArticle {
  id: string;
  topic: string;
  seoMeta: SEOMetadata;
  primaryQuestion: string;
  subQuestions: string[];
  markdownContent: string;
  eeatAudit: EEATAudit;
  faqs: FAQItem[];
  createdAt: string;
  modelUsed: string;
  thinkingMode: boolean;
}

export interface TrendAnalysisResult {
  topic: string;
  geo: string;
  timeframe: string;
  summary: string;
  netizenDiscussionContext: string;
  topTrendKeywords: string[];
  queries: UserQueryItem[];
  formulatedQuestions: FormulatedQuestion[];
}

export interface ResearchHistoryItem {
  id: string;
  topic: string;
  createdAt: string;
  queriesCount: number;
  hasArticle: boolean;
  article?: GeneratedArticle;
  analysis?: TrendAnalysisResult;
}
