/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  RefreshCw, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  HelpCircle,
  Database
} from 'lucide-react';
import { Booking, GoogleSheetConfig } from '../types/crm';
import { 
  GOOGLE_APPS_SCRIPT_CODE, 
  GOOGLE_SHEET_HEADERS, 
  bookingToSheetRow, 
  fetchFromGoogleSheet, 
  fullBatchSyncToSheet 
} from '../services/googleSheetService';

interface GoogleSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetConfig: GoogleSheetConfig;
  onSaveConfig: (config: GoogleSheetConfig) => void;
  bookings: Booking[];
  onImportBookingsFromSheet: (sheetBookings: Booking[]) => void;
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({
  isOpen,
  onClose,
  sheetConfig,
  onSaveConfig,
  bookings,
  onImportBookingsFromSheet
}) => {
  const [webAppUrl, setWebAppUrl] = useState(sheetConfig.webAppUrl || '');
  const [autoSync, setAutoSync] = useState(sheetConfig.autoSync ?? true);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedTable, setCopiedTable] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');

  if (!isOpen) return null;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleCopyTable = () => {
    const rows = bookings.map((b, i) => bookingToSheetRow(b, i).join('\t'));
    const tsv = [GOOGLE_SHEET_HEADERS.join('\t'), ...rows].join('\n');
    navigator.clipboard.writeText(tsv);
    setCopiedTable(true);
    setTimeout(() => setCopiedTable(false), 2500);
  };

  const handleDownloadCsv = () => {
    const rows = bookings.map((b, i) => 
      bookingToSheetRow(b, i).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [GOOGLE_SHEET_HEADERS.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `YatriDesk_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTestAndConnect = async () => {
    if (!webAppUrl.trim()) {
      setStatusType('error');
      setSyncStatus('Please enter your Google Apps Script Web App URL.');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('Connecting and reading existing rows from your Google Sheet...');
    setStatusType('info');

    try {
      const result = await fetchFromGoogleSheet(webAppUrl.trim());
      if (result.success) {
        // Google Sheet is Primary Database: Import its current state (respecting any deletions in sheet)
        onImportBookingsFromSheet(result.bookings || []);
        setStatusType('success');
        setSyncStatus(`Connected! Successfully synced ${result.bookings.length} record(s) from your Google Sheet.`);

        const newConfig: GoogleSheetConfig = {
          ...sheetConfig,
          webAppUrl: webAppUrl.trim(),
          isConnected: true,
          lastSyncedAt: new Date().toISOString(),
          autoSync,
          totalRowsSynced: result.bookings.length
        };
        onSaveConfig(newConfig);
      } else {
        setStatusType('error');
        setSyncStatus(result.error || 'Failed to connect. Please check permissions.');
      }
    } catch (err: any) {
      setStatusType('error');
      setSyncStatus(err.message || 'Connection failed');
    } finally {
      setIsSyncing(false);
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto text-slate-800 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Live 2-Way Google Sheets Sync &amp; Backup
              </h2>
              <p className="text-xs text-slate-600">
                Continuous bi-directional sync: Deleting/adding in portal syncs to sheet, and vice versa.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Connection URL Bar */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-700">
              Your Google Apps Script Web App URL:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                value={webAppUrl}
                onChange={(e) => setWebAppUrl(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleTestAndConnect}
                disabled={isSyncing}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Connecting...' : 'Connect & Sync'}</span>
              </button>
            </div>

            {/* Status notice */}
            {syncStatus && (
              <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                statusType === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : statusType === 'error' ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-white border-slate-300 text-slate-700'
              }`}>
                <Database className="w-4 h-4 shrink-0" />
                <span>{syncStatus}</span>
              </div>
            )}

            {/* Config Status Indicators */}
            {sheetConfig.isConnected && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-700 font-bold">2-Way Sync Active</span>
                  {sheetConfig.lastSyncedAt && (
                    <span>• Last synced: {new Date(sheetConfig.lastSyncedAt).toLocaleTimeString()}</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!webAppUrl.trim()) return;
                      setIsSyncing(true);
                      setSyncStatus('Fetching all latest rows from Google Sheet...');
                      try {
                        const res = await fetchFromGoogleSheet(webAppUrl.trim());
                        if (res.success && res.bookings) {
                          onImportBookingsFromSheet(res.bookings);
                          setStatusType('success');
                          setSyncStatus(`Successfully imported all ${res.bookings.length} records from Google Sheet!`);
                        }
                      } catch (e: any) {
                        setStatusType('error');
                        setSyncStatus(e.message || 'Error fetching');
                      } finally {
                        setIsSyncing(false);
                      }
                    }}
                    disabled={isSyncing}
                    className="text-emerald-700 hover:underline font-bold"
                  >
                    Force Re-Import
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!webAppUrl.trim()) return;
                      if (!window.confirm(`This will upload all ${bookings.length} local CRM records to your Google Sheet. Continue?`)) return;
                      setIsSyncing(true);
                      setSyncStatus('Pushing local bookings to Google Sheet...');
                      try {
                        const ok = await fullBatchSyncToSheet(webAppUrl.trim(), bookings);
                        if (ok) {
                          setStatusType('success');
                          setSyncStatus(`Uploaded ${bookings.length} records to your Google Sheet!`);
                        }
                      } catch (e: any) {
                        setStatusType('error');
                        setSyncStatus(e.message || 'Error exporting to sheet');
                      } finally {
                        setIsSyncing(false);
                      }
                    }}
                    disabled={isSyncing}
                    className="text-slate-600 hover:text-slate-900 hover:underline text-[11px]"
                  >
                    Export to Sheet
                  </button>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300" title="Google Sheet is permanently linked for data safety">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Permanent Linked</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Setup Instructions & 1-Click Code Copy */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                How to Link Your Google Sheet in 1 Minute:
              </h3>
              <button
                type="button"
                onClick={handleCopyScript}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold text-[11px] transition-colors"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Code Copied!' : 'Copy Apps Script Code'}</span>
              </button>
            </div>

            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <li>Open your personal <strong>Google Sheet</strong> in your browser.</li>
              <li>Click menu: <strong>Extensions &gt; Apps Script</strong>.</li>
              <li>Delete any default text, click the button above <strong>&quot;Copy Apps Script Code&quot;</strong>, and paste it.</li>
              <li>Click <strong>Deploy &gt; New deployment</strong> &gt; Select type: <strong>Web app</strong>.</li>
              <li>Set <em>Execute as: Me</em> and <em>Who has access: Anyone</em>, click <strong>Deploy</strong>, and copy the Web App URL!</li>
            </ol>
          </div>

          {/* Offline Backup & Manual Clipboard Tools */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
              Instant Backup &amp; Offline Export
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleCopyTable}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 text-left flex items-center justify-between group transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 text-xs block">Copy {GOOGLE_SHEET_HEADERS.length} Columns Table</span>
                  <span className="text-[10px] text-slate-500">Ctrl+V paste directly into Excel or Sheet</span>
                </div>
                {copiedTable ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-800" />}
              </button>

              <button
                type="button"
                onClick={handleDownloadCsv}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 text-left flex items-center justify-between group transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 text-xs block">Download CSV Backup</span>
                  <span className="text-[10px] text-slate-500">Save full offline spreadsheet file (.csv)</span>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
