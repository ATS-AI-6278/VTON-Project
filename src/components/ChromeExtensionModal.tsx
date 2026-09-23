/**
 * AnyWear Local VTON - Chrome Extension Guide & Code Viewer
 */

import React, { useState } from 'react';
import { Download, Check, Copy, ExternalLink, Code2, ShieldCheck, Zap } from 'lucide-react';

interface ChromeExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChromeExtensionModal: React.FC<ChromeExtensionModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<'manifest' | 'content' | 'background'>('manifest');

  if (!isOpen) return null;

  const copyPath = () => {
    navigator.clipboard.writeText('/chrome-extension');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col p-6 gap-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-neutral-100">
                AnyWear Local VTON Chrome Extension
              </h2>
            </div>
            <p className="text-xs text-neutral-400">
              Drag garments from any fashion store (Zara, ASOS, Uniqlo) directly into your live local video stream.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-200 text-lg rounded-md"
          >
            ✕
          </button>
        </div>

        {/* Installation Steps */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-neutral-200">
            Installation in 30 Seconds (Developer Mode)
          </h3>

          <ol className="flex flex-col gap-2.5 text-xs text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-mono font-bold text-cyan-400 shrink-0 text-[11px]">
                1
              </span>
              <span>
                Open Chrome or any Chromium browser and navigate to{' '}
                <code className="bg-neutral-950 text-cyan-300 px-1.5 py-0.5 rounded border border-neutral-800 font-mono">
                  chrome://extensions/
                </code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-mono font-bold text-cyan-400 shrink-0 text-[11px]">
                2
              </span>
              <span>
                In the top-right corner of the Extensions page, toggle <strong>Developer mode</strong> to <strong>ON</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-mono font-bold text-cyan-400 shrink-0 text-[11px]">
                3
              </span>
              <div className="flex flex-col gap-1.5 flex-1">
                <span>
                  Click <strong>Load unpacked</strong> in the top left, and select the extension folder:
                </span>
                <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 p-2 rounded-md font-mono text-cyan-300 text-[11px]">
                  <span>/chrome-extension</span>
                  <button
                    onClick={copyPath}
                    className="ml-auto flex items-center gap-1 text-neutral-400 hover:text-neutral-200"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-mono font-bold text-cyan-400 shrink-0 text-[11px]">
                4
              </span>
              <span>
                Go to any apparel shopping site, drag a clothing photo across windows into your live try-on video, or click the try-on button. It hot-swaps in under 120ms!
              </span>
            </li>
          </ol>
        </div>

        {/* Security & Local Zero-Cloud Guarantee */}
        <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-lg p-3.5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 text-xs">
            <span className="font-semibold text-emerald-200">100% Local IPC & Privacy Protocol</span>
            <span className="text-neutral-400 leading-relaxed">
              No webcam video or image frames ever touch cloud servers. Communications route directly through browser{' '}
              <code className="text-emerald-300 font-mono">BroadcastChannel</code> and local loopback{' '}
              <code className="text-emerald-300 font-mono">ws://127.0.0.1:8765</code>.
            </span>
          </div>
        </div>

        {/* Extension Source Code Browser */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-200">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Extension Source Files</span>
            </div>
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded border border-neutral-800 text-xs">
              <button
                onClick={() => setSelectedFile('manifest')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedFile === 'manifest' ? 'bg-neutral-800 text-cyan-400 font-medium' : 'text-neutral-400'
                }`}
              >
                manifest.json
              </button>
              <button
                onClick={() => setSelectedFile('content')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedFile === 'content' ? 'bg-neutral-800 text-cyan-400 font-medium' : 'text-neutral-400'
                }`}
              >
                content.js
              </button>
              <button
                onClick={() => setSelectedFile('background')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedFile === 'background' ? 'bg-neutral-800 text-cyan-400 font-medium' : 'text-neutral-400'
                }`}
              >
                background.js
              </button>
            </div>
          </div>

          <pre className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-48 scrollbar-thin">
            {selectedFile === 'manifest' &&
              `{
  "manifest_version": 3,
  "name": "AnyWear Local VTON - Live Fashion Try-On",
  "version": "1.0.0",
  "description": "Drag & drop garments from any fashion website into your local 4GB real-time VTON stream.",
  "permissions": ["activeTab", "storage"],
  "host_permissions": ["<all_urls>"],
  "background": { "service_worker": "background.js" },
  "content_scripts": [{ "matches": ["<all_urls>"], "js": ["content.js"] }]
}`}
            {selectedFile === 'content' &&
              `// Detects highest-res apparel image & transmits via BroadcastChannel
function transmitGarment(imageUrl, label) {
  const channel = new BroadcastChannel('anywear_vton_channel');
  channel.postMessage({
    type: 'TRY_ON_GARMENT',
    source: 'CHROME_EXTENSION',
    garment: { imageUrl, name: label }
  });
}`}
            {selectedFile === 'background' &&
              `// Relays garment payloads across active browser windows
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TRY_ON_GARMENT') {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(t => chrome.tabs.sendMessage(t.id, message));
    });
  }
});`}
          </pre>
        </div>
      </div>
    </div>
  );
};
