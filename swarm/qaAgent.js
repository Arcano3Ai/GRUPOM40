import { BaseAgent } from './baseAgent.js';
import { buildWhatsAppUrl, formatCurrency } from '../js/core.js';

/**
 * QAAgent: Pruebas unitarias para el reporte de WhatsApp (Nombre, Edad, Año de Inicio).
 */
export class QAAgent extends BaseAgent {
  constructor() {
    super('QAAgent', 'Quality Assurance & Automated Testing Engineer');
  }

  async execute(task) {
    this.log('Iniciando suite de pruebas QA para reporte al asesor...');
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

    runTest('buildWhatsAppUrl estructura el reporte con nombre, edad, año de inicio, teléfono, correo y situación del cliente', () => {
      const url = buildWhatsAppUrl({
        nombre: 'Guillermo Treviño',
        telefono: '55 1234 5678',
        email: 'guillermo@ejemplo.com',
        edad: 58,
        inicioLaboral: 1985
      });
      const decoded = decodeURIComponent(url);
      if (!decoded.includes('Guillermo Treviño')) throw new Error('Falta nombre');
      if (!decoded.includes('55 1234 5678')) throw new Error('Falta teléfono');
      if (!decoded.includes('guillermo@ejemplo.com')) throw new Error('Falta correo');
      if (!decoded.includes('58 años')) throw new Error('Falta edad');
      if (!decoded.includes('1985')) throw new Error('Falta año de inicio');
      if (!decoded.includes('Ley 73')) throw new Error('Falta referencia a Ley 73');
      if (!decoded.includes('SITUACIÓN DEL CLIENTE')) throw new Error('Falta situación del cliente');
    });

    runTest('buildWhatsAppUrl tolera campos vacíos sin romper el envío', () => {
      const url = buildWhatsAppUrl({});
      const decoded = decodeURIComponent(url);
      if (!decoded.includes('Por especificar')) throw new Error('No manejó campos vacíos');
    });

    runTest('formatCurrency formatea montos en moneda mexicana correctamente', () => {
      const formatted = formatCurrency(50000);
      if (!formatted.includes('50,000')) throw new Error(`Formato incorrecto: ${formatted}`);
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
