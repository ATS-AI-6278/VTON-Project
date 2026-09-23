/**
 * AnyWear Live VTON - Desktop Preload Bridge
 * Exposes native platform details and file dropping to the renderer process safely.
 */

const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');

contextBridge.exposeInMainWorld('desktopBridge', {
  platform: process.platform,
  arch: process.arch,
  osVersion: os.release(),
  hostname: os.hostname(),
  isDesktopApp: true,
  onBackendMessage: (callback) => {
    ipcRenderer.on('backend-message', (event, ...args) => callback(...args));
  },
  sendToBackend: (channel, data) => {
    ipcRenderer.send(channel, data);
  }
});
