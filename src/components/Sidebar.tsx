import React from 'react';
import {
  LayoutDashboard,
  Search,
  Kanban,
  Sparkles,
  BarChart3,
  Settings,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'search' | 'crm' | 'intelligence' | 'reports' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedLeadsCount: number;
  hotLeadsCount: number;
  apiStatus: {
    googleMaps: boolean;
    anthropic: boolean;
    gemini: boolean;
    supabase: boolean;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  savedLeadsCount,
  hotLeadsCount,
  apiStatus,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'search' as ActiveTab,
      label: 'Busca de Leads',
      icon: Search,
      badge: 'Google Maps',
    },
    {
      id: 'crm' as ActiveTab,
      label: 'CRM Pipeline',
      icon: Kanban,
      badge: savedLeadsCount > 0 ? String(savedLeadsCount) : undefined,
    },
    {
      id: 'intelligence' as ActiveTab,
      label: 'Claude Intelligence',
      icon: Sparkles,
      badge: hotLeadsCount > 0 ? `${hotLeadsCount} Quentes` : undefined,
    },
    {
      id: 'reports' as ActiveTab,
      label: 'Relatórios & Histórico',
      icon: BarChart3,
      badge: undefined,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Configurações & APIs',
      icon: Settings,
      badge: undefined,
    },
  ];

  return (
    <aside className="w-64 bg-[#0A0E1A] border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen select-none">
      {/* Brand Zone */}
      <div className="p-5 border-b border-slate-800/70 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-lg tracking-wider">
          N
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
            NEXUS LEADS <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">AI</span>
          </h1>
          <p className="text-[11px] text-slate-400">Prospecção B2B & Inteligência</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 pt-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Módulos Principais
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600/15 text-white border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-blue-500/25 text-blue-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Integration Status Mini-Card */}
      <div className="p-3 m-3 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-400" /> Conexões Ativas
          </span>
          <button
            onClick={() => setActiveTab('settings')}
            className="text-[10px] text-blue-400 hover:text-blue-300 underline"
          >
            Ajustar
          </button>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-slate-300">
            <span>Google Places (New)</span>
            <span className="text-[10px] font-medium text-emerald-400">Ativo</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Claude AI / Gemini</span>
            <span className="text-[10px] font-medium text-purple-400">Conectado</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Supabase CRM</span>
            <span className="text-[10px] font-medium text-blue-400">Sincronizado</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Webhook Slack/Discord</span>
            <span className="text-[10px] font-medium text-purple-400">Pronto</span>
          </div>
        </div>
      </div>

      {/* User / Workspace Footer */}
      <div className="p-3.5 border-t border-slate-800/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
            NL
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-200 truncate">Workspace B2B</p>
            <p className="text-[10px] text-slate-400 truncate">Plano Profissional</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
          PRO
        </span>
      </div>
    </aside>
  );
};
