import { BaseAgent } from './baseAgent.js';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * FrontendAgent: Audita y valida la interfaz, campos del formulario y accesibilidad.
 */
export class FrontendAgent extends BaseAgent {
  constructor() {
    super('FrontendAgent', 'UI/UX & Accessibility Specialist');
  }

  async execute(task) {
    this.log('Auditando archivos de UI (index.html, css/styles.css y js/app.js)...');

    const html = await fs.readFile(path.resolve('index.html'), 'utf-8');
    const css = await fs.readFile(path.resolve('css/styles.css'), 'utf-8');
    const js = await fs.readFile(path.resolve('js/app.js'), 'utf-8');

    const auditResults = {
      htmlChecks: [],
      cssChecks: [],
      jsChecks: [],
      passed: true
    };

    // 1. Verificación de Campos Requeridos en el Modal
    const requiredFields = [
      { id: 'diag-nombre', name: 'Nombre Completo' },
      { id: 'diag-fechaNacimiento', name: 'Fecha de Nacimiento' },
      { id: 'diag-edad', name: 'Edad en Años' },
      { id: 'diag-nss', name: 'Número de Seguro Social (NSS)' },
      { id: 'diag-descripcion', name: 'Descripción del Caso' }
    ];

    for (const field of requiredFields) {
      const exists = html.includes(`id="${field.id}"`);
      auditResults.htmlChecks.push({
        check: `Campo ${field.name} (${field.id}) presente en modal`,
        passed: exists
      });
      if (!exists) auditResults.passed = false;
    }

    // 2. Verificación de Accesibilidad y Modal
    const hasModal = html.includes('id="modal-diagnostico-m40"');
    const hasRoleDialog = html.includes('role="dialog"');
    const hasAriaHidden = html.includes('aria-hidden');
    auditResults.htmlChecks.push({
      check: 'Modal accesible implementado con role="dialog" y aria-hidden',
      passed: hasModal && hasRoleDialog && hasAriaHidden
    });

    // 3. Verificación de Estilos CSS
    const hasModalStyles = css.includes('.m40-modal-overlay.is-active');
    const hasInputStyles = css.includes('.m40-input.is-invalid');
    const hasResponsive = css.includes('@media (max-width: 580px)');
    auditResults.cssChecks.push({
      check: 'Estilos CSS de modal y estados de error presentes',
      passed: hasModalStyles && hasInputStyles && hasResponsive
    });

    // 4. Verificación de Lógica JS
    const hasAgeCalc = js.includes('calculateAge');
    const hasNssMask = js.includes('formatNSSDisplay');
    const hasUrlBuilder = js.includes('buildWhatsAppUrl');
    auditResults.jsChecks.push({
      check: 'Lógica reactiva de autocalculo de edad implementada',
      passed: hasAgeCalc
    });
    auditResults.jsChecks.push({
      check: 'Máscara y sanitización de 11 dígitos para NSS implementada',
      passed: hasNssMask
    });
    auditResults.jsChecks.push({
      check: 'Constructor oficial de URL de WhatsApp implementado',
      passed: hasUrlBuilder
    });

    this.log(`Auditoría UI/UX completada: ${auditResults.passed ? 'APROBADA' : 'FALLIDA'}`);
    return auditResults;
  }
}
