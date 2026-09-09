import test from 'node:test';
import assert from 'node:assert/strict';
import { PRICING_PLANS, buildPlanWhatsAppUrl, buildPaymentWhatsAppConfirmationUrl, CONFIG } from '../js/core.js';

test('PRICING_PLANS - Estructura y precios oficiales de planes', () => {
    // Validar Plan Online
    assert.ok(PRICING_PLANS.ONLINE, 'El Plan Online debe existir');
    assert.strictEqual(PRICING_PLANS.ONLINE.price, 2500, 'El Plan Online debe costar $2,500 MXN');
    assert.strictEqual(PRICING_PLANS.ONLINE.priceFormatted, '$2,500 MXN');
    assert.ok(PRICING_PLANS.ONLINE.features.length >= 4, 'El Plan Online debe tener al menos 4 características');

    // Validar Plan Presencial
    assert.ok(PRICING_PLANS.PRESENCIAL, 'El Plan Presencial debe existir');
    assert.strictEqual(PRICING_PLANS.PRESENCIAL.price, 3500, 'El Plan Presencial debe costar $3,500 MXN');
    assert.strictEqual(PRICING_PLANS.PRESENCIAL.priceFormatted, '$3,500 MXN');
    assert.ok(PRICING_PLANS.PRESENCIAL.features.length >= 5, 'El Plan Presencial debe incluir todo lo necesario');
    assert.ok(!PRICING_PLANS.PRESENCIAL.subtitle.toLowerCase().includes('oficina'), 'El Plan Presencial no debe referirse a una oficina');
    assert.ok(PRICING_PLANS.PRESENCIAL.subtitle.includes('casa del cliente') && PRICING_PLANS.PRESENCIAL.subtitle.includes('café'), 'El Plan Presencial debe indicar casa del cliente o lugar comercial/café');
});

test('PAYMENT_CONFIG - Pasarela de pagos oficial (SPEI, CLABE y Mercado Pago)', () => {
    assert.ok(CONFIG.PAYMENT_CONFIG, 'La configuración de pasarela de pagos debe existir');
    
    // Validar SPEI y CLABE Interbancaria (18 dígitos numéricos oficiales)
    const { SPEI, MERCADO_PAGO } = CONFIG.PAYMENT_CONFIG;
    assert.ok(SPEI, 'Los datos de transferencia SPEI deben existir');
    assert.strictEqual(typeof SPEI.banco, 'string');
    assert.ok(SPEI.banco.length > 0, 'El banco receptor debe estar especificado');
    assert.match(SPEI.clabe, /^\d{18}$/, 'La CLABE interbancaria debe tener exactamente 18 dígitos');
    assert.ok(SPEI.beneficiario.length > 0, 'El beneficiario debe estar especificado');

    // Validar Mercado Pago
    assert.ok(MERCADO_PAGO, 'Los enlaces de Mercado Pago deben existir');
    assert.ok(MERCADO_PAGO.ONLINE.startsWith('https://'), 'El enlace de MP Online debe ser HTTPS');
    assert.ok(MERCADO_PAGO.PRESENCIAL.startsWith('https://'), 'El enlace de MP Presencial debe ser HTTPS');
});

test('buildPaymentWhatsAppConfirmationUrl - Generación de confirmación de pago', () => {
    const urlSpei = buildPaymentWhatsAppConfirmationUrl('PRESENCIAL', 'SPEI');
    const decodedSpei = decodeURIComponent(urlSpei);
    assert.ok(decodedSpei.includes('Plan Presencial'));
    assert.ok(decodedSpei.includes('$3,500 MXN'));
    assert.ok(decodedSpei.includes('SPEI / Transferencia Bancaria'));

    const urlMp = buildPaymentWhatsAppConfirmationUrl('ONLINE', 'MERCADO_PAGO');
    const decodedMp = decodeURIComponent(urlMp);
    assert.ok(decodedMp.includes('Plan Online'));
    assert.ok(decodedMp.includes('$2,500 MXN'));
    assert.ok(decodedMp.includes('Mercado Pago'));
});

test('buildPlanWhatsAppUrl - Generación de URL WhatsApp para Plan Online', () => {
    const url = buildPlanWhatsAppUrl('ONLINE');
    assert.ok(url.startsWith(`https://wa.me/${CONFIG.PHONE}?text=`));
    const decoded = decodeURIComponent(url);
    assert.ok(decoded.includes('Plan Online'));
    assert.ok(decoded.includes('$2,500 MXN'));
});

test('buildPlanWhatsAppUrl - Generación de URL WhatsApp para Plan Presencial', () => {
    const url = buildPlanWhatsAppUrl('PRESENCIAL');
    assert.ok(url.startsWith(`https://wa.me/${CONFIG.PHONE}?text=`));
    const decoded = decodeURIComponent(url);
    assert.ok(decoded.includes('Plan Presencial'));
    assert.ok(decoded.includes('$3,500 MXN'));
    assert.ok(decoded.includes('todo incluido'));
});

test('buildPlanWhatsAppUrl - Manejo tolerante a mayúsculas/minúsculas y fallback', () => {
    const urlLower = buildPlanWhatsAppUrl('online');
    assert.ok(decodeURIComponent(urlLower).includes('$2,500 MXN'));

    const urlPresencialLower = buildPlanWhatsAppUrl('presencial');
    assert.ok(decodeURIComponent(urlPresencialLower).includes('$3,500 MXN'));

    const fallbackUrl = buildPlanWhatsAppUrl('INEXISTENTE');
    assert.strictEqual(fallbackUrl, `https://wa.me/${CONFIG.PHONE}`);

    const nullUrl = buildPlanWhatsAppUrl(null);
    assert.strictEqual(nullUrl, `https://wa.me/${CONFIG.PHONE}`);
});

