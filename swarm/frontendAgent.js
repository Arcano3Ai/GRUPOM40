import { BaseAgent } from './baseAgent.js';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * FrontendAgent: Audita el formulario simplificado (Nombre, Edad, NSS si lo sabe).
 */
export class FrontendAgent extends BaseAgent {
  constructor() {
    super('FrontendAgent', 'UI/UX & Accessibility Specialist');
  }

  async execute(task) {
    this.log('Auditando formulario simplificado...');

    const html = await fs.readFile(path.resolve('index.html'), 'utf-8');
    const js = await fs.readFile(path.resolve('js/app.js'), 'utf-8');

    const auditResults = {
      htmlChecks: [],
      jsChecks: [],
      passed: true
    };

    const requiredFields = [
      { id: 'diag-nombre', name: 'Nombre Completo' },
      { id: 'diag-edad', name: 'Edad' },
      { id: 'diag-nss', name: 'NSS (si se lo sabe)' }
    ];

    for (const field of requiredFields) {
      const exists = html.includes(`id="${field.id}"`);
      auditResults.htmlChecks.push({
        check: `Campo ${field.name} (${field.id}) presente`,
        passed: exists
      });
      if (!exists) auditResults.passed = false;
    }

    const hasUrlBuilder = js.includes('buildWhatsAppUrl');
    auditResults.jsChecks.push({
      check: 'Constructor de mensaje para asesor WhatsApp presente',
      passed: hasUrlBuilder
    });

    this.log(`Auditoría UI completada: ${auditResults.passed ? 'APROBADA' : 'FALLIDA'}`);
    return auditResults;
  }
}
