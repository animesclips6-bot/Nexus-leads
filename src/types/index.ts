export type PipelineStage = 'new' | 'contacted' | 'negotiating' | 'proposal' | 'won' | 'lost';

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface NoteItem {
  id: string;
  text: string;
  createdAt: string;
  author?: string;
}

export interface SalesArgument {
  objection: string;
  argument: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface AiAnalysis {
  leadScore: number;
  scoreRationale: string;
  digitalMaturity: 'Nenhuma' | 'Básica' | 'Intermediária' | 'Avançada';
  opportunities: string[];
  weaknesses: string[];
  recommendedServices: string[];
  whatsappPitch: string;
  salesArguments: SalesArgument[];
  websiteCreationPrompt: string;
  swot?: SwotAnalysis;
  engineUsed?: string;
  analyzedAt?: string;
  webhookDispatched?: boolean;
  webhookDetails?: string;
}

export interface Lead {
  id: string;
  name: string;
  category: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewsCount?: number;
  lat: number;
  lng: number;
  googleMapsUri?: string;
  businessStatus?: string;
  city: string;
  neighborhood?: string;
  
  // CRM Attributes
  isSaved?: boolean;
  stage: PipelineStage;
  contactPerson?: string;
  email?: string;
  dealValue?: number;
  notes: NoteItem[];
  tasks: TaskItem[];
  savedAt?: string;
  
  // AI Attributes
  aiAnalysis?: AiAnalysis;
  leadScore?: number;
}

export interface SearchHistoryItem {
  id: string;
  niche: string;
  city: string;
  neighborhood?: string;
  timestamp: string;
  resultsCount: number;
}

export interface FilterOptions {
  onlyWithoutWebsite: boolean;
  onlyWithoutPhone: boolean;
  onlyHighPotential: boolean; // Score >= 70 or Rating >= 4.5 without website
  minRating: number;
  selectedNiche: string;
  searchQuery: string;
  targetLimit?: number;
}

export type WebhookPlatform = 'auto' | 'slack' | 'discord';

export interface WebhookLogItem {
  id: string;
  leadName: string;
  score: number;
  platform: 'discord' | 'slack' | 'custom';
  timestamp: string;
  status: 'success' | 'failed';
  responseMessage?: string;
}

export interface AppConfig {
  googleMapsApiKey: string;
  anthropicApiKey: string;
  geminiApiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  preferredAiModel: 'auto' | 'claude' | 'gemini';
  webhookUrl?: string;
  webhookPlatform?: WebhookPlatform;
  webhookEnabled?: boolean;
  minScoreForWebhook?: number;
}

