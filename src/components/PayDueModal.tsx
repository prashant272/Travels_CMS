/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle2, DollarSign, Wallet, MessageSquare } from 'lucide-react';
import { Booking, AgencyProfile, WhatsAppConfig } from '../types/crm';
import { sendWhatsAppMessage } from '../services/whatsappService';

interface PayDueModalProps {
  booking: Booking | null;
  agency: AgencyProfile;
  waConfig: WhatsAppConfig;
  isOpen: boolean;
  onClose: () => void;
  onPaymentRecorded: (bookingId: string, paidAmount: number) => void;
}

export const PayDueModal: React.FC<PayDueModalProps> = ({
  booking,
  agency,
  waConfig,
  isOpen,
  onClose,
  onPaymentRecorded
}) => {
  const [paymentAmount, setPaymentAmount] = useState<string>(booking?.due ? String(booking.due) : '');
  const [shareReceipt, setShareReceipt] = useState(true);

  if (!isOpen || !booking) return null;

  const numPayment = Math.min(booking.due, parseFloat(paymentAmount) || 0);
  const remainingAfterPayment = Math.max(0, booking.due - numPayment);

  const handleConfirm = async () => {
    if (numPayment <= 0) return;

    onPaymentRecorded(booking.id, numPayment);

    if (shareReceipt) {
      const receiptMsg = `✅ *PAYMENT RECEIVED RECEIPT | ${agency.name.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━━━━
Dear *${booking.customerName}*,

We have successfully received your payment:

*Bill No:* ${booking.billNo}
*Amount Received:* ₹${numPayment.toLocaleString('en-IN')}
*Total Bill:* ₹${booking.netAmount.toLocaleString('en-IN')}
*Remaining Due:* ₹${remainingAfterPayment.toLocaleString('en-IN')}
*Payment Status:* ${remainingAfterPayment === 0 ? '✅ FULLY PAID & SETTLED' : 'PARTIALLY PAID'}

Thank you for your business!
📞 ${agency.phone}`;
      await sendWhatsAppMessage(booking.customerPhone, receiptMsg, waConfig);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-auto text-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-teal-100 bg-teal-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100 border border-teal-300 text-teal-700 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Record Due Payment</h2>
              <p className="text-xs text-slate-500">Bill: <span className="font-mono font-semibold text-emerald-600">{booking.billNo}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-semibold text-slate-900">{booking.customerName} (+91 {booking.customerPhone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Billed:</span>
              <span className="font-mono text-slate-900">₹{booking.netAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Previously Paid:</span>
              <span className="font-mono text-teal-700 font-bold">₹{booking.amountReceived.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1">
              <span className="text-amber-700 font-bold">Current Pending Due:</span>
              <span className="font-mono font-bold text-amber-800 text-sm">₹{booking.due.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Payment Amount Received Now (₹)</span>
              <button
                type="button"
                onClick={() => setPaymentAmount(String(booking.due))}
                className="text-[11px] text-teal-700 hover:underline font-bold"
              >
                Pay Full (₹{booking.due})
              </button>
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter amount (₹)"
              value={paymentAmount}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '');
                if (!digits) {
                  setPaymentAmount('');
                  return;
                }
                const clean = digits.replace(/^0+(?=\d)/, '');
                setPaymentAmount(clean);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-base text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Balance after payment preview */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600">Remaining Balance after this payment:</span>
            <span className={`font-mono font-bold ${remainingAfterPayment === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
              ₹{remainingAfterPayment.toLocaleString('en-IN')}
            </span>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1 font-medium">
            <input
              type="checkbox"
              checked={shareReceipt}
              onChange={(e) => setShareReceipt(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-0"
            />
            <span>Send payment receipt to customer on WhatsApp</span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Payment of ₹{numPayment.toLocaleString('en-IN')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
