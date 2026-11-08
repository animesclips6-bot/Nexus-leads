export interface CityLocation {
  city: string;
  state: string;
  uf: string;
  neighborhoods: string[];
  lat: number;
  lng: number;
}

export const BRAZIL_CITIES: CityLocation[] = [
  {
    city: 'São Paulo',
    state: 'São Paulo',
    uf: 'SP',
    lat: -23.5505,
    lng: -46.6333,
    neighborhoods: [
      'Bela Vista',
      'Paulista',
      'Pinheiros',
      'Moema',
      'Jardins',
      'Itaim Bibi',
      'Vila Madalena',
      'Tatuapé',
      'Santana',
      'Morumbi',
      'Perdizes',
      'Vila Mariana',
      'Brooklin',
      'Campo Belo',
      'Mooca',
      'Lapa',
      'Consolação',
      'Higienópolis',
      'Aclimação',
      'Ipiranga',
      'Saúde',
      'Butantã',
      'Santo Amaro',
      'Cerqueira César',
      'Jardim Paulista',
      'Chácara Santo Antônio',
      'Vila Olímpia',
      'Anália Franco',
    ],
  },
  {
    city: 'Rio de Janeiro',
    state: 'Rio de Janeiro',
    uf: 'RJ',
    lat: -22.9068,
    lng: -43.1729,
    neighborhoods: [
      'Copacabana',
      'Ipanema',
      'Barra da Tijuca',
      'Leblon',
      'Botafogo',
      'Flamengo',
      'Tijuca',
      'Laranjeiras',
      'Centro',
      'Recreio dos Bandeirantes',
      'Gávea',
      'Humaitá',
      'São Conrado',
      'Méier',
      'Vila Isabel',
      'Madureira',
      'Jacarepaguá',
      'Grajaú',
      'Glória',
      'Santa Teresa',
      'Urca',
    ],
  },
  {
    city: 'Belo Horizonte',
    state: 'Minas Gerais',
    uf: 'MG',
    lat: -19.9167,
    lng: -43.9345,
    neighborhoods: [
      'Savassi',
      'Lourdes',
      'Funcionários',
      'Buritis',
      'Belvedere',
      'Pampulha',
      'Sion',
      'Santo Agostinho',
      'Serra',
      'Anchieta',
      'Gutierrez',
      'Prado',
      'Castelo',
      'Mangabeiras',
      'Cidade Nova',
      'Floresta',
      'Cruzeiro',
      'Ouro Preto',
    ],
  },
  {
    city: 'Curitiba',
    state: 'Paraná',
    uf: 'PR',
    lat: -25.4290,
    lng: -49.2671,
    neighborhoods: [
      'Batel',
      'Bigorrilho',
      'Água Verde',
      'Centro Cívico',
      'Cabral',
      'Juvevê',
      'Ecoville',
      'Mercês',
      'Alto da XV',
      'Santa Felicidade',
      'Portão',
      'Cristo Rei',
      'Ahú',
      'Prado Velho',
      'Vila Izabel',
      'Boa Vista',
    ],
  },
  {
    city: 'Porto Alegre',
    state: 'Rio Grande do Sul',
    uf: 'RS',
    lat: -30.0346,
    lng: -51.2177,
    neighborhoods: [
      'Moinhos de Vento',
      'Bela Vista',
      'Petrópolis',
      'Menino Deus',
      'Centro Histórico',
      'Cidade Baixa',
      'Mont\'Serrat',
      'Bom Fim',
      'Três Figueiras',
      'Higienópolis',
      'Passo d\'Areia',
      'Rio Branco',
      'Auxiliadora',
    ],
  },
  {
    city: 'Brasília',
    state: 'Distrito Federal',
    uf: 'DF',
    lat: -15.7975,
    lng: -47.8919,
    neighborhoods: [
      'Asa Sul',
      'Asa Norte',
      'Sudoeste',
      'Noroeste',
      'Lago Sul',
      'Lago Norte',
      'Águas Claras',
      'Taguatinga',
      'Guará',
      'Park Way',
      'Octogonal',
      'Vicente Pires',
    ],
  },
  {
    city: 'Salvador',
    state: 'Bahia',
    uf: 'BA',
    lat: -12.9777,
    lng: -38.5016,
    neighborhoods: [
      'Barra',
      'Ondina',
      'Rio Vermelho',
      'Pituba',
      'Itaigara',
      'Caminho das Árvores',
      'Graça',
      'Vitória',
      'Horto Florestal',
      'Campo Grande',
      'Patamares',
      'Imbuí',
      'Stella Maris',
    ],
  },
  {
    city: 'Fortaleza',
    state: 'Ceará',
    uf: 'CE',
    lat: -3.7319,
    lng: -38.5267,
    neighborhoods: [
      'Meireles',
      'Aldeota',
      'Varjota',
      'Cocó',
      'Dionísio Torres',
      'Praia de Iracema',
      'Papicu',
      'Fátima',
      'Guararapes',
      'Messejana',
    ],
  },
  {
    city: 'Recife',
    state: 'Pernambuco',
    uf: 'PE',
    lat: -8.0476,
    lng: -34.8770,
    neighborhoods: [
      'Boa Viagem',
      'Pina',
      'Casa Forte',
      'Graças',
      'Espinheiro',
      'Aflitos',
      'Madalena',
      'Derby',
      'Jaqueira',
      'Setúbal',
    ],
  },
  {
    city: 'Campinas',
    state: 'São Paulo',
    uf: 'SP',
    lat: -22.9056,
    lng: -47.0608,
    neighborhoods: [
      'Cambuí',
      'Taquaral',
      'Barão Geraldo',
      'Nova Campinas',
      'Gramado',
      'Guanabara',
      'Sousas',
      'Castelo',
      'Alphaville',
      'Mansões Santo Antônio',
    ],
  },
  {
    city: 'Florianópolis',
    state: 'Santa Catarina',
    uf: 'SC',
    lat: -27.5954,
    lng: -48.5480,
    neighborhoods: [
      'Centro',
      'Agronômica',
      'Trindade',
      'Itacorubi',
      'Córrego Grande',
      'Lagoa da Conceição',
      'Jurerê Internacional',
      'Campeche',
      'Canasvieiras',
      'Ingleses',
      'Coqueiros',
    ],
  },
  {
    city: 'Goiânia',
    state: 'Goiás',
    uf: 'GO',
    lat: -16.6869,
    lng: -49.2648,
    neighborhoods: [
      'Setor Bueno',
      'Setor Marista',
      'Setor Oeste',
      'Setor Sul',
      'Jardim Goiás',
      'Alto da Glória',
      'Setor Pedro Ludovico',
      'Setor Central',
      'Parque Amazônia',
    ],
  },
  {
    city: 'Santos',
    state: 'São Paulo',
    uf: 'SP',
    lat: -23.9608,
    lng: -46.3336,
    neighborhoods: [
      'Gonzaga',
      'Boqueirão',
      'Embaré',
      'Ponta da Praia',
      'Aparecida',
      'Campo Grande',
      'Pompeia',
      'Vila Mathias',
    ],
  },
  {
    city: 'Ribeirão Preto',
    state: 'São Paulo',
    uf: 'SP',
    lat: -21.1767,
    lng: -47.8108,
    neighborhoods: [
      'Jardim Botânico',
      'Jardim Canadá',
      'Alto da Boa Vista',
      'Vila Seixas',
      'Centro',
      'Jardim Irajá',
      'subsetor Sul',
      'Ribeirânia',
    ],
  },
];

export interface LocationSuggestion {
  title: string;
  subtitle: string;
  city: string;
  neighborhood?: string;
  state: string;
  uf: string;
  type: 'city' | 'neighborhood';
}

// Instant smart search function matching cities and neighborhoods
export function searchLocations(query: string, currentCityFilter?: string): LocationSuggestion[] {
  if (!query || query.trim().length < 2) {
    if (currentCityFilter) {
      const cityData = BRAZIL_CITIES.find(
        (c) => c.city.toLowerCase() === currentCityFilter.toLowerCase()
      );
      if (cityData) {
        return cityData.neighborhoods.slice(0, 10).map((n) => ({
          title: n,
          subtitle: `${cityData.city} - ${cityData.uf}`,
          city: cityData.city,
          neighborhood: n,
          state: cityData.state,
          uf: cityData.uf,
          type: 'neighborhood',
        }));
      }
    }

    // Default top recommendations
    return BRAZIL_CITIES.slice(0, 6).map((c) => ({
      title: c.city,
      subtitle: `${c.state} (${c.uf})`,
      city: c.city,
      neighborhood: undefined,
      state: c.state,
      uf: c.uf,
      type: 'city',
    }));
  }

  const clean = query.toLowerCase().trim();
  const results: LocationSuggestion[] = [];

  // 1. Search in matching cities
  for (const c of BRAZIL_CITIES) {
    if (c.city.toLowerCase().includes(clean)) {
      results.push({
        title: c.city,
        subtitle: `${c.state} (${c.uf})`,
        city: c.city,
        neighborhood: undefined,
        state: c.state,
        uf: c.uf,
        type: 'city',
      });
    }

    // 2. Search in neighborhoods of this city
    for (const n of c.neighborhoods) {
      if (
        n.toLowerCase().includes(clean) ||
        (clean.includes(c.city.toLowerCase()) && n.toLowerCase().includes(clean.replace(c.city.toLowerCase(), '').trim()))
      ) {
        results.push({
          title: n,
          subtitle: `${c.city} - ${c.uf}`,
          city: c.city,
          neighborhood: n,
          state: c.state,
          uf: c.uf,
          type: 'neighborhood',
        });
      }
    }
  }

  // Deduplicate and prioritize neighborhoods if query matches them closely
  return results.slice(0, 10);
}
