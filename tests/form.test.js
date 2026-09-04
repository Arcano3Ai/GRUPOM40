import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeNSS, formatNSSDisplay, buildWhatsAppUrl } from '../js/app.js';

test('sanitizeNSS filtra caracteres no numéricos y corta a 11', () => {
  assert.equal(sanitizeNSS('45-89-66-1234-1'), '45896612341');
  assert.equal(sanitizeNSS('12345'), '12345');
  assert.equal(sanitizeNSS(''), '');
});

test('formatNSSDisplay aplica formato de Seguro Social', () => {
  assert.equal(formatNSSDisplay('45896612341'), '45-89-66-1234-1');
});

test('buildWhatsAppUrl con NSS conocido arma mensaje al asesor', () => {
  const payload = {
    nombre: 'Guillermo Treviño',
    edad: 59,
    nss: '45896612341'
  };

  const url = buildWhatsAppUrl(payload);
  assert.ok(url.startsWith('https://wa.me/5212206494278?text='));
  const decoded = decodeURIComponent(url);
  assert.ok(decoded.includes('Guillermo Treviño'));
  assert.ok(decoded.includes('59 años'));
  assert.ok(decoded.includes('45-89-66-1234-1'));
});

test('buildWhatsAppUrl cuando no sabe su NSS maneja fallback', () => {
  const payload = {
    nombre: 'Ana Garza',
    edad: 55,
    nss: ''
  };

  const url = buildWhatsAppUrl(payload);
  const decoded = decodeURIComponent(url);
  assert.ok(decoded.includes('Ana Garza'));
  assert.ok(decoded.includes('55 años'));
  assert.ok(decoded.includes('No lo tengo a la mano'));
});
