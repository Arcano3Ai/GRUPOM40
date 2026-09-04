import { FrontendAgent } from './frontendAgent.js';
import { QAAgent } from './qaAgent.js';
import { DevOpsAgent } from './devopsAgent.js';

/**
 * ScrumMaster: Orquestador del Swarm
 */
export class ScrumMaster {
  constructor() {
    this.sprint = {
      id: 'SPRINT-M40-02',
      goal: 'Integrar y validar el formulario de pre-consulta para WhatsApp (Nombre, Fecha, Edad, NSS y Caso) y sincronizar en el repositorio oficial.',
      tasks: [
        { id: 'TASK-01', title: 'Auditoría de Frontend, accesibilidad y campos de formulario', agent: 'frontend' },
        { id: 'TASK-02', title: 'Validación automatizada de TDD y edge cases de negocio', agent: 'qa' },
        { id: 'TASK-03', title: 'Integración, commit semántico y push a Git para testeo', agent: 'devops' }
      ]
    };

    this.agents = {
      frontend: new FrontendAgent(),
      qa: new QAAgent(),
      devops: new DevOpsAgent()
    };
  }

  log(msg) {
    console.log(`\x1b[36m[SCRUM MASTER]\x1b[0m ${msg}`);
  }

  async runSprint() {
    console.log('\n======================================================================');
    console.log(`  🚀 INICIANDO SPRINT: ${this.sprint.id}`);
    console.log(`  🎯 META: ${this.sprint.goal}`);
    console.log('======================================================================\n');

    const sprintResults = {
      sprintId: this.sprint.id,
      goal: this.sprint.goal,
      taskResults: [],
      dodPassed: false
    };

    // 1. Frontend
    this.log('Asignando TASK-01 a FrontendAgent...');
    const frontendTask = this.sprint.tasks[0];
    const frontendRes = await this.agents.frontend.run(frontendTask);
    sprintResults.taskResults.push(frontendRes);

    if (!frontendRes.success || !frontendRes.output.passed) {
      this.log('❌ TASK-01 no cumplió los criterios de aceptación.', 'ERROR');
      return sprintResults;
    }
    this.log('✅ TASK-01 completada exitosamente.');

    // 2. QA
    this.log('Asignando TASK-02 a QAAgent...');
    const qaTask = this.sprint.tasks[1];
    const qaRes = await this.agents.qa.run(qaTask);
    sprintResults.taskResults.push(qaRes);

    if (!qaRes.success || !qaRes.output.allPassed) {
      this.log('❌ TASK-02 falló en las pruebas automatizadas.', 'ERROR');
      return sprintResults;
    }
    this.log('✅ TASK-02 completada con 100% de tests aprobados.');

    // 3. DevOps
    this.log('Asignando TASK-03 a DevOpsAgent...');
    const devopsTask = this.sprint.tasks[2];
    const devopsRes = await this.agents.devops.run(devopsTask);
    sprintResults.taskResults.push(devopsRes);
    this.log('✅ TASK-03 procesada por DevOpsAgent.');

    // 4. DoD
    sprintResults.dodPassed = frontendRes.output.passed && qaRes.output.allPassed;

    console.log('\n======================================================================');
    console.log(`  🏁 SPRINT COMPLETADO: ${sprintResults.dodPassed ? '✅ EXITOSO (DoD Cumplido)' : '⚠️ CON OBSERVACIONES'}`);
    console.log('======================================================================\n');

    return sprintResults;
  }
}
