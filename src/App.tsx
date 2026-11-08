import React, { useState, useEffect } from 'react';
import { Sidebar, type ActiveTab } from './components/Sidebar.tsx';
import { TopNav } from './components/TopNav.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { LeadSearchView } from './components/LeadSearchView.tsx';
import { CrmPipelineView } from './components/CrmPipelineView.tsx';
import { ReportsView } from './components/ReportsView.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { ClaudeIntelligenceModal } from './components/ClaudeIntelligenceModal.tsx';
import type { Lead, AiAnalysis, AppConfig, SearchHistoryItem, FilterOptions } from './types/index.ts';
import { searchPlacesApi, analyzeLeadWithAi, fetchServerConfig, saveServerConfig } from './services/api.ts';
import {
  getSavedLeads,
  saveLeadsToStorage,
  getSearchHistory,
  addSearchHistoryItem,
  getStoredConfig,
  saveStoredConfig,
  initSupabase,
  syncLeadToSupabase,
} from './services/storage.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [savedLeads, setSavedLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchNotice, setSearchNotice] = useState<string | undefined>();
  const [appConfig, setAppConfig] = useState<AppConfig>(getStoredConfig());
  const [apiStatus, setApiStatus] = useState({
    googleMaps: true,
    anthropic: false,
    gemini: true,
    supabase: false,
  });

  // GMP Quota Warning State (Client-Side Quota Defense)
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // AI Dossier Modal States
  const [analyzingLead, setAnalyzingLead] = useState<Lead | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AiAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    // 1. Quota tap listener
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);

    // 2. Load CRM and search history
    const storedLeads = getSavedLeads();
    setSavedLeads(storedLeads);
    setSearchHistory(getSearchHistory());

    // 3. Init Supabase if config exists
    const cfg = getStoredConfig();
    if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
      initSupabase(cfg.supabaseUrl, cfg.supabaseAnonKey);
    }

    // 4. Fetch server status
    fetchServerConfig().then((res) => {
      if (res?.integrations) {
        setApiStatus({
          googleMaps: res.integrations.googleMaps?.configured ?? true,
          anthropic: res.integrations.anthropic?.configured ?? false,
          gemini: res.integrations.gemini?.configured ?? true,
          supabase: res.integrations.supabase?.configured ?? false,
        });
      }
    });

    // 5. Initial seed search for immediate data rich experience (100+ leads)
    performSearch('Clínicas Odontológicas', 'São Paulo', 'Paulista', { targetLimit: 105 });

    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuota);
    };
  }, []);

  const performSearch = async (
    niche: string,
    city: string,
    neighborhood: string,
    filters: Partial<FilterOptions>
  ) => {
    setIsLoadingSearch(true);
    setSearchNotice(undefined);
    try {
      const result = await searchPlacesApi({
        niche,
        city,
        neighborhood,
        onlyWithoutWebsite: filters.onlyWithoutWebsite,
        minRating: filters.minRating,
        limit: filters.targetLimit || 105,
      });

      // Cross-reference with saved leads in CRM
      const enrichedLeads = result.leads.map((l) => {
        const existing = savedLeads.find((sl) => sl.id === l.id || sl.name === l.name);
        return existing ? { ...l, isSaved: true, stage: existing.stage, notes: existing.notes, tasks: existing.tasks } : l;
      });

      setLeads(enrichedLeads);
      if (enrichedLeads.length > 0) {
        setSelectedLead(enrichedLeads[0]);
      }
      setSearchNotice(result.notice);

      // Record in history
      const updatedHistory = addSearchHistoryItem({
        niche,
        city,
        neighborhood,
        resultsCount: enrichedLeads.length,
      });
      setSearchHistory(updatedHistory);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleSaveToCrm = (lead: Lead) => {
    const isAlreadySaved = savedLeads.some((l) => l.id === lead.id);
    let updatedSaved: Lead[];

    if (isAlreadySaved) {
      updatedSaved = savedLeads.map((l) => (l.id === lead.id ? { ...l, ...lead, isSaved: true } : l));
    } else {
      const newLead: Lead = {
        ...lead,
        isSaved: true,
        savedAt: new Date().toISOString(),
        stage: lead.stage || 'new',
        notes: [
          {
            id: `note-${Date.now()}`,
            text: 'Lead prospectado no Google Maps e salvo no CRM.',
            createdAt: new Date().toISOString(),
          },
          ...lead.notes,
        ],
      };
      updatedSaved = [newLead, ...savedLeads];
      syncLeadToSupabase(newLead);
    }

    setSavedLeads(updatedSaved);
    saveLeadsToStorage(updatedSaved);

    // Update in active search results
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, isSaved: true } : l))
    );
  };

  const handleUpdateCrmLead = (updatedLead: Lead) => {
    const nextSaved = savedLeads.map((l) => (l.id === updatedLead.id ? updatedLead : l));
    setSavedLeads(nextSaved);
    saveLeadsToStorage(nextSaved);
    syncLeadToSupabase(updatedLead);

    // Also update in current search list if present
    setLeads((prev) =>
      prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
    );
  };

  const handleRemoveFromCrm = (leadId: string) => {
    const nextSaved = savedLeads.filter((l) => l.id !== leadId);
    setSavedLeads(nextSaved);
    saveLeadsToStorage(nextSaved);

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, isSaved: false } : l))
    );
  };

  const handleAnalyzeWithClaude = async (lead: Lead) => {
    setAnalyzingLead(lead);
    setIsAnalyzing(true);
    setCurrentAnalysis(lead.aiAnalysis || null);

    try {
      const analysis = await analyzeLeadWithAi(lead);
      setCurrentAnalysis(analysis);

      // Attach analysis to lead in state
      const updatedLead = { ...lead, aiAnalysis: analysis, leadScore: analysis.leadScore };

      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? updatedLead : l))
      );

      if (lead.isSaved) {
        handleUpdateCrmLead(updatedLead);
      }
    } catch (err) {
      console.error('Claude AI Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenWhatsApp = (lead: Lead) => {
    if (!lead.phone) return;
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const defaultPitch = lead.aiAnalysis?.whatsappPitch ||
      `Olá! Tudo bem? Me chamo [Seu Nome], especialista em presença digital. Vi as excelentes avaliações da ${lead.name} no Google e gostaria de apresentar uma oportunidade rápida de criação de site moderno para potencializar suas vendas em ${lead.city}.`;
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(defaultPitch)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSaveConfig = async (newConfig: AppConfig) => {
    saveStoredConfig(newConfig);
    setAppConfig(newConfig);
    await saveServerConfig(newConfig);
    const updatedStatus = await fetchServerConfig();
    if (updatedStatus?.integrations) {
      setApiStatus({
        googleMaps: updatedStatus.integrations.googleMaps?.configured ?? true,
        anthropic: updatedStatus.integrations.anthropic?.configured ?? false,
        gemini: updatedStatus.integrations.gemini?.configured ?? true,
        supabase: updatedStatus.integrations.supabase?.configured ?? false,
      });
    }
  };

  const handleClearLocalData = () => {
    if (window.confirm('Tem certeza de que deseja limpar todos os leads e dados locais do CRM?')) {
      localStorage.removeItem('nexus_leads_crm_v1');
      setSavedLeads([]);
      setLeads((prev) => prev.map((l) => ({ ...l, isSaved: false })));
    }
  };

  const handleExportCsv = () => {
    const dataToExport = savedLeads.length > 0 ? savedLeads : leads;
    if (dataToExport.length === 0) {
      alert('Nenhum dado disponível para exportar no momento.');
      return;
    }

    const headers = [
      'ID',
      'Nome da Empresa',
      'Nicho / Segmento',
      'Cidade',
      'Bairro',
      'Endereço Completo',
      'Telefone',
      'Website',
      'Avaliação Google',
      'Quantidade Avaliações',
      'Lead Score',
      'Estágio CRM',
    ];

    const rows = dataToExport.map((l) => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.category.replace(/"/g, '""')}"`,
      `"${l.city.replace(/"/g, '""')}"`,
      `"${(l.neighborhood || '').replace(/"/g, '""')}"`,
      `"${l.address.replace(/"/g, '""')}"`,
      `"${l.phone || ''}"`,
      `"${l.website || 'Sem site'}"`,
      `"${l.rating || ''}"`,
      `"${l.reviewsCount || 0}"`,
      `"${l.leadScore ?? 85}"`,
      `"${l.stage || 'new'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nexus_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hotLeadsCount = leads.filter((l) => (l.leadScore ?? 80) >= 80).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080C15] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedLeadsCount={savedLeads.length}
        hotLeadsCount={hotLeadsCount}
        apiStatus={apiStatus}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Google Maps Platform Quota Exceeded Sticky Notice (Case A) */}
        {quotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm shrink-0">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        {/* Top Bar Contract (1 row, 3 zones) */}
        <TopNav
          activeTab={activeTab}
          onNewSearchClick={() => setActiveTab('search')}
          onExportCsvClick={handleExportCsv}
          totalLeadsCount={leads.length}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              leads={leads}
              savedLeads={savedLeads}
              onNavigateToSearch={() => setActiveTab('search')}
              onNavigateToCrm={() => setActiveTab('crm')}
              onAnalyzeLead={handleAnalyzeWithClaude}
              onOpenWhatsApp={handleOpenWhatsApp}
            />
          )}

          {activeTab === 'search' && (
            <LeadSearchView
              leads={leads}
              isLoading={isLoadingSearch}
              onSearch={(niche, city, neighborhood, filters) =>
                performSearch(niche, city, neighborhood, filters)
              }
              onAnalyzeLead={handleAnalyzeWithClaude}
              onSaveLead={handleSaveToCrm}
              onOpenWhatsApp={handleOpenWhatsApp}
              selectedLead={selectedLead}
              onSelectLead={setSelectedLead}
              searchNotice={searchNotice}
              googleMapsApiKey={appConfig.googleMapsApiKey}
            />
          )}

          {activeTab === 'crm' && (
            <CrmPipelineView
              savedLeads={savedLeads}
              onUpdateLead={handleUpdateCrmLead}
              onRemoveLead={handleRemoveFromCrm}
              onOpenAnalysis={handleAnalyzeWithClaude}
              onOpenWhatsApp={handleOpenWhatsApp}
            />
          )}

          {activeTab === 'intelligence' && (
            <div className="space-y-6 text-left">
              <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  Claude Intelligence Central
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Qualificação Automática &amp; Geração de Scripts Comerciais
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Selecione qualquer empresa encontrada para gerar Lead Score de 0 a 100, mensagens consultivas para WhatsApp e prompts para criação de sites.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leads.slice(0, 9).map((lead) => (
                  <div
                    key={lead.id}
                    className="p-5 rounded-xl border border-slate-800 bg-[#0B0F19] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-slate-400">{lead.category}</span>
                        <span className="text-xs font-mono font-bold text-purple-400">
                          {lead.leadScore ?? 88} SCORE
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{lead.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{lead.city} &middot; {lead.rating ? `★ ${lead.rating}` : 'Sem nota'}</p>
                      <p className={`text-xs mt-2 font-medium ${!lead.website ? 'text-purple-400' : 'text-blue-400'}`}>
                        {!lead.website ? '⚠️ Oportunidade: Sem website cadastrado' : '✓ Possui website'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAnalyzeWithClaude(lead)}
                      className="mt-4 w-full py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {lead.aiAnalysis ? 'Abrir Dossiê Completo' : 'Analisar com Claude IA'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <ReportsView
              leads={leads}
              savedLeads={savedLeads}
              searchHistory={searchHistory}
              onRepeatSearch={(item) => {
                setActiveTab('search');
                performSearch(item.niche, item.city, item.neighborhood || '', {});
              }}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              config={appConfig}
              onSaveConfig={handleSaveConfig}
              onClearLocalData={handleClearLocalData}
              apiStatus={apiStatus}
            />
          )}
        </main>
      </div>

      {/* Claude Intelligence Dossier Modal */}
      <ClaudeIntelligenceModal
        lead={analyzingLead}
        analysis={currentAnalysis}
        isLoading={isAnalyzing}
        onClose={() => setAnalyzingLead(null)}
        onSaveToCrm={handleSaveToCrm}
      />
    </div>
  );
}
