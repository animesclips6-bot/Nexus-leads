import React from 'react';
import { Search, Plus, Download, Sparkles, MapPin } from 'lucide-react';
import type { ActiveTab } from './Sidebar.tsx';

interface TopNavProps {
  activeTab: ActiveTab;
  onNewSearchClick: () => void;
  onExportCsvClick: () => void;
  totalLeadsCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onNewSearchClick,
  onExportCsvClick,
  totalLeadsCount,
}) => {
  const getTabLabel = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Visão Geral & Métricas Comerciais';
      case 'search':
        return 'Prospecção no Google Places API (New)';
      case 'crm':
        return 'Pipeline de Vendas & Negociações';
      case 'intelligence':
        return 'Qualificação & Análise Claude Intelligence';
      case 'reports':
        return 'Relatórios Estratégicos & Histórico';
      case 'settings':
        return 'Configurações de APIs & Integrações';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 bg-[#090D17]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between gap-8 shrink-0 sticky top-0 z-30">
      {/* Zone 1: Contextual Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap shrink-0">
        <span className="font-semibold text-slate-300">Nexus Leads AI</span>
        <span className="text-slate-600">/</span>
        <span className="text-blue-400 font-medium">{getTabLabel()}</span>
      </div>

      {/* Zone 2: Informational Status */}
      <div className="hidden lg:flex items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>Base Ativa: <strong className="text-slate-200 font-mono tabular-nums">{totalLeadsCount}</strong> empresas</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>IA: <span className="text-slate-200">Claude 3.5 Sonnet &amp; Gemini 2.5</span></span>
        </div>
      </div>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onExportCsvClick}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
          title="Exportar dados em formato CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Exportar CSV</span>
        </button>

        <button
          onClick={onNewSearchClick}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-sm shadow-blue-500/25 flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Pesquisa</span>
        </button>
      </div>
    </header>
  );
};
