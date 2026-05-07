import { runCLI } from './cli.js';
runCLI().catch(err => {
    console.error(err);
    process.exit(1);
});
