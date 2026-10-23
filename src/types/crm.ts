/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BookingMode = 'train' | 'flight' | 'bus';

export type BookingStatus = 'confirmed' | 'cancelled';

export type PaymentStatus = 'paid' | 'partial' | 'unpaid';

export interface CancellationDetails {
  cancelledAt: string;
  operatorDeduction: number; // What IRCTC / Airline / Bus operator deducted
  agencyCancellationFee: number; // Agency fee charged/retained for cancellation
  customerRefundAmount: number; // Amount refunded to customer
  agentFinalProfit: number; // Realized net profit/loss for the agent
  reason?: string;
}

export interface Booking {
  id: string;
  billNo: string;
  bookingDate: string; // YYYY-MM-DD
  mode: BookingMode;
  trainNumber?: string;
  trainName?: string;
  travelNumber: string; // Train number, Flight reference, or Bus reference
  doj: string; // YYYY-MM-DD
  fromStation: string;
  toStation: string;
  travelClass: string;
  customerName: string;
  customerPhone: string; // 10-digit format
  pnr: string;
  ticketAmount: number; // Base operator ticket fare
  charge: number; // Agency profit/service fee
  netAmount: number; // ticketAmount + charge
  customerAmount: number; // netAmount billed to customer
  amountReceived: number;
  profit: number; // Realized agent profit
  due: number; // Net amount - amountReceived
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  passengerDetails?: string;
  remarks?: string;
  cancellationDetails?: CancellationDetails;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  email: string;
  name: string;
  picture?: string;
  loginAt: string;
}

export interface AgencyProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  gstNumber?: string;
  upiId: string;
  defaultCharge: number;
}

export interface GoogleSheetConfig {
  webAppUrl: string;
  isConnected: boolean;
  lastSyncedAt?: string;
  autoSync: boolean;
  syncIntervalSec: number;
  totalRowsSynced?: number;
}

export interface WhatsAppConfig {
  mode: 'whatsapp_web' | 'whatsapp_app' | 'in_app_direct' | 'cloud_api' | 'webhook';
  agencyPhone: string;
  // Meta Cloud API configuration (optional fallback)
  metaPhoneNumberId?: string;
  metaAccessToken?: string;
  // Custom Webhook or Gateway (optional)
  webhookUrl?: string;
  webhookApiKey?: string;
}

export interface DashboardMetrics {
  totalBookings: number;
  grossBilling: number;
  totalCollected: number;
  pendingDue: number;
  dueCustomersCount: number;
  totalProfit: number;
  totalRefunds: number;
  cancelledCount: number;
  cancellationLoss: number; // Realized net financial loss on cancellations
  cancellationGain: number; // Realized net gain on cancellations
}

export type PeriodFilter = 'all' | 'today' | 'this_week' | 'this_month' | 'last_month' | 'custom';
