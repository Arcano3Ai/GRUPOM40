import { BaseAgent } from './baseAgent.js';
import { calculateAge, sanitizeNSS, formatNSSDisplay, buildWhatsAppUrl, formatDateToMX } from '../js/app.js';

/**
 * QAAgent: Especialista en pruebas automatizadas y cobertura de casos límite (TDD).
 */
export class QAAgent extends BaseAgent {
  constructor() {
    super('QAAgent', 'Quality Assurance & Automated Testing Engineer');
  }

  async execute(task) {
    this.log('Iniciando suite de pruebas de QA...');
    const testResults = [];
    let allPassed = true;

    const runTest = (name, testFn) => {
      try {
        testFn();
        testResults.push({ name, passed: true });
        this.log(`  ✔ [PASS] ${name}`);
      } catch (err) {
        allPassed = false;
        testResults.push({ name, passed: false, error: err.message });
        this.log(`  ✖ [FAIL] ${name}: ${err.message}`, 'ERROR');
      }
    };

    // 1. Cálculo de edad
    runTest('calculateAge calcula edad exacta en años cumplidos', () => {
      const age = calculateAge('1964-07-20');
      if (typeof age !== 'number' || age < 55 || age > 70) {
        throw new Error(`Edad calculada fuera de rango: ${age}`);
      }
    });

    // 2. Manejo de valores vacíos o malformados
    runTest('calculateAge devuelve null ante fechas vacías o inválidas', () => {
      if (calculateAge('') !== null) throw new Error('Falló con string vacío');
      if (calculateAge('invalid-date') !== null) throw new Error('Falló con fecha malformada');
    });

    // 3. Sanitización de NSS
    runTest('sanitizeNSS elimina caracteres no numéricos y corta a 11 dígitos', () => {
      const raw = 'NSS: 45-89-66-1234-1 (extra)';
      const clean = sanitizeNSS(raw);
      if (clean !== '45896612341') throw new Error(`NSS inesperado: ${clean}`);
    });

    // 4. Formato de NSS
    runTest('formatNSSDisplay genera formato visual 00-00-00-0000-0', () => {
      const formatted = formatNSSDisplay('45896612341');
      if (formatted !== '45-89-66-1234-1') throw new Error(`Formato incorrecto: ${formatted}`);
    });

    // 5. Formato de fecha
    runTest('formatDateToMX convierte a DD/MM/AAAA', () => {
      const formatted = formatDateToMX('1964-07-20');
      if (formatted !== '20/07/1964') throw new Error(`Fecha incorrecta: ${formatted}`);
    });

    // 6. Construcción y codificación de URL de WhatsApp
    runTest('buildWhatsAppUrl genera el mensaje codificado con todos los datos y número oficial', () => {
      const payload = {
        nombre: 'Guillermo Treviño Garza',
        fechaNacimiento: '1964-07-20',
        edad: 61,
        nss: '45896612341',
        descripcion: 'Tengo 920 semanas cotizadas, busco cotizar 3 años al tope de 25 UMAs.'
      };

      const url = buildWhatsAppUrl(payload);
      if (!url.startsWith('https://wa.me/5212206494278?text=')) {
        throw new Error('La URL no contiene el teléfono oficial +52 1 220 649 4278');
      }

      const decoded = decodeURIComponent(url);
      if (!decoded.includes('Guillermo Treviño Garza')) throw new Error('Falta nombre');
      if (!decoded.includes('20/07/1964')) throw new Error('Falta fecha');
      if (!decoded.includes('61 años')) throw new Error('Falta edad');
      if (!decoded.includes('45-89-66-1234-1')) throw new Error('Falta NSS');
      if (!decoded.includes('920 semanas')) throw new Error('Falta descripción');
    });

    this.log(`Resultados QA: ${testResults.filter(t => t.passed).length}/${testResults.length} pruebas pasaron.`);
    return {
      allPassed,
      totalTests: testResults.length,
      passedTests: testResults.filter(t => t.passed).length,
      details: testResults
    };
  }
}
