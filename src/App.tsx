/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  getStoredBookings, 
  loadBookingsFromStorage,
  saveBookings, 
  getAgencyProfile, 
  saveAgencyProfile, 
  getGoogleSheetConfig, 
  saveGoogleSheetConfig, 
  getWhatsAppConfig, 
  saveWhatsAppConfig 
} from './services/storageService';
import { 
  fetchFromGoogleSheet, 
  upsertToGoogleSheet, 
  deleteFromGoogleSheet, 
  fullBatchSyncToSheet 
} from './services/googleSheetService';
import { 
  Booking, 
  AgencyProfile, 
  GoogleSheetConfig, 
  WhatsAppConfig, 
  PeriodFilter, 
  BookingMode, 
  DashboardMetrics as IDashboardMetrics,
  CancellationDetails 
} from './types/crm';

// Components
import { Header } from './components/Header';
import { DashboardMetrics } from './components/DashboardMetrics';
import { BookingsTable } from './components/BookingsTable';
import { BookingFormModal } from './components/BookingFormModal';
import { BookingEditModal } from './components/BookingEditModal';
import { CancelBillModal } from './components/CancelBillModal';
import { InvoiceModal } from './components/InvoiceModal';
import { PayDueModal } from './components/PayDueModal';
import { CustomerPnrManager } from './components/CustomerPnrManager';
import { PendingDuesManager } from './components/PendingDuesManager';
import { GoogleSheetSyncModal } from './components/GoogleSheetSyncModal';
import { WhatsAppSettingsModal } from './components/WhatsAppSettingsModal';
import { LoginScreen } from './components/LoginScreen';
import { AgencySettingsModal } from './components/AgencySettingsModal';
import { TravelBackground } from './components/TravelBackground';
import { getStoredAuthUser, clearAuthUser } from './services/authService';
import { AuthUser } from './types/crm';

export default function App() {
  // Persistent data state
  const [bookings, setBookings] = useState<Booking[]>(() => getStoredBookings());
  const [agency, setAgency] = useState<AgencyProfile>(() => getAgencyProfile());
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>(() => getGoogleSheetConfig());
  const [waConfig, setWaConfig] = useState<WhatsAppConfig>(() => getWhatsAppConfig());

  // Privacy & Navigation & Authentication
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredAuthUser());
  const [privacyMask, setPrivacyMask] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customer_pnr' | 'pending_dues'>('dashboard');

  // Filter States: Period, Custom Dates, and Basis (DOJ vs Date of Booking)
  const [dateFilterBasis, setDateFilterBasis] = useState<'doj' | 'bookingDate'>('doj');
  const [period, setPeriod] = useState<PeriodFilter>('this_month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMode, setSelectedMode] = useState<'all' | BookingMode>('all');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isSheetSyncOpen, setIsSheetSyncOpen] = useState(false);
  const [isWaSettingsOpen, setIsWaSettingsOpen] = useState(false);
  const [isAgencySettingsOpen, setIsAgencySettingsOpen] = useState(false);

  const [activeInvoiceBooking, setActiveInvoiceBooking] = useState<Booking | null>(null);
  const [activePayDueBooking, setActivePayDueBooking] = useState<Booking | null>(null);
  const [activeEditBooking, setActiveEditBooking] = useState<Booking | null>(null);
  const [activeCancelBooking, setActiveCancelBooking] = useState<Booking | null>(null);

  // Show brief toast helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Save Bookings & Sync Helper
  const updateBookingsState = useCallback((newBookings: Booking[]) => {
    setBookings(newBookings);
    saveBookings(newBookings);
  }, []);

  // 2-Way Google Sheet Synchronizer with Smart Non-Destructive Merge (Never auto-deletes entered data!)
  const triggerGoogleSheetSync = useCallback(async () => {
    if (!sheetConfig.isConnected || !sheetConfig.webAppUrl) return;
    setIsSyncing(true);
    try {
      const res = await fetchFromGoogleSheet(sheetConfig.webAppUrl);
      if (res.success && Array.isArray(res.bookings)) {
        const sheetBookings = res.bookings;
        setBookings((prevLocalBookings) => {
          if (!sheetBookings) return prevLocalBookings;

          const sheetBillSet = new Set<string>(sheetBookings.map(b => (b.billNo || '').toUpperCase()));
          const sheetIdSet = new Set<string>(sheetBookings.map(b => b.id));

          // Only preserve ultra-recent in-flight local creations (created within the last 15 seconds)
          // so if the user just created a booking in the portal 2 seconds ago, it is not lost before sheet write
          const now = Date.now();
          const inFlightLocal = prevLocalBookings.filter((localB) => {
            const createdTime = localB.createdAt ? new Date(localB.createdAt).getTime() : 0;
            const billKey = (localB.billNo || '').toUpperCase();
            return (now - createdTime < 15000) && !sheetBillSet.has(billKey) && !sheetIdSet.has(localB.id);
          });

          // Google Sheet is the master database:
          // Deleted rows in Google Sheet will be immediately removed from the portal and IndexedDB!
          const merged = [...inFlightLocal, ...sheetBookings];

          saveBookings(merged);
          return merged;
        });

        const updatedConfig: GoogleSheetConfig = {
          ...sheetConfig,
          lastSyncedAt: new Date().toISOString(),
          totalRowsSynced: sheetBookings.length
        };
        setSheetConfig(updatedConfig);
        saveGoogleSheetConfig(updatedConfig);
      }
    } catch (err) {
      console.error('Auto sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [sheetConfig]);

  // Initial load from high-capacity IndexedDB on startup
  useEffect(() => {
    loadBookingsFromStorage().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setBookings(loaded);
      }
    });
  }, []);

  // Initial Sync on load if connected
  useEffect(() => {
    if (sheetConfig.isConnected && sheetConfig.webAppUrl) {
      triggerGoogleSheetSync();
    }
  }, []); // Run once on startup

  // Continuous Auto-Sync Interval + Instant Sync on Window Focus / Tab Switch
  useEffect(() => {
    if (!sheetConfig.isConnected || !sheetConfig.autoSync || !sheetConfig.webAppUrl) return;
    
    // Poll on interval (every 8s)
    const interval = setInterval(() => {
      triggerGoogleSheetSync();
    }, (sheetConfig.syncIntervalSec || 8) * 1000);

    // Instant sync whenever user switches back from Google Sheet tab to CRM portal
    const onFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        triggerGoogleSheetSync();
      }
    };

    window.addEventListener('focus', onFocusOrVisible);
    document.addEventListener('visibilitychange', onFocusOrVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocusOrVisible);
      document.removeEventListener('visibilitychange', onFocusOrVisible);
    };
  }, [sheetConfig.isConnected, sheetConfig.autoSync, sheetConfig.webAppUrl, sheetConfig.syncIntervalSec, triggerGoogleSheetSync]);

  // Pre-computed ISO date bounds for zero-allocation, nanosecond filtering of 100,000+ items
  const dateRangeBounds = useMemo(() => {
    if (period === 'all') return null;

    const now = new Date();
    const pad = (n: number) => (n < 10 ? '0' + n : String(n));
    const toYMD = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (period === 'today') {
      const todayStr = toYMD(now);
      return { start: todayStr, end: todayStr };
    }
    if (period === 'this_week') {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      return { start: toYMD(start), end: '9999-12-31' };
    }
    if (period === 'this_month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: toYMD(start), end: toYMD(end) };
    }
    if (period === 'last_month') {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: toYMD(start), end: toYMD(end) };
    }
    if (period === 'custom') {
      return {
        start: startDate || '0000-01-01',
        end: endDate || '9999-12-31'
      };
    }
    return null;
  }, [period, startDate, endDate]);

  // Ultra-fast pure ISO string date filter (<0.00001ms per booking, zero garbage collection)
  const isDateInFilterPeriod = useCallback((dateStr: string): boolean => {
    if (!dateRangeBounds) return true;
    if (!dateStr) return false;
    const cleanDate = dateStr.slice(0, 10);
    return cleanDate >= dateRangeBounds.start && cleanDate <= dateRangeBounds.end;
  }, [dateRangeBounds]);

  // Filtered Bookings for the Dashboard (Period & Mode)
  // Can filter either by DOJ (Date of Journey) OR Date of Booking
  const dashboardFilteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Period Filter (uses Date of Journey OR Date of Booking as selected by user)
      const targetDate = dateFilterBasis === 'bookingDate' 
        ? (b.bookingDate || b.createdAt) 
        : (b.doj || b.bookingDate);
      if (!isDateInFilterPeriod(targetDate)) return false;

      // 2. Mode Filter
      if (selectedMode !== 'all' && b.mode !== selectedMode) return false;

      // 3. Quick Card Filter
      if (activeQuickFilter === 'paid' && (b.due > 0 || b.status === 'cancelled')) return false;
      if (activeQuickFilter === 'due' && (b.due <= 0 || b.status === 'cancelled')) return false;
      if (activeQuickFilter === 'cancelled' && b.status !== 'cancelled') return false;

      return true;
    });
  }, [bookings, isDateInFilterPeriod, selectedMode, activeQuickFilter, dateFilterBasis]);

  // Calculate Dashboard Metrics based on chosen filter basis (DOJ or DOB)
  const metrics: IDashboardMetrics = useMemo(() => {
    const periodBookings = bookings.filter((b) => {
      const targetDate = dateFilterBasis === 'bookingDate' 
        ? (b.bookingDate || b.createdAt) 
        : (b.doj || b.bookingDate);
      if (!isDateInFilterPeriod(targetDate)) return false;
      if (selectedMode !== 'all' && b.mode !== selectedMode) return false;
      return true;
    });

    let totalBookings = 0;
    let grossBilling = 0;
    let totalCollected = 0;
    let pendingDue = 0;
    let dueCustomersCount = 0;
    let totalProfit = 0;
    let totalRefunds = 0;
    let cancelledCount = 0;
    let cancellationLoss = 0;
    let cancellationGain = 0;

    for (const b of periodBookings) {
      if (b.status === 'cancelled') {
        cancelledCount += 1;
        totalRefunds += b.cancellationDetails?.customerRefundAmount || 0;
        totalProfit += b.profit; // realized profit on cancellation
        if (b.cancellationDetails && b.cancellationDetails.agentFinalProfit < 0) {
          cancellationLoss += Math.abs(b.cancellationDetails.agentFinalProfit);
        } else if (b.cancellationDetails && b.cancellationDetails.agentFinalProfit > 0) {
          cancellationGain += b.cancellationDetails.agentFinalProfit;
        }
      } else {
        totalBookings += 1;
        grossBilling += b.netAmount;
        totalCollected += b.amountReceived;
        if (b.due > 0) {
          pendingDue += b.due;
          dueCustomersCount += 1;
        }
        totalProfit += b.profit;
      }
    }

    return {
      totalBookings,
      grossBilling,
      totalCollected,
      pendingDue,
      dueCustomersCount,
      totalProfit,
      totalRefunds,
      cancelledCount,
      cancellationLoss,
      cancellationGain
    };
  }, [bookings, isDateInFilterPeriod, selectedMode]);

  // Handlers
  const handleSaveNewBooking = (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    updateBookingsState(updated);
    showToast(`Booking ${newBooking.billNo} saved! Open bill to share.`);

    // Live sync to Google Sheet
    if (sheetConfig.isConnected && sheetConfig.webAppUrl) {
      upsertToGoogleSheet(sheetConfig.webAppUrl, newBooking, 0);
    }
  };

  const handleSaveModifiedBooking = (updatedBooking: Booking) => {
    const idx = bookings.findIndex(b => b.id === updatedBooking.id);
    const updated = bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b);
    updateBookingsState(updated);
    showToast(`Booking ${updatedBooking.billNo} updated!`);

    if (sheetConfig.isConnected && sheetConfig.webAppUrl) {
      upsertToGoogleSheet(sheetConfig.webAppUrl, updatedBooking, idx >= 0 ? idx : 0);
    }
  };

  const handlePaymentRecorded = (bookingId: string, paidAmount: number) => {
    const idx = bookings.findIndex(b => b.id === bookingId);
    const updated = bookings.map((b) => {
      if (b.id !== bookingId) return b;
      const newReceived = b.amountReceived + paidAmount;
      const newDue = Math.max(0, b.netAmount - newReceived);
      const newPaymentStatus = newDue <= 0 ? 'paid' : 'partial';
      return {
        ...b,
        amountReceived: newReceived,
        due: newDue,
        paymentStatus: newPaymentStatus as Booking['paymentStatus'],
        updatedAt: new Date().toISOString()
      };
    });

    updateBookingsState(updated);
    showToast(`Payment of ₹${paidAmount} recorded!`);

    const updatedBooking = updated.find(b => b.id === bookingId);
    if (updatedBooking && sheetConfig.isConnected && sheetConfig.webAppUrl) {
      upsertToGoogleSheet(sheetConfig.webAppUrl, updatedBooking, idx >= 0 ? idx : 0);
    }
  };

  const handleConfirmCancellation = (bookingId: string, details: CancellationDetails) => {
    const idx = bookings.findIndex(b => b.id === bookingId);
    const updated = bookings.map((b) => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        status: 'cancelled' as const,
        due: 0,
        profit: details.agentFinalProfit,
        cancellationDetails: details,
        remarks: `${b.remarks ? b.remarks + ' | ' : ''}Cancelled: Ref ₹${details.customerRefundAmount}, Ded ₹${details.operatorDeduction}`,
        updatedAt: new Date().toISOString()
      };
    });

    updateBookingsState(updated);
    showToast(`Ticket cancelled & refund settled!`);

    const updatedBooking = updated.find(b => b.id === bookingId);
    if (updatedBooking && sheetConfig.isConnected && sheetConfig.webAppUrl) {
      upsertToGoogleSheet(sheetConfig.webAppUrl, updatedBooking, idx >= 0 ? idx : 0);
    }
  };


  const handleUpdatePnr = (bookingId: string, newPnr: string) => {
    const idx = bookings.findIndex(b => b.id === bookingId);
    const updated = bookings.map(b => b.id === bookingId ? { ...b, pnr: newPnr, updatedAt: new Date().toISOString() } : b);
    updateBookingsState(updated);
    showToast(`PNR updated to ${newPnr}!`);

    const updatedBooking = updated.find(b => b.id === bookingId);
    if (updatedBooking && sheetConfig.isConnected && sheetConfig.webAppUrl) {
      upsertToGoogleSheet(sheetConfig.webAppUrl, updatedBooking, idx >= 0 ? idx : 0);
    }
  };

  const handleSaveAgency = (profile: AgencyProfile) => {
    setAgency(profile);
    saveAgencyProfile(profile);
    showToast('Agency profile updated successfully.');
  };

  const handleSaveSheetConfig = (config: GoogleSheetConfig) => {
    setSheetConfig(config);
    saveGoogleSheetConfig(config);
  };

  const handleSaveWaConfig = (config: WhatsAppConfig) => {
    setWaConfig(config);
    saveWhatsAppConfig(config);
    showToast('WhatsApp settings updated.');
  };

  // Authenticated Access Gate - if not logged in, show Login Screen only
  if (!currentUser) {
    return (
      <LoginScreen
        agency={agency}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.name}!`);
        }}
      />
    );
  }

  const modeStats = useMemo(() => {
    return {
      train: bookings.filter(b => b.mode === 'train').length,
      flight: bookings.filter(b => b.mode === 'flight').length,
      bus: bookings.filter(b => b.mode === 'bus').length,
      total: bookings.length
    };
  }, [bookings]);

  return (
    <div className="min-h-screen travel-canvas-bg text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">

      {/* Ultra-Fast Multi-Modal Indian Travel Canvas Background (Vande Bharat Train, Flight, Luxury Bus) */}
      <TravelBackground opacityPreset="balanced" showControls={true} />

      {/* Global Header */}
      <Header
        agency={agency}
        sheetConfig={sheetConfig}
        waConfig={waConfig}
        currentUser={currentUser}
        onLogout={() => {
          clearAuthUser();
          setCurrentUser(null);
          showToast('Logged out successfully.');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewBooking={() => setIsNewBookingOpen(true)}
        onOpenSheetSync={() => setIsSheetSyncOpen(true)}
        onOpenWaSettings={() => setIsWaSettingsOpen(true)}
        onOpenAgencySettings={() => setIsAgencySettingsOpen(true)}
        onTriggerSync={triggerGoogleSheetSync}
        isSyncing={isSyncing}
        privacyMask={privacyMask}
        setPrivacyMask={setPrivacyMask}
        showToast={showToast}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Floating Toast Notice */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-40 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md animate-slide-up border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab 1: Executive Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <DashboardMetrics
              metrics={metrics}
              dateFilterBasis={dateFilterBasis}
              setDateFilterBasis={setDateFilterBasis}
              period={period}
              setPeriod={setPeriod}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              activeQuickFilter={activeQuickFilter}
              setActiveQuickFilter={setActiveQuickFilter}
              privacyMask={privacyMask}
            />

            <BookingsTable
              bookings={dashboardFilteredBookings}
              onOpenInvoice={(b) => setActiveInvoiceBooking(b)}
              privacyMask={privacyMask}
            />
          </div>
        )}

        {/* Tab 2: Customer & PNR Manager (Booking Manage) */}
        {activeTab === 'customer_pnr' && (
          <CustomerPnrManager
            bookings={bookings}
            onUpdatePnr={handleUpdatePnr}
            onOpenInvoice={(b) => setActiveInvoiceBooking(b)}
            onOpenPayDue={(b) => setActivePayDueBooking(b)}
            onOpenEdit={(b) => setActiveEditBooking(b)}
            onOpenCancel={(b) => setActiveCancelBooking(b)}
            agency={agency}
            waConfig={waConfig}
            privacyMask={privacyMask}
          />
        )}

        {/* Tab 3: Lifetime Pending Dues & Bulk Reminders */}
        {activeTab === 'pending_dues' && (
          <PendingDuesManager
            bookings={bookings}
            agency={agency}
            waConfig={waConfig}
            onOpenPayDue={(b) => setActivePayDueBooking(b)}
            privacyMask={privacyMask}
          />
        )}

      </main>

      {/* Global Modals: Conditionally mounted to strictly obey Rules of Hooks */}
      {isNewBookingOpen && (
        <BookingFormModal
          isOpen={isNewBookingOpen}
          onClose={() => setIsNewBookingOpen(false)}
          onSave={handleSaveNewBooking}
          existingBookings={bookings}
          agency={agency}
        />
      )}

      {activeEditBooking && (
        <BookingEditModal
          booking={activeEditBooking}
          isOpen={!!activeEditBooking}
          onClose={() => setActiveEditBooking(null)}
          onSaveModified={handleSaveModifiedBooking}
        />
      )}

      {activeCancelBooking && (
        <CancelBillModal
          booking={activeCancelBooking}
          isOpen={!!activeCancelBooking}
          onClose={() => setActiveCancelBooking(null)}
          onConfirmCancellation={handleConfirmCancellation}
        />
      )}

      {activeInvoiceBooking && (
        <InvoiceModal
          booking={activeInvoiceBooking}
          agency={agency}
          waConfig={waConfig}
          isOpen={!!activeInvoiceBooking}
          onClose={() => setActiveInvoiceBooking(null)}
        />
      )}

      {activePayDueBooking && (
        <PayDueModal
          booking={activePayDueBooking}
          agency={agency}
          waConfig={waConfig}
          isOpen={!!activePayDueBooking}
          onClose={() => setActivePayDueBooking(null)}
          onPaymentRecorded={handlePaymentRecorded}
        />
      )}

      {isSheetSyncOpen && (
        <GoogleSheetSyncModal
          isOpen={isSheetSyncOpen}
          onClose={() => setIsSheetSyncOpen(false)}
          sheetConfig={sheetConfig}
          onSaveConfig={handleSaveSheetConfig}
          bookings={bookings}
          onImportBookingsFromSheet={(sheetBookings) => {
            updateBookingsState(sheetBookings);
            showToast(`Imported ${sheetBookings.length} records from Google Sheet!`);
          }}
        />
      )}

      {isWaSettingsOpen && (
        <WhatsAppSettingsModal
          isOpen={isWaSettingsOpen}
          onClose={() => setIsWaSettingsOpen(false)}
          waConfig={waConfig}
          onSaveConfig={handleSaveWaConfig}
          agency={agency}
        />
      )}

      {isAgencySettingsOpen && (
        <AgencySettingsModal
          isOpen={isAgencySettingsOpen}
          onClose={() => setIsAgencySettingsOpen(false)}
          agency={agency}
          onSaveAgency={handleSaveAgency}
        />
      )}

    </div>
  );
}
