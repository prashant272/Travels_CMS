/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  AlertCircle, 
  CheckSquare, 
  Square, 
  Send, 
  CheckCircle2, 
  X, 
  Wallet, 
  Phone, 
  Calendar, 
  DollarSign,
  MessageSquare,
  Play,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { Booking, AgencyProfile, WhatsAppConfig } from '../types/crm';
import { generateReminderMessage, sendWhatsAppMessage, openSmartWhatsApp } from '../services/whatsappService';

interface PendingDuesManagerProps {
  bookings: Booking[];
  agency: AgencyProfile;
  waConfig: WhatsAppConfig;
  onOpenPayDue: (booking: Booking) => void;
  privacyMask: boolean;
}

interface DispatchItem {
  booking: Booking;
  status: 'pending' | 'sending' | 'sent' | 'failed' | 'skipped';
  error?: string;
}

export const PendingDuesManager: React.FC<PendingDuesManagerProps> = ({
  bookings,
  agency,
  waConfig,
  onOpenPayDue,
  privacyMask
}) => {
  // Filter all lifetime bookings that have due > 0 and not cancelled
  const dueBookings = useMemo(() => {
    return bookings.filter(b => b.status !== 'cancelled' && b.due > 0);
  }, [bookings]);

  // High-performance O(1) Set-based selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(dueBookings.map(b => b.id)));
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Dispatch Runner Modal state
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);
  const [dispatchQueue, setDispatchQueue] = useState<DispatchItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRunning, setIsAutoRunning] = useState(false);

  // Toggle selection with O(1) Set operations
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === dueBookings.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(dueBookings.map(b => b.id)));
    }
  };

  const selectedTotalDue = useMemo(() => {
    return dueBookings
      .filter(b => selectedIds.has(b.id))
      .reduce((sum, b) => sum + b.due, 0);
  }, [dueBookings, selectedIds]);

  const totalPages = Math.max(1, Math.ceil(dueBookings.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedDueBookings = dueBookings.slice(startIndex, startIndex + pageSize);

  // Launch Bulk Reminder Runner
  const handleStartBulkReminder = () => {
    const queue: DispatchItem[] = dueBookings
      .filter(b => selectedIds.has(b.id))
      .map(b => ({ booking: b, status: 'pending' }));

    if (queue.length === 0) return;

    setDispatchQueue(queue);
    setCurrentIndex(0);
    setIsRunnerOpen(true);
    setIsAutoRunning(false);
  };

  // Dispatch a single item in queue
  const dispatchItemAt = async (index: number) => {
    if (index >= dispatchQueue.length) {
      setIsAutoRunning(false);
      return;
    }

    const item = dispatchQueue[index];
    setDispatchQueue(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], status: 'sending' };
      return copy;
    });

    const msg = generateReminderMessage(item.booking, agency);
    const result = await sendWhatsAppMessage(item.booking.customerPhone, msg, waConfig);

    setDispatchQueue(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        status: result.success ? 'sent' : 'failed',
        error: result.error
      };
      return copy;
    });

    setCurrentIndex(index + 1);

    // If API/Webhook mode, auto-continue seamlessly
    if (waConfig.mode !== 'in_app_direct' && isAutoRunning && index + 1 < dispatchQueue.length) {
      setTimeout(() => {
        dispatchItemAt(index + 1);
      }, 1000);
    }
  };

  const handleAutoRun = () => {
    setIsAutoRunning(true);
    dispatchItemAt(currentIndex);
  };

  const formatINR = (val: number) => {
    if (privacyMask) return '₹••••';
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Bulk Action Bar - 8-Hour Eye-Comfort Light */}
      <div className="bg-white/92 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Pending Due &amp; Bulk WhatsApp Reminders
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold font-mono">
                {dueBookings.length} Customers Pending
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Select clients with outstanding dues and dispatch automated payment reminders to their WhatsApp without leaving the app.
            </p>
          </div>

          {/* Action Stats */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Selected Due Balance</span>
              <span className="text-base font-black font-mono text-amber-700">
                {formatINR(selectedTotalDue)}
              </span>
            </div>

            <button
              onClick={handleStartBulkReminder}
              disabled={selectedIds.size === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer ${
                selectedIds.size > 0
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Send Bulk WhatsApp Reminders ({selectedIds.size})</span>
            </button>
          </div>
        </div>

        {/* Selection Controller Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-extrabold cursor-pointer"
          >
            {selectedIds.size === dueBookings.length ? (
              <CheckSquare className="w-4 h-4 text-amber-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>Select All Customers ({dueBookings.length})</span>
          </button>

          <span className="text-slate-500 font-semibold">
            {selectedIds.size} of {dueBookings.length} selected
          </span>
        </div>
      </div>

      {/* Due Customer Cards & Table */}
      {dueBookings.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {paginatedDueBookings.map((b) => {
              const isSelected = selectedIds.has(b.id);
            return (
              <div
                key={b.id}
                className={`bg-white border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-xs ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-300'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Checkbox & Client Info */}
                <div className="flex items-start sm:items-center gap-3">
                  <button
                    onClick={() => handleToggleSelect(b.id)}
                    className="mt-0.5 sm:mt-0 text-slate-400 hover:text-slate-900 cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 text-sm">{b.customerName}</h4>
                      <span className="font-mono text-xs text-slate-500 font-medium">
                        +91 {privacyMask ? b.customerPhone.slice(0, 2) + '••••••' + b.customerPhone.slice(-2) : b.customerPhone}
                      </span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                        {b.billNo}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3 font-medium">
                      <span className="font-bold text-slate-800">{b.fromStation} ➔ {b.toStation}</span>
                      <span>•</span>
                      <span className="text-amber-700 font-black">DOJ: {b.doj}</span>
                      {b.remarks && <span className="text-slate-400">({b.remarks})</span>}
                    </p>
                  </div>
                </div>

                {/* Financials & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right font-mono">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total / Paid</span>
                    <span className="text-xs text-slate-700">
                      ₹{b.netAmount.toLocaleString('en-IN')} / <span className="text-emerald-700 font-bold">₹{b.amountReceived.toLocaleString('en-IN')}</span>
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-amber-700 uppercase tracking-wider block font-bold">Due Balance</span>
                    <span className="text-base font-black text-amber-700">
                      {formatINR(b.due)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenPayDue(b)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-xs transition-all cursor-pointer"
                    >
                      Clear Due
                    </button>
                    {(() => {
                      const msg = generateReminderMessage(b, agency);
                      const cleanPhone = (b.customerPhone || '').replace(/\D/g, '').slice(-10);
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(msg).catch(() => {});
                            openSmartWhatsApp(cleanPhone, msg);
                          }}
                          className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
                          title="Open WhatsApp directly with reminder (reuses active tab on PC, opens App on mobile)"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

          {/* Pagination Controls Bar - Instant Response for 100,000 Data Entries */}
          <div className="p-3 sm:p-4 border border-slate-200/90 rounded-2xl bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-3 text-slate-600 font-medium">
              <span>
                Showing <strong className="text-slate-900 font-bold">{dueBookings.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
                <strong className="text-slate-900 font-bold">{Math.min(startIndex + pageSize, dueBookings.length)}</strong> of{' '}
                <strong className="text-slate-900 font-bold">{dueBookings.length.toLocaleString('en-IN')}</strong> records
              </span>

              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <span className="text-slate-500">Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs cursor-pointer"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>

            {/* Page navigation buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={safePage <= 1}
                title="First Page"
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                title="Previous Page"
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900 shadow-2xs">
                Page {safePage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                title="Next Page"
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={safePage >= totalPages}
                title="Last Page"
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-600 shadow-xs">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">All Clear! No Pending Dues</h3>
          <p className="text-xs text-slate-500 mt-1">Every client account has been settled and fully paid.</p>
        </div>
      )}

      {/* Bulk Reminder Dispatch Runner Modal */}
      {isRunnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-auto text-slate-800">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Bulk WhatsApp Reminder Dispatch
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Smart Tab-Reuse: Reuses active WhatsApp Web tab without opening extra tabs
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setIsRunnerOpen(false); setIsAutoRunning(false); }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Progress Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">Progress:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {dispatchQueue.filter(i => i.status === 'sent').length} of {dispatchQueue.length} Delivered
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full transition-all duration-300"
                    style={{
                      width: `${(dispatchQueue.filter(i => i.status === 'sent').length / dispatchQueue.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleAutoRun}
                  disabled={isAutoRunning || currentIndex >= dispatchQueue.length}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isAutoRunning ? 'Delivering...' : 'Start Auto Delivery'}</span>
                </button>

                <button
                  onClick={() => dispatchItemAt(currentIndex)}
                  disabled={currentIndex >= dispatchQueue.length}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
                >
                  Deliver Next Customer
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
