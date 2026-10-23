/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Train, 
  Plane, 
  Bus, 
  MapPin, 
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Download,
  AlertTriangle,
  RotateCcw,
  FileCheck
} from 'lucide-react';
import { Booking, AgencyProfile, WhatsAppConfig } from '../types/crm';
import { 
  generateInvoiceMessage, 
  generateRefundReceiptMessage, 
  sendWhatsAppMessage,
  openSmartWhatsApp
} from '../services/whatsappService';

interface InvoiceModalProps {
  booking: Booking | null;
  agency: AgencyProfile;
  waConfig: WhatsAppConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  booking,
  agency,
  waConfig,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [isSendingWa, setIsSendingWa] = useState(false);
  const [waNotice, setWaNotice] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  const isCancelled = booking.status === 'cancelled';
  const cd = booking.cancellationDetails;

  const invoiceMessage = isCancelled 
    ? generateRefundReceiptMessage(booking, agency)
    : generateInvoiceMessage(booking, agency);

  const cleanPhone = (booking.customerPhone || '').replace(/\D/g, '').slice(-10);

  const handleCopy = () => {
    navigator.clipboard.writeText(invoiceMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Direct 1-Click WhatsApp Web Dispatch
  const handleShareWhatsAppWeb = async () => {
    setIsSendingWa(true);
    setWaNotice(null);
    try {
      const res = await sendWhatsAppMessage(booking.customerPhone, invoiceMessage, waConfig);
      setWaNotice(res.notice || 'Opened WhatsApp Web with pre-filled invoice message!');
    } catch (err: any) {
      setWaNotice(err.message || 'Error opening WhatsApp Web');
    } finally {
      setIsSendingWa(false);
      setTimeout(() => setWaNotice(null), 5000);
    }
  };

  // Standalone Downloadable Slip (HTML/PDF format)
  const handleDownloadSlip = () => {
    const refundSection = isCancelled ? `
      <div style="margin-top: 15px; padding: 12px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px;">
        <h3 style="color: #be123c; margin: 0 0 8px 0; font-size: 14px;">OFFICIAL CANCELLATION & REFUND SETTLEMENT</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr><td>Original Amount Paid by Customer:</td><td align="right"><b>₹${booking.amountReceived.toLocaleString('en-IN')}</b></td></tr>
          <tr><td>Operator / IRCTC Cancellation Penalty:</td><td align="right" style="color: #e11d48;">-₹${(cd?.operatorDeduction || 0).toLocaleString('en-IN')}</td></tr>
          <tr><td>Agency Processing Charge:</td><td align="right" style="color: #e11d48;">-₹${(cd?.agencyCancellationFee || 0).toLocaleString('en-IN')}</td></tr>
          <tr style="border-top: 1px dashed #be123c; font-size: 15px; color: #be123c;">
            <td style="padding-top: 6px;"><b>NET AMOUNT REFUNDED TO CUSTOMER:</b></td>
            <td align="right" style="padding-top: 6px;"><b>₹${(cd?.customerRefundAmount || 0).toLocaleString('en-IN')}</b></td>
          </tr>
          <tr><td>Settlement Date & Time:</td><td align="right">${cd?.cancelledAt ? new Date(cd.cancelledAt).toLocaleString('en-IN') : 'Completed'}</td></tr>
          <tr><td>Settlement Proof ID:</td><td align="right"><b>REF-${booking.billNo}</b></td></tr>
          <tr><td>Refund Status:</td><td align="right"><b style="color: #059669;">REFUNDED &amp; CLEARED</b></td></tr>
        </table>
      </div>
    ` : '';

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${isCancelled ? 'Refund Receipt' : 'Invoice'} - ${booking.billNo}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; padding: 20px; }
    .card { max-width: 650px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; background: ${isCancelled ? '#fee2e2' : booking.due <= 0 ? '#dcfce7' : '#fef3c7'}; color: ${isCancelled ? '#991b1b' : booking.due <= 0 ? '#166534' : '#92400e'}; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
    th { text-align: left; padding: 8px; background: #f1f5f9; border-bottom: 2px solid #cbd5e1; }
    td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
    .total-row { font-weight: bold; font-size: 14px; background: #f8fafc; }
    .footer { margin-top: 25px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; }
    @media print { body { background: #fff; padding: 0; } .card { box-shadow: none; border: none; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <h1 class="title">${agency.name}</h1>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #475569;">${agency.address || 'Travel & Reservation Desk'}</p>
        <p style="margin: 2px 0 0 0; font-size: 12px; color: #475569;">Helpline: +91 ${agency.phone} • ${agency.email}</p>
        ${agency.gstNumber ? `<p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">GSTIN: ${agency.gstNumber}</p>` : ''}
      </div>
      <div style="text-align: right;">
        <span class="badge">${isCancelled ? 'CANCELLED & REFUNDED' : booking.due <= 0 ? 'PAID IN FULL' : 'PAYMENT DUE'}</span>
        <p style="margin: 6px 0 0 0; font-size: 12px; font-family: monospace;">Bill #${booking.billNo}</p>
        <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">Date: ${booking.bookingDate}</p>
      </div>
    </div>

    <div class="grid">
      <div>
        <span style="color: #64748b; font-size: 11px; text-transform: uppercase;">Customer Information:</span>
        <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: bold;">${booking.customerName}</p>
        <p style="margin: 2px 0 0 0; font-family: monospace;">+91 ${booking.customerPhone}</p>
        ${booking.passengerDetails ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #475569;"><b>Passengers:</b> ${booking.passengerDetails}</p>` : ''}
      </div>
      <div style="text-align: right;">
        <span style="color: #64748b; font-size: 11px; text-transform: uppercase;">Travel Details:</span>
        <p style="margin: 4px 0 0 0; font-weight: bold;">${booking.mode.toUpperCase()} (${booking.travelClass})</p>
        <p style="margin: 2px 0 0 0; color: #334155;">${booking.trainName || booking.trainNumber || booking.travelNumber}</p>
        <p style="margin: 2px 0 0 0;">Route: <b>${booking.fromStation} ➔ ${booking.toStation}</b></p>
        <p style="margin: 2px 0 0 0; color: #059669; font-weight: bold;">DOJ: ${booking.doj}</p>
        ${booking.pnr ? `<p style="margin: 2px 0 0 0; font-family: monospace; color: #0284c7;"><b>PNR: ${booking.pnr}</b></p>` : ''}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th align="right">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Base Operator Ticket Fare</td>
          <td align="right">₹${booking.ticketAmount.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td>Agency Reservation &amp; Service Fee</td>
          <td align="right">₹${booking.charge.toLocaleString('en-IN')}</td>
        </tr>
        <tr class="total-row">
          <td>Total Net Billed Amount</td>
          <td align="right">₹${booking.netAmount.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td>Amount Received from Client</td>
          <td align="right" style="color: #059669; font-weight: bold;">₹${booking.amountReceived.toLocaleString('en-IN')}</td>
        </tr>
        <tr style="background: ${booking.due > 0 && !isCancelled ? '#fef3c7' : '#f8fafc'}; font-weight: bold;">
          <td>Balance Outstanding Due</td>
          <td align="right" style="color: ${booking.due > 0 && !isCancelled ? '#d97706' : '#64748b'};">
            ${isCancelled ? '₹0 (Settled upon cancellation)' : booking.due > 0 ? '₹' + booking.due.toLocaleString('en-IN') : '₹0 (Fully Paid)'}
          </td>
        </tr>
      </tbody>
    </table>

    ${refundSection}

    <div class="footer">
      <p>Thank you for choosing ${agency.name}. Official computer-generated invoice slip.</p>
    </div>
  </div>
  <script>window.onload = function() { window.print(); };</script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) {
      // Fallback download if popup blocked
      const a = document.createElement('a');
      a.href = url;
      a.download = `${isCancelled ? 'Refund_Proof' : 'Bill'}_${booking.billNo}.html`;
      a.click();
    }
  };

  const modeIcon = booking.mode === 'train' ? <Train className="w-5 h-5 text-amber-400" />
    : booking.mode === 'flight' ? <Plane className="w-5 h-5 text-sky-400" />
    : <Bus className="w-5 h-5 text-rose-400" />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-auto text-slate-800">
        
        {/* Top Action Bar (hidden in print) */}
        <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isCancelled ? 'Official Refund Proof' : 'Travel Voucher & Invoice'}
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              {booking.billNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
              title="Copy slip text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownloadSlip}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
              title="Download Slip (HTML/PDF)"
            >
              <Download className="w-4 h-4 text-sky-600" />
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
              title="Print voucher"
            >
              <Printer className="w-4 h-4 text-slate-700" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {waNotice && (
          <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium animate-fadeIn">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{waNotice}</span>
          </div>
        )}

        {/* Printable Ticket Voucher Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-white text-slate-800 print-card" id="printable-invoice">
          
          {/* Agency Branding Header */}
          <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {agency.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {agency.address || 'Travel & Reservation Desk'}
              </p>
              <p className="text-xs text-slate-500">
                Helpline: +91 {agency.phone} • {agency.email}
              </p>
              {agency.gstNumber && (
                <p className="text-[10px] text-slate-400 font-mono">GSTIN: {agency.gstNumber}</p>
              )}
            </div>

            <div className="text-left sm:text-right">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isCancelled
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : booking.due <= 0
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {isCancelled ? 'CANCELLED & REFUNDED' : booking.due <= 0 ? 'PAID IN FULL' : 'PARTIALLY DUE'}
              </span>
              <p className="text-xs text-slate-500 font-mono mt-1">Date: {booking.bookingDate}</p>
              <p className="text-xs font-bold text-slate-900 font-mono">Bill #{booking.billNo}</p>
            </div>
          </div>

          {/* Cancellation Proof Banner (if cancelled) */}
          {isCancelled && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Official Cancellation &amp; Refund Settled</span>
                  <span className="text-[11px] text-rose-700">
                    Ref ID: <strong className="font-mono text-slate-900">REF-{booking.billNo}</strong> • Date: {cd?.cancelledAt ? new Date(cd.cancelledAt).toLocaleDateString('en-IN') : 'Settled'}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-200 font-bold text-rose-900 font-mono">
                Refund: ₹{(cd?.customerRefundAmount || 0).toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {/* Customer & Travel Information */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Billed To (Passenger / Client):</span>
              <p className="text-sm font-bold text-slate-900">{booking.customerName}</p>
              <p className="text-slate-600 font-mono font-medium">+91 {booking.customerPhone}</p>
              {booking.passengerDetails && (
                <p className="text-slate-600 text-[11px] mt-1">
                  <span className="text-slate-400">Details: </span>{booking.passengerDetails}
                </p>
              )}
            </div>

            <div className="space-y-1 text-right">
              <span className="text-slate-500 font-medium">Journey Details:</span>
              <p className="text-sm font-bold text-slate-900 flex items-center justify-end gap-1.5">
                {modeIcon}
                <span>{booking.mode.toUpperCase()} ({booking.travelClass})</span>
              </p>
              <p className="text-slate-700 font-semibold">
                {booking.mode === 'train' ? (booking.trainName || booking.trainNumber || booking.travelNumber) : booking.travelNumber}
              </p>
              {booking.pnr && (
                <p className="text-emerald-700 font-mono font-bold text-xs">
                  PNR: {booking.pnr}
                </p>
              )}
            </div>
          </div>

          {/* Route Banner */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Boarding Point</span>
                <span className="font-bold text-slate-900 text-sm">{booking.fromStation}</span>
              </div>
            </div>

            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 block font-mono">➔ ➔ ➔</span>
              <span className="text-xs font-semibold text-emerald-700">{booking.doj}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Destination</span>
              <span className="font-bold text-slate-900 text-sm">{booking.toStation}</span>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <th className="py-2 px-3 text-left font-semibold">Description</th>
                  <th className="py-2 px-3 text-right font-semibold">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="py-2.5 px-3 text-slate-700 font-sans">Base Operator Ticket Fare</td>
                  <td className="py-2.5 px-3 text-right text-slate-900 font-bold">₹{booking.ticketAmount.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-slate-700 font-sans">Agency Service &amp; Reservation Fee</td>
                  <td className="py-2.5 px-3 text-right text-slate-900 font-bold">₹{booking.charge.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="py-2.5 px-3 text-slate-900 font-sans">Total Net Billed Amount</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 text-sm">₹{booking.netAmount.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-slate-700 font-sans">Amount Received from Customer</td>
                  <td className="py-2.5 px-3 text-right text-teal-700 font-bold">₹{booking.amountReceived.toLocaleString('en-IN')}</td>
                </tr>

                {/* Normal Booking Due row */}
                {!isCancelled && (
                  <tr className={booking.due > 0 ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-500'}>
                    <td className="py-2.5 px-3 font-sans">Balance Outstanding Due</td>
                    <td className="py-2.5 px-3 text-right">
                      {booking.due > 0 ? `₹${booking.due.toLocaleString('en-IN')}` : '₹0 (Cleared)'}
                    </td>
                  </tr>
                )}

                {/* Cancelled Booking Audit Rows */}
                {isCancelled && (
                  <>
                    <tr className="bg-rose-50 text-rose-800">
                      <td className="py-2 px-3 font-sans">Operator / IRCTC Cancellation Penalty</td>
                      <td className="py-2 px-3 text-right font-bold text-rose-700">
                        -₹{(cd?.operatorDeduction || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr className="bg-rose-50 text-rose-800">
                      <td className="py-2 px-3 font-sans">Agency Cancellation Processing Fee</td>
                      <td className="py-2 px-3 text-right font-bold text-rose-700">
                        -₹{(cd?.agencyCancellationFee || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr className="bg-emerald-50 text-emerald-900 font-bold text-sm border-t-2 border-emerald-300">
                      <td className="py-2.5 px-3 flex items-center gap-1.5 font-sans">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span>NET AMOUNT REFUNDED TO CUSTOMER</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-emerald-700 text-base">
                        ₹{(cd?.customerRefundAmount || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 text-slate-600 text-[11px]">
                      <td className="py-2 px-3 font-sans">Refund Status / Settlement Proof</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                        REFUNDED &amp; CLEARED (REF-{booking.billNo})
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Payment UPI Details (if due > 0 and not cancelled) */}
          {agency.upiId && booking.due > 0 && !isCancelled && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Clear Balance via UPI</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">{agency.upiId}</span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">Instant Payment</span>
            </div>
          )}

          {/* Footer note */}
          <div className="text-center pt-2 text-[11px] text-slate-500 border-t border-slate-200">
            {isCancelled 
              ? `This document certifies that a refund of ₹${(cd?.customerRefundAmount || 0).toLocaleString('en-IN')} was settled for ticket cancellation.`
              : `Thank you for choosing ${agency.name}. Please verify your identity proof and ticket copy before boarding.`
            }
          </div>
        </div>

        {/* Footer Actions (hidden in print) */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <span className="text-xs text-slate-600">
            Client: <strong className="text-slate-900 font-mono">+91 {booking.customerPhone}</strong>
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadSlip}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
              title="Download standalone voucher / PDF"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>{isCancelled ? 'Refund Proof' : 'PDF Bill'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-700" />
              <span>Print</span>
            </button>

            {/* Single Smart WhatsApp Button (Reuses active tab on PC, launches app on mobile) */}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(invoiceMessage).catch(() => {});
                openSmartWhatsApp(cleanPhone, invoiceMessage);
                setWaNotice('Opening WhatsApp! (Reuses active Web tab on PC, or opens App on mobile)');
                setTimeout(() => setWaNotice(null), 3500);
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all text-center ${
                isCancelled
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
              title="Share Invoice on WhatsApp (Reuses active tab on PC, opens App on mobile)"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>
                {isCancelled ? 'Send Refund on WhatsApp' : 'Share on WhatsApp'}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
