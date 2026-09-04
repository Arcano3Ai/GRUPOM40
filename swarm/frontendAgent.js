import { BaseAgent } from './baseAgent.js';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * FrontendAgent: Audita que el formulario esté AL PRINCIPIO y que NO haya formularios abajo.
 */
export class FrontendAgent extends BaseAgent {
  constructor() {
    super('FrontendAgent', 'UI/UX & Layout Specialist');
  }

  async execute(task) {
    this.log('Auditando layout del formulario...');

    const html = await fs.readFile(path.resolve('index.html'), 'utf-8');
    const js = await fs.readFile(path.resolve('js/app.js'), 'utf-8');

    const auditResults = {
      heroChecks: [],
      bottomChecks: [],
      passed: true
    };

    // 1. Campos requeridos en el Hero (al principio)
    const requiredHeroFields = [
      { id: 'hero-nombre', name: 'Nombre Completo' },
      { id: 'hero-edad', name: 'Edad' },
      { id: 'hero-inicio', name: 'Año de Inicio Laboral' },
      { id: 'hero-telefono', name: 'Teléfono / WhatsApp' },
      { id: 'hero-email', name: 'Correo Electrónico' },
      { id: 'btn-hero-submit', name: 'Botón de Envío' }
    ];

    for (const field of requiredHeroFields) {
      const exists = html.includes(`id="${field.id}"`);
      auditResults.heroChecks.push({ check: `Campo ${field.name} (${field.id}) en Hero`, passed: exists });
      if (!exists) auditResults.passed = false;
    }

    // 2. Verificar que NO haya formularios al fondo de la página
    const hasBottomModal = html.includes('modal-diagnostico-m40');
    auditResults.bottomChecks.push({
      check: 'Sin formularios ni modales estorbando al fondo de la página',
      passed: !hasBottomModal
    });
    if (hasBottomModal) auditResults.passed = false;

    // 3. Vinculación de CTAs
    const hasCtaHandler = js.includes('initLeadFormsAndCTAs');
    auditResults.heroChecks.push({ check: 'Manejador unificado de CTAs presente', passed: hasCtaHandler });
    if (!hasCtaHandler) auditResults.passed = false;

    this.log(`Auditoría UI completada: ${auditResults.passed ? 'APROBADA' : 'FALLIDA'}`);
    return auditResults;
  }
}
