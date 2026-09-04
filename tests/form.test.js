import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppUrl, formatCurrency, CONFIG } from '../js/core.js';

test('buildWhatsAppUrl - Caso 1: Candidato clásico a Ley 73 (inició antes de 1997)', () => {
  const payload = {
    nombre: 'Guillermo Treviño',
    telefono: '55 1234 5678',
    email: 'guillermo@ejemplo.com',
    edad: 58,
    inicioLaboral: 1985
  };

  const url = buildWhatsAppUrl(payload);
  assert.ok(url.startsWith(`https://wa.me/${CONFIG.PHONE}?text=`));
  const decoded = decodeURIComponent(url);
  assert.ok(decoded.includes('Guillermo Treviño'));
  assert.ok(decoded.includes('55 1234 5678'));
  assert.ok(decoded.includes('guillermo@ejemplo.com'));
  assert.ok(decoded.includes('58 años'));
  assert.ok(decoded.includes('1985'));
  assert.ok(decoded.includes('Candidato a Ley 73 (Inició antes del 1 de julio de 1997)'));
  assert.ok(decoded.includes('SITUACIÓN DEL CLIENTE:'));
});

test('buildWhatsAppUrl - Caso 2: Cotizante posterior a 1997 (Ley 97)', () => {
  const payload = {
    nombre: 'Ana Luisa Morales',
    edad: 46,
    inicioLaboral: 2001
  };

  const url = buildWhatsAppUrl(payload);
  const decoded = decodeURIComponent(url);
  assert.ok(decoded.includes('Ana Luisa Morales'));
  assert.ok(decoded.includes('46 años'));
  assert.ok(decoded.includes('2001'));
  assert.ok(decoded.includes('Inició en o después de 1997 (Requiere revisión de régimen)'));
});

test('buildWhatsAppUrl - Caso 3: Campos vacíos o no especificados (tolerancia a fallos)', () => {
  const payload = {
    nombre: '',
    edad: '',
    inicioLaboral: ''
  };

  const url = buildWhatsAppUrl(payload);
  const decoded = decodeURIComponent(url);
  assert.ok(decoded.includes('Nombre: Por especificar'));
  assert.ok(decoded.includes('Edad: Por especificar'));
  assert.ok(decoded.includes('Año en que empezó a cotizar/trabajar: Por especificar'));
  assert.ok(decoded.includes('Diagnóstico preliminar: Por definir'));
});

test('buildWhatsAppUrl - Caso 4: Payload nulo o indefinido', () => {
  const url = buildWhatsAppUrl(null);
  const decoded = decodeURIComponent(url);
  assert.ok(decoded.includes('SITUACIÓN DEL CLIENTE:'));
  assert.ok(decoded.includes('Por especificar'));
});

test('formatCurrency - formato de moneda en pesos mexicanos sin decimales', () => {
  const formatted = formatCurrency(45000);
  assert.ok(formatted.includes('45,000'));
});
