import { BaseAgent } from './baseAgent.js';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

/**
 * DevOpsAgent: Manejo de Git, versionado semántico y sincronización remota para testeo.
 */
export class DevOpsAgent extends BaseAgent {
  constructor() {
    super('DevOpsAgent', 'Release & Version Control Engineer');
    this.remoteUrl = 'https://github.com/Arcano3Ai/GRUPOM40.git';
  }

  async execute(task) {
    this.log('Iniciando sincronización y despliegue a Git...');
    const results = {};

    // 1. Verificar estado de git
    this.log('Añadiendo cambios al staging de Git...');
    await execAsync('git add -A');

    const commitMsg = 'feat(lead-capture): integrar modal pre-WhatsApp con formulario de diagnostico (NSS, edad, fecha, descripcion)';
    try {
      const { stdout: commitOut } = await execAsync(`git commit -m "${commitMsg}"`);
      this.log(`Commit creado: ${commitOut.trim().split('\n')[0]}`);
      results.committed = true;
    } catch (err) {
      if (err.stdout && err.stdout.includes('nothing to commit')) {
        this.log('No hay cambios pendientes por commitear.');
        results.committed = false;
      } else {
        this.log(`Nota en commit: ${err.message}`, 'WARN');
      }
    }

    // 2. Git push al repositorio oficial
    this.log(`Empujando cambios a origin/main (${this.remoteUrl})...`);
    try {
      const { stdout: pushOut, stderr: pushErr } = await execAsync('git push origin main');
      this.log(`Push exitoso al repositorio: ${pushOut || pushErr}`);
      results.pushed = true;
    } catch (err) {
      this.log(`Aviso en push directo: ${err.message}. Intentando push con seguimiento...`, 'WARN');
      try {
        const { stdout: pushTrack, stderr: pushTrackErr } = await execAsync('git push -u origin main');
        this.log(`Push completado: ${pushTrack || pushTrackErr}`);
        results.pushed = true;
      } catch (err2) {
        this.log(`Error en push: ${err2.message}`, 'ERROR');
        results.pushed = false;
        results.error = err2.message;
      }
    }

    return results;
  }
}
