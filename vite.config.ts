import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import {
  searchPlacesHandler,
  analyzeLeadHandler,
  configHandler,
  saveConfigHandler,
  autocompleteLocationsHandler,
  testWebhookHandler,
  getWebhookLogsHandler,
} from './server/api.ts';

function apiPlugin(): Plugin {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (url === '/api/places/search' && req.method === 'POST') {
          return searchPlacesHandler(req, res);
        }
        if (url === '/api/places/autocomplete' && req.method === 'POST') {
          return autocompleteLocationsHandler(req, res);
        }
        if (url === '/api/ai/analyze-lead' && req.method === 'POST') {
          return analyzeLeadHandler(req, res);
        }
        if (url === '/api/config') {
          if (req.method === 'GET') return configHandler(req, res);
          if (req.method === 'POST') return saveConfigHandler(req, res);
        }
        if (url === '/api/webhooks/test' && req.method === 'POST') {
          return testWebhookHandler(req, res);
        }
        if (url === '/api/webhooks/logs' && req.method === 'GET') {
          return getWebhookLogsHandler(req, res);
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
