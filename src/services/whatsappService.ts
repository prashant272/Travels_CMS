/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Booking, AgencyProfile, WhatsAppConfig } from '../types/crm';

export const WHATSAPP_CONFIG_KEY = 'yatridesk_wa_config_v2';

export const DEFAULT_WA_CONFIG: WhatsAppConfig = {
  mode: 'whatsapp_web', // Default: Direct WhatsApp Web (No API needed!)
  agencyPhone: '9876543210'
};

/**
 * Format 10-digit phone number with 91 prefix
 */
export function formatPhoneNumber(phone: string): string {
  const clean = (phone || '').replace(/\D/g, '');
  if (clean.length === 10) {
    return `91${clean}`;
  }
  if (clean.length === 12 && clean.startsWith('91')) {
    return clean;
  }
  return clean;
}

/**
 * Generate formatted WhatsApp invoice slip message
 */
export function generateInvoiceMessage(booking: Booking, agency: AgencyProfile): string {
  // If the booking is cancelled, generate the official Cancellation & Refund Receipt instead!
  if (booking.status === 'cancelled') {
    return generateRefundReceiptMessage(booking, agency);
  }

  const modeEmoji = booking.mode === 'train' ? '🚆' : booking.mode === 'flight' ? '✈️' : '🚌';
  const travelDesc = booking.mode === 'train'
    ? `*Train:* ${booking.trainNumber ? `${booking.trainNumber} - ${booking.trainName || ''}` : booking.travelNumber}`
    : booking.mode === 'flight'
    ? `*Flight Reference:* ${booking.travelNumber}`
    : `*Bus Service:* ${booking.travelNumber}`;

  const dueLine = booking.due > 0
    ? `*⚠️ Balance Outstanding Due:* ₹${booking.due.toLocaleString('en-IN')}`
    : `*✅ Payment Status:* FULLY SETTLED & PAID`;

  return `🎫 *${agency.name.toUpperCase()}*
*OFFICIAL TRAVEL INVOICE & VOUCHER*
━━━━━━━━━━━━━━━━━━━━━━━━
*Bill No:* ${booking.billNo}
*Booking Date:* ${booking.bookingDate}
*Customer Name:* ${booking.customerName}
${modeEmoji} *Mode:* ${booking.mode.toUpperCase()} (${booking.travelClass})
${travelDesc}
*Journey Date (DOJ):* ${booking.doj}
*Route:* ${booking.fromStation} ➔ ${booking.toStation}
${booking.pnr ? `*PNR Number:* ${booking.pnr}\n` : ''}${booking.passengerDetails ? `*Passengers:* ${booking.passengerDetails}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━━
*Ticket Fare:* ₹${booking.ticketAmount.toLocaleString('en-IN')}
*Agency Service Fee:* ₹${booking.charge.toLocaleString('en-IN')}
*Total Net Billed:* ₹${booking.netAmount.toLocaleString('en-IN')}
*Amount Received:* ₹${booking.amountReceived.toLocaleString('en-IN')}
${dueLine}
${booking.due > 0 && agency.upiId ? `*UPI ID for Payment:* ${agency.upiId}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━━
${agency.address ? `📍 ${agency.address}\n` : ''}📞 Helpline: +91 ${agency.phone}
Thank you for booking with us. Have a safe and pleasant journey!`;
}

/**
 * Generate official Cancellation & Refund proof message for WhatsApp
 * Provides proof if a customer comes back asking whether refund was given.
 */
export function generateRefundReceiptMessage(booking: Booking, agency: AgencyProfile): string {
  const cd = booking.cancellationDetails;
  const refAmount = cd?.customerRefundAmount ?? 0;
  const dedAmount = cd?.operatorDeduction ?? 0;
  const feeAmount = cd?.agencyCancellationFee ?? 0;
  const cancelDate = cd?.cancelledAt ? new Date(cd.cancelledAt).toLocaleString('en-IN') : new Date().toLocaleDateString('en-IN');

  return `🔴 *OFFICIAL CANCELLATION & REFUND RECEIPT*
🏢 *${agency.name.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━━━━
Dear *${booking.customerName}*,

Your travel ticket has been officially cancelled and the refund has been settled:

*Bill / Invoice No:* ${booking.billNo}
*Settlement Ref ID:* REF-${booking.billNo}
*Travel Route:* ${booking.fromStation} ➔ ${booking.toStation}
*Journey Date (DOJ):* ${booking.doj}
${booking.trainNumber ? `*Train:* ${booking.trainNumber} ${booking.trainName || ''}\n` : ''}${booking.pnr ? `*PNR:* ${booking.pnr}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━
*Original Advance Paid by You:* ₹${booking.amountReceived.toLocaleString('en-IN')}
*IRCTC / Operator Cancellation Deduction:* -₹${dedAmount.toLocaleString('en-IN')}
*Agency Cancellation Fee:* -₹${feeAmount.toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━━━━━
*✅ TOTAL REFUNDED TO YOU:* ₹${refAmount.toLocaleString('en-IN')}
*Refund Settlement Date:* ${cancelDate}
*Refund Status:* COMPLETED & HANDED OVER
*Reason:* ${cd?.reason || 'Ticket cancelled upon client request'}
━━━━━━━━━━━━━━━━━━━━━━━━
Please preserve this official message as proof of refund settlement.
If you have any queries, contact our helpline at +91 ${agency.phone}.
${agency.address ? `📍 ${agency.address}` : ''}`;
}

/**
 * Generate formatted WhatsApp Payment Reminder message
 */
export function generateReminderMessage(booking: Booking, agency: AgencyProfile): string {
  return `🔔 *PAYMENT REMINDER | ${agency.name.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━━━━
Dear *${booking.customerName}*,

This is a gentle payment reminder regarding your travel booking:

*Bill No:* ${booking.billNo}
*Travel Route:* ${booking.fromStation} ➔ ${booking.toStation}
*Journey Date (DOJ):* ${booking.doj}
*Total Bill Amount:* ₹${booking.netAmount.toLocaleString('en-IN')}
*Amount Received:* ₹${booking.amountReceived.toLocaleString('en-IN')}
*⚠️ PENDING BALANCE DUE:* ₹${booking.due.toLocaleString('en-IN')}

Kindly clear the balance amount at your earliest convenience.
${agency.upiId ? `💳 *Pay via UPI:* ${agency.upiId}\n` : ''}
If you have already paid, please ignore this notice.
For any query, call us at +91 ${agency.phone}.
Thank you!`;
}

/**
 * Checks if current user is browsing on a mobile device (Android, iOS, iPad)
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || !navigator) return false;
  const ua = (navigator.userAgent || navigator.vendor || (window as any).opera || '').toLowerCase();
  const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua);
  const isSmallTouchDevice = Boolean(
    typeof window !== 'undefined' && 
    window.innerWidth <= 768 && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );
  return isMobileUA || isSmallTouchDevice;
}

/**
 * WhatsApp Web Direct Link (for Chrome / Desktop / Laptop)
 */
export function getWhatsAppWebUrl(phone: string, text: string): string {
  const formattedPhone = formatPhoneNumber(phone);
  const encodedText = encodeURIComponent(text);
  return `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`;
}

/**
 * WhatsApp App Direct Link (for Mobile App or Desktop App)
 */
export function getWhatsAppAppUrl(phone: string, text: string): string {
  const formattedPhone = formatPhoneNumber(phone);
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`;
}

/**
 * Smart WhatsApp Opener:
 * 1. Mobile Phone: Directly opens the native mobile WhatsApp App (whatsapp:// protocol), no extra browser tab.
 * 2. PC / Laptop: Targets the SAME named tab ('whatsapp_web') so if WhatsApp Web is already open in browser,
 *    it redirects/refocuses that exact tab and never spams new tabs!
 */
export function openSmartWhatsApp(phone: string, text: string): void {
  const formattedPhone = formatPhoneNumber(phone);
  const encodedText = encodeURIComponent(text);

  if (isMobileDevice()) {
    // Mobile device: Launch native WhatsApp app directly
    const appDeepLink = `whatsapp://send?phone=${formattedPhone}&text=${encodedText}`;
    try {
      window.location.href = appDeepLink;
    } catch {
      window.location.href = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`;
    }
  } else {
    // Desktop / Laptop: Target the SAME window/tab name 'whatsapp_web'
    // The browser redirects the already open WhatsApp Web tab instead of opening another one
    const webUrl = `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`;
    window.open(webUrl, 'whatsapp_web');
  }
}

/**
 * Universal WhatsApp Link generator (works seamlessly on mobile & web)
 */
export function getUniversalWhatsAppUrl(phone: string, text: string): string {
  const formattedPhone = formatPhoneNumber(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
}

/**
 * Direct WhatsApp Link generator
 */
export function getDirectWhatsAppUrl(phone: string, text: string, mode: WhatsAppConfig['mode'] = 'whatsapp_web'): string {
  if (isMobileDevice() || mode === 'whatsapp_app') {
    return getWhatsAppAppUrl(phone, text);
  }
  return getWhatsAppWebUrl(phone, text);
}

/**
 * Send WhatsApp Message directly via Smart WhatsApp Opener
 * Automatically uses WhatsApp App on mobile devices, and redirects/reuses active WhatsApp Web tab on desktop.
 */
export async function sendWhatsAppMessage(
  phone: string,
  text: string,
  config?: WhatsAppConfig
): Promise<{ success: boolean; method: string; notice: string; error?: string }> {
  const formattedPhone = formatPhoneNumber(phone);

  if (!formattedPhone || formattedPhone.length < 10) {
    return {
      success: false,
      method: config?.mode || 'smart',
      notice: 'Invalid phone number',
      error: 'Please provide a valid 10-digit mobile number'
    };
  }

  // 1. Cloud API mode (if configured)
  if (config && config.mode === 'cloud_api' && config.metaPhoneNumberId && config.metaAccessToken) {
    try {
      const url = `https://graph.facebook.com/v19.0/${config.metaPhoneNumberId}/messages`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.metaAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedPhone,
          type: 'text',
          text: { preview_url: false, body: text }
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Cloud API error HTTP ${res.status}`);
      }

      return {
        success: true,
        method: 'cloud_api',
        notice: `Dispatched via WhatsApp Cloud API to +${formattedPhone}!`
      };
    } catch (err: any) {
      console.warn('Cloud API failed, falling back to Smart WhatsApp:', err);
    }
  }

  // 2. Smart Opener: Native App on Mobile, Reuses Active WhatsApp Web Tab on Desktop
  openSmartWhatsApp(phone, text);

  return {
    success: true,
    method: isMobileDevice() ? 'whatsapp_app' : 'whatsapp_web',
    notice: isMobileDevice()
      ? `Opened directly in WhatsApp App for +${formattedPhone}!`
      : `Sent to active WhatsApp Web tab for +${formattedPhone}!`
  };
}

