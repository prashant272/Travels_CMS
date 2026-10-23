/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  AlertCircle, 
  DollarSign, 
  Calendar, 
  RotateCcw,
  Plane, 
  Train, 
  Bus, 
  Filter
} from 'lucide-react';
import { BookingMode, DashboardMetrics as IDashboardMetrics, PeriodFilter } from '../types/crm';

interface DashboardMetricsProps {
  metrics: IDashboardMetrics;
  dateFilterBasis: 'doj' | 'bookingDate';
  setDateFilterBasis: (b: 'doj' | 'bookingDate') => void;
  period: PeriodFilter;
  setPeriod: (p: PeriodFilter) => void;
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
  selectedMode: 'all' | BookingMode;
  setSelectedMode: (m: 'all' | BookingMode) => void;
  activeQuickFilter: string | null;
  setActiveQuickFilter: (f: string | null) => void;
  privacyMask: boolean;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  metrics,
  dateFilterBasis,
  setDateFilterBasis,
  period,
  setPeriod,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedMode,
  setSelectedMode,
  activeQuickFilter,
  setActiveQuickFilter,
  privacyMask
}) => {
  const formatINR = (val: number) => {
    if (privacyMask) return '₹••••';
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  const periodOptions: { id: PeriodFilter; label: string }[] = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'last_month', label: 'Last Month' },
    { id: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="space-y-4">
      {/* Unified Ultra-Compact 1-Line Command Bar (Date Basis + Periods + Transport Modes) */}
      <div className="bg-white/92 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2 sm:p-2.5 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          
          {/* LEFT: Date Filter Basis & Periods in 1 Sleek Compact Line */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            
            {/* 1. Date Basis Switcher (DOJ vs Date of Booking) */}
            <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setDateFilterBasis('doj')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  dateFilterBasis === 'doj'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Filter by Journey Date (DOJ)"
              >
                📅 DOJ
              </button>
              <button
                type="button"
                onClick={() => setDateFilterBasis('bookingDate')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  dateFilterBasis === 'bookingDate'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Filter by Date of Booking (DOB)"
              >
                📝 Booking Date
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            {/* 2. Period Selection Pills */}
            <div className="inline-flex items-center gap-0.5 bg-slate-100/90 p-0.5 rounded-xl border border-slate-200 text-xs">
              {periodOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPeriod(opt.id)}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                    period === opt.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* 3. Inline Custom Range Pickers (Compact) */}
            {period === 'custom' && (
              <div className="flex items-center gap-1.5 bg-amber-50/70 px-2 py-0.5 rounded-xl border border-amber-300 text-xs shadow-2xs animate-fadeIn">
                <span className="text-[10px] font-black text-amber-900 uppercase">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-900 font-bold focus:outline-none cursor-pointer"
                />
                <span className="text-amber-500 font-bold">➔</span>
                <span className="text-[10px] font-black text-amber-900 uppercase">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-900 font-bold focus:outline-none cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* RIGHT: Transport Mode in 1 Single Sleek Line */}
          <div className="flex items-center gap-1.5 self-start lg:self-auto">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider hidden sm:inline mr-0.5">
              Mode:
            </span>

            <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setSelectedMode('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedMode === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode('train')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedMode === 'train'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <Train className="w-3.5 h-3.5" />
                <span>Trains 🚆</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode('flight')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedMode === 'flight'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-sky-700 hover:bg-sky-50'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Flights ✈️</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode('bus')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedMode === 'bus'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>Buses 🚌</span>
              </button>
            </div>

            {selectedMode !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedMode('all')}
                className="text-[11px] text-amber-700 hover:text-amber-900 font-extrabold px-1.5 py-1 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                title="Reset mode filter to All"
              >
                Reset
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 6 Clickable KPI Metric Cards (8-Hour Eye-Comfort Light Theme) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Total Bookings */}
        <button
          onClick={() => setActiveQuickFilter(activeQuickFilter === 'all' ? null : 'all')}
          className={`text-left p-3.5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.99] relative overflow-hidden cursor-pointer ${
            activeQuickFilter === 'all'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-sm'
              : 'bg-white/92 backdrop-blur-md border-slate-200/90 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Bookings</span>
            <Filter className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {metrics.totalBookings}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between font-semibold">
            <span>Filtered trips</span>
            {activeQuickFilter === 'all' && <span className="text-amber-600 font-black">Filtered</span>}
          </div>
        </button>

        {/* 2. Gross Billing Volume */}
        <div className="p-3.5 rounded-2xl border bg-white/92 backdrop-blur-md border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700">Gross Billed</span>
            <Wallet className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-sky-800">
            {formatINR(metrics.grossBilling)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-semibold">
            Total client invoice value
          </div>
        </div>

        {/* 3. Total Received / Collected */}
        <button
          onClick={() => setActiveQuickFilter(activeQuickFilter === 'paid' ? null : 'paid')}
          className={`text-left p-3.5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.99] relative overflow-hidden cursor-pointer ${
            activeQuickFilter === 'paid'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 shadow-sm'
              : 'bg-white/92 backdrop-blur-md border-slate-200/90 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">Collected</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-700">
            {formatINR(metrics.totalCollected)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between font-semibold">
            <span>Cash &amp; UPI in hand</span>
            {activeQuickFilter === 'paid' && <span className="text-emerald-700 font-black">Filtered</span>}
          </div>
        </button>

        {/* 4. Pending Due Balance */}
        <button
          onClick={() => setActiveQuickFilter(activeQuickFilter === 'due' ? null : 'due')}
          className={`text-left p-3.5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.99] relative overflow-hidden cursor-pointer ${
            activeQuickFilter === 'due'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-sm'
              : metrics.pendingDue > 0
              ? 'bg-white/92 backdrop-blur-md border-amber-300 hover:border-amber-400 shadow-xs'
              : 'bg-white/92 backdrop-blur-md border-slate-200/90 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">Pending Due</span>
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-amber-800">
            {formatINR(metrics.pendingDue)}
          </div>
          <div className="text-[10px] text-amber-700 mt-1 flex items-center justify-between font-bold">
            <span>{metrics.dueCustomersCount} client(s) due</span>
            {activeQuickFilter === 'due' ? <span className="text-amber-800 font-black">Filtered</span> : <span className="underline">View</span>}
          </div>
        </button>

        {/* 5. Agency Net Profit Margin */}
        <div className="p-3.5 rounded-2xl border bg-white/92 backdrop-blur-md border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">Net Profit</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-700">
            {formatINR(metrics.totalProfit)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-semibold">
            Earned service margins
          </div>
        </div>

        {/* 6. Total Refunds & Cancellations */}
        <button
          onClick={() => setActiveQuickFilter(activeQuickFilter === 'cancelled' ? null : 'cancelled')}
          className={`text-left p-3.5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.99] relative overflow-hidden cursor-pointer ${
            activeQuickFilter === 'cancelled'
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300 shadow-sm'
              : 'bg-white/92 backdrop-blur-md border-slate-200/90 hover:border-rose-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700">Refunds &amp; Loss</span>
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-rose-700">
            {formatINR(metrics.totalRefunds)}
          </div>
          <div className="text-[10px] mt-1 flex flex-col gap-0.5 font-semibold">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{metrics.cancelledCount} cancelled</span>
              {activeQuickFilter === 'cancelled' && <span className="text-rose-700 font-black">Filtered</span>}
            </div>
            {metrics.cancellationLoss > 0 && (
              <span className="font-extrabold text-rose-800 text-[10px] bg-rose-50 px-1 py-0.5 rounded border border-rose-200">
                Loss: -₹{metrics.cancellationLoss.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
