import { ScrumMaster } from './scrumMaster.js';

async function main() {
  const master = new ScrumMaster();
  const summary = await master.runSprint();
  if (!summary.dodPassed) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Error en ejecución del Swarm:', err);
  process.exit(1);
});
