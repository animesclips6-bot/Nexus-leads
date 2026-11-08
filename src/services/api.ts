import type { Lead, AiAnalysis } from '../types/index.ts';

export interface SearchParams {
  niche: string;
  city: string;
  neighborhood?: string;
  query?: string;
  minRating?: number;
  onlyWithoutWebsite?: boolean;
  limit?: number;
}

export interface SearchResponse {
  source: string;
  query: string;
  count: number;
  places: Array<{
    id: string;
    displayName: { text: string };
    formattedAddress: string;
    nationalPhoneNumber?: string;
    internationalPhoneNumber?: string;
    websiteUri?: string;
    rating?: number;
    userRatingCount?: number;
    location: { latitude: number; longitude: number };
    primaryTypeDisplayName?: { text: string };
    businessStatus?: string;
    googleMapsUri?: string;
  }>;
  notice?: string;
}

export async function searchPlacesApi(params: SearchParams): Promise<{ leads: Lead[]; source: string; notice?: string }> {
  try {
    const res = await fetch('/api/places/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Erro na busca: ${res.statusText}`);
    }

    const data: SearchResponse = await res.json();
    
    const leads: Lead[] = (data.places || []).map((p) => {
      const hasWebsite = Boolean(p.websiteUri && p.websiteUri.trim().length > 3);
      // Heuristic initial lead score based on commercial opportunity
      let baseScore = hasWebsite ? 55 : 88;
      if (p.rating && p.rating >= 4.5) baseScore += 7;
      if (p.userRatingCount && p.userRatingCount > 100) baseScore += 5;
      const initialScore = Math.min(99, Math.max(30, baseScore));

      return {
        id: p.id || `lead-${Math.random().toString(36).substring(2, 9)}`,
        name: p.displayName?.text || 'Empresa sem nome',
        category: p.primaryTypeDisplayName?.text || params.niche || 'Empresa Local',
        address: p.formattedAddress || 'Endereço não disponível',
        phone: p.nationalPhoneNumber || p.internationalPhoneNumber,
        website: p.websiteUri,
        rating: p.rating,
        reviewsCount: p.userRatingCount,
        lat: p.location?.latitude || -23.5505,
        lng: p.location?.longitude || -46.6333,
        googleMapsUri: p.googleMapsUri || `https://maps.google.com/?q=${encodeURIComponent(p.displayName?.text || '')}`,
        businessStatus: p.businessStatus || 'OPERATIONAL',
        city: params.city || 'São Paulo',
        neighborhood: params.neighborhood,
        stage: 'new',
        notes: [],
        tasks: [],
        leadScore: initialScore,
      };
    });

    return {
      leads,
      source: data.source,
      notice: data.notice,
    };
  } catch (error) {
    console.error('searchPlacesApi error:', error);
    throw error;
  }
}

export async function analyzeLeadWithAi(lead: Lead): Promise<AiAnalysis> {
  const payload = {
    name: lead.name,
    category: lead.category,
    address: lead.address,
    phone: lead.phone,
    website: lead.website,
    rating: lead.rating,
    reviewsCount: lead.reviewsCount,
    city: lead.city,
    neighborhood: lead.neighborhood,
  };

  const res = await fetch('/api/ai/analyze-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || `Erro ao analisar lead: ${res.statusText}`);
  }

  const analysis: AiAnalysis = await res.json();
  analysis.analyzedAt = new Date().toISOString();
  return analysis;
}

export async function fetchServerConfig() {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) throw new Error('Falha ao obter configurações');
    return await res.json();
  } catch (error) {
    console.error('fetchServerConfig error:', error);
    return null;
  }
}

export async function saveServerConfig(config: {
  anthropicApiKey?: string;
  googleMapsApiKey?: string;
  geminiApiKey?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  webhookUrl?: string;
  webhookPlatform?: string;
  webhookEnabled?: boolean;
  minScoreForWebhook?: number;
}) {
  const res = await fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  if (!res.ok) throw new Error('Falha ao salvar configurações no servidor');
  return await res.json();
}

export async function testWebhookApi(params?: {
  webhookUrl?: string;
  webhookPlatform?: string;
}) {
  const res = await fetch('/api/webhooks/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params || {}),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.details || 'Falha ao testar webhook');
  }
  return data;
}

export async function fetchWebhookLogsApi() {
  try {
    const res = await fetch('/api/webhooks/logs');
    if (!res.ok) return { logs: [] };
    return await res.json();
  } catch (err) {
    console.error('fetchWebhookLogsApi error:', err);
    return { logs: [] };
  }
}

