import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  searchPlacesHandler,
  analyzeLeadHandler,
  configHandler,
  saveConfigHandler,
  autocompleteLocationsHandler,
  testWebhookHandler,
  getWebhookLogsHandler,
} from './server/api.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API endpoints
app.post('/api/places/search', (req, res) => searchPlacesHandler(req, res));
app.post('/api/places/autocomplete', (req, res) => autocompleteLocationsHandler(req, res));
app.post('/api/ai/analyze-lead', (req, res) => analyzeLeadHandler(req, res));
app.get('/api/config', (req, res) => configHandler(req, res));
app.post('/api/config', (req, res) => saveConfigHandler(req, res));
app.post('/api/webhooks/test', (req, res) => testWebhookHandler(req, res));
app.get('/api/webhooks/logs', (req, res) => getWebhookLogsHandler(req, res));

// Serve client in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NEXUS LEADS AI server running on http://0.0.0.0:${PORT}`);
});
