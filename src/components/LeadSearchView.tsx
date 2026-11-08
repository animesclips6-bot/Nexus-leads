import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Filter,
  Grid,
  List,
  Map as MapIcon,
  Sparkles,
  Globe,
  Phone,
  Star,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Info,
} from 'lucide-react';
import type { Lead, FilterOptions } from '../types/index.ts';
import { LeadCard } from './LeadCard.tsx';
import { LeadTable } from './LeadTable.tsx';
import { GoogleMapView } from './GoogleMapView.tsx';
import { LocationAutocomplete } from './LocationAutocomplete.tsx';

interface LeadSearchViewProps {
  leads: Lead[];
  isLoading: boolean;
  onSearch: (niche: string, city: string, neighborhood: string, filters: Partial<FilterOptions>) => void;
  onAnalyzeLead: (lead: Lead) => void;
  onSaveLead: (lead: Lead) => void;
  onOpenWhatsApp: (lead: Lead) => void;
  selectedLead: Lead | null;
  onSelectLead: (lead: Lead) => void;
  searchNotice?: string;
  googleMapsApiKey?: string;
}

export interface NicheItem {
  name: string;
  query: string;
  icon: string;
  category: string;
}

export const REQUESTED_NICHES: NicheItem[] = [
  { name: 'Açaiteria', query: 'Açaiteria', icon: '🍧', category: 'Alimentação' },
  { name: 'Sorveteria', query: 'Sorveteria', icon: '🍦', category: 'Alimentação' },
  { name: 'Hamburgueria', query: 'Hamburgueria', icon: '🍔', category: 'Alimentação' },
  { name: 'Pizzaria', query: 'Pizzaria', icon: '🍕', category: 'Alimentação' },
  { name: 'Churrascaria', query: 'Churrascaria', icon: '🥩', category: 'Alimentação' },
  { name: 'Pet Shop', query: 'Pet Shop', icon: '🐾', category: 'Pets' },
  { name: 'Academia', query: 'Academia', icon: '🏋️', category: 'Saúde' },
  { name: 'Barbearia', query: 'Barbearia', icon: '✂️', category: 'Beleza' },
  { name: 'Salão de Beleza', query: 'Salão de Beleza', icon: '💇', category: 'Beleza' },
  { name: 'Pensão', query: 'Pensão & Hospedagem', icon: '🏨', category: 'Hospedagem' },
  { name: 'Odontologia', query: 'Clínicas Odontológicas', icon: '🦷', category: 'Saúde' },
  { name: 'Oficina Mecânica', query: 'Oficinas Mecânicas', icon: '🔧', category: 'Serviços' },
];

const QUICK_CITIES = [
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Curitiba',
  'Brasília',
  'Porto Alegre',
  'Salvador',
  'Campinas',
];

export const LeadSearchView: React.FC<LeadSearchViewProps> = ({
  leads,
  isLoading,
  onSearch,
  onAnalyzeLead,
  onSaveLead,
  onOpenWhatsApp,
  selectedLead,
  onSelectLead,
  searchNotice,
  googleMapsApiKey,
}) => {
  const [niche, setNiche] = useState('Clínicas Odontológicas');
  const [city, setCity] = useState('São Paulo');
  const [neighborhood, setNeighborhood] = useState('Paulista');
  const [searchVolume, setSearchVolume] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'map'>('grid');
  const [onlyWithoutWebsite, setOnlyWithoutWebsite] = useState(false);
  const [onlyHighPotential, setOnlyHighPotential] = useState(false);
  const [onlyWithoutPhone, setOnlyWithoutPhone] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [textFilter, setTextFilter] = useState('');

  const noWebsiteCount = leads.filter((l) => !l.website).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(niche, city, neighborhood, {
      onlyWithoutWebsite,
      onlyHighPotential,
      onlyWithoutPhone,
      minRating,
      targetLimit: searchVolume,
    });
  };

  // Filter leads based on active smart filters
  const filteredLeads = leads.filter((lead) => {
    if (onlyWithoutWebsite && lead.website) return false;
    if (onlyWithoutPhone && lead.phone) return false;
    if (onlyHighPotential && (lead.leadScore ?? 80) < 75) return false;
    if (minRating > 0 && (lead.rating || 0) < minRating) return false;
    if (
      textFilter.trim() &&
      !lead.name.toLowerCase().includes(textFilter.toLowerCase()) &&
      !lead.address.toLowerCase().includes(textFilter.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search Header Banner & Form */}
      <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 text-left relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                Motor Oficial Google Places API (New) &amp; Varredura B2B
              </span>
              <span className="text-[10px] bg-purple-950/60 text-purple-300 border border-purple-800/60 font-mono px-2 py-0.5 rounded">
                Potência Turbo Ativa: {searchVolume}+ Leads
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Encontrar Empresas &amp; Oportunidades Comerciais
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <div>
                <span className="block text-[10px] text-purple-400/80 uppercase font-semibold">Sem Website</span>
                <strong className="text-purple-200 font-mono text-sm tabular-nums">
                  {noWebsiteCount} empresas
                </strong>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Total Leads</span>
                <strong className="text-white font-mono text-sm tabular-nums">
                  {leads.length}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Search Inputs Grid */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 1: Niche */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Nicho / Segmento de Empresas
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Clínicas Odontológicas, Restaurantes..."
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  required
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  <span>{isLoading ? 'Buscando...' : 'Prospectar Leads'}</span>
                </button>
              </div>

              {/* Quick Suggestions Tags - Requested Niches */}
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium text-slate-300">Nichos Comerciais Populares:</span>
                  <span className="text-[10px] text-slate-500 font-mono">1 clique para selecionar</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {REQUESTED_NICHES.map((item) => {
                    const isSelected =
                      niche.toLowerCase() === item.name.toLowerCase() ||
                      niche.toLowerCase() === item.query.toLowerCase();
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setNiche(item.query)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold ring-1 ring-blue-400/50'
                            : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Field 2 & 3: Automatic Location & Neighborhood Autocomplete */}
            <LocationAutocomplete
              city={city}
              neighborhood={neighborhood}
              onCityChange={(newCity) => setCity(newCity)}
              onNeighborhoodChange={(newNeigh) => setNeighborhood(newNeigh)}
              onSelectLocation={(selectedCity, selectedNeigh) => {
                setCity(selectedCity);
                setNeighborhood(selectedNeigh);
              }}
            />
          </div>

          {/* Quick Major Cities Bar */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1 border-t border-slate-800/60">
            <span className="text-[11px] text-slate-500 mr-1">Cidades Populares:</span>
            {QUICK_CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCity(c);
                  setNeighborhood('');
                }}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  city === c
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search Power & Depth Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Potência da Varredura:
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { value: 100, label: '100 Leads', desc: 'Padrão Recomendado (100+ Empresas)' },
                  { value: 150, label: '150 Leads', desc: 'Varredura Turbo Máxima' },
                  { value: 50, label: '50 Leads', desc: 'Varredura Rápida' },
                ].map((vol) => (
                  <button
                    key={vol.value}
                    type="button"
                    onClick={() => setSearchVolume(vol.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      searchVolume === vol.value
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-400/40'
                        : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                    title={vol.desc}
                  >
                    <span>{vol.value === 150 ? '🚀' : vol.value === 100 ? '⚡' : '🎯'}</span>
                    <span>{vol.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Garante no mínimo 100 clientes com dezenas de oportunidades sem site</span>
            </div>
          </div>
        </form>

        {searchNotice && (
          <div className="mt-4 p-3 rounded-lg bg-blue-950/30 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{searchNotice}</span>
          </div>
        )}
      </div>

      {/* Smart Filters Toolbar */}
      <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" /> Filtros Inteligentes:
          </span>

          {/* Filter 1: Without Website */}
          <button
            onClick={() => setOnlyWithoutWebsite(!onlyWithoutWebsite)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              onlyWithoutWebsite
                ? 'bg-purple-600/20 text-purple-300 border-purple-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-700/80'
            }`}
          >
            Sem Website ({leads.filter((l) => !l.website).length})
          </button>

          {/* Filter 2: High Potential (Score 75+) */}
          <button
            onClick={() => setOnlyHighPotential(!onlyHighPotential)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              onlyHighPotential
                ? 'bg-blue-600/20 text-blue-300 border-blue-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-700/80'
            }`}
          >
            Alto Potencial Comercial
          </button>

          {/* Filter 3: Min Rating 4.5+ */}
          <button
            onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              minRating === 4.5
                ? 'bg-amber-600/20 text-amber-300 border-amber-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-700/80'
            }`}
          >
            ★ 4.5+ Avaliações
          </button>

          {/* Reset Filters */}
          {(onlyWithoutWebsite || onlyHighPotential || minRating > 0 || textFilter) && (
            <button
              onClick={() => {
                setOnlyWithoutWebsite(false);
                setOnlyHighPotential(false);
                setMinRating(0);
                setTextFilter('');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 ml-1"
            >
              <RotateCcw className="w-3 h-3" /> Limpar Filtros
            </button>
          )}
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Quick Name Search */}
          <input
            type="text"
            placeholder="Filtrar por nome..."
            value={textFilter}
            onChange={(e) => setTextFilter(e.target.value)}
            className="w-40 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Cards"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Tabela"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Mapa"
            >
              <MapIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Results View */}
      {isLoading ? (
        <div className="p-20 text-center rounded-2xl bg-[#0B0F19] border border-slate-800 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-purple-500 rounded-full animate-spin mb-3" />
          <h4 className="text-sm font-bold text-white">Consultando Google Places API (New)...</h4>
          <p className="text-xs text-slate-400 mt-1">
            Localizando empresas cadastradas em {city} no nicho de {niche}...
          </p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#0B0F19] border border-slate-800">
          <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-white">Nenhum Lead Encontrado com os Filtros Atuais</h4>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Tente remover alguns filtros ou buscar por outra cidade ou segmento.
          </p>
          <button
            onClick={() => {
              setOnlyWithoutWebsite(false);
              setOnlyHighPotential(false);
              setMinRating(0);
              setTextFilter('');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
          >
            Redefinir Filtros
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onAnalyze={onAnalyzeLead}
              onSaveToCrm={onSaveLead}
              onOpenWhatsApp={onOpenWhatsApp}
              isSelected={selectedLead?.id === lead.id}
              onSelect={() => onSelectLead(lead)}
            />
          ))}
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <LeadTable
          leads={filteredLeads}
          onAnalyze={onAnalyzeLead}
          onSaveToCrm={onSaveLead}
          onOpenWhatsApp={onOpenWhatsApp}
          selectedLeadId={selectedLead?.id}
          onSelectLead={onSelectLead}
        />
      ) : (
        /* Map View */
        <div className="space-y-4">
          <GoogleMapView
            leads={filteredLeads}
            selectedLead={selectedLead}
            onSelectLead={onSelectLead}
            onAnalyzeLead={onAnalyzeLead}
            onSaveLead={onSaveLead}
            googleMapsApiKey={googleMapsApiKey}
          />
          {selectedLead && (
            <div className="max-w-xl mx-auto">
              <LeadCard
                lead={selectedLead}
                onAnalyze={onAnalyzeLead}
                onSaveToCrm={onSaveLead}
                onOpenWhatsApp={onOpenWhatsApp}
                isSelected={true}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
