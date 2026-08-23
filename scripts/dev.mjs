import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';

function runNpmScript(script) {
  if (isWindows) {
    return spawn(
      process.env.ComSpec ?? 'cmd.exe',
      ['/d', '/s', '/c', `npm run ${script}`],
      {
        stdio: 'inherit',
      },
    );
  }

  return spawn('npm', ['run', script], {
    stdio: 'inherit',
  });
}

const processes = [
  runNpmScript('dev:api'),
  runNpmScript('dev:web'),
];

let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

for (const child of processes) {
  child.on('exit', (code) => {
    if (!shuttingDown && code !== 0) {
      shutdown('SIGTERM');
      process.exitCode = code ?? 1;
    }
  });
}
