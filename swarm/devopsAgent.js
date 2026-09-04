import { BaseAgent } from './baseAgent.js';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

/**
 * DevOpsAgent: Sincronización y despliegue a Git.
 */
export class DevOpsAgent extends BaseAgent {
  constructor() {
    super('DevOpsAgent', 'Release & Version Control Engineer');
    this.remoteUrl = 'https://github.com/Arcano3Ai/GRUPOM40.git';
  }

  async execute(task) {
    this.log('Iniciando sincronización a Git...');
    const results = {};

    this.log('Añadiendo cambios al staging de Git...');
    await execAsync('git add -A');

    const commitMsg = 'fix(form-layout): colocar formulario al principio (nombre, edad, año de inicio), remover formulario de abajo y vincular CTAs';
    try {
      const { stdout: commitOut } = await execAsync(`git commit -m "${commitMsg}"`);
      this.log(`Commit creado: ${commitOut.trim().split('\n')[0]}`);
      results.committed = true;
    } catch (err) {
      if (err.stdout && err.stdout.includes('nothing to commit')) {
        this.log('No hay cambios pendientes.');
        results.committed = false;
      } else {
        this.log(`Nota en commit: ${err.message}`, 'WARN');
      }
    }

    this.log(`Empujando cambios a origin/main...`);
    try {
      const { stdout: pushOut, stderr: pushErr } = await execAsync('git push origin main');
      this.log(`Push completado: ${pushOut || pushErr}`);
      results.pushed = true;
    } catch (err) {
      this.log(`Reintentando push con upstream...`, 'WARN');
      const { stdout: pushTrack, stderr: pushTrackErr } = await execAsync('git push -u origin main');
      this.log(`Push completado: ${pushTrack || pushTrackErr}`);
      results.pushed = true;
    }

    return results;
  }
}
