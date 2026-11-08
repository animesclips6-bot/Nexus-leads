import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Send,
  Globe,
  Star,
  Phone,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  FileCode,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import type { Lead, AiAnalysis } from '../types/index.ts';

interface ClaudeIntelligenceModalProps {
  lead: Lead | null;
  analysis: AiAnalysis | null;
  isLoading: boolean;
  onClose: () => void;
  onSaveToCrm?: (lead: Lead) => void;
}

export const ClaudeIntelligenceModal: React.FC<ClaudeIntelligenceModalProps> = ({
  lead,
  analysis,
  isLoading,
  onClose,
  onSaveToCrm,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pitch' | 'arguments' | 'prompt' | 'swot'>('pitch');

  if (!lead) return null;

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleOpenWhatsApp = (text: string) => {
    if (!lead.phone) return;
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const score = analysis?.leadScore ?? lead.leadScore ?? 85;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0A0E1A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-900/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                  Claude Intelligence Dossier
                </span>
                {analysis?.engineUsed && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded">
                    {analysis.engineUsed}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
                {lead.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-purple-500 animate-spin mb-4" />
              <h3 className="text-base font-bold text-white">Analisando Lead com Claude AI...</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Avaliando maturidade digital, oportunidades comerciais no Google Maps, dores do nicho e redigindo pitch de vendas...
              </p>
            </div>
          ) : (
            <>
              {/* Webhook Alert for High Score Lead */}
              {score >= 90 && (
                <div className="p-3 px-4 rounded-xl bg-purple-950/40 border border-purple-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-left">
                  <div className="flex items-center gap-2.5 text-purple-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>
                      <strong className="text-white">Lead de Alta Pontuação (Score {score}/100):</strong> Notificação comercial disparada via Webhook para canais integrados (Slack / Discord).
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-900/60 px-2.5 py-0.5 rounded border border-purple-700/50 shrink-0">
                    Webhook Ativo
                  </span>
                </div>
              )}

              {/* Score & Diagnostic Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Score Dial */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-4">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-purple-500 transition-all duration-1000 ease-out"
                        strokeDasharray={`${score}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-mono font-black text-sm text-white tabular-nums">
                      {score}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Lead Score Comercial
                    </span>
                    <p className="text-xs font-bold text-purple-400 mt-0.5">
                      {score >= 80 ? 'Oportunidade Prioritária' : score >= 60 ? 'Potencial Moderado' : 'Qualificação Normal'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Escala de 0 a 100</p>
                  </div>
                </div>

                {/* Digital Maturity */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Maturidade Digital
                  </span>
                  <p className="text-base font-bold text-white mt-1">
                    {analysis?.digitalMaturity || (lead.website ? 'Intermediária' : 'Básica')}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lead.website ? 'Possui presença web online' : 'Sem site oficial identificado'}
                  </p>
                </div>

                {/* Company Reputation */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Google Maps Data
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-base mt-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{lead.rating ? lead.rating.toFixed(1) : '—'}</span>
                    <span className="text-slate-400 text-xs font-normal">
                      ({lead.reviewsCount || 0} avaliações)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">
                    {lead.category} · {lead.city}
                  </p>
                </div>
              </div>

              {/* Analytical Rationale */}
              {analysis?.scoreRationale && (
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs leading-relaxed text-blue-200">
                  <strong className="text-blue-300 font-semibold block mb-1">
                    Diagnóstico Executivo da IA:
                  </strong>
                  {analysis.scoreRationale}
                </div>
              )}

              {/* Opportunities & Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Commercial Opportunities */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2.5">
                    <TrendingUp className="w-4 h-4" />
                    Oportunidades Comerciais Detectadas
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {analysis?.opportunities.map((opp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2.5">
                    <AlertTriangle className="w-4 h-4" />
                    Fraquezas Digitais da Empresa
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {analysis?.weaknesses.map((weak, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Services */}
              {analysis?.recommendedServices && (
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <h4 className="text-xs font-bold text-purple-400 flex items-center gap-1.5 mb-2.5">
                    <Lightbulb className="w-4 h-4" />
                    Serviços de Maior Valor para Oferecer
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {analysis.recommendedServices.map((srv, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200"
                      >
                        {srv}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs for Actionable Deliverables */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setActiveTab('pitch')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      activeTab === 'pitch'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Script WhatsApp
                  </button>
                  <button
                    onClick={() => setActiveTab('arguments')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      activeTab === 'arguments'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Argumentos &amp; Objeções
                  </button>
                  <button
                    onClick={() => setActiveTab('prompt')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      activeTab === 'prompt'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Prompt para Criação do Site
                  </button>
                  <button
                    onClick={() => setActiveTab('swot')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      activeTab === 'swot'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Matriz SWOT
                  </button>
                </div>

                {/* Tab 1: WhatsApp Pitch */}
                {activeTab === 'pitch' && analysis?.whatsappPitch && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5" /> Mensagem Pronta para Abordagem no WhatsApp
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(analysis.whatsappPitch, 'pitch')}
                          className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded flex items-center gap-1.5 transition-colors"
                        >
                          {copiedSection === 'pitch' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar Texto</span>
                            </>
                          )}
                        </button>
                        {lead.phone && (
                          <button
                            onClick={() => handleOpenWhatsApp(analysis.whatsappPitch)}
                            className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Abrir no WhatsApp</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                      {analysis.whatsappPitch}
                    </div>
                  </div>
                )}

                {/* Tab 2: Sales Arguments */}
                {activeTab === 'arguments' && analysis?.salesArguments && (
                  <div className="space-y-2.5">
                    {analysis.salesArguments.map((arg, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5"
                      >
                        <p className="font-semibold text-amber-400 flex items-center gap-1.5">
                          <span>Objeção:</span> &ldquo;{arg.objection}&rdquo;
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                          <strong className="text-blue-400">Argumento:</strong> {arg.argument}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 3: Website Creation Prompt */}
                {activeTab === 'prompt' && analysis?.websiteCreationPrompt && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5" /> Prompt para Construtor de Sites ou IA
                      </span>
                      <button
                        onClick={() => handleCopy(analysis.websiteCreationPrompt, 'prompt')}
                        className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded flex items-center gap-1.5 transition-colors"
                      >
                        {copiedSection === 'prompt' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed">
                      {analysis.websiteCreationPrompt}
                    </div>
                  </div>
                )}

                {/* Tab 4: SWOT Analysis */}
                {activeTab === 'swot' && analysis?.swot && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                      <h5 className="font-bold text-emerald-400 mb-2">Forças (Strengths)</h5>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {analysis.swot.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                      <h5 className="font-bold text-rose-400 mb-2">Fraquezas (Weaknesses)</h5>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {analysis.swot.weaknesses.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                      <h5 className="font-bold text-blue-400 mb-2">Oportunidades (Opportunities)</h5>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {analysis.swot.opportunities.map((o, idx) => (
                          <li key={idx}>{o}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                      <h5 className="font-bold text-amber-400 mb-2">Ameaças (Threats)</h5>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {analysis.swot.threats.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#080B14] flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-400">
            Dossiê estruturado com Claude Intelligence &middot; NEXUS LEADS AI
          </div>
          <div className="flex items-center gap-2">
            {onSaveToCrm && (
              <button
                onClick={() => onSaveToCrm(lead)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                {lead.isSaved ? 'Atualizado no CRM' : 'Salvar no CRM'}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
