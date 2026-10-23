/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Check, 
  Send, 
  ShieldCheck, 
  Globe, 
  Smartphone,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { WhatsAppConfig, AgencyProfile } from '../types/crm';
import { sendWhatsAppMessage } from '../services/whatsappService';

interface WhatsAppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  waConfig: WhatsAppConfig;
  onSaveConfig: (config: WhatsAppConfig) => void;
  agency: AgencyProfile;
}

export const WhatsAppSettingsModal: React.FC<WhatsAppSettingsModalProps> = ({
  isOpen,
  onClose,
  waConfig,
  onSaveConfig,
  agency
}) => {
  const [mode, setMode] = useState<WhatsAppConfig['mode']>(
    waConfig.mode === 'whatsapp_app' ? 'whatsapp_app' : 'whatsapp_web'
  );
  const [agencyPhone, setAgencyPhone] = useState(waConfig.agencyPhone || agency.phone || '');

  // Test send state
  const [testPhone, setTestPhone] = useState(agency.phone || '');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: WhatsAppConfig = {
      mode,
      agencyPhone
    };
    onSaveConfig(updated);
    onClose();
  };

  const handleTestSend = async () => {
    if (!testPhone || testPhone.length < 10) {
      setTestResult('Enter a valid 10-digit mobile number for testing.');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const testMsg = `👋 *HELLO FROM ${agency.name.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━━━━
This is a live test message from your YatriDesk Travel CRM.
Testing WhatsApp Web direct dispatch.
Time: ${new Date().toLocaleTimeString('en-IN')}

Connection is working perfectly!`;

    const activeConfig: WhatsAppConfig = {
      mode,
      agencyPhone
    };

    const res = await sendWhatsAppMessage(testPhone, testMsg, activeConfig);
    if (res.success) {
      setTestResult(`✅ Launched ${mode === 'whatsapp_web' ? 'WhatsApp Web' : 'WhatsApp'} for +91 ${testPhone}!`);
    } else {
      setTestResult(`❌ Failed: ${res.error}`);
    }
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto text-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Smart WhatsApp Dispatcher
              </h2>
              <p className="text-xs text-emerald-700 font-medium">
                Single Smart Button • Auto Tab-Reuse on PC • Direct App on Mobile
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Method Selector Tabs */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Select Preferred WhatsApp Dispatch Mode:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: WhatsApp Web */}
              <button
                type="button"
                onClick={() => setMode('whatsapp_web')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === 'whatsapp_web'
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Laptop className="w-5 h-5 text-emerald-600" />
                  {mode === 'whatsapp_web' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">WhatsApp Web (Default)</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Best for Laptop / PC Chrome. Reuses your open WhatsApp Web tab so no extra browser tabs are opened!
                </p>
              </button>

              {/* Option 2: WhatsApp Mobile App */}
              <button
                type="button"
                onClick={() => setMode('whatsapp_app')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === 'whatsapp_app'
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Smartphone className="w-5 h-5 text-teal-600" />
                  {mode === 'whatsapp_app' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">WhatsApp App</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Best for Mobile Phones or WhatsApp Desktop App. Directly launches the native installed WhatsApp application.
                </p>
              </button>
            </div>
          </div>

          {/* How it works info card */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Smart Tab-Reuse &amp; Mobile App Integration:
            </h4>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-600 leading-relaxed">
              <li>On PC/Laptop: When WhatsApp Web is open, clicking Share will redirect/refocus that same tab without opening new tabs.</li>
              <li>On Mobile Phone: Automatically opens your native WhatsApp Mobile App with the passenger's chat pre-filled.</li>
              <li>No setup required, no Meta fees, 100% free and instant.</li>
            </ol>
          </div>

          {/* Test Sender */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
            <label className="block text-xs font-bold text-emerald-900 flex items-center justify-between">
              <span>Test WhatsApp Dispatch</span>
              <span className="text-[10px] text-emerald-700">Instant Verification</span>
            </label>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">+91</span>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <button
                type="button"
                onClick={handleTestSend}
                disabled={isTesting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isTesting ? 'Opening...' : 'Test Send'}</span>
              </button>
            </div>

            {testResult && (
              <p className={`text-[11px] font-medium p-2 rounded-lg ${
                testResult.startsWith('✅') ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
              }`}>
                {testResult}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
            >
              Save Preference
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
