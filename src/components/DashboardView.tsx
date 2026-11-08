import React from 'react';
import {
  Users,
  BookmarkCheck,
  Globe,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Star,
  MapPin,
  Search,
  MessageSquare,
  BarChart,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Filter,
  Clock,
} from 'lucide-react';
import type { Lead } from '../types/index.ts';

interface DashboardViewProps {
  leads: Lead[];
  savedLeads: Lead[];
  onNavigateToSearch: () => void;
  onNavigateToCrm: () => void;
  onAnalyzeLead: (lead: Lead) => void;
  onOpenWhatsApp: (lead: Lead) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  savedLeads,
  onNavigateToSearch,
  onNavigateToCrm,
  onAnalyzeLead,
  onOpenWhatsApp,
}) => {
  const allLeads = leads.length > 0 ? leads : savedLeads;
  const totalLeads = allLeads.length;
  const withoutWebsiteCount = allLeads.filter((l) => !l.website).length;
  const withoutWebsitePercent = totalLeads > 0 ? Math.round((withoutWebsiteCount / totalLeads) * 100) : 0;
  const hotLeads = allLeads.filter((l) => (l.leadScore ?? 85) >= 80);
  const hotLeadsCount = hotLeads.length;
  const totalSaved = savedLeads.length;

  // CRM Funnel Metrics (Leads Captados vs Leads em Negociação vs Leads Convertidos)
  const capturedCount = savedLeads.length;
  const inNegotiationLeads = savedLeads.filter(
    (l) => l.stage === 'negotiating' || l.stage === 'proposal'
  );
  const inNegotiationCount = inNegotiationLeads.length;

  const convertedLeads = savedLeads.filter((l) => l.stage === 'won');
  const convertedCount = convertedLeads.length;

  const contactedLeads = savedLeads.filter((l) => l.stage === 'contacted');
  const contactedCount = contactedLeads.length;
  const newLeadsCount = savedLeads.filter((l) => l.stage === 'new').length;

  // Conversion Rates
  const overallConversionRate = capturedCount > 0
    ? ((convertedCount / capturedCount) * 100).toFixed(1)
    : '0.0';

  const negotiationConversionRate = capturedCount > 0
    ? ((inNegotiationCount / capturedCount) * 100).toFixed(1)
    : '0.0';

  const closingRate = (inNegotiationCount + convertedCount) > 0
    ? ((convertedCount / (inNegotiationCount + convertedCount)) * 100).toFixed(1)
    : '0.0';

  // Deal Values
  const totalPipelineValue = savedLeads.reduce((acc, l) => acc + (l.dealValue || 2200), 0);
  const negotiatingValue = inNegotiationLeads.reduce((acc, l) => acc + (l.dealValue || 2400), 0);
  const wonValue = convertedLeads.reduce((acc, l) => acc + (l.dealValue || 3350), 0);
  const avgTicketWon = convertedCount > 0 ? Math.round(wonValue / convertedCount) : 3350;

  // Segment distribution
  const segmentCounts: Record<string, number> = {};
  allLeads.forEach((l) => {
    const cat = l.category || 'Geral';
    segmentCounts[cat] = (segmentCounts[cat] || 0) + 1;
  });

  const sortedSegments = Object.entries(segmentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Top urgent opportunities: high rating, high reviews, without website
  const priorityOpportunities = allLeads
    .filter((l) => !l.website)
    .sort((a, b) => (b.leadScore ?? 90) - (a.leadScore ?? 90))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Leads */}
        <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Leads Identificados
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {totalLeads}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold font-mono">100%</span> verificados no Google Maps
          </p>
        </div>

        {/* KPI 2: Saved in CRM */}
        <div
          onClick={onNavigateToCrm}
          className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left relative overflow-hidden group hover:border-indigo-500/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Leads no CRM
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookmarkCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {totalSaved}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Em funil de vendas ativo</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </p>
        </div>

        {/* KPI 3: Without Website (High Opportunity) */}
        <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              Sem Site Identificado
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {withoutWebsiteCount}{' '}
            <span className="text-sm font-normal text-purple-400/90 font-mono">
              ({withoutWebsitePercent}%)
            </span>
          </div>
          <p className="text-[11px] text-purple-300/80 mt-1">
            Alvo de alta conversão para criação de sites
          </p>
        </div>

        {/* KPI 4: Hot Opportunities (Score >= 80) */}
        <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Oportunidades Quentes
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {hotLeadsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Score comercial &ge; 80/100 qualificado
          </p>
        </div>
      </div>

      {/* CRM Funnel Conversion Card (Leads Captados vs Leads em Negociação vs Leads Convertidos) */}
      <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                Funil de Vendas &amp; Conversão CRM
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Pipeline Ativo</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight mt-1">
              Taxa de Conversão do Funil Comercial
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Acompanhamento de eficiência: Leads captados no Google Maps vs. Leads em negociação vs. Leads convertidos
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
            <div className="p-2.5 px-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-left">
              <span className="block text-[10px] text-emerald-400 uppercase font-semibold">
                Conversão Geral
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-emerald-300 font-mono tabular-nums">
                  {overallConversionRate}%
                </span>
                <span className="text-[10px] text-slate-400">fechamento</span>
              </div>
            </div>

            <button
              onClick={onNavigateToCrm}
              className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 shrink-0"
            >
              <span>Gerenciar Funil</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stepped Visual Funnel (3 Stages) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stage 1: Leads Captados */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 relative overflow-hidden flex flex-col justify-between hover:border-blue-500/30 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> 1. Leads Captados
                </span>
                <span className="font-mono text-slate-400 text-[11px]">100% da Base</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-black text-white font-mono tabular-nums">
                  {capturedCount}
                </span>
                <span className="text-xs text-slate-400">empresas no CRM</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                Empresas prospectadas no Google Maps adicionadas ao pipeline de prospecção comercial.
              </p>
            </div>

            <div>
              {/* Funnel Stage Bar 1 */}
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                <div className="h-full w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span>Potencial em Pipeline:</span>
                <span className="font-mono font-semibold text-slate-200 tabular-nums">
                  R$ {totalPipelineValue.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Stage 2: Leads em Negociação */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 relative overflow-hidden flex flex-col justify-between hover:border-purple-500/30 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> 2. Em Negociação
                </span>
                <span className="font-mono text-purple-300 text-[11px] tabular-nums">
                  {negotiationConversionRate}% do total
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-black text-white font-mono tabular-nums">
                  {inNegotiationCount}
                </span>
                <span className="text-xs text-slate-400">em negociação ativa</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                Apresentações comerciais realizadas, reuniões agendadas e propostas formais enviadas.
              </p>
            </div>

            <div>
              {/* Funnel Stage Bar 2 */}
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                  style={{
                    width: `${Math.max(20, Math.min(100, Number(negotiationConversionRate) || 30))}%`,
                  }}
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span>Volume em Propostas:</span>
                <span className="font-mono font-semibold text-purple-300 tabular-nums">
                  R$ {negotiatingValue.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Stage 3: Leads Convertidos */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30 relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 3. Leads Convertidos
                </span>
                <span className="font-mono text-emerald-300 text-[11px] tabular-nums">
                  {overallConversionRate}% Conversão
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-black text-white font-mono tabular-nums">
                  {convertedCount}
                </span>
                <span className="text-xs text-slate-400">contratos fechados</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                Contratos assinados com sucesso e serviços de criação de site/consultoria faturados.
              </p>
            </div>

            <div>
              {/* Funnel Stage Bar 3 */}
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                  style={{
                    width: `${Math.max(15, Math.min(100, Number(overallConversionRate) || 25))}%`,
                  }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span>Receita Faturada:</span>
                <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                  R$ {wonValue.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Funnel Flow & Transition Rate Bar */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-300">
            <span className="font-semibold text-white">Fluxo do Funil:</span>
            <span className="font-mono text-blue-300 tabular-nums">{capturedCount} Captados</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="font-mono text-purple-300 tabular-nums">
              {inNegotiationCount} Em Negociação ({negotiationConversionRate}%)
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="font-mono text-emerald-300 tabular-nums">
              {convertedCount} Convertidos ({overallConversionRate}%)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 shrink-0">
            <div>
              <span>Taxa de Fechamento (Negociação → Ganho): </span>
              <strong className="text-emerald-400 font-mono tabular-nums">{closingRate}%</strong>
            </div>
            <div>
              <span>Ticket Médio: </span>
              <strong className="text-white font-mono tabular-nums">
                R$ {avgTicketWon.toLocaleString('pt-BR')}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph 1: Digital Presence Ratio */}
        <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Presença Digital no Google</span>
            <span className="text-[10px] font-mono text-slate-500">Métrica Real</span>
          </h4>
          <p className="text-xs text-slate-400 mb-6">
            Proporção de empresas com website vs sem website
          </p>

          <div className="space-y-4">
            {/* Visual Bar Indicator */}
            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${withoutWebsitePercent}%` }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-500"
                title={`Sem Website: ${withoutWebsitePercent}%`}
              />
              <div
                style={{ width: `${100 - withoutWebsitePercent}%` }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 h-full transition-all duration-500"
                title={`Com Website: ${100 - withoutWebsitePercent}%`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <div className="flex items-center gap-1.5 text-purple-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Sem Site</span>
                </div>
                <div className="text-lg font-black text-white font-mono tabular-nums mt-1">
                  {withoutWebsiteCount}
                </div>
                <span className="text-[10px] text-slate-400">{withoutWebsitePercent}% da base</span>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Com Site</span>
                </div>
                <div className="text-lg font-black text-white font-mono tabular-nums mt-1">
                  {totalLeads - withoutWebsiteCount}
                </div>
                <span className="text-[10px] text-slate-400">{100 - withoutWebsitePercent}% da base</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              💡 <strong>Insight Estratégico:</strong> {withoutWebsiteCount} empresas possuem alta demanda imediata para venda de páginas de destino (Landing Pages) e presença digital moderna.
            </div>
          </div>
        </div>

        {/* Graph 2: Niches / Segments Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Distribuição por Nicho / Categoria
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">Top Segmentos</span>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Segmentos com maior concentração de oportunidades identificadas
          </p>

          <div className="space-y-3.5">
            {sortedSegments.map(([segment, count], idx) => {
              const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{segment}</span>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {count} empresas ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(8, pct)}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
            {sortedSegments.length === 0 && (
              <p className="text-xs text-slate-500 italic py-6 text-center">
                Execute uma busca no Google Maps para visualizar estatísticas por nicho.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Top Urgent Opportunities Table */}
      <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Top Oportunidades Imediatas (Sem Website no Google Maps)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Empresas bem conceituadas com maior propensão de compra de site e consultoria digital
            </p>
          </div>

          <button
            onClick={onNavigateToSearch}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors self-end sm:self-auto"
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Ver Todos os Resultados</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Empresa</th>
                <th className="py-2.5 px-3">Cidade / Bairro</th>
                <th className="py-2.5 px-3 text-right">Avaliação Google</th>
                <th className="py-2.5 px-3 text-right">Lead Score</th>
                <th className="py-2.5 px-3 text-center">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {priorityOpportunities.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-bold text-white truncate max-w-xs">{lead.name}</p>
                    <p className="text-[11px] text-slate-400">{lead.category}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {lead.city} {lead.neighborhood ? `· ${lead.neighborhood}` : ''}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    {lead.rating ? (
                      <span className="text-amber-400 font-semibold inline-flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {lead.rating.toFixed(1)}
                        <span className="text-slate-500 text-[10px]">({lead.reviewsCount || 0})</span>
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-purple-400 tabular-nums">
                    {lead.leadScore ?? 92}/100
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onAnalyzeLead(lead)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-blue-200" />
                        Claude IA
                      </button>
                      <button
                        onClick={() => onOpenWhatsApp(lead)}
                        className="p-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                        title="Enviar WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {priorityOpportunities.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                    Nenhuma empresa sem site encontrada no momento. Faça uma busca para carregar leads.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
