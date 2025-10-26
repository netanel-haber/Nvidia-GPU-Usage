const vscode = require('vscode');
const { exec } = require('child_process');

let statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);

function updateGpuUsageAndMemory() {
  exec('nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits', (error, stdout, stderr) => {
    if (error || stderr) return;

    const lines = stdout.trim().split('\n');
    let SINGLE_TOTAL = 0;
    const gpuStats = lines.map(line => {
      const [_, used, total] = line.split(', ').map(Number);
      const memTotal = (total / 1024).toFixed(1);
      SINGLE_TOTAL = memTotal; // assume all GPUs have the same total memory
      const memUsed = (used / 1024).toFixed(1);
      return memUsed;
    });

    statusBar.text = gpuStats.join(' ▒ ') + " / " + SINGLE_TOTAL + "GB";
    statusBar.show();
  });
}


function activate(context) {
  context.subscriptions.push(statusBar);
  updateGpuUsageAndMemory();
  setInterval(updateGpuUsageAndMemory, 2000);
}

exports.activate = activate;
