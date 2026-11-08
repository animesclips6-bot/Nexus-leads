import React, { useState, useMemo } from 'react';
import { APIProvider, Map as VisMap, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { ExternalLink, Star, Phone, Globe, Sparkles, Plus, MapPin } from 'lucide-react';
import type { Lead } from '../types/index.ts';

interface GoogleMapViewProps {
  leads: Lead[];
  selectedLead: Lead | null;
  onSelectLead: (lead: Lead) => void;
  onAnalyzeLead: (lead: Lead) => void;
  onSaveLead: (lead: Lead) => void;
  googleMapsApiKey?: string;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  leads,
  selectedLead,
  onSelectLead,
  onAnalyzeLead,
  onSaveLead,
  googleMapsApiKey,
}) => {
  const [activeMarkerLead, setActiveMarkerLead] = useState<Lead | null>(null);

  // Compute map center from leads, defaulting to São Paulo
  const defaultCenter = useMemo(() => {
    if (leads.length > 0 && leads[0].lat && leads[0].lng) {
      return { lat: leads[0].lat, lng: leads[0].lng };
    }
    return { lat: -23.5505, lng: -46.6333 };
  }, [leads]);

  const effectiveKey = googleMapsApiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const hasValidKey = Boolean(effectiveKey && effectiveKey !== 'MY_GOOGLE_MAPS_API_KEY');

  // If Google Maps API key is configured, render real official @vis.gl/react-google-maps Map
  if (hasValidKey) {
    return (
      <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
        <APIProvider apiKey={effectiveKey} language="pt-BR" region="BR">
          <VisMap
            defaultCenter={defaultCenter}
            defaultZoom={13}
            mapId="DEMO_MAP_ID"
            className="w-full h-full"
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            {leads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              const hasNoSite = !lead.website;

              return (
                <AdvancedMarker
                  key={lead.id}
                  position={{ lat: lead.lat, lng: lead.lng }}
                  onClick={() => {
                    setActiveMarkerLead(lead);
                    onSelectLead(lead);
                  }}
                  title={lead.name}
                >
                  <Pin
                    background={hasNoSite ? '#8B5CF6' : '#2563EB'}
                    borderColor="#0F172A"
                    glyphColor="#FFFFFF"
                    scale={isSelected ? 1.25 : 1.0}
                  />
                </AdvancedMarker>
              );
            })}

            {activeMarkerLead && (
              <InfoWindow
                position={{ lat: activeMarkerLead.lat, lng: activeMarkerLead.lng }}
                onCloseClick={() => setActiveMarkerLead(null)}
              >
                <div className="p-2 max-w-xs text-slate-900 font-sans">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs leading-tight text-slate-900">
                      {activeMarkerLead.name}
                    </h4>
                    {activeMarkerLead.rating && (
                      <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-700 shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{activeMarkerLead.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {activeMarkerLead.address}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-medium ${!activeMarkerLead.website ? 'text-purple-700 font-bold' : 'text-slate-600'}`}>
                      {!activeMarkerLead.website ? 'Sem site cadastrado' : 'Com site'}
                    </span>
                    <button
                      onClick={() => onAnalyzeLead(activeMarkerLead)}
                      className="px-2 py-1 text-[10px] font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      Analisar
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </VisMap>
        </APIProvider>
      </div>
    );
  }

  // Interactive Spatial Radar Canvas when waiting for Google Maps API Key
  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-800 bg-[#070A12] flex flex-col items-center justify-center p-6 text-center shadow-inner">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Concentric Radar Rings */}
      <div className="absolute w-[440px] h-[440px] rounded-full border border-blue-500/15 pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full border border-purple-500/15 pointer-events-none" />
      <div className="absolute w-[160px] h-[160px] rounded-full border border-blue-500/20 pointer-events-none" />

      {/* Interactive Simulated Pins on Visual Grid */}
      <div className="absolute inset-8 pointer-events-auto">
        {leads.slice(0, 15).map((lead, idx) => {
          // Calculate distributed coordinates across visual bounds
          const angle = (idx / Math.min(leads.length, 15)) * Math.PI * 2;
          const radius = 35 + ((idx * 17) % 45); // percentage from center
          const left = 50 + radius * Math.cos(angle) * 0.75;
          const top = 50 + radius * Math.sin(angle) * 0.75;
          const isSelected = selectedLead?.id === lead.id;
          const hasNoSite = !lead.website;

          return (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              style={{ left: `${left}%`, top: `${top}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform ${
                isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
              }`}
            >
              <div
                className={`p-2 rounded-full border shadow-lg flex items-center justify-center transition-colors ${
                  hasNoSite
                    ? 'bg-purple-600/90 text-white border-purple-400/80 shadow-purple-500/30'
                    : 'bg-blue-600/90 text-white border-blue-400/80 shadow-blue-500/30'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
              </div>

              {/* Pin Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block whitespace-nowrap bg-slate-900 border border-slate-700 text-slate-100 text-[11px] px-2.5 py-1.5 rounded-md shadow-xl z-30 pointer-events-none">
                <p className="font-semibold">{lead.name}</p>
                <p className="text-[10px] text-slate-400">
                  {lead.rating ? `★ ${lead.rating} (${lead.reviewsCount || 0})` : 'Sem avaliações'} · {hasNoSite ? 'Sem site' : 'Com site'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Info Overlay */}
      <div className="relative z-10 max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-800 p-5 rounded-xl text-left shadow-2xl">
        <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-semibold">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span>Visualizador Georreferenciado de Leads</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          Mostrando <strong className="text-white font-mono">{leads.length}</strong> empresas encontradas em{' '}
          <span className="text-blue-300 font-medium">{leads[0]?.city || 'sua região'}</span>. Clique em qualquer marcador para inspecionar os dados ou iniciar a qualificação com Claude IA.
        </p>
        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Sem Website (Alta Oportunidade)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Com Website</span>
          </div>
        </div>
      </div>
    </div>
  );
};
