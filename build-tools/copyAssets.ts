import * as shell from 'shelljs';

// copy public folder
shell.cp('-R', 'src/public', 'dist/public');
