/**
 * routes/checkout.js
 * Lógica de creación de Preference de Mercado Pago Checkout Pro
 * SDK oficial: https://github.com/mercadopago/sdk-nodejs
 */
import { MercadoPagoConfig, Preference } from 'mercadopago';

// ── Configuración de planes ──────────────────────────────────────────────────
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

// ── Handler principal ────────────────────────────────────────────────────────
export async function createPreference(req, res, accessToken, baseUrl) {
    // Leer body completo
    let body = '';
    req.on('data', chunk => { body += chunk; });

    req.on('end', async () => {
        try {
            const { plan } = JSON.parse(body || '{}');
            const planKey = (plan || '').toUpperCase();

            if (!PLANS[planKey]) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: `Plan inválido: "${plan}". Use ONLINE o PRESENCIAL.` }));
                return;
            }

            // Inicializar cliente MP con el access token del .env
            const client = new MercadoPagoConfig({
                accessToken,
                options: { timeout: 5000 },
            });

            const preferenceApi = new Preference(client);

            const preferenceBody = {
                items: [PLANS[planKey]],
                back_urls: {
                    success: `${baseUrl}/pago-exitoso`,
                    pending: `${baseUrl}/pago-pendiente`,
                    failure: `${baseUrl}/pago-fallido`,
                },
                auto_return: 'approved',        // redirige automáticamente en pago aprobado
                statement_descriptor: 'GRUPOM40',
                external_reference: `${planKey}-${Date.now()}`,
                metadata: {
                    plan: planKey,
                    site: 'grupomodalidad40.com.mx',
                },
                payment_methods: {
                    excluded_payment_types: [],  // acepta todos los métodos disponibles en MX
                    installments: 12,            // hasta 12 MSI donde aplique
                },
            };

            const preference = await preferenceApi.create({ body: preferenceBody });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                init_point: preference.init_point,           // producción
                sandbox_init_point: preference.sandbox_init_point, // sandbox/test
                preference_id: preference.id,
            }));

        } catch (err) {
            console.error('[MP Checkout] Error creando preference:', err?.message || err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'No se pudo crear la preference de pago.',
                detail: err?.message,
            }));
        }
    });
}
