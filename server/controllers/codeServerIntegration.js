const { spawn } = require('child_process');
const path = require('path');

function startCodeServer() {
  // Path to code-server executable, adjust if necessary.
  const codeServerExecutable = 'code-server';

  // Command‑line flags: change flags as needed.
  const args = [
    '--auth', 'none',                   // Disable authentication for easier testing.
    '--disable-telemetry',              // Disable telemetry.
    '--disable-update-check',           // Disable update checks.
    '--port', '8081',                   // Set the port.
    '--user-data-dir', path.join(__dirname, '../../projects/codeServerUserData')
  ];

  // Spawn code-server.
  const codeServerProcess = spawn(codeServerExecutable, args, {
    cwd: __dirname,
    env: process.env,
    shell: true
  });

  codeServerProcess.stdout.on('data', data => {
    console.log(`code-server stdout: ${data}`);
  });

  codeServerProcess.stderr.on('data', data => {
    console.error(`code-server stderr: ${data}`);
  });

  codeServerProcess.on('close', code => {
    console.log(`code-server process exited with code ${code}`);
  });

  return codeServerProcess;
}

module.exports = { startCodeServer };