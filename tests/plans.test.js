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

test('PAYMENT_CONFIG - Cuentas bancarias oficiales (Mercado Pago y Spin by OXXO)', () => {
    assert.ok(CONFIG.PAYMENT_CONFIG, 'La configuración de pagos debe existir');
    
    // Validar datos de Mercado Pago
    const { MERCADO_PAGO, SPIN } = CONFIG.PAYMENT_CONFIG;
    assert.ok(MERCADO_PAGO, 'Los datos de Mercado Pago deben existir');
    assert.strictEqual(MERCADO_PAGO.banco, 'Mercado Pago');
    assert.strictEqual(MERCADO_PAGO.beneficiario, 'Sergio Adrian Perez Villarreal');
    assert.strictEqual(MERCADO_PAGO.clabe, '722969017074087021');
    assert.match(MERCADO_PAGO.clabe, /^\d{18}$/, 'La CLABE de Mercado Pago debe tener exactamente 18 dígitos');

    // Validar datos de Spin by OXXO
    assert.ok(SPIN, 'Los datos de Spin by OXXO deben existir');
    assert.strictEqual(SPIN.banco, 'Spin by OXXO');
    assert.strictEqual(SPIN.beneficiario, 'Sergio Adrian Perez Villarreal');
    assert.strictEqual(SPIN.cuenta, '728969000127902158');
    assert.match(SPIN.cuenta, /^\d{18}$/, 'La cuenta Spin debe tener exactamente 18 dígitos');
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

    const urlSpin = buildPaymentWhatsAppConfirmationUrl('ONLINE', 'SPIN');
    const decodedSpin = decodeURIComponent(urlSpin);
    assert.ok(decodedSpin.includes('Plan Online'));
    assert.ok(decodedSpin.includes('$2,500 MXN'));
    assert.ok(decodedSpin.includes('Spin by OXXO'));
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

