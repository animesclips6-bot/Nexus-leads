import React from 'react';
import {
  BarChart3,
  MapPin,
  PieChart,
  History,
  TrendingUp,
  Download,
  RotateCcw,
  Sparkles,
  Search,
} from 'lucide-react';
import type { Lead, SearchHistoryItem } from '../types/index.ts';

interface ReportsViewProps {
  leads: Lead[];
  savedLeads: Lead[];
  searchHistory: SearchHistoryItem[];
  onRepeatSearch: (item: SearchHistoryItem) => void;
  onExportCsv: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  leads,
  savedLeads,
  searchHistory,
  onRepeatSearch,
  onExportCsv,
}) => {
  const allLeads = leads.length > 0 ? leads : savedLeads;
  const total = allLeads.length;

  // City aggregation
  const cityCounts: Record<string, number> = {};
  allLeads.forEach((l) => {
    cityCounts[l.city] = (cityCounts[l.city] || 0) + 1;
  });

  // Category aggregation
  const categoryCounts: Record<string, number> = {};
  allLeads.forEach((l) => {
    categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1;
  });

  // Commercial Opportunities Breakout
  const withoutWebsite = allLeads.filter((l) => !l.website).length;
  const highRating = allLeads.filter((l) => (l.rating || 0) >= 4.5).length;
  const withoutPhone = allLeads.filter((l) => !l.phone).length;
  const highConversionPotential = allLeads.filter((l) => (l.leadScore ?? 80) >= 80).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
            Inteligência de Mercado &amp; Relatórios B2B
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Métricas de Prospecção &amp; Histórico Comercial
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Análise consolidada de leads prospectados, distribuição geográfica e oportunidades por nicho.
          </p>
        </div>

        <button
          onClick={onExportCsv}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Baixar Relatório Completo CSV</span>
        </button>
      </div>

      {/* Grid: Cities & Segments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-400" />
            Leads por Cidade / Região
          </h4>
          <p className="text-xs text-slate-400 mb-5">
            Volume de empresas identificadas por praça comercial
          </p>

          <div className="space-y-3">
            {Object.entries(cityCounts).map(([cityName, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cityName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{cityName}</span>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(10, pct)}%` }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(cityCounts).length === 0 && (
              <p className="text-xs text-slate-500 italic py-6 text-center">Nenhum dado registrado.</p>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-purple-400" />
            Leads por Segmento / Nicho
          </h4>
          <p className="text-xs text-slate-400 mb-5">
            Concentração de oportunidades por tipo de negócio
          </p>

          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([catName, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={catName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white truncate max-w-[220px]">
                      {catName}
                    </span>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(10, pct)}%` }}
                      className="h-full bg-purple-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(categoryCounts).length === 0 && (
              <p className="text-xs text-slate-500 italic py-6 text-center">Nenhum dado registrado.</p>
            )}
          </div>
        </div>
      </div>

      {/* Identified Commercial Opportunities Matrix */}
      <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Tipos de Oportunidades Comerciais Identificadas
        </h4>
        <p className="text-xs text-slate-400 mb-6">
          Serviços de alto valor prontos para comercialização ativa
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Venda de Site */}
          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
              Venda de Landing Page / Site
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1 tabular-nums">
              {withoutWebsite}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Empresas sem website cadastrado no Google Maps
            </p>
          </div>

          {/* Card 2: Gestão de Reputação & SEO */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
              Gestão de Avaliações &amp; SEO
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1 tabular-nums">
              {highRating}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Empresas com nota &ge; 4.5 aptas para automação de reviews
            </p>
          </div>

          {/* Card 3: Automação de WhatsApp */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Automação WhatsApp &amp; Agendamento
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1 tabular-nums">
              {total - withoutPhone}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Empresas com telefone ativo e público receptivo
            </p>
          </div>

          {/* Card 4: Tráfego Pago Google Ads */}
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
              Campanhas de Google Ads
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1 tabular-nums">
              {highConversionPotential}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Leads de altíssimo potencial com score comercial &ge; 80
            </p>
          </div>
        </div>
      </div>

      {/* Search History */}
      <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-4 h-4 text-blue-400" />
            Histórico Recente de Pesquisas Realizadas
          </h4>
          <span className="text-xs text-slate-500">Últimas 20 buscas</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {searchHistory.map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-slate-900/40 px-2 rounded-lg transition-colors"
            >
              <div>
                <p className="font-semibold text-white">
                  {item.niche} em {item.city} {item.neighborhood ? `(${item.neighborhood})` : ''}
                </p>
                <p className="text-[11px] text-slate-400">
                  Data: {new Date(item.timestamp).toLocaleString('pt-BR')} &middot; Encontrados:{' '}
                  <strong className="text-slate-200 font-mono">{item.resultsCount}</strong> leads
                </p>
              </div>

              <button
                onClick={() => onRepeatSearch(item)}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg flex items-center gap-1.5 hover:bg-slate-800 transition-colors shrink-0"
              >
                <RotateCcw className="w-3 h-3 text-blue-400" />
                <span>Repetir Busca</span>
              </button>
            </div>
          ))}
          {searchHistory.length === 0 && (
            <p className="text-xs text-slate-500 italic py-6 text-center">Nenhuma pesquisa no histórico.</p>
          )}
        </div>
      </div>
    </div>
  );
};
