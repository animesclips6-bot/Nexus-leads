import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Lead, SearchHistoryItem, AppConfig } from '../types/index.ts';

const CRM_LEADS_KEY = 'nexus_leads_crm_v1';
const SEARCH_HISTORY_KEY = 'nexus_search_history_v1';
const CONFIG_KEY = 'nexus_app_config_v1';

let supabaseClient: SupabaseClient | null = null;

export function initSupabase(url?: string, anonKey?: string): SupabaseClient | null {
  const finalUrl = url || import.meta.env.VITE_SUPABASE_URL || '';
  const finalKey = anonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (finalUrl && finalKey && finalUrl.startsWith('https://')) {
    try {
      supabaseClient = createClient(finalUrl, finalKey);
      return supabaseClient;
    } catch (err) {
      console.warn('Could not initialize Supabase client:', err);
    }
  }
  supabaseClient = null;
  return null;
}

export function getStoredConfig(): AppConfig {
  const defaults: AppConfig = {
    googleMapsApiKey: '',
    anthropicApiKey: '',
    geminiApiKey: '',
    supabaseUrl: '',
    supabaseAnonKey: '',
    preferredAiModel: 'auto',
    webhookUrl: '',
    webhookPlatform: 'auto',
    webhookEnabled: true,
    minScoreForWebhook: 90,
  };

  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      return { ...defaults, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error reading stored config:', e);
  }
  return defaults;
}

export function saveStoredConfig(config: AppConfig) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    if (config.supabaseUrl && config.supabaseAnonKey) {
      initSupabase(config.supabaseUrl, config.supabaseAnonKey);
    }
  } catch (e) {
    console.error('Error saving config:', e);
  }
}

export const DEFAULT_CRM_LEADS: Lead[] = [
  {
    id: 'seed-lead-1',
    name: 'Clínica OdontoVila Estética Dental',
    category: 'Clínicas Odontológicas',
    address: 'Av. Paulista, 1420 - Bela Vista, São Paulo - SP',
    phone: '(11) 98745-1200',
    website: undefined,
    rating: 4.8,
    reviewsCount: 94,
    lat: -23.5614,
    lng: -46.6562,
    city: 'São Paulo',
    neighborhood: 'Bela Vista',
    stage: 'won',
    dealValue: 3800,
    isSaved: true,
    savedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    leadScore: 94,
    notes: [
      { id: 'n1', text: 'Fechamento de contrato assinado: Criação de Landing Page + Google Meu Negócio otimizado.', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() }
    ],
    tasks: [],
  },
  {
    id: 'seed-lead-2',
    name: 'Bella Forneria & Pizzaria Nobre',
    category: 'Pizzaria',
    address: 'Rua Augusta, 980 - Consolação, São Paulo - SP',
    phone: '(11) 97120-4355',
    website: undefined,
    rating: 4.6,
    reviewsCount: 165,
    lat: -23.5532,
    lng: -46.6588,
    city: 'São Paulo',
    neighborhood: 'Consolação',
    stage: 'won',
    dealValue: 2900,
    isSaved: true,
    savedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    leadScore: 91,
    notes: [
      { id: 'n2', text: 'Cliente fechou pacote completo com cardápio digital integrado e WhatsApp de pedidos.', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() }
    ],
    tasks: [],
  },
  {
    id: 'seed-lead-3',
    name: 'Pet Care Focinhos & Cia',
    category: 'Pet Shop',
    address: 'Rua dos Pinheiros, 740 - Pinheiros, São Paulo - SP',
    phone: '(11) 99341-8890',
    website: undefined,
    rating: 4.7,
    reviewsCount: 88,
    lat: -23.5670,
    lng: -46.6865,
    city: 'São Paulo',
    neighborhood: 'Pinheiros',
    stage: 'negotiating',
    dealValue: 2400,
    isSaved: true,
    savedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    leadScore: 88,
    notes: [
      { id: 'n3', text: 'Reunião de apresentação realizada via WhatsApp. Dono interessado em site com agendamento online de banho e tosa.', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ],
    tasks: [
      { id: 't1', title: 'Enviar demonstração de layout para Pet Shop', dueDate: new Date(Date.now() + 86400000).toISOString(), completed: false, priority: 'high' }
    ],
  },
  {
    id: 'seed-lead-4',
    name: 'Barbearia Dom Barba Tradicional',
    category: 'Barbearia',
    address: 'Rua Oscar Freire, 520 - Cerqueira César, São Paulo - SP',
    phone: '(11) 98210-9944',
    website: undefined,
    rating: 4.9,
    reviewsCount: 210,
    lat: -23.5630,
    lng: -46.6690,
    city: 'São Paulo',
    neighborhood: 'Cerqueira César',
    stage: 'proposal',
    dealValue: 2200,
    isSaved: true,
    savedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    leadScore: 89,
    notes: [
      { id: 'n4', text: 'Proposta comercial enviada no valor de R$ 2.200 com pagamento em 2x. Aguardando retorno.', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() }
    ],
    tasks: [],
  },
  {
    id: 'seed-lead-5',
    name: 'Churrascaria Fogo Nobre Grill',
    category: 'Churrascaria',
    address: 'Av. Brigadeiro Faria Lima, 2040 - Itaim Bibi, São Paulo - SP',
    phone: '(11) 99450-3321',
    website: undefined,
    rating: 4.5,
    reviewsCount: 140,
    lat: -23.5780,
    lng: -46.6890,
    city: 'São Paulo',
    neighborhood: 'Itaim Bibi',
    stage: 'contacted',
    dealValue: 3500,
    isSaved: true,
    savedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    leadScore: 86,
    notes: [
      { id: 'n5', text: 'Primeiro contato realizado pelo WhatsApp consultivo gerado pela IA. Gerente pediu para retornar.', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ],
    tasks: [],
  },
  {
    id: 'seed-lead-6',
    name: 'Açaiteria & Sorvetes Tropical Fruit',
    category: 'Açaiteria',
    address: 'Rua Fradique Coutinho, 310 - Vila Madalena, São Paulo - SP',
    phone: '(11) 98110-6677',
    website: undefined,
    rating: 4.7,
    reviewsCount: 75,
    lat: -23.5590,
    lng: -46.6910,
    city: 'São Paulo',
    neighborhood: 'Vila Madalena',
    stage: 'new',
    dealValue: 1800,
    isSaved: true,
    savedAt: new Date(Date.now() - 86400000).toISOString(),
    leadScore: 87,
    notes: [
      { id: 'n6', text: 'Lead captado no Google Maps. Empresa com nota 4.7 e sem site divulgado.', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ],
    tasks: [],
  },
  {
    id: 'seed-lead-7',
    name: 'Auto Mecânica & Centro Automotivo Precision',
    category: 'Oficina Mecânica',
    address: 'Av. Santo Amaro, 2890 - Brooklin, São Paulo - SP',
    phone: '(11) 97320-1199',
    website: undefined,
    rating: 4.4,
    reviewsCount: 62,
    lat: -23.6180,
    lng: -46.6810,
    city: 'São Paulo',
    neighborhood: 'Brooklin',
    stage: 'new',
    dealValue: 2500,
    isSaved: true,
    savedAt: new Date(Date.now() - 86400000).toISOString(),
    leadScore: 84,
    notes: [
      { id: 'n7', text: 'Lead prospectado no Google Maps e salvo no CRM.', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ],
    tasks: [],
  },
  {
    id: 'seed-lead-8',
    name: 'Studio Bella Donna Cabelo e Estética',
    category: 'Salão de Beleza',
    address: 'Alameda Lorena, 1120 - Jardins, São Paulo - SP',
    phone: '(11) 98900-5544',
    website: undefined,
    rating: 4.8,
    reviewsCount: 112,
    lat: -23.5650,
    lng: -46.6640,
    city: 'São Paulo',
    neighborhood: 'Jardins',
    stage: 'new',
    dealValue: 2000,
    isSaved: true,
    savedAt: new Date(Date.now() - 86400000).toISOString(),
    leadScore: 89,
    notes: [
      { id: 'n8', text: 'Lead prospectado no Google Maps e salvo no CRM.', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ],
    tasks: [],
  },
];

export function getSavedLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(CRM_LEADS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading saved leads:', e);
  }
  // Initialize with seed leads so CRM and conversion funnel are immediately populated
  try {
    localStorage.setItem(CRM_LEADS_KEY, JSON.stringify(DEFAULT_CRM_LEADS));
  } catch (_) {}
  return DEFAULT_CRM_LEADS;
}

export function saveLeadsToStorage(leads: Lead[]) {
  try {
    localStorage.setItem(CRM_LEADS_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error('Error writing leads to local storage:', e);
  }
}

// Background sync to Supabase if configured
export async function syncLeadToSupabase(lead: Lead) {
  if (!supabaseClient) return;
  try {
    const payload = {
      id: lead.id,
      name: lead.name,
      category: lead.category,
      address: lead.address,
      phone: lead.phone,
      website: lead.website,
      rating: lead.rating,
      reviews_count: lead.reviewsCount,
      lat: lead.lat,
      lng: lead.lng,
      lead_score: lead.leadScore || 0,
      stage: lead.stage,
      notes: lead.notes,
      tasks: lead.tasks,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseClient
      .from('nexus_leads')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase sync notice (table may need setup):', error.message);
    }
  } catch (err) {
    console.warn('Supabase sync skipped:', err);
  }
}

export function getSearchHistory(): SearchHistoryItem[] {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading search history:', e);
  }
  return [
    {
      id: 'sh-1',
      niche: 'Clínicas Odontológicas',
      city: 'São Paulo',
      neighborhood: 'Paulista',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      resultsCount: 20,
    },
    {
      id: 'sh-2',
      niche: 'Restaurantes',
      city: 'Rio de Janeiro',
      neighborhood: 'Ipanema',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      resultsCount: 18,
    },
  ];
}

export function addSearchHistoryItem(item: Omit<SearchHistoryItem, 'id' | 'timestamp'>) {
  try {
    const history = getSearchHistory();
    const newItem: SearchHistoryItem = {
      ...item,
      id: `sh-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newItem, ...history.slice(0, 19)];
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving search history:', e);
    return [];
  }
}
