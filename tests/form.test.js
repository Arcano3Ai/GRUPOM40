import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAge, sanitizeNSS, formatNSSDisplay, buildWhatsAppUrl, formatDateToMX } from '../js/app.js';

test('calculateAge calcula la edad cumplida a partir de fecha válida', () => {
  const birthDate = '1965-06-15';
  const age = calculateAge(birthDate);
  assert.ok(age !== null);
  assert.ok(typeof age === 'number');
  assert.ok(age >= 50 && age <= 70);

  // Casos límite
  assert.equal(calculateAge(''), null);
  assert.equal(calculateAge('fecha-invalida'), null);
});

test('sanitizeNSS filtra caracteres y limita estrictamente a 11 dígitos', () => {
  assert.equal(sanitizeNSS('45-89-66-1234-1'), '45896612341');
  assert.equal(sanitizeNSS('abc 45896612341 def 999'), '45896612341');
  assert.equal(sanitizeNSS('12345'), '12345');
  assert.equal(sanitizeNSS(''), '');
});

test('formatNSSDisplay aplica formato de Seguro Social XX-XX-XX-XXXX-X', () => {
  assert.equal(formatNSSDisplay('45896612341'), '45-89-66-1234-1');
  assert.equal(formatNSSDisplay('4589'), '45-89');
});

test('formatDateToMX convierte formato ISO a formato latino DD/MM/AAAA', () => {
  assert.equal(formatDateToMX('1964-07-20'), '20/07/1964');
  assert.equal(formatDateToMX(''), '');
});

test('buildWhatsAppUrl estructura el mensaje formal con todos los datos y teléfono oficial', () => {
  const payload = {
    nombre: 'Guillermo Treviño Garza',
    fechaNacimiento: '1964-07-20',
    edad: 61,
    nss: '45896612341',
    descripcion: 'Tengo 920 semanas cotizadas, busco cotizar 3 años al tope de 25 UMAs.'
  };

  const url = buildWhatsAppUrl(payload);
  assert.ok(url.startsWith('https://wa.me/5212206494278?text='));

  const decoded = decodeURIComponent(url);
  assert.ok(decoded.includes('Guillermo Treviño Garza'));
  assert.ok(decoded.includes('20/07/1964'));
  assert.ok(decoded.includes('61 años'));
  assert.ok(decoded.includes('45-89-66-1234-1'));
  assert.ok(decoded.includes('920 semanas cotizadas'));
});
