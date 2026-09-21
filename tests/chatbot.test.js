import test from 'node:test';
import assert from 'node:assert/strict';
import {
    createChatbotEngine,
    CHATBOT_KNOWLEDGE,
    buildChatbotWhatsAppUrl
} from '../js/chatbot.js';
import { CONFIG } from '../js/core.js';

test('createChatbotEngine - Estado inicial de bienvenida', () => {
    const bot = createChatbotEngine();
    const current = bot.getCurrentStep();
    assert.strictEqual(current.id, 'welcome');
    assert.ok(current.text.includes('Grupo Modalidad 40'));
    assert.ok(current.options.length >= 2);
});

test('createChatbotEngine - Filtro Ley 97 (Descalificación cordial)', () => {
    const bot = createChatbotEngine();
    bot.selectOption('start_diagnostico');
    assert.strictEqual(bot.getCurrentStep().id, 'step_regimen');

    // Selecciona Ley 97 (No)
    bot.selectOption('regimen_ley97');
    const step = bot.getCurrentStep();
    assert.strictEqual(step.id, 'descalifica_ley97');
    assert.ok(step.text.includes('Ley 73'));
    assert.ok(!step.text.toLowerCase().includes('afore'), 'El bot no debe mencionar la AFORE');
    assert.ok(step.text.includes('este servicio no es aplicable para ti'));
    assert.strictEqual(bot.getLeadData().calificaLey73, false);
});

test('createChatbotEngine - Calificación Ley 73 hasta oferta Monterrey (Plan Presencial y Online)', () => {
    const bot = createChatbotEngine();
    bot.selectOption('start_diagnostico');
    bot.selectOption('regimen_ley73'); // Es Ley 73
    assert.strictEqual(bot.getCurrentStep().id, 'step_tiempo_baja');

    bot.selectOption('baja_menos_5'); // Menos de 5 años
    assert.strictEqual(bot.getCurrentStep().id, 'step_ubicacion');

    bot.selectOption('ubicacion_monterrey'); // En Monterrey
    const stepOferta = bot.getCurrentStep();
    assert.strictEqual(stepOferta.id, 'oferta_final');
    assert.ok(stepOferta.text.includes('Plan Presencial ($3,500 MXN)'));
    assert.ok(stepOferta.text.includes('Plan Online ($2,500 MXN)'));
    assert.strictEqual(bot.getLeadData().ubicacion, 'MONTERREY');
});

test('createChatbotEngine - Calificación Ley 73 hasta oferta Foráneo (Plan Online)', () => {
    const bot = createChatbotEngine();
    bot.selectOption('start_diagnostico');
    bot.selectOption('regimen_ley73');
    bot.selectOption('baja_mas_5'); // Más de 5 años (alerta reactivación)
    assert.strictEqual(bot.getLeadData().tiempoBaja, 'MAS_5_ANIOS');

    bot.selectOption('ubicacion_foraneo'); // Foráneo
    const stepOferta = bot.getCurrentStep();
    assert.strictEqual(stepOferta.id, 'oferta_final');
    assert.ok(stepOferta.text.includes('Plan Online ($2,500 MXN)'));
    assert.strictEqual(bot.getLeadData().ubicacion, 'FORANEO');
});

test('createChatbotEngine - Preguntas Frecuentes (Qué SÍ y qué NO responde)', () => {
    const bot = createChatbotEngine();
    bot.selectOption('menu_faq');
    assert.strictEqual(bot.getCurrentStep().id, 'faq_menu');

    // Qué es M40 -> SÍ responde
    bot.selectOption('faq_que_es');
    assert.ok(bot.getCurrentStep().text.toLowerCase().includes('continuación voluntaria'));

    // Cuánto me tocará de pensión -> NO responde números al azar
    bot.selectOption('menu_faq');
    bot.selectOption('faq_cuanto_pension');
    const respPension = bot.getCurrentStep().text;
    assert.ok(respPension.includes('Cada caso es único'));
    assert.ok(respPension.includes('estudio de pensión'));

    // Cuánto debo pagar al mes -> NO responde números al azar
    bot.selectOption('menu_faq');
    bot.selectOption('faq_cuanto_pago');
    const respPago = bot.getCurrentStep().text.toLowerCase();
    assert.ok(respPago.includes('depende') && respPago.includes('salario'));
    assert.ok(respPago.includes('25 umas'));

    // Garantía y apego legal -> SÍ responde
    bot.selectOption('menu_faq');
    bot.selectOption('faq_garantia');
    assert.ok(bot.getCurrentStep().text.includes('al IMSS, no al despacho'));
});

test('buildChatbotWhatsAppUrl - Resumen estructurado del funnel', () => {
    const lead = {
        calificaLey73: true,
        regimen: 'Ley 73 (Inició antes de julio 1997)',
        tiempoBaja: 'Menos de 5 años sin cotizar',
        ubicacion: 'Monterrey / Área Metropolitana',
        planInteres: 'Plan Presencial ($3,500 MXN)'
    };

    const url = buildChatbotWhatsAppUrl(lead);
    assert.ok(url.startsWith(`https://wa.me/${CONFIG.PHONE}?text=`));
    const decoded = decodeURIComponent(url);
    assert.ok(decoded.includes('Ley 73'));
    assert.ok(decoded.includes('Menos de 5 años'));
    assert.ok(decoded.includes('Monterrey'));
    assert.ok(decoded.includes('Plan Presencial'));
});
