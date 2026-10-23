/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Booking, GoogleSheetConfig } from '../types/crm';

export const GOOGLE_SHEET_CONFIG_KEY = 'yatridesk_gsheet_config_v2';

export const DEFAULT_GSHEET_CONFIG: GoogleSheetConfig = {
  webAppUrl: '',
  isConnected: false,
  autoSync: true,
  syncIntervalSec: 8, // Real-time poll interval (8 seconds)
  totalRowsSynced: 0
};

/**
 * Exact user requested Google Sheet column headers format:
 * S.No | Booking Date | Booking Month | Train No | DOJ | From-to | Class | Customer Name | Customer Number |
 * Ticket Amount | Charge | Net Amount | Customer Amount | Amount Received | Profiit | Due | REMARS | Bill No | Status | Refund Amount
 */
export const GOOGLE_SHEET_HEADERS = [
  "S.No",
  "Booking Date",
  "Booking Month",
  "Train No",
  "DOJ",
  "From-to",
  "Class",
  "Customer Name",
  "Customer Number",
  "Ticket Amount",
  "Charge",
  "Net Amount",
  "Customer Amount",
  "Amount Received",
  "Profiit",
  "Due",
  "REMARS",
  "Bill No",
  "Status",
  "Refund Amount"
];

/**
 * Converts a Booking object into a row matching the exact sheet columns
 */
export function bookingToSheetRow(b: Booking, index: number): (string | number)[] {
  const fromTo = (b.fromStation || b.toStation)
    ? `${b.fromStation || ''} to ${b.toStation || ''}`.trim()
    : '';

  let trainNo = '';
  if (b.mode === 'flight') {
    trainNo = b.travelNumber && b.travelNumber.toUpperCase().startsWith('FLIGHT') 
      ? b.travelNumber 
      : `FLIGHT: ${b.travelNumber || 'Aviation'}`;
  } else if (b.mode === 'bus') {
    trainNo = b.travelNumber && b.travelNumber.toUpperCase().startsWith('BUS') 
      ? b.travelNumber 
      : `BUS: ${b.travelNumber || 'Express'}`;
  } else {
    trainNo = b.trainNumber 
      ? `${b.trainNumber}${b.trainName ? ' - ' + b.trainName : ''}` 
      : (b.travelNumber || 'TRAIN');
  }
  
  // Extract month from bookingDate (e.g. "October 2026")
  let bookingMonth = '';
  try {
    const dtSource = b.bookingDate || b.doj;
    if (dtSource) {
      const dt = new Date(dtSource);
      if (!isNaN(dt.getTime())) {
        bookingMonth = dt.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      } else {
        bookingMonth = dtSource;
      }
    }
  } catch {
    bookingMonth = b.bookingDate || '';
  }

  const refundAmt = b.cancellationDetails?.customerRefundAmount || 0;

  return [
    index + 1,
    b.bookingDate || new Date().toISOString().split('T')[0],
    bookingMonth,
    trainNo,
    b.doj || '',
    fromTo,
    b.travelClass || 'SL',
    b.customerName || '',
    b.customerPhone ? `'${b.customerPhone}` : '', // Apostrophe prefix ensures Google Sheets formats as text without scientific notation
    Number(b.ticketAmount) || 0,
    Number(b.charge) || 0,
    Number(b.netAmount) || 0,
    Number(b.customerAmount || b.netAmount) || 0,
    Number(b.amountReceived) || 0,
    Number(b.profit) || 0,
    b.status === 'cancelled' ? 0 : (Number(b.due) || 0),
    b.remarks || (b.status === 'cancelled' ? `CANCELLED (Refund: ₹${refundAmt})` : ''),
    b.billNo,
    b.status || 'confirmed',
    refundAmt
  ];
}

/**
 * Robust parser to convert any row (with or without headers) from Google Sheet into a Booking object
 */
export function parseSheetRowToBooking(row: any[], headerMap?: { [colName: string]: number }, rowIndex: number = 0): Booking | null {
  try {
    if (!row || !Array.isArray(row) || row.length === 0) return null;

    // Helper to get by header name or index
    const getVal = (colName: string, fallbackIdx: number): any => {
      if (headerMap && headerMap[colName.toLowerCase()] !== undefined) {
        return row[headerMap[colName.toLowerCase()]];
      }
      return row[fallbackIdx];
    };

    // Detect if row has Booking Date in column 1 (20-col layout vs old 19-col layout)
    const is20Col = (headerMap && headerMap['booking date'] !== undefined) ||
      (row.length >= 20) ||
      (typeof row[1] === 'string' && /^\d{4}-\d{2}-\d{2}/.test(row[1])) ||
      (typeof row[1] === 'string' && /^\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/.test(row[1]));

    const offset = is20Col ? 1 : 0;

    const bookingDateRaw = is20Col ? String(getVal('booking date', 1) || '').trim() : '';

    const customerName = String(getVal('customer name', 6 + offset) || '').trim();
    const customerPhoneRaw = String(getVal('customer number', 7 + offset) || '').trim();
    const customerPhone = customerPhoneRaw.replace(/\D/g, '').slice(-10);

    // Skip purely empty rows or header echoes
    if (!customerName && !customerPhone && !row[2 + offset]) return null;
    if (customerName.toLowerCase() === 'customer name') return null;

    const billNoRaw = String(getVal('bill no', 16 + offset) || '').trim();
    const billNo = billNoRaw || `TRV-SH-${1000 + rowIndex}`;

    const travelNo = String(getVal('train no', 2 + offset) || '').trim();
    const doj = String(getVal('doj', 3 + offset) || bookingDateRaw || new Date().toISOString().split('T')[0]).trim();
    const fromTo = String(getVal('from-to', 4 + offset) || '').trim();

    let fromStation = '';
    let toStation = '';
    if (fromTo.includes(' to ')) {
      const parts = fromTo.split(' to ');
      fromStation = parts[0]?.trim() || '';
      toStation = parts[1]?.trim() || '';
    } else if (fromTo.includes('-')) {
      const parts = fromTo.split('-');
      fromStation = parts[0]?.trim() || '';
      toStation = parts[1]?.trim() || '';
    } else {
      fromStation = fromTo;
      toStation = '';
    }

    const travelClass = String(getVal('class', 5 + offset) || 'SL').trim();
    const ticketAmount = Number(getVal('ticket amount', 8 + offset)) || 0;
    const charge = Number(getVal('charge', 9 + offset)) || 0;
    const netAmount = Number(getVal('net amount', 10 + offset)) || (ticketAmount + charge);
    const customerAmount = Number(getVal('customer amount', 11 + offset)) || netAmount;
    const amountReceived = Number(getVal('amount received', 12 + offset)) || 0;
    const profit = Number(getVal('profiit', 13 + offset)) || Number(getVal('profit', 13 + offset)) || charge;
    const due = Number(getVal('due', 14 + offset)) || Math.max(0, netAmount - amountReceived);
    const remarks = String(getVal('remars', 15 + offset) || getVal('remarks', 15 + offset) || '').trim();

    const statusRaw = String(getVal('status', 17 + offset) || '').toLowerCase();
    const isCancelled = statusRaw.includes('cancel') || remarks.toLowerCase().includes('cancelled');
    const status: Booking['status'] = isCancelled ? 'cancelled' : 'confirmed';

    const refundAmount = Number(getVal('refund amount', 18 + offset)) || 0;

    let paymentStatus: Booking['paymentStatus'] = 'unpaid';
    if (due <= 0) paymentStatus = 'paid';
    else if (amountReceived > 0) paymentStatus = 'partial';

    // Intelligently detect mode of transport from travel number, travel class, or remarks
    let detectedMode: Booking['mode'] = 'train';
    const travelNoUpper = travelNo.toUpperCase();
    const travelClassUpper = travelClass.toUpperCase();
    const remarksUpper = remarks.toUpperCase();

    if (
      travelNoUpper.includes('FLIGHT') || 
      travelNoUpper.includes('AIR') || 
      travelNoUpper.includes('6E') || 
      travelNoUpper.includes('AI-') || 
      travelNoUpper.includes('UK-') || 
      travelNoUpper.includes('SG-') ||
      travelClassUpper.includes('ECONOMY') || 
      travelClassUpper.includes('BUSINESS') || 
      travelClassUpper.includes('PREMIUM') ||
      remarksUpper.includes('FLIGHT')
    ) {
      detectedMode = 'flight';
    } else if (
      travelNoUpper.includes('BUS') || 
      travelNoUpper.includes('VOLVO') || 
      travelNoUpper.includes('SCANIA') || 
      travelNoUpper.includes('SLEEPER (2+') ||
      travelClassUpper.includes('SLEEPER (2+') || 
      travelClassUpper.includes('SEATER') || 
      travelClassUpper.includes('VOLVO') || 
      remarksUpper.includes('BUS')
    ) {
      detectedMode = 'bus';
    } else {
      detectedMode = 'train';
    }

    // Extract train number and name ONLY if detectedMode is train
    let trainNumber: string | undefined = undefined;
    let trainName: string | undefined = undefined;
    if (detectedMode === 'train') {
      const trainMatch = travelNo.match(/^(\d{4,5})/);
      if (trainMatch) {
        trainNumber = trainMatch[1];
        trainName = travelNo.replace(/^(\d{4,5})\s*[-:]?\s*/, '').trim();
      }
    }

    return {
      id: billNo,
      billNo,
      bookingDate: bookingDateRaw || doj || new Date().toISOString().split('T')[0],
      mode: detectedMode,
      trainNumber,
      trainName,
      travelNumber: travelNo || (detectedMode === 'flight' ? 'Flight' : detectedMode === 'bus' ? 'Bus' : 'Train'),
      doj,
      fromStation,
      toStation,
      travelClass,
      customerName: customerName || 'Valued Customer',
      customerPhone: customerPhone || '9876543210',
      pnr: '',
      ticketAmount,
      charge,
      netAmount,
      customerAmount,
      amountReceived,
      profit,
      due: isCancelled ? 0 : due,
      paymentStatus,
      status,
      remarks,
      cancellationDetails: isCancelled ? {
        cancelledAt: new Date().toISOString(),
        operatorDeduction: Math.max(0, ticketAmount - refundAmount),
        agencyCancellationFee: charge,
        customerRefundAmount: refundAmount,
        agentFinalProfit: profit,
        reason: remarks || 'Cancelled'
      } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (err) {
    console.error('Error parsing sheet row:', err);
    return null;
  }
}

/**
 * 2-Way Google Apps Script Web App Code for the user's Google Sheet
 * Handles existing sheets (Sheet1, active sheet) so all historical data is read seamlessly.
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ===============================================================
 * YatriDesk Travel CRM - Official Realtime 2-Way Google Sheets Sync
 * ===============================================================
 * 
 * STEP-BY-STEP SETUP INSTRUCTIONS:
 * 1. Open the Google Sheet where your travel booking data lives.
 * 2. In Google Sheets top menu, click: Extensions > Apps Script
 * 3. Delete ANY existing text in the editor, and PASTE this ENTIRE code block.
 * 4. Click the 'Save' icon (Floppy disk).
 * 5. Click the blue 'Deploy' button (top right) > Choose 'New deployment'.
 * 6. Click the gear icon next to 'Select type' and choose: 'Web app'.
 *    - Description: YatriDesk Sync
 *    - Execute as: Me (your email)
 *    - Who has access: Anyone  <-- (VERY IMPORTANT: Choose 'Anyone')
 * 7. Click 'Deploy'. When prompted, click 'Authorize access' > Choose your account > Advanced > Go to YatriDesk (unsafe) > Allow.
 * 8. COPY the 'Web app URL' (ends with /exec).
 * 9. In YatriDesk CRM, click 'Google Sheet' in top bar, PASTE your URL, and click 'Connect & Sync Now'.
 * 
 * All your existing old data will immediately import into YatriDesk, 
 * and any deletion or addition will sync bidirectionally in REAL TIME!
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getAll";
  var sheet = getTargetSheet();
  
  if (action === "getAll") {
    var data = sheet.getDataRange().getValues();
    if (!data || data.length === 0) {
      return responseJSON({ success: true, headers: [], rows: [] });
    }
    
    var headers = data[0];
    var rows = data.slice(1);
    return responseJSON({
      success: true,
      sheetName: sheet.getName(),
      headers: headers,
      rows: rows,
      total: rows.length
    });
  }

  // Real-time Upsert via GET (handles CORS seamlessly)
  if (action === "upsert") {
    var billNo = (e && e.parameter && e.parameter.billNo) ? String(e.parameter.billNo).trim().toLowerCase() : "";
    var rowJson = (e && e.parameter && e.parameter.rowJson) ? String(e.parameter.rowJson) : "[]";
    var row = JSON.parse(rowJson);
    var data = sheet.getDataRange().getValues();
    var foundRow = -1;

    for (var i = 1; i < data.length; i++) {
      for (var c = 0; c < data[i].length; c++) {
        var val = String(data[i][c] || "").trim().toLowerCase();
        if (val && billNo && (val === billNo || val.indexOf(billNo) !== -1)) {
          foundRow = i + 1;
          break;
        }
      }
      if (foundRow > 0) break;
    }

    if (foundRow > 0) {
      sheet.getRange(foundRow, 1, 1, row.length).setValues([row]);
      return responseJSON({ success: true, operation: "updated", billNo: e.parameter.billNo, row: foundRow });
    } else {
      sheet.appendRow(row);
      return responseJSON({ success: true, operation: "inserted", billNo: e.parameter.billNo, row: sheet.getLastRow() });
    }
  }

  // Real-time Delete via GET
  if (action === "delete") {
    var billNoToDelete = (e && e.parameter && e.parameter.billNo) ? String(e.parameter.billNo).trim().toLowerCase() : "";
    var idToDelete = (e && e.parameter && e.parameter.id) ? String(e.parameter.id).trim().toLowerCase() : "";
    var pnrToDelete = (e && e.parameter && e.parameter.pnr) ? String(e.parameter.pnr).trim().toLowerCase() : "";
    var data = sheet.getDataRange().getValues();
    var deletedCount = 0;

    for (var j = data.length - 1; j >= 1; j--) {
      var row = data[j];
      var matches = false;
      for (var c = 0; c < row.length; c++) {
        var cellStr = String(row[c] || "").trim().toLowerCase();
        if (!cellStr) continue;
        if (billNoToDelete && (cellStr === billNoToDelete || cellStr.indexOf(billNoToDelete) !== -1)) {
          matches = true;
          break;
        }
        if (idToDelete && (cellStr === idToDelete || cellStr.indexOf(idToDelete) !== -1)) {
          matches = true;
          break;
        }
        if (pnrToDelete && pnrToDelete.length > 3 && cellStr === pnrToDelete) {
          matches = true;
          break;
        }
      }
      if (matches) {
        sheet.deleteRow(j + 1);
        deletedCount++;
      }
    }
    return responseJSON({ success: true, operation: "deleted", deletedCount: deletedCount, billNo: billNoToDelete });
  }
  
  return responseJSON({ success: true, message: "YatriDesk Sync Service Active" });
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var action = contents.action;
    var sheet = getTargetSheet();

    // ACTION 1: Full batch sync (reconciliation)
    if (action === "syncAll") {
      var rows = contents.rows || [];
      sheet.clearContents();
      
      var headers = ${JSON.stringify(GOOGLE_SHEET_HEADERS)};
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#0f172a").setFontColor("#38bdf8");
      sheet.setFrozenRows(1);
      
      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      }
      return responseJSON({ success: true, count: rows.length });
    }

    // ACTION 2: Real-time Upsert (Insert or Update a booking)
    if (action === "upsert") {
      var row = contents.row;
      var billNo = String(contents.billNo || '').trim().toLowerCase();
      var data = sheet.getDataRange().getValues();
      var foundRow = -1;

      // Look for matching Bill No (search any column with billNo)
      for (var i = 1; i < data.length; i++) {
        for (var c = 0; c < data[i].length; c++) {
          var val = String(data[i][c] || '').trim().toLowerCase();
          if (val && billNo && (val === billNo || val.indexOf(billNo) !== -1)) {
            foundRow = i + 1;
            break;
          }
        }
        if (foundRow > 0) break;
      }

      if (foundRow > 0) {
        // Update existing row
        sheet.getRange(foundRow, 1, 1, row.length).setValues([row]);
        return responseJSON({ success: true, operation: "updated", billNo: contents.billNo, row: foundRow });
      } else {
        // Append new row
        sheet.appendRow(row);
        return responseJSON({ success: true, operation: "inserted", billNo: contents.billNo, row: sheet.getLastRow() });
      }
    }

    // ACTION 3: Real-time Delete
    if (action === "delete") {
      var billNoToDelete = String(contents.billNo || '').trim().toLowerCase();
      var idToDelete = String(contents.id || '').trim().toLowerCase();
      var pnrToDelete = String(contents.pnr || '').trim().toLowerCase();
      var data = sheet.getDataRange().getValues();
      var deletedCount = 0;

      for (var j = data.length - 1; j >= 1; j--) {
        var row = data[j];
        var matches = false;
        for (var c = 0; c < row.length; c++) {
          var cellStr = String(row[c] || '').trim().toLowerCase();
          if (!cellStr) continue;
          if (billNoToDelete && (cellStr === billNoToDelete || cellStr.indexOf(billNoToDelete) !== -1)) {
            matches = true;
            break;
          }
          if (idToDelete && (cellStr === idToDelete || cellStr.indexOf(idToDelete) !== -1)) {
            matches = true;
            break;
          }
          if (pnrToDelete && pnrToDelete.length > 3 && cellStr === pnrToDelete) {
            matches = true;
            break;
          }
        }
        if (matches) {
          sheet.deleteRow(j + 1);
          deletedCount++;
        }
      }
      return responseJSON({ success: true, operation: "deleted", deletedCount: deletedCount, billNo: contents.billNo });
    }

    return responseJSON({ success: false, error: "Unknown action" });
  } catch (err) {
    return responseJSON({ success: false, error: err.toString() });
  }
}

/**
 * Finds the sheet where the user's booking data resides
 * Inspects 'Bookings', 'Sheet1', or active sheet deterministically.
 */
function getTargetSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  
  // Prefer named 'Bookings' or 'Sheet1', else active, else first sheet
  var target = ss.getSheetByName("Bookings") || ss.getSheetByName("Sheet1") || ss.getActiveSheet() || sheets[0];
  
  // If brand new empty sheet, initialize headers
  if (target.getLastRow() === 0) {
    var headers = ${JSON.stringify(GOOGLE_SHEET_HEADERS)};
    target.appendRow(headers);
    target.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#0f172a").setFontColor("#38bdf8");
    target.setFrozenRows(1);
  }
  return target;
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

/**
 * Fetch all rows from Google Sheet Web App (Imports both old and new data)
 */
export async function fetchFromGoogleSheet(webAppUrl: string): Promise<{ success: boolean; bookings: Booking[]; error?: string; rawCount?: number }> {
  try {
    if (!webAppUrl || !webAppUrl.startsWith('https://script.google.com/')) {
      return { success: false, bookings: [], error: 'Invalid Google Apps Script Web App URL. It must start with https://script.google.com/' };
    }

    const separator = webAppUrl.includes('?') ? '&' : '?';
    const targetUrl = `${webAppUrl}${separator}action=getAll&_t=${Date.now()}`;

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`Google Sheet returned HTTP status ${res.status}`);
    }

    const data = await res.json();
    if (!data.success || !Array.isArray(data.rows)) {
      throw new Error(data.error || 'Could not read records from Google Sheet.');
    }

    // Build header map if headers are returned
    const headerMap: { [key: string]: number } = {};
    if (Array.isArray(data.headers)) {
      data.headers.forEach((h: any, idx: number) => {
        if (h) headerMap[String(h).trim().toLowerCase()] = idx;
      });
    }

    const bookings: Booking[] = [];
    data.rows.forEach((row: any[], idx: number) => {
      const b = parseSheetRowToBooking(row, headerMap, idx);
      if (b && (b.customerName || b.customerPhone)) {
        bookings.push(b);
      }
    });

    return { 
      success: true, 
      bookings, 
      rawCount: data.rows.length 
    };
  } catch (err: any) {
    console.error('fetchFromGoogleSheet error:', err);
    return { success: false, bookings: [], error: err.message || 'Network error connecting to Google Sheet' };
  }
}

/**
 * Upsert (Real-time insert or update) a booking to Google Sheet
 */
export async function upsertToGoogleSheet(webAppUrl: string, booking: Booking, index: number = 0): Promise<boolean> {
  try {
    if (!webAppUrl || !webAppUrl.startsWith('https://script.google.com/')) return false;

    const row = bookingToSheetRow(booking, index);
    const payload = {
      action: 'upsert',
      billNo: booking.billNo,
      row
    };

    // Primary: POST with no-cors to prevent redirect/cors exceptions
    try {
      await fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
      return true;
    } catch {
      // Fallback: GET with URL encoded params
      const rowParam = encodeURIComponent(JSON.stringify(row));
      const billParam = encodeURIComponent(booking.billNo);
      const sep = webAppUrl.includes('?') ? '&' : '?';
      await fetch(`${webAppUrl}${sep}action=upsert&billNo=${billParam}&rowJson=${rowParam}`, {
        method: 'GET',
        mode: 'no-cors'
      });
      return true;
    }
  } catch (err) {
    console.error('upsertToGoogleSheet error:', err);
    return false;
  }
}

/**
 * Delete a booking row in Google Sheet by billNo, id, or pnr
 */
export async function deleteFromGoogleSheet(
  webAppUrl: string, 
  identifiers: { billNo: string; id?: string; pnr?: string } | string
): Promise<boolean> {
  try {
    if (!webAppUrl || !webAppUrl.startsWith('https://script.google.com/')) return false;

    const billNo = typeof identifiers === 'string' ? identifiers : identifiers.billNo;
    const id = typeof identifiers === 'object' ? (identifiers.id || '') : '';
    const pnr = typeof identifiers === 'object' ? (identifiers.pnr || '') : '';

    const payload = {
      action: 'delete',
      billNo,
      id,
      pnr
    };

    // Attempt POST
    try {
      await fetch(webAppUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
    } catch {
      // Fallback via GET query parameters
      const separator = webAppUrl.includes('?') ? '&' : '?';
      const deleteUrl = `${webAppUrl}${separator}action=delete&billNo=${encodeURIComponent(billNo)}&id=${encodeURIComponent(id)}&pnr=${encodeURIComponent(pnr)}&_t=${Date.now()}`;
      await fetch(deleteUrl, { method: 'GET' });
    }

    return true;
  } catch (err) {
    console.error('deleteFromGoogleSheet error:', err);
    return false;
  }
}

/**
 * Full batch sync of all current bookings to Google Sheet
 */
export async function fullBatchSyncToSheet(webAppUrl: string, bookings: Booking[]): Promise<boolean> {
  try {
    if (!webAppUrl || !webAppUrl.startsWith('https://script.google.com/')) return false;

    const rows = bookings.map((b, idx) => bookingToSheetRow(b, idx));
    const payload = {
      action: 'syncAll',
      rows
    };

    await fetch(webAppUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    });

    return true;
  } catch (err) {
    console.error('fullBatchSyncToSheet error:', err);
    return false;
  }
}
