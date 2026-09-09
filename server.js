/**
 * server.js — Grupo Modalidad 40
 * Servidor HTTP estático + API para Mercado Pago Checkout Pro
 */
import 'dotenv/config';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPreference } from './routes/checkout.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';
const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || '';
const BASE_URL = process.env.BASE_URL || `http://${HOST}:${PORT}`;

if (!ACCESS_TOKEN || ACCESS_TOKEN.includes('YOUR_ACCESS_TOKEN')) {
    console.warn('\n⚠️  MP_ACCESS_TOKEN no configurado. Edita el archivo .env con tus credenciales reales de Mercado Pago.\n');
}

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css':  'text/css; charset=UTF-8',
    '.js':   'application/javascript; charset=UTF-8',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.webp': 'image/webp',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.gif':  'image/gif',
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Intentar servir index.html como fallback SPA (rutas de back_url)
                const indexPath = path.join(__dirname, 'index.html');
                fs.readFile(indexPath, (err2, indexContent) => {
                    if (err2) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
                        res.end(indexContent);
                    }
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

// ── Router ───────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
    // CORS básico para desarrollo local
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const urlPath = req.url.split('?')[0];

    // ── API: crear preference de Mercado Pago ──
    if (req.method === 'POST' && urlPath === '/api/create-preference') {
        createPreference(req, res, ACCESS_TOKEN, BASE_URL);
        return;
    }

    // ── Páginas de Back URL de Mercado Pago ──
    if (urlPath === '/pago-exitoso') {
        serveFile(path.join(__dirname, 'public', 'pago-exitoso.html'), res);
        return;
    }
    if (urlPath === '/pago-pendiente') {
        serveFile(path.join(__dirname, 'public', 'pago-pendiente.html'), res);
        return;
    }
    if (urlPath === '/pago-fallido') {
        serveFile(path.join(__dirname, 'public', 'pago-fallido.html'), res);
        return;
    }

    // ── Archivos estáticos ──
    const filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
    serveFile(filePath, res);
});

server.listen(PORT, HOST, () => {
    console.log(`\n🚀  Grupo Modalidad 40 — Server`);
    console.log(`    Local:  http://${HOST}:${PORT}`);
    console.log(`    Token:  ${ACCESS_TOKEN ? (ACCESS_TOKEN.substring(0, 12) + '...') : '⚠️  NO CONFIGURADO'}`);
    console.log(`    Env:    ${ACCESS_TOKEN?.startsWith('APP_USR') ? '🟢 PRODUCCIÓN' : '🟡 SANDBOX/TEST'}\n`);
});
