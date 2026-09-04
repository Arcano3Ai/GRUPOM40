import { BaseAgent } from './baseAgent.js';
import { sanitizeNSS, formatNSSDisplay, buildWhatsAppUrl } from '../js/app.js';

/**
 * QAAgent: Pruebas unitarias para el flujo simplificado de WhatsApp.
 */
export class QAAgent extends BaseAgent {
  constructor() {
    super('QAAgent', 'Quality Assurance & Automated Testing Engineer');
  }

  async execute(task) {
    this.log('Iniciando suite de pruebas QA para formulario simplificado...');
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

    runTest('sanitizeNSS filtra caracteres a 11 dígitos', () => {
      const clean = sanitizeNSS('45-89-66-1234-1');
      if (clean !== '45896612341') throw new Error(`NSS inválido: ${clean}`);
    });

    runTest('formatNSSDisplay aplica formato institucional', () => {
      const fmt = formatNSSDisplay('45896612341');
      if (fmt !== '45-89-66-1234-1') throw new Error(`Formato incorrecto: ${fmt}`);
    });

    runTest('buildWhatsAppUrl incluye nombre, edad y NSS al asesor', () => {
      const url = buildWhatsAppUrl({
        nombre: 'Guillermo Treviño',
        edad: 59,
        nss: '45896612341'
      });
      const decoded = decodeURIComponent(url);
      if (!decoded.includes('Guillermo Treviño')) throw new Error('Falta nombre');
      if (!decoded.includes('59 años')) throw new Error('Falta edad');
      if (!decoded.includes('45-89-66-1234-1')) throw new Error('Falta NSS');
    });

    runTest('buildWhatsAppUrl maneja si no tiene NSS a la mano', () => {
      const url = buildWhatsAppUrl({
        nombre: 'Carlos López',
        edad: 52,
        nss: ''
      });
      const decoded = decodeURIComponent(url);
      if (!decoded.includes('No lo tengo a la mano')) throw new Error('Debería indicar que no lo tiene a la mano');
    });

    this.log(`Resultados QA: ${testResults.filter(t => t.passed).length}/${testResults.length} pruebas pasadas.`);
    return {
      allPassed,
      totalTests: testResults.length,
      passedTests: testResults.filter(t => t.passed).length,
      details: testResults
    };
  }
}
