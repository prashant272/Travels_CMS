/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useDeferredValue, useEffect } from 'react';
import { 
  Train, 
  Plane, 
  Bus, 
  Search, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { Booking } from '../types/crm';

interface BookingsTableProps {
  bookings: Booking[];
  onOpenInvoice: (b: Booking) => void;
  privacyMask: boolean;
}

export const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  onOpenInvoice,
  privacyMask
}) => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'due' | 'cancelled'>('all');
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset to first page when search query or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearch, statusFilter, pageSize]);

  // Filter logic with zero UI blocking
  const filteredBookings = bookings.filter((b) => {
    // Status filter
    if (statusFilter === 'paid' && (b.due > 0 || b.status === 'cancelled')) return false;
    if (statusFilter === 'due' && (b.due <= 0 || b.status === 'cancelled')) return false;
    if (statusFilter === 'cancelled' && b.status !== 'cancelled') return false;

    // Search query
    if (!deferredSearch.trim()) return true;
    const q = deferredSearch.toLowerCase();
    return (
      b.customerName.toLowerCase().includes(q) ||
      b.customerPhone.includes(q) ||
      b.billNo.toLowerCase().includes(q) ||
      (b.pnr && b.pnr.toLowerCase().includes(q)) ||
      b.fromStation.toLowerCase().includes(q) ||
      b.toStation.toLowerCase().includes(q) ||
      (b.trainNumber && b.trainNumber.includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + pageSize);

  const formatINR = (val: number) => {
    if (privacyMask) return '₹••••';
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  const maskPhone = (phone: string) => {
    if (!privacyMask) return `+91 ${phone}`;
    if (phone.length === 10) {
      return `+91 ${phone.slice(0, 2)}••••••${phone.slice(-2)}`;
    }
    return '+91 ••••••••••';
  };

  return (
    <div className="bg-white/92 backdrop-blur-md border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden">
      
      {/* Table Controls Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-black text-slate-900 text-sm sm:text-base">
            Recent Travel Bookings
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-700 font-mono text-xs font-bold border border-slate-200 shadow-2xs">
            {filteredBookings.length} Record(s)
          </span>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Quick status tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('due')}
              className={`px-3 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                statusFilter === 'due' ? 'bg-amber-500 text-slate-950 shadow-2xs' : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              Dues Only
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                statusFilter === 'paid' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Settled
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-3 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                statusFilter === 'cancelled' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              Cancelled
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search name, phone, PNR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-60 bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-black border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Bill #</th>
              <th className="py-3 px-3">Mode</th>
              <th className="py-3 px-3">Dates (DOJ)</th>
              <th className="py-3 px-4">Route &amp; Class</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-3 text-right">Ticket Fare</th>
              <th className="py-3 px-3 text-right">Fee</th>
              <th className="py-3 px-3 text-right">Net Billed</th>
              <th className="py-3 px-3 text-right">Paid</th>
              <th className="py-3 px-3 text-right">Due</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {paginatedBookings.length > 0 ? (
              paginatedBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Bill No */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {b.billNo}
                  </td>

                  {/* Mode */}
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      b.mode === 'train' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : b.mode === 'flight' ? 'bg-sky-50 text-sky-800 border border-sky-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {b.mode === 'train' ? <Train className="w-3 h-3 text-emerald-600" />
                        : b.mode === 'flight' ? <Plane className="w-3 h-3 text-sky-600" />
                        : <Bus className="w-3 h-3 text-amber-600" />}
                      <span>{b.mode}</span>
                    </span>
                  </td>

                  {/* Dates */}
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-slate-900">{b.doj}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Booked: {b.bookingDate}</div>
                  </td>

                  {/* Route & Class */}
                  <td className="py-3 px-4 max-w-[200px]">
                    <div className="font-bold text-slate-900 truncate">
                      {b.fromStation} ➔ {b.toStation}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5 truncate">
                      <span className="font-bold text-amber-600">{b.travelClass}</span>
                      {b.pnr && <span className="font-mono text-slate-700 font-semibold">PNR: {b.pnr}</span>}
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{b.customerName}</div>
                    <div className="text-[10px] font-mono text-slate-500 font-medium">{maskPhone(b.customerPhone)}</div>
                  </td>

                  {/* Financials */}
                  <td className="py-3 px-3 text-right font-mono text-slate-700">
                    ₹{b.ticketAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-amber-700 font-bold">
                    {formatINR(b.charge)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-slate-900">
                    ₹{b.netAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-700 font-bold">
                    ₹{b.amountReceived.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    {b.status === 'cancelled' ? (
                      <span className="text-rose-700 text-xs font-bold block" title="Customer Refund Handed Over">
                        Ref: ₹{(b.cancellationDetails?.customerRefundAmount || 0).toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className={b.due > 0 ? 'text-amber-700 font-black' : 'text-slate-400'}>
                        {formatINR(b.due)}
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 text-center">
                    {b.status === 'cancelled' ? (
                      b.cancellationDetails && b.cancellationDetails.agentFinalProfit < 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300 text-[10px] font-bold inline-flex items-center gap-1">
                          <span>LOSS: -₹{Math.abs(b.cancellationDetails.agentFinalProfit).toLocaleString('en-IN')}</span>
                        </span>
                      ) : b.cancellationDetails && b.cancellationDetails.agentFinalProfit > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                          PROFIT: +₹{b.cancellationDetails.agentFinalProfit.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300 text-[10px] font-bold">
                          CANCELLED
                        </span>
                      )
                    ) : b.due <= 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                        PAID
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold">
                        DUE
                      </span>
                    )}
                  </td>

                  {/* Action Buttons: View Bill / Refund Slip (NO DELETE OPTION) */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenInvoice(b)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          b.status === 'cancelled'
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                        }`}
                        title={b.status === 'cancelled' ? 'View & Share Official Refund Proof' : 'View & Share Invoice Slip'}
                      >
                        {b.status === 'cancelled' ? 'Refund Slip' : 'Bill'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="py-12 text-center text-slate-400 text-xs">
                  No bookings found matching current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Optimized for smartphones - 8-Hour Eye-Comfort Light) */}
      <div className="lg:hidden divide-y divide-slate-100">
        {paginatedBookings.length > 0 ? (
          paginatedBookings.map((b) => (
            <div key={b.id} className="p-4 space-y-3 bg-white">
              {/* Top Row: Bill No, Mode, Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {b.billNo}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    b.mode === 'train' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : b.mode === 'flight' ? 'bg-sky-50 text-sky-800 border border-sky-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {b.mode}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  b.status === 'cancelled'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : b.due <= 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {b.status === 'cancelled' 
                    ? b.cancellationDetails && b.cancellationDetails.agentFinalProfit < 0
                      ? `LOSS: -₹${Math.abs(b.cancellationDetails.agentFinalProfit).toLocaleString('en-IN')}`
                      : 'CANCELLED' 
                    : b.due <= 0 ? 'PAID' : `DUE: ${formatINR(b.due)}`}
                </span>
              </div>

              {/* Route & Customer */}
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {b.fromStation} ➔ {b.toStation}
                </div>
                <div className="text-xs text-slate-600 flex items-center justify-between mt-0.5">
                  <span>{b.customerName} ({maskPhone(b.customerPhone)})</span>
                  <span className="text-amber-700 font-bold">{b.travelClass}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>DOJ: {b.doj}</span>
                  {b.pnr && <span>• PNR: {b.pnr}</span>}
                </div>
              </div>

              {/* Financials Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Total</span>
                  <span className="font-bold text-slate-900">₹{b.netAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Paid</span>
                  <span className="font-bold text-emerald-700">₹{b.amountReceived.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">
                    {b.status === 'cancelled' ? 'Refunded' : 'Due'}
                  </span>
                  <span className={`font-bold ${
                    b.status === 'cancelled' 
                      ? 'text-rose-700' 
                      : b.due > 0 
                      ? 'text-amber-700 font-black' 
                      : 'text-slate-400'
                  }`}>
                    {b.status === 'cancelled' 
                      ? `₹${(b.cancellationDetails?.customerRefundAmount || 0).toLocaleString('en-IN')}` 
                      : formatINR(b.due)}
                  </span>
                </div>
              </div>

              {/* Mobile Actions Bar: View Bill / Refund (NO DELETE BUTTON) */}
              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={() => onOpenInvoice(b)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all ${
                    b.status === 'cancelled'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  {b.status === 'cancelled' ? 'View Official Refund Slip' : 'View Bill & Invoice'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            No bookings found matching current filters.
          </div>
        )}
      </div>

      {/* Pagination Controls Bar - Instant Response for 100,000 Data Entries */}
      <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-slate-600 font-medium">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredBookings.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
            <strong className="text-slate-900 font-bold">{Math.min(startIndex + pageSize, filteredBookings.length)}</strong> of{' '}
            <strong className="text-slate-900 font-bold">{filteredBookings.length.toLocaleString('en-IN')}</strong> records
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
  );
};
