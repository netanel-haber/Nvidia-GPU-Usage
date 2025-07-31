const vscode = require('vscode');
const { exec } = require('child_process');

let statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

function updateGpuUsageAndMemory() {
  exec('nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits', (error, stdout, stderr) => {
    if (error || stderr) return;

    const lines = stdout.trim().split('\n');

    const gpuStats = lines.map(line => {
      const [usage, used, total] = line.split(', ').map(Number);
      const usageStr = `${usage.toString().padStart(3)}%`;
      const memUsed = (used / 1024).toFixed(2);
      const memTotal = (total / 1024).toFixed(2);
      const memStr = `${memUsed.padStart(5)}/${memTotal}GB`;
      return `${usageStr} ${memStr}`;
    });

    statusBar.text = `GPU: ${gpuStats.join(' | ')}`;
    statusBar.show();
  });
}


function activate(context) {
  context.subscriptions.push(statusBar);
  updateGpuUsageAndMemory();
  setInterval(updateGpuUsageAndMemory, 2000);
}

exports.activate = activate;
