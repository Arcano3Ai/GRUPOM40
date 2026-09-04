/**
 * BaseAgent: Clase base para todos los agentes del Swarm
 */
export class BaseAgent {
  constructor(name, role) {
    this.name = name;
    this.role = role;
    this.logs = [];
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logEntry = `[${timestamp}] [${this.name} (${this.role})] [${level}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  async run(task) {
    this.log(`Iniciando tarea: ${task.title}`);
    try {
      const result = await this.execute(task);
      this.log(`Tarea completada con éxito: ${task.title}`, 'SUCCESS');
      return {
        success: true,
        agent: this.name,
        task: task.id,
        output: result,
        logs: this.logs
      };
    } catch (error) {
      this.log(`Error al ejecutar tarea: ${error.message}`, 'ERROR');
      return {
        success: false,
        agent: this.name,
        task: task.id,
        error: error.message,
        logs: this.logs
      };
    }
  }

  async execute(task) {
    throw new Error(`execute() debe ser implementado por la subclase ${this.constructor.name}`);
  }
}
