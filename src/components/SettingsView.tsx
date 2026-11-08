import React, { useState, useEffect } from 'react';
import {
  Key,
  ShieldCheck,
  Database,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  ExternalLink,
  Lock,
  Send,
  Bell,
  Check,
  Radio,
  Loader2,
} from 'lucide-react';
import type { AppConfig, WebhookLogItem, WebhookPlatform } from '../types/index.ts';
import { testWebhookApi, fetchWebhookLogsApi } from '../services/api.ts';

interface SettingsViewProps {
  config: AppConfig;
  onSaveConfig: (newConfig: AppConfig) => Promise<void>;
  onClearLocalData: () => void;
  apiStatus: {
    googleMaps: boolean;
    anthropic: boolean;
    gemini: boolean;
    supabase: boolean;
  };
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  onSaveConfig,
  onClearLocalData,
  apiStatus,
}) => {
  const [formData, setFormData] = useState<AppConfig>({
    ...config,
    webhookUrl: config.webhookUrl || '',
    webhookPlatform: config.webhookPlatform || 'auto',
    webhookEnabled: config.webhookEnabled !== false,
    minScoreForWebhook: config.minScoreForWebhook || 90,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogItem[]>([]);

  useEffect(() => {
    fetchWebhookLogsApi().then((res) => {
      if (res?.logs) setWebhookLogs(res.logs);
    });
  }, []);

  const handleTestWebhook = async () => {
    if (!formData.webhookUrl) {
      setWebhookTestResult({
        success: false,
        message: 'Por favor, insira a URL do webhook do Discord ou Slack antes de testar.',
      });
      return;
    }
    setIsTestingWebhook(true);
    setWebhookTestResult(null);
    try {
      const res = await testWebhookApi({
        webhookUrl: formData.webhookUrl,
        webhookPlatform: formData.webhookPlatform,
      });
      setWebhookTestResult({
        success: res.success,
        message: res.message || 'Webhook de teste disparado com sucesso!',
      });
      const updatedLogs = await fetchWebhookLogsApi();
      if (updatedLogs?.logs) setWebhookLogs(updatedLogs.logs);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na conexão com o webhook';
      setWebhookTestResult({
        success: false,
        message: msg,
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await onSaveConfig(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800">
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          Proteção Backend &amp; Arquitetura Segura
        </span>
        <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
          Configuração de APIs &amp; Integrações do NEXUS LEADS AI
        </h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Suas credenciais são processadas de forma segura e protegidas no servidor. As chaves de API nunca são expostas no código cliente do navegador.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Google Places & Maps API */}
        <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Google Places API (New) &amp; Maps</h3>
                <p className="text-xs text-slate-400">Pesquisa oficial de estabelecimentos e dados georreferenciados</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-medium">Habilitado</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Google Maps Platform API Key
            </label>
            <input
              type="password"
              value={formData.googleMapsApiKey}
              onChange={(e) => setFormData({ ...formData, googleMapsApiKey: e.target.value })}
              placeholder="AIzaSy... (ou configurado via ambiente do AI Studio)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
              <span>Chave pré-provisionada ou personalizada para chamadas seguras da Places API (New).</span>
              <a
                href="https://console.cloud.google.com/google/maps-apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline inline-flex items-center gap-0.5"
              >
                Obter no Google Cloud <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>

        {/* Section 2: Claude API (Anthropic) & Gemini Dual Engine */}
        <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Inteligência Artificial (Claude &amp; Gemini Engine)</h3>
                <p className="text-xs text-slate-400">Qualificação de leads, Lead Score 0-100, pitches de WhatsApp e prompts</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-purple-400 font-medium">Claude 3.5 Sonnet / Gemini 2.5</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Claude API Key (Anthropic)
            </label>
            <input
              type="password"
              value={formData.anthropicApiKey}
              onChange={(e) => setFormData({ ...formData, anthropicApiKey: e.target.value })}
              placeholder="sk-ant-api03-... (opcional, fallback automático para motor Gemini server-side)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
              <span>Se configurada, utiliza Claude 3.5 Sonnet diretamente; caso contrário, opera com Gemini 2.5 Flash de alta performance.</span>
            </p>
          </div>
        </div>

        {/* Section 3: Supabase (Database & Auth) */}
        <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Supabase (Banco de Dados &amp; CRM Sync)</h3>
                <p className="text-xs text-slate-400">Persistência na nuvem com autenticação e políticas RLS</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`w-2 h-2 rounded-full ${apiStatus.supabase ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              <span className={apiStatus.supabase ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                {apiStatus.supabase ? 'Supabase Conectado' : 'Armazenamento Local Ativo'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={formData.supabaseUrl}
                onChange={(e) => setFormData({ ...formData, supabaseUrl: e.target.value })}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                value={formData.supabaseAnonKey}
                onChange={(e) => setFormData({ ...formData, supabaseAnonKey: e.target.value })}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            A aplicação sincroniza automaticamente em background para a tabela <code>nexus_leads</code> mantendo conformidade com RLS. O sistema opera com persistência local resiliente mesmo sem conexão externa.
          </p>
        </div>

        {/* Section 4: Webhooks (Slack & Discord Notifications) */}
        <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-5 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Notificações por Webhook (Slack &amp; Discord)</h3>
                <p className="text-xs text-slate-400">
                  Envie alertas instantâneos para seus canais no Slack ou Discord sempre que a IA qualificar um lead de alta pontuação (Lead Score &gt; 90).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.webhookEnabled}
                  onChange={(e) => setFormData({ ...formData, webhookEnabled: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-0 focus:ring-offset-0 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-300">Ativar Notificações</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Field 1: Webhook URL */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                URL do Webhook (Discord / Slack)
              </label>
              <input
                type="text"
                value={formData.webhookUrl || ''}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                placeholder="https://discord.com/api/webhooks/... ou https://hooks.slack.com/services/..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <p className="text-[11px] text-slate-500">
                Cole a URL de Incoming Webhook do canal. Compatível nativamente com embeds ricos do Discord e blocos do Slack.
              </p>
            </div>

            {/* Field 2: Platform Choice */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Formato do Payload
              </label>
              <select
                value={formData.webhookPlatform || 'auto'}
                onChange={(e) => setFormData({ ...formData, webhookPlatform: e.target.value as WebhookPlatform })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="auto">Auto-detectar (Recomendado)</option>
                <option value="discord">Discord (Rich Embeds Coloridos)</option>
                <option value="slack">Slack (Block Kit Formatado)</option>
              </select>
            </div>
          </div>

          {/* Min Score Trigger Setting */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Gatilho de Pontuação Mínima</span>
              <span className="text-[11px] text-slate-400">
                Dispara o webhook sempre que o Claude qualificar um lead com score igual ou superior a:
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {[85, 90, 95].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFormData({ ...formData, minScoreForWebhook: val })}
                  className={`px-3 py-1 text-xs font-semibold font-mono rounded-lg transition-colors ${
                    (formData.minScoreForWebhook || 90) === val
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Score &ge; {val}
                </button>
              ))}
            </div>
          </div>

          {/* Test Webhook Action & Feedback */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
            <div className="text-xs">
              {webhookTestResult && (
                <div
                  className={`p-2.5 px-3 rounded-lg border text-xs flex items-center gap-2 ${
                    webhookTestResult.success
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {webhookTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{webhookTestResult.message}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={isTestingWebhook || !formData.webhookUrl}
              onClick={handleTestWebhook}
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl transition-all flex items-center gap-2 disabled:opacity-40 shrink-0 self-end sm:self-auto"
            >
              {isTestingWebhook ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Testando Webhook...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Testar Disparo no Canal</span>
                </>
              )}
            </button>
          </div>

          {/* Webhook Dispatch History (Recent Logs) */}
          {webhookLogs.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Últimos Disparos de Webhook ({webhookLogs.length})
              </span>
              <div className="divide-y divide-slate-800/60 rounded-xl border border-slate-800/80 bg-slate-950/60 overflow-hidden text-xs">
                {webhookLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-2.5 px-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          log.status === 'success' ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                      />
                      <span className="font-semibold text-white truncate">{log.leadName}</span>
                      <span className="text-slate-500">·</span>
                      <span className="font-mono text-purple-400 font-bold tabular-nums">
                        {log.score}/100
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-[10px] uppercase text-slate-400 font-mono">
                        {log.platform}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Compliance & LGPD */}
        <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Conformidade com LGPD &amp; Termos do Google Maps Platform</span>
          </div>
          <p className="leading-relaxed">
            O NEXUS LEADS AI respeita integralmente os Termos de Serviço do Google Maps Platform, as diretrizes de não scraping massivo, as políticas de retenção máxima de 30 dias de dados de geolocalização e a Lei Geral de Proteção de Dados (LGPD). Todos os contatos e dados capturados destinam-se exclusivamente à prospecção comercial legítima (B2B).
          </p>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClearLocalData}
            className="px-4 py-2.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Dados Locais do CRM</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Configurações Salvas com Sucesso!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Configurações'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
