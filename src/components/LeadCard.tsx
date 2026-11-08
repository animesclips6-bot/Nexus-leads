import React from 'react';
import {
  Star,
  Globe,
  Phone,
  MapPin,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import type { Lead } from '../types/index.ts';

interface LeadCardProps {
  lead: Lead;
  onAnalyze: (lead: Lead) => void;
  onSaveToCrm: (lead: Lead) => void;
  onOpenWhatsApp: (lead: Lead) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onAnalyze,
  onSaveToCrm,
  onOpenWhatsApp,
  isSelected,
  onSelect,
}) => {
  const hasWebsite = Boolean(lead.website && lead.website.trim().length > 3);
  const score = lead.aiAnalysis?.leadScore ?? lead.leadScore ?? (hasWebsite ? 60 : 92);

  const getScoreColor = (sc: number) => {
    if (sc >= 80) return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
    if (sc >= 60) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    return 'text-slate-400 border-slate-700 bg-slate-800/50';
  };

  return (
    <div
      onClick={onSelect}
      className={`relative p-5 rounded-xl border transition-all duration-200 bg-[#0B0F19] text-left flex flex-col justify-between ${
        isSelected
          ? 'border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/50'
          : 'border-slate-800/80 hover:border-slate-700 hover:bg-[#0D1322]'
      }`}
    >
      {/* Top Header: Category & Score */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          {/* Metadata Discipline: Clean unboxed text with dot separator */}
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-slate-300">{lead.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{lead.city}</span>
            {lead.neighborhood && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{lead.neighborhood}</span>
              </>
            )}
          </div>

          {/* Lead Score Indicator */}
          <div
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border tabular-nums shrink-0 ${getScoreColor(
              score
            )}`}
            title={`Lead Score Comercial: ${score}/100`}
          >
            SCORE {score}
          </div>
        </div>

        {/* Business Title */}
        <h3 className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-1">
          {lead.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
          {lead.rating ? (
            <div className="flex items-center gap-1 text-amber-400 font-mono font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{lead.rating.toFixed(1)}</span>
              <span className="text-slate-500 text-[11px] font-normal">
                ({lead.reviewsCount || 0} avaliações)
              </span>
            </div>
          ) : (
            <span className="text-slate-500 text-[11px]">Sem avaliações no Maps</span>
          )}

          <span aria-hidden="true" className="text-slate-700">·</span>

          {/* Website Status */}
          {hasWebsite ? (
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px] truncate max-w-[150px]"
            >
              <Globe className="w-3 h-3 shrink-0" />
              <span className="truncate">{lead.website?.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </a>
          ) : (
            <span className="text-purple-400 font-semibold text-[11px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Sem site identificado
            </span>
          )}
        </div>

        {/* Physical Address */}
        <p className="text-xs text-slate-400 mt-2.5 flex items-start gap-1.5 line-clamp-2 leading-relaxed">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>{lead.address}</span>
        </p>

        {/* Phone Contact */}
        {lead.phone && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-300 font-mono">
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <a
              href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-blue-400 transition-colors"
            >
              {lead.phone}
            </a>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAnalyze(lead);
          }}
          className="px-2.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          <span>{lead.aiAnalysis ? 'Ver Dossiê' : 'Claude IA'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          {/* WhatsApp Direct Pitch */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenWhatsApp(lead);
            }}
            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
            title="Abrir abordagem via WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          {/* CRM Bookmark */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSaveToCrm(lead);
            }}
            className={`p-1.5 rounded-lg border transition-colors ${
              lead.isSaved
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-700'
            }`}
            title={lead.isSaved ? 'Lead salvo no CRM' : 'Salvar no CRM'}
          >
            {lead.isSaved ? (
              <BookmarkCheck className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <Bookmark className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Google Maps link */}
          {lead.googleMapsUri && (
            <a
              href={lead.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              title="Abrir no Google Maps oficial"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
