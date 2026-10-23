/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle2, Edit3, Calendar, User, Phone, DollarSign } from 'lucide-react';
import { Booking } from '../types/crm';

interface BookingEditModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveModified: (updated: Booking) => void;
}

export const BookingEditModal: React.FC<BookingEditModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSaveModified
}) => {
  const [mode, setMode] = useState<Booking['mode']>(booking?.mode || 'train');
  const [travelNumber, setTravelNumber] = useState(booking?.travelNumber || '');
  const [bookingDate, setBookingDate] = useState(booking?.bookingDate || '');
  const [doj, setDoj] = useState(booking?.doj || '');
  const [pnr, setPnr] = useState(booking?.pnr || '');
  const [customerName, setCustomerName] = useState(booking?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(booking?.customerPhone || '');
  const [passengerDetails, setPassengerDetails] = useState(booking?.passengerDetails || '');
  const [remarks, setRemarks] = useState(booking?.remarks || '');
  const [fromStation, setFromStation] = useState(booking?.fromStation || '');
  const [toStation, setToStation] = useState(booking?.toStation || '');
  const [travelClass, setTravelClass] = useState(booking?.travelClass || '');

  const [ticketAmount, setTicketAmount] = useState<string>(booking?.ticketAmount ? String(booking.ticketAmount) : '');
  const [charge, setCharge] = useState<string>(booking?.charge !== undefined ? String(booking.charge) : '');
  const [amountReceived, setAmountReceived] = useState<string>(booking?.amountReceived !== undefined ? String(booking.amountReceived) : '');

  const handleNumericChange = (val: string, setter: (v: string) => void) => {
    const digitsOnly = val.replace(/\D/g, '');
    if (!digitsOnly) {
      setter('');
      return;
    }
    const clean = digitsOnly.replace(/^0+(?=\d)/, '');
    setter(clean);
  };

  if (!isOpen || !booking) return null;

  const numTicketAmount = parseFloat(ticketAmount) || 0;
  const numCharge = parseFloat(charge) || 0;
  const numReceived = parseFloat(amountReceived) || 0;

  const netAmount = numTicketAmount + numCharge;
  const due = Math.max(0, netAmount - numReceived);
  const profit = numCharge;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    let paymentStatus: Booking['paymentStatus'] = 'unpaid';
    if (due <= 0) paymentStatus = 'paid';
    else if (numReceived > 0) paymentStatus = 'partial';

    const updated: Booking = {
      ...booking,
      mode,
      travelNumber: travelNumber.trim(),
      bookingDate,
      doj,
      pnr: pnr.trim(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.replace(/\D/g, '').slice(0, 10),
      passengerDetails: passengerDetails.trim(),
      remarks: remarks.trim(),
      fromStation: fromStation.trim(),
      toStation: toStation.trim(),
      travelClass,
      ticketAmount: numTicketAmount,
      charge: numCharge,
      netAmount,
      customerAmount: netAmount,
      amountReceived: numReceived,
      profit,
      due,
      paymentStatus,
      updatedAt: new Date().toISOString()
    };

    onSaveModified(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto text-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Modify Booking Details</h2>
              <p className="text-xs text-slate-500">Bill: <span className="font-mono font-semibold text-emerald-600">{booking.billNo}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          
          {/* Mode Selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Mode of Transport</label>
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setMode('train')}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  mode === 'train' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                IRCTC Train
              </button>
              <button
                type="button"
                onClick={() => setMode('flight')}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  mode === 'flight' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flight
              </button>
              <button
                type="button"
                onClick={() => setMode('bus')}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  mode === 'bus' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Intercity Bus
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {mode === 'train' ? 'Train Number / Train Name' : mode === 'flight' ? 'Flight Number / Airline' : 'Bus Operator / Bus Name'}
            </label>
            <input
              type="text"
              value={travelNumber}
              onChange={(e) => setTravelNumber(e.target.value)}
              placeholder="e.g. 12393 - Sampoorna Kranti / Indigo 6E-204 / Zingbus AC"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>📅 Booking Date</span>
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-slate-50 hover:bg-white border-2 border-emerald-300 hover:border-emerald-500 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold cursor-pointer"
                required
                title="Select booking date from calendar"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>📅 Journey Date (DOJ) *</span>
              </label>
              <input
                type="date"
                value={doj}
                onChange={(e) => setDoj(e.target.value)}
                className="w-full bg-amber-50/40 hover:bg-white border-2 border-amber-400 hover:border-amber-500 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold cursor-pointer"
                required
                title="Select journey date from calendar"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">PNR Number</label>
              <input
                type="text"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Customer Phone</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">From Point</label>
              <input
                type="text"
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">To Destination</label>
              <input
                type="text"
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Class</label>
              <input
                type="text"
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Passenger Details</label>
              <input
                type="text"
                value={passengerDetails}
                onChange={(e) => setPassengerDetails(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Financials */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Ticket Fare (₹)</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Fare amount"
                value={ticketAmount}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleNumericChange(e.target.value, setTicketAmount)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Charge / Fee (₹)</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Fee amount"
                value={charge}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleNumericChange(e.target.value, setCharge)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Received (₹)</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Received amount"
                value={amountReceived}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleNumericChange(e.target.value, setAmountReceived)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="flex items-center justify-between font-mono text-xs text-slate-600 pt-1 font-semibold">
            <span>Net: <strong className="text-slate-900">₹{netAmount.toLocaleString('en-IN')}</strong></span>
            <span>Profit: <strong className="text-teal-700">₹{profit.toLocaleString('en-IN')}</strong></span>
            <span>Due: <strong className={due > 0 ? 'text-amber-700' : 'text-slate-500'}>₹{due.toLocaleString('en-IN')}</strong></span>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
