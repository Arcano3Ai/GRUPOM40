import test from 'node:test';
import assert from 'node:assert/strict';
import { PRICING_PLANS, buildPlanWhatsAppUrl, CONFIG } from '../js/core.js';

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
