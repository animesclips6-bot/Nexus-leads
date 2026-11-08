import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Building2,
  Navigation,
  Search,
  X,
  ChevronDown,
  Loader2,
  Check,
} from 'lucide-react';
import {
  BRAZIL_CITIES,
  searchLocations,
  type LocationSuggestion,
} from '../data/brazilLocations.ts';

interface LocationAutocompleteProps {
  city: string;
  neighborhood: string;
  onSelectLocation: (city: string, neighborhood: string) => void;
  onCityChange: (city: string) => void;
  onNeighborhoodChange: (neighborhood: string) => void;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  city,
  neighborhood,
  onSelectLocation,
  onCityChange,
  onNeighborhoodChange,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal search query display with current city/neighborhood
  useEffect(() => {
    if (neighborhood && city) {
      setQuery(`${neighborhood}, ${city}`);
    } else if (city) {
      setQuery(city);
    }
  }, [city, neighborhood]);

  // Update suggestions on query change
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      // 1. Client-side instant suggestions from curated Brazil dataset
      const localResults = searchLocations(query, city);

      // 2. Try fetching from server Places Autocomplete endpoint if available
      try {
        if (query.trim().length >= 2) {
          const res = await fetch('/api/places/autocomplete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: query, city }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.suggestions && data.suggestions.length > 0) {
              const serverFormatted: LocationSuggestion[] = data.suggestions.map((s: {
                title: string;
                subtitle: string;
                type: 'city' | 'neighborhood';
              }) => ({
                title: s.title,
                subtitle: s.subtitle,
                city: s.type === 'city' ? s.title : city,
                neighborhood: s.type === 'neighborhood' ? s.title : undefined,
                state: '',
                uf: '',
                type: s.type,
              }));
              // Merge and deduplicate
              const combined = [...serverFormatted, ...localResults];
              const unique = combined.filter(
                (v, i, a) => a.findIndex((t) => t.title.toLowerCase() === v.title.toLowerCase()) === i
              );
              setSuggestions(unique.slice(0, 10));
              return;
            }
          }
        }
      } catch (e) {
        // Fallback to local
      }

      setSuggestions(localResults);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, isOpen, city]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: LocationSuggestion) => {
    if (item.type === 'neighborhood') {
      onSelectLocation(item.city, item.title);
      setQuery(`${item.title}, ${item.city}`);
    } else {
      onSelectLocation(item.city, '');
      setQuery(item.city);
    }
    setIsOpen(false);
  };

  // Browser Geolocation auto-detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Find closest known city from coordinates
        let closestCity = BRAZIL_CITIES[0];
        let minDistance = Infinity;

        for (const c of BRAZIL_CITIES) {
          const dist = Math.hypot(c.lat - latitude, c.lng - longitude);
          if (dist < minDistance) {
            minDistance = dist;
            closestCity = c;
          }
        }

        // Pick first iconic neighborhood or center
        const defaultNeighborhood = closestCity.neighborhoods[0] || 'Centro';
        onSelectLocation(closestCity.city, defaultNeighborhood);
        setQuery(`${defaultNeighborhood}, ${closestCity.city}`);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation warning:', err.message);
        // Default to São Paulo
        onSelectLocation('São Paulo', 'Paulista');
        setQuery('Paulista, São Paulo');
        setIsLocating(false);
      },
      { timeout: 7000 }
    );
  };

  // Active city's neighborhoods for quick chip selection
  const currentCityData = BRAZIL_CITIES.find(
    (c) => c.city.toLowerCase() === (city || 'são paulo').toLowerCase()
  ) || BRAZIL_CITIES[0];

  return (
    <div ref={containerRef} className="space-y-2">
      {/* Search Input Container */}
      <div className="relative">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            Buscador Automático de Cidade e Bairro
          </span>
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-normal capitalize tracking-normal hover:underline"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                <span>Localizando...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3 h-3 text-blue-400" />
                <span>Usar minha localização</span>
              </>
            )}
          </button>
        </label>

        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Digite o bairro ou cidade (ex: Moema, Copacabana, Curitiba...)"
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                onSelectLocation(city, '');
              }}
              className="absolute right-3 p-1 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0B0F19] border border-slate-700/90 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800 max-h-72 overflow-y-auto">
            <div className="p-2 bg-slate-950/70 text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
              <span>Sugestões Automáticas</span>
              <span className="text-slate-500 font-mono">Google Places + Base BR</span>
            </div>

            {suggestions.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                onClick={() => handleSelect(item)}
                className="px-3.5 py-2.5 hover:bg-blue-600/15 cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded-md ${
                      item.type === 'neighborhood'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {item.type === 'neighborhood' ? (
                      <MapPin className="w-3.5 h-3.5" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-blue-300">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{item.subtitle}</p>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    item.type === 'neighborhood'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {item.type === 'neighborhood' ? 'BAIRRO' : 'CIDADE'}
                </span>
              </div>
            ))}

            {suggestions.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">
                Nenhum bairro ou cidade encontrado para &ldquo;{query}&rdquo;. Tente buscar por capitais ou bairros conhecidos.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Neighborhood Chips for Currently Selected City */}
      <div className="pt-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span className="font-medium">
            Bairros Populares em <strong className="text-blue-400">{currentCityData.city}</strong>:
          </span>
          <span className="text-[10px] text-slate-500 font-mono">1 clique para selecionar</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {currentCityData.neighborhoods.slice(0, 8).map((neigh) => {
            const isSelected = neighborhood.toLowerCase() === neigh.toLowerCase();
            return (
              <button
                key={neigh}
                type="button"
                onClick={() => {
                  onNeighborhoodChange(neigh);
                  setQuery(`${neigh}, ${currentCityData.city}`);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20 font-semibold'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 inline mr-1 text-white" />}
                {neigh}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
