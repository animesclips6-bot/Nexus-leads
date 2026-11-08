import React from 'react';
import {
  Star,
  Globe,
  Phone,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import type { Lead } from '../types/index.ts';

interface LeadTableProps {
  leads: Lead[];
  onAnalyze: (lead: Lead) => void;
  onSaveToCrm: (lead: Lead) => void;
  onOpenWhatsApp: (lead: Lead) => void;
  selectedLeadId?: string;
  onSelectLead: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onAnalyze,
  onSaveToCrm,
  onOpenWhatsApp,
  selectedLeadId,
  onSelectLead,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-[#0B0F19]">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-medium">
            <th className="py-3 px-4">Empresa &amp; Segmento</th>
            <th className="py-3 px-3">Localização</th>
            <th className="py-3 px-3">Status Web</th>
            <th className="py-3 px-3 text-right">Avaliação</th>
            <th className="py-3 px-3 text-right">Lead Score</th>
            <th className="py-3 px-3">Telefone</th>
            <th className="py-3 px-4 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {leads.map((lead) => {
            const hasWebsite = Boolean(lead.website && lead.website.trim().length > 3);
            const score = lead.aiAnalysis?.leadScore ?? lead.leadScore ?? (hasWebsite ? 60 : 92);
            const isSelected = selectedLeadId === lead.id;

            return (
              <tr
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className={`transition-colors cursor-pointer group ${
                  isSelected ? 'bg-blue-600/10' : 'hover:bg-slate-900/40'
                }`}
              >
                {/* Name & Segment */}
                <td className="py-3 px-4 max-w-xs">
                  <p className="font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                    {lead.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {lead.category}
                  </p>
                </td>

                {/* Location */}
                <td className="py-3 px-3 max-w-[200px] text-slate-300 truncate">
                  <span className="text-slate-200">{lead.city}</span>
                  {lead.neighborhood && (
                    <span className="text-slate-500 text-[11px]"> ({lead.neighborhood})</span>
                  )}
                </td>

                {/* Website */}
                <td className="py-3 px-3 whitespace-nowrap">
                  {hasWebsite ? (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 truncate max-w-[140px]"
                    >
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{lead.website?.replace(/^https?:\/\/(www\.)?/, '')}</span>
                    </a>
                  ) : (
                    <span className="text-purple-400 font-semibold text-[11px] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-purple-400 shrink-0" />
                      Sem website
                    </span>
                  )}
                </td>

                {/* Rating */}
                <td className="py-3 px-3 text-right whitespace-nowrap font-mono tabular-nums">
                  {lead.rating ? (
                    <span className="text-amber-400 font-semibold flex items-center justify-end gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {lead.rating.toFixed(1)}
                      <span className="text-slate-500 text-[10px]">({lead.reviewsCount || 0})</span>
                    </span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>

                {/* Lead Score */}
                <td className="py-3 px-3 text-right whitespace-nowrap font-mono tabular-nums font-bold">
                  <span
                    className={
                      score >= 80
                        ? 'text-purple-400'
                        : score >= 60
                        ? 'text-blue-400'
                        : 'text-slate-400'
                    }
                  >
                    {score}/100
                  </span>
                </td>

                {/* Phone */}
                <td className="py-3 px-3 whitespace-nowrap font-mono text-slate-300">
                  {lead.phone ? (
                    <a
                      href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-blue-400"
                    >
                      {lead.phone}
                    </a>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onAnalyze(lead)}
                      className="px-2 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded flex items-center gap-1 shadow-sm"
                      title="Qualificar com Claude AI"
                    >
                      <Sparkles className="w-3 h-3 text-blue-200" />
                      <span>{lead.aiAnalysis ? 'Dossiê' : 'Analisar'}</span>
                    </button>

                    <button
                      onClick={() => onOpenWhatsApp(lead)}
                      className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/20"
                      title="Abordagem WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSaveToCrm(lead)}
                      className={`p-1.5 rounded border ${
                        lead.isSaved
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : 'bg-slate-900 text-slate-400 hover:text-white border-slate-700'
                      }`}
                      title={lead.isSaved ? 'Lead salvo' : 'Salvar no CRM'}
                    >
                      {lead.isSaved ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {lead.googleMapsUri && (
                      <a
                        href={lead.googleMapsUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-700"
                        title="Ver no Google Maps"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
