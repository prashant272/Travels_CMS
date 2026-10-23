/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  RotateCcw, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { Booking, CancellationDetails } from '../types/crm';

interface CancelBillModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancellation: (bookingId: string, details: CancellationDetails) => void;
}

export const CancelBillModal: React.FC<CancelBillModalProps> = ({
  booking,
  isOpen,
  onClose,
  onConfirmCancellation
}) => {
  const initialDeduction = '150';
  const initialAgencyFee = '100';
  const calculatedRefund = Math.max(0, ((booking?.amountReceived || 0) - 150 - 100));

  const [operatorDeduction, setOperatorDeduction] = useState<string>(initialDeduction);
  const [agencyCancellationFee, setAgencyCancellationFee] = useState<string>(initialAgencyFee);
  const [customerRefundAmount, setCustomerRefundAmount] = useState<string>(String(calculatedRefund));
  const [reason, setReason] = useState<string>('Client requested ticket cancellation');

  if (!isOpen || !booking) return null;

  const numDeduction = parseFloat(operatorDeduction) || 0;
  const numAgencyFee = parseFloat(agencyCancellationFee) || 0;
  const numRefund = parseFloat(customerRefundAmount) || 0;

  // Exact Agent Realized Net Profit / Loss:
  const agentFinalProfit = (booking.amountReceived || 0) - numRefund - numDeduction;

  const handleNumericInput = (val: string, setter: (v: string) => void) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) {
      setter('');
      return;
    }
    const clean = digits.replace(/^0+(?=\d)/, '');
    setter(clean);
  };

  const handleDeductionChange = (valStr: string) => {
    handleNumericInput(valStr, setOperatorDeduction);
    const d = parseFloat(valStr) || 0;
    const newRef = Math.max(0, (booking.amountReceived || 0) - d - numAgencyFee);
    setCustomerRefundAmount(String(newRef));
  };

  const handleAgencyFeeChange = (valStr: string) => {
    handleNumericInput(valStr, setAgencyCancellationFee);
    const f = parseFloat(valStr) || 0;
    const newRef = Math.max(0, (booking.amountReceived || 0) - numDeduction - f);
    setCustomerRefundAmount(String(newRef));
  };

  const handleConfirm = () => {
    const details: CancellationDetails = {
      cancelledAt: new Date().toISOString(),
      operatorDeduction: numDeduction,
      agencyCancellationFee: numAgencyFee,
      customerRefundAmount: numRefund,
      agentFinalProfit,
      reason
    };

    onConfirmCancellation(booking.id, details);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto text-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-100 bg-rose-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-300 text-rose-600 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Ticket Cancellation &amp; Refund Settlement
              </h2>
              <p className="text-xs text-rose-700 font-medium">
                Bill No: <span className="font-mono font-bold text-slate-900">{booking.billNo}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Summary Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-semibold text-slate-900">{booking.customerName} (+91 {booking.customerPhone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trip / Route:</span>
              <span className="text-slate-800">{booking.fromStation} ➔ {booking.toStation} ({booking.doj})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Original Ticket Cost:</span>
              <span className="font-mono text-slate-700">₹{booking.ticketAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1">
              <span className="text-slate-500">Customer Advance Received:</span>
              <span className="font-mono font-bold text-emerald-700">₹{booking.amountReceived.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Refund & Deduction Calculation Form */}
          <div className="space-y-4">
            {/* Operator / IRCTC Deduction */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>1. Operator / IRCTC Cancellation Deduction (₹)</span>
                <span className="text-[10px] text-slate-500">What Railway/Operator deducted</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Deduction amount"
                value={operatorDeduction}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleDeductionChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-rose-500 font-bold"
              />
            </div>

            {/* Agency Cancellation Fee */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>2. Agency Cancellation Service Fee (₹)</span>
                <span className="text-[10px] text-emerald-700 font-bold">Your retained fee for processing</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Agency fee"
                value={agencyCancellationFee}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleAgencyFeeChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>

            {/* Refund to Customer */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>3. Actual Refund Handed to Customer (₹)</span>
                <span className="text-[10px] text-amber-700 font-bold">Cash / UPI paid back to client</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Customer refund amount"
                value={customerRefundAmount}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleNumericInput(e.target.value, setCustomerRefundAmount)}
                className="w-full bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-sm text-amber-900 font-bold font-mono focus:bg-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Suggested formula: Advance (₹{booking.amountReceived}) - Deduction (₹{operatorDeduction}) - Agency Fee (₹{agencyCancellationFee}) = ₹{Math.max(0, (booking.amountReceived || 0) - numDeduction - numAgencyFee)}
              </p>
            </div>

            {/* Reason / Remarks */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cancellation Reason / Note
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Passenger plan changed / Waitlist not cleared"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-500"
              />
            </div>

            {/* Real-Time Agent Profit or Loss Outcome */}
            <div className={`p-4 rounded-2xl border ${
              agentFinalProfit >= 0 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  {agentFinalProfit >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-rose-600" />}
                  <span>{agentFinalProfit >= 0 ? 'Agent Final Profit Outcome:' : '⚠️ AGENT DEFICIT / LOSS:'}</span>
                </span>
                <span className={`text-lg font-black font-mono ${
                  agentFinalProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {agentFinalProfit >= 0 ? `+₹${agentFinalProfit.toLocaleString('en-IN')}` : `LOSS: -₹${Math.abs(agentFinalProfit).toLocaleString('en-IN')}`}
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed ${agentFinalProfit >= 0 ? 'text-slate-600' : 'text-rose-700'}`}>
                {agentFinalProfit >= 0 
                  ? `You retained a net profit of ₹${agentFinalProfit.toLocaleString('en-IN')} on this cancellation.`
                  : `You incurred an out-of-pocket loss of ₹${Math.abs(agentFinalProfit).toLocaleString('en-IN')}. This deficit will be highlighted in red across your dashboard and booking manage.`}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Cancellation &amp; Settle Refund</span>
          </button>
        </div>

      </div>
    </div>
  );
};
