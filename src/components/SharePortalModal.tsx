/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  Laptop, 
  Share2, 
  ShieldCheck,
  Download,
  AlertCircle
} from 'lucide-react';

interface SharePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyName: string;
}

export const SharePortalModal: React.FC<SharePortalModalProps> = ({
  isOpen,
  onClose,
  agencyName
}) => {
  const [copied, setCopied] = useState(false);
  const [liveUrl, setLiveUrl] = useState('');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Determine the real, active origin
      const origin = window.location.origin || window.location.href;
      setLiveUrl(origin);

      const handleBeforeInstall = (e: any) => {
        e.preventDefault();
        setInstallPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);

      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (liveUrl) {
      navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInstallApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setInstallPrompt(null);
    } else {
      alert('To install on your phone or PC:\n1. Open this link in Google Chrome\n2. Tap the 3 dots (⋮) menu\n3. Tap "Add to Home Screen" or "Install App"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-auto text-slate-800 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-sky-100 bg-sky-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 text-sky-700 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Share &amp; Open Portal Anywhere
              </h2>
              <p className="text-xs text-slate-500">
                Open on Mobile, Staff Laptop, or share with anyone
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs overflow-y-auto max-h-[80vh]">
          
          {/* Active Live Link Box */}
          <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-900 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                <Globe className="w-4 h-4 text-sky-600" />
                Active Working Portal URL
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 font-semibold">
                ● Live &amp; Online
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={liveUrl}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none select-all font-bold"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors shrink-0"
                title="Open in new browser tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-slate-500">
              Yeh aapke travel portal ka real live link hai.
            </p>
          </div>

          {/* Guide: How to open anywhere */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Access &amp; Install Options:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1 */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">1</span>
                  <span>Direct Web Access</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Open this link on any browser (Chrome, Edge, Safari) on any mobile phone or computer.
                </p>
              </div>

              {/* Option 2: Install as App (PWA) */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-sky-700 font-bold">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs">2</span>
                  <span>Mobile App Install (PWA)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Apne phone ya PC ke Google Chrome me is link ko open karein, fir 3-dots (⋮) par tap karke <strong className="text-slate-900">&quot;Add to Home screen&quot;</strong> ya <strong className="text-slate-900">&quot;Install App&quot;</strong> kar lein.
                </p>
              </div>
            </div>
          </div>

          {/* 1-Click Install Button */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">
                  {isInstalled ? 'App Already Installed' : 'Install as Standalone Mobile / Desktop App'}
                </h4>
                <p className="text-[11px] text-slate-600">
                  Runs full screen offline with fast booking speed on Android, iPhone &amp; Windows PC.
                </p>
              </div>
            </div>

            <button
              onClick={handleInstallApp}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{isInstalled ? 'App Ready' : 'Install App Now'}</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
