/**
 * api/create-preference.js
 * Vercel Serverless Function — Mercado Pago Checkout Pro
 */
import { MercadoPagoConfig, Preference } from 'mercadopago';

const PLANS = {
    ONLINE: {
        id: 'plan-online-m40',
        title: 'Asesoría Modalidad 40 — Plan Online',
        description: 'Sesión 1 a 1 por videollamada o llamada, auditoría IMSS, cálculo ROI y carpeta digital PDF.',
        unit_price: 2500,
        currency_id: 'MXN',
        quantity: 1,
    },
    PRESENCIAL: {
        id: 'plan-presencial-m40',
        title: 'Asesoría Modalidad 40 — Plan Presencial',
        description: 'Sesión presencial en café o lugar neutral, cotejo físico de documentos y expediente impreso.',
        unit_price: 3500,
        currency_id: 'MXN',
        quantity: 1,
    },
};

export default async function handler(req, res) {
    // Cabeceras CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Use POST.' });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch {}
        }

        const { plan } = body || {};
        const planKey = (plan || 'ONLINE').toUpperCase();

        if (!PLANS[planKey]) {
            return res.status(400).json({ error: `Plan inválido: "${plan}". Use ONLINE o PRESENCIAL.` });
        }

        const accessToken = process.env.MP_ACCESS_TOKEN || '';
        if (!accessToken) {
            return res.status(500).json({ error: 'MP_ACCESS_TOKEN no configurado en variables de entorno.' });
        }

        const host = req.headers['x-forwarded-host'] || req.headers.host || 'grupomodalidad40.com.mx';
        const proto = req.headers['x-forwarded-proto'] || 'https';
        const baseUrl = process.env.BASE_URL || `${proto}://${host}`;

        const client = new MercadoPagoConfig({
            accessToken,
            options: { timeout: 8000 },
        });

        const preferenceApi = new Preference(client);

        const preferenceBody = {
            items: [PLANS[planKey]],
            back_urls: {
                success: `${baseUrl}/pago-exitoso.html`,
                pending: `${baseUrl}/pago-pendiente.html`,
                failure: `${baseUrl}/pago-fallido.html`,
            },
            ...(baseUrl.startsWith('https://') && { auto_return: 'approved' }),
            statement_descriptor: 'GRUPOM40',
            external_reference: `${planKey}-${Date.now()}`,
            metadata: {
                plan: planKey,
                site: 'grupomodalidad40.com.mx',
            },
            payment_methods: {
                excluded_payment_types: [],
                installments: 12,
            },
        };

        const preference = await preferenceApi.create({ body: preferenceBody });

        return res.status(200).json({
            init_point: preference.init_point,
            sandbox_init_point: preference.sandbox_init_point,
            preference_id: preference.id,
        });

    } catch (err) {
        const detail = err?.cause ?? err?.message ?? String(err);
        console.error('[API create-preference Error]:', detail);
        return res.status(500).json({
            error: 'No se pudo generar la preferencia de pago.',
            detail: typeof detail === 'object' ? detail : String(detail),
        });
    }
}
