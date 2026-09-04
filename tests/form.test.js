import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppUrl, formatCurrency } from '../js/app.js';

test('buildWhatsAppUrl estructura el reporte con nombre, edad y año de inicio', () => {
  const payload = {
    nombre: 'Guillermo Treviño',
    edad: 58,
    inicioLaboral: 1985
  };

  const url = buildWhatsAppUrl(payload);
  assert.ok(url.startsWith('https://wa.me/5212206494278?text='));
  const decoded = decodeURIComponent(url);
  assert.ok(decoded.includes('Guillermo Treviño'));
  assert.ok(decoded.includes('58 años'));
  assert.ok(decoded.includes('1985'));
  assert.ok(decoded.includes('Ley 73'));
});

test('formatCurrency formatea montos en pesos mexicanos', () => {
  const formatted = formatCurrency(45000);
  assert.ok(formatted.includes('45,000'));
});
