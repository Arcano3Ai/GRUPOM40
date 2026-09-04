import { BaseAgent } from './baseAgent.js';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * FrontendAgent: Audita el formulario al principio (Hero) y en el Modal, así como la vinculación de CTAs.
 */
export class FrontendAgent extends BaseAgent {
  constructor() {
    super('FrontendAgent', 'UI/UX & Accessibility Specialist');
  }

  async execute(task) {
    this.log('Auditando formulario en el Hero (al principio) y en el Modal...');

    const html = await fs.readFile(path.resolve('index.html'), 'utf-8');
    const css = await fs.readFile(path.resolve('css/styles.css'), 'utf-8');
    const js = await fs.readFile(path.resolve('js/app.js'), 'utf-8');

    const auditResults = {
      heroChecks: [],
      modalChecks: [],
      ctaChecks: [],
      passed: true
    };

    // 1. Formulario al principio (Hero)
    const heroFields = ['hero-nombre', 'hero-edad', 'hero-nss', 'btn-hero-submit'];
    for (const field of heroFields) {
      const exists = html.includes(`id="${field}"`);
      auditResults.heroChecks.push({ check: `Hero field ${field} presente`, passed: exists });
      if (!exists) auditResults.passed = false;
    }

    // 2. Formulario en el Modal
    const modalFields = ['diag-nombre', 'diag-edad', 'diag-nss', 'btn-submit-whatsapp-modal'];
    for (const field of modalFields) {
      const exists = html.includes(`id="${field}"`);
      auditResults.modalChecks.push({ check: `Modal field ${field} presente`, passed: exists });
      if (!exists) auditResults.passed = false;
    }

    // 3. Estilos del Hero Form
    const hasHeroStyles = css.includes('.hero-form-card') && css.includes('.hero-quick-form');
    auditResults.heroChecks.push({ check: 'Estilos CSS de formulario en el Hero presentes', passed: hasHeroStyles });
    if (!hasHeroStyles) auditResults.passed = false;

    // 4. Lógica de Vinculación de CTAs en JS
    const hasCtaBinding = js.includes('initLeadFormsAndCTAs') && js.includes('buildWhatsAppUrl');
    auditResults.ctaChecks.push({ check: 'Controlador de vinculación de CTAs de WhatsApp presente', passed: hasCtaBinding });
    if (!hasCtaBinding) auditResults.passed = false;

    this.log(`Auditoría UI/UX completada: ${auditResults.passed ? 'APROBADA' : 'FALLIDA'}`);
    return auditResults;
  }
}
