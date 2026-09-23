/**
 * AnyWear Live VTON - Standalone Desktop Application Entry (Electron)
 * Cross-platform desktop shell for Windows 10/11 and macOS.
 * Manages native webcam permissions, native Explorer/Finder file drag-and-drop,
 * and launches the local Python inference worker.
 */

const { app, BrowserWindow, ipcMain, systemPreferences } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow = null;
let pythonWorker = null;

function startInferenceWorker() {
  const isWindows = process.platform === 'win32';
  const pythonExecutable = isWindows ? 'python' : 'python3';
  const workerScript = path.join(__dirname, '../backend/inference_worker/server.py');

  try {
    pythonWorker = spawn(pythonExecutable, [workerScript], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: path.join(__dirname, '..')
    });

    pythonWorker.stdout.on('data', (data) => {
      console.log(`[Python Worker] ${data}`);
    });

    pythonWorker.stderr.on('data', (data) => {
      console.error(`[Python Worker Error] ${data}`);
    });

    pythonWorker.on('close', (code) => {
      console.log(`[Python Worker Exited] Code ${code}`);
    });
  } catch (err) {
    console.error('Failed to spawn Python inference worker:', err);
  }
}

async function createWindow() {
  // Request native camera permission on macOS
  if (process.platform === 'darwin') {
    try {
      const cameraStatus = await systemPreferences.askForMediaAccess('camera');
      console.log('macOS Camera media access granted:', cameraStatus);
    } catch (e) {
      console.warn('macOS media access error:', e);
    }
  }

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 700,
    title: 'AnyWear Live VTON Desktop (Windows & macOS)',
    backgroundColor: '#09090b',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // In development load dev server, in production load index.html
  const devUrl = 'http://localhost:3000';
  mainWindow.loadURL(devUrl).catch(() => {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startInferenceWorker();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (pythonWorker) {
    pythonWorker.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
