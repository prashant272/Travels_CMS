/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Train, 
  Plane, 
  Bus, 
  Calendar, 
  User, 
  Phone, 
  DollarSign, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { Booking, BookingMode, AgencyProfile } from '../types/crm';
import { 
  getAllTrains, 
  lookupCustomerByPhone, 
  generateNextBillNo 
} from '../services/storageService';
import { 
  MAJOR_AIRPORTS, 
  MAJOR_BUS_CITIES, 
  TRAVEL_CLASSES, 
  TrainInfo 
} from '../data/travelData';

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Booking) => void;
  existingBookings: Booking[];
  agency: AgencyProfile;
}

export const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingBookings,
  agency
}) => {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const allTrains = useMemo(() => getAllTrains(), []);

  // Form State
  const [mode, setMode] = useState<BookingMode>('train');
  const [billNo, setBillNo] = useState('');
  const [bookingDate, setBookingDate] = useState(todayStr);
  const [doj, setDoj] = useState(todayStr);

  // Train specific
  const [trainNumber, setTrainNumber] = useState('');
  const [trainName, setTrainName] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [busOperator, setBusOperator] = useState('');
  const [trainSuggestions, setTrainSuggestions] = useState<TrainInfo[]>([]);
  const [activeTrain, setActiveTrain] = useState<TrainInfo | null>(null);

  // Route & Class
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [travelClass, setTravelClass] = useState('3rd Ac');
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);

  // Explicit Dropdown Visibility State (Prevents double-click / re-popup bug)
  const [showTrainDropdown, setShowTrainDropdown] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.train-input-group')) setShowTrainDropdown(false);
      if (!target.closest('.from-input-group')) setShowFromDropdown(false);
      if (!target.closest('.to-input-group')) setShowToDropdown(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Customer Details
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerLookupHit, setCustomerLookupHit] = useState<{ totalBookings: number; totalDue: number } | null>(null);
  const [passengerDetails, setPassengerDetails] = useState('');
  const [remarks, setRemarks] = useState('');

  // Financials stored as clean strings to completely avoid leading zero bugs (e.g. "0500")
  const [ticketAmount, setTicketAmount] = useState<string>('');
  const [charge, setCharge] = useState<string>(agency.defaultCharge ? String(agency.defaultCharge) : '150');
  const [amountReceived, setAmountReceived] = useState<string>('');

  // Numeric equivalents for calculation
  const numTicketAmount = parseFloat(ticketAmount) || 0;
  const numCharge = parseFloat(charge) || 0;
  const numReceived = parseFloat(amountReceived) || 0;
  const netAmount = numTicketAmount + numCharge;
  const customerAmount = netAmount;
  const due = Math.max(0, netAmount - numReceived);
  const profit = numCharge;

  // Errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Generate next bill number on mount
  useEffect(() => {
    setBillNo(generateNextBillNo(existingBookings));
  }, [existingBookings]);

  // Adjust default class when mode switches
  useEffect(() => {
    if (mode === 'train') setTravelClass('3rd Ac');
    else if (mode === 'flight') setTravelClass('Economy');
    else if (mode === 'bus') setTravelClass('AC Sleeper (2+1)');
  }, [mode]);

  // Train Search & Route Autocomplete (matches number, name, or route)
  useEffect(() => {
    if (mode !== 'train' || !trainNumber.trim()) {
      setTrainSuggestions([]);
      return;
    }
    const cleanQuery = trainNumber.trim().toLowerCase();
    const matches = allTrains.filter(t => 
      t.number.includes(cleanQuery) || 
      t.name.toLowerCase().includes(cleanQuery)
    );
    setTrainSuggestions(matches.slice(0, 10));
  }, [trainNumber, mode, allTrains]);

  // Station Suggestions based on selected train, airport, or bus city
  useEffect(() => {
    if (mode === 'train') {
      if (activeTrain && activeTrain.stations.length > 0) {
        if (fromStation.trim()) {
          setFromSuggestions(activeTrain.stations.filter(s => s.toLowerCase().includes(fromStation.toLowerCase())));
        } else {
          setFromSuggestions(activeTrain.stations);
        }
        if (toStation.trim()) {
          setToSuggestions(activeTrain.stations.filter(s => s.toLowerCase().includes(toStation.toLowerCase())));
        } else {
          setToSuggestions(activeTrain.stations);
        }
      } else {
        if (fromStation.trim()) {
          const allStops = Array.from(new Set(allTrains.flatMap(t => t.stations)));
          setFromSuggestions(allStops.filter(s => s.toLowerCase().includes(fromStation.toLowerCase())).slice(0, 10));
        } else {
          setFromSuggestions([]);
        }
        if (toStation.trim()) {
          const allStops = Array.from(new Set(allTrains.flatMap(t => t.stations)));
          setToSuggestions(allStops.filter(s => s.toLowerCase().includes(toStation.toLowerCase())).slice(0, 10));
        } else {
          setToSuggestions([]);
        }
      }
    } else if (mode === 'flight') {
      const airportList = MAJOR_AIRPORTS.map(a => `${a.city} (${a.code}) - ${a.name}`);
      setFromSuggestions(airportList.filter(a => a.toLowerCase().includes(fromStation.toLowerCase())).slice(0, 8));
      setToSuggestions(airportList.filter(a => a.toLowerCase().includes(toStation.toLowerCase())).slice(0, 8));
    } else if (mode === 'bus') {
      setFromSuggestions(MAJOR_BUS_CITIES.filter(c => c.toLowerCase().includes(fromStation.toLowerCase())).slice(0, 8));
      setToSuggestions(MAJOR_BUS_CITIES.filter(c => c.toLowerCase().includes(toStation.toLowerCase())).slice(0, 8));
    }
  }, [mode, activeTrain, fromStation, toStation, allTrains]);

  // Clean numeric input helper: prevents 0500 and allows true blank
  const handleNumericChange = (val: string, setter: (v: string) => void) => {
    const digitsOnly = val.replace(/\D/g, '');
    if (!digitsOnly) {
      setter('');
      return;
    }
    const clean = digitsOnly.replace(/^0+(?=\d)/, '');
    setter(clean);
  };

  // Select train in exactly ONE single tap & immediately close suggestions
  const handleSelectTrain = (t: TrainInfo) => {
    setTrainNumber(t.number);
    setTrainName(t.name);
    setActiveTrain(t);
    setShowTrainDropdown(false);
    setTrainSuggestions([]);
    if (t.stations.length >= 2) {
      if (!fromStation) setFromStation(t.stations[0]);
      if (!toStation) setToStation(t.stations[t.stations.length - 1]);
    }
  };

  // Select From station in exactly ONE single tap & immediately close suggestions
  const handleSelectFrom = (stationName: string) => {
    setFromStation(stationName);
    setShowFromDropdown(false);
    setFromSuggestions([]);
  };

  // Select To station in exactly ONE single tap & immediately close suggestions
  const handleSelectTo = (stationName: string) => {
    setToStation(stationName);
    setShowToDropdown(false);
    setToSuggestions([]);
  };

  // Customer phone change & auto-lookup
  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setCustomerPhone(digitsOnly);

    if (digitsOnly.length === 10) {
      const prev = lookupCustomerByPhone(digitsOnly, existingBookings);
      if (prev) {
        setCustomerName(prev.name);
        setCustomerLookupHit({ totalBookings: prev.totalBookings, totalDue: prev.totalDue });
      } else {
        setCustomerLookupHit(null);
      }
    } else {
      setCustomerLookupHit(null);
    }
  };

  // Customer name change: alphabets & spaces only
  const handleNameChange = (val: string) => {
    const alphaOnly = val.replace(/[^a-zA-Z\s]/g, '');
    setCustomerName(alphaOnly);
  };

  // Form Validation & Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!doj) newErrors.doj = 'Date of journey is required';
    if (mode === 'train' && !trainNumber.trim()) newErrors.trainNumber = 'Train number is required';
    if (!fromStation.trim()) newErrors.fromStation = 'Origin station is required';
    if (!toStation.trim()) newErrors.toStation = 'Destination station is required';

    if (!customerPhone || customerPhone.length !== 10) {
      newErrors.customerPhone = 'Valid 10-digit mobile number required (6200000000 - 9999999999)';
    } else {
      const numVal = parseInt(customerPhone, 10);
      if (numVal < 6000000000 || numVal > 9999999999) {
        newErrors.customerPhone = 'Phone must be between 6000000000 and 9999999999';
      }
    }

    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (numTicketAmount <= 0) {
      newErrors.ticketAmount = 'Ticket fare must be greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let paymentStatus: Booking['paymentStatus'] = 'unpaid';
    if (due <= 0) paymentStatus = 'paid';
    else if (numReceived > 0) paymentStatus = 'partial';

    const travelNumber = mode === 'train' 
      ? `${trainNumber.trim()} ${trainName ? '- ' + trainName.trim() : ''}`.trim()
      : mode === 'flight'
      ? (flightNumber.trim() ? `FLIGHT: ${flightNumber.trim()}` : 'FLIGHT: Domestic Flight')
      : (busOperator.trim() ? `BUS: ${busOperator.trim()}` : 'BUS: Intercity Bus');

    const newBooking: Booking = {
      id: billNo || `TRV-${Date.now().toString().slice(-6)}`,
      billNo,
      bookingDate,
      mode,
      trainNumber: mode === 'train' ? trainNumber.trim() : undefined,
      trainName: mode === 'train' ? trainName.trim() : undefined,
      travelNumber,
      doj,
      fromStation: fromStation.trim(),
      toStation: toStation.trim(),
      travelClass,
      customerName: customerName.trim(),
      customerPhone,
      pnr: '', // Clean: PNR removed from creation as requested
      ticketAmount: numTicketAmount,
      charge: numCharge,
      netAmount,
      customerAmount,
      amountReceived: numReceived,
      profit,
      due,
      paymentStatus,
      status: 'confirmed',
      passengerDetails: passengerDetails.trim(),
      remarks: remarks.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newBooking);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto text-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-amber-50/80 via-white to-sky-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center font-bold">
              {mode === 'train' ? <Train className="w-5 h-5 text-amber-600" /> : mode === 'flight' ? <Plane className="w-5 h-5 text-sky-600" /> : <Bus className="w-5 h-5 text-rose-600" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                New Travel Booking Entry
              </h2>
              <p className="text-xs text-slate-500">
                Bill No: <span className="font-mono font-semibold text-emerald-600">{billNo}</span> • Real-time 2-Way Google Sheet Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Top Row: Travel Mode Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setMode('train')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold transition-all ${
                mode === 'train' 
                  ? 'bg-amber-500 text-slate-950 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Train className="w-4 h-4" />
              <span>IRCTC Train</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('flight')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold transition-all ${
                mode === 'flight' 
                  ? 'bg-sky-500 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Air Flight</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('bus')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold transition-all ${
                mode === 'bus' 
                  ? 'bg-rose-500 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>Intercity Bus</span>
            </button>
          </div>

          {/* Booking Date & DOJ with prominent calendar indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>📅 Booking Date</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Calendar Pick</span>
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-slate-50 hover:bg-white border-2 border-emerald-300 hover:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold shadow-xs cursor-pointer"
                title="Click to select booking date from calendar"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-800 font-extrabold">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>📅 Date of Journey (DOJ) *</span>
                </span>
                <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">Required</span>
              </label>
              <input
                type="date"
                value={doj}
                onChange={(e) => setDoj(e.target.value)}
                className="w-full bg-amber-50/40 hover:bg-white border-2 border-amber-400 hover:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold shadow-xs cursor-pointer"
                title="Click to select journey date from calendar"
              />
              {errors.doj && <p className="text-rose-600 text-xs mt-1 font-bold">{errors.doj}</p>}
            </div>
          </div>

          {/* Train Specific: Number & Auto-Suggest */}
          {mode === 'train' && (
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
              <label className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-amber-600" />
                IRCTC Train Number &amp; Live Suggestions (Only Numbers) *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
                <div className="train-input-group relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Type Train Number (e.g. 12301, 12393, 22436)"
                    value={trainNumber}
                    onFocus={() => {
                      if (trainSuggestions.length > 0) setShowTrainDropdown(true);
                    }}
                    onChange={(e) => {
                      const numOnly = e.target.value.replace(/\D/g, '');
                      setTrainNumber(numOnly);
                      setShowTrainDropdown(true);
                      const match = allTrains.find(t => t.number === numOnly);
                      if (match) {
                        setTrainName(match.name);
                        setActiveTrain(match);
                      }
                    }}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 font-mono font-bold"
                  />
                  {errors.trainNumber && <p className="text-rose-600 text-xs mt-1">{errors.trainNumber}</p>}

                  {/* Train Suggestions Dropdown (Opens on typing, closes on 1st tap) */}
                  {showTrainDropdown && trainSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-96 z-30 mt-1 bg-white border border-amber-300 rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto">
                      {trainSuggestions.map((t) => (
                        <button
                          key={t.number}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectTrain(t);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-amber-50 text-xs border-b border-slate-100 last:border-0 flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <span className="font-mono font-bold text-amber-700 mr-2">{t.number}</span>
                            <span className="text-slate-800 font-medium">{t.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">{t.stations.length} stops</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Train Name (Auto-filled on number selection)"
                    value={trainName}
                    onChange={(e) => setTrainName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {activeTrain && (
                <p className="text-[11px] text-amber-800 flex items-center gap-1 font-medium">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  Route stops available in From / To suggestions below (Click to pick or type station).
                </p>
              )}
            </div>
          )}

          {/* Flight Specific: Airline & Flight No */}
          {mode === 'flight' && (
            <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-200 space-y-2">
              <label className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-sky-600" />
                <span>Airline &amp; Flight Number (e.g. Indigo 6E-204, Air India AI-102)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Indigo 6E-204, Air India AI-102, Vistara UK-945"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>
          )}

          {/* Bus Specific: Operator & Service */}
          {mode === 'bus' && (
            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-2">
              <label className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-rose-600" />
                <span>Bus Operator &amp; Service Type (e.g. Zingbus AC Sleeper, Volvo)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Zingbus AC Sleeper, IntrCity SmartBus, Volvo Multi-Axle"
                value={busOperator}
                onChange={(e) => setBusOperator(e.target.value)}
                className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
              />
            </div>
          )}

          {/* Route: From & To Stations / Airports / Cities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* From Station */}
            <div className="from-input-group relative">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {mode === 'train' ? 'From Station *' : mode === 'flight' ? 'Departure Airport *' : 'Boarding City *'}
              </label>
              <input
                type="text"
                placeholder={mode === 'train' ? 'e.g. Patna Jn (PNBE)' : mode === 'flight' ? 'e.g. Delhi (DEL)' : 'e.g. Delhi ISBT'}
                value={fromStation}
                onFocus={() => {
                  if (fromSuggestions.length > 0) setShowFromDropdown(true);
                }}
                onChange={(e) => {
                  setFromStation(e.target.value);
                  setShowFromDropdown(true);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              {errors.fromStation && <p className="text-rose-600 text-xs mt-1">{errors.fromStation}</p>}

              {/* Suggestions Dropdown (Opens on typing, closes on 1st tap) */}
              {showFromDropdown && fromSuggestions.length > 0 && fromStation.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                  <div className="p-1.5 text-[10px] text-slate-500 font-semibold border-b border-slate-100">
                    Click to pick route:
                  </div>
                  {fromSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectFrom(s);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* To Station */}
            <div className="to-input-group relative">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {mode === 'train' ? 'To Station *' : mode === 'flight' ? 'Arrival Airport *' : 'Drop City *'}
              </label>
              <input
                type="text"
                placeholder={mode === 'train' ? 'e.g. New Delhi (NDLS)' : mode === 'flight' ? 'e.g. Mumbai (BOM)' : 'e.g. Patna Bairiya'}
                value={toStation}
                onFocus={() => {
                  if (toSuggestions.length > 0) setShowToDropdown(true);
                }}
                onChange={(e) => {
                  setToStation(e.target.value);
                  setShowToDropdown(true);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              {errors.toStation && <p className="text-rose-600 text-xs mt-1">{errors.toStation}</p>}

              {/* Suggestions Dropdown (Opens on typing, closes on 1st tap) */}
              {showToDropdown && toSuggestions.length > 0 && toStation.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                  <div className="p-1.5 text-[10px] text-slate-500 font-semibold border-b border-slate-100">
                    Click to pick route:
                  </div>
                  {toSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectTo(s);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Travel Class */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Class *
              </label>
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              >
                {TRAVEL_CLASSES[mode].map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer Details: Strict Phone & Name rules */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer Mobile: 10 Digits strictly */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    Customer Mobile Number (10 Digits) *
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{customerPhone.length}/10</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-semibold">+91</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="9876543210"
                    value={customerPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-12 pr-3 py-2 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {errors.customerPhone && <p className="text-rose-600 text-xs mt-1">{errors.customerPhone}</p>}

                {/* Auto-lookup banner */}
                {customerLookupHit && (
                  <div className="mt-2 p-2 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                    <span className="flex items-center gap-1 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Returning Customer: {customerLookupHit.totalBookings} past booking(s)
                    </span>
                    {customerLookupHit.totalDue > 0 && (
                      <span className="text-amber-800 font-bold">
                        Pending Due: ₹{customerLookupHit.totalDue.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name (Alphabets Only) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 capitalize font-medium"
                />
                {errors.customerName && <p className="text-rose-600 text-xs mt-1">{errors.customerName}</p>}
              </div>
            </div>

            {/* Passenger Details & Remarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Passenger Details (Age, Gender, Berth/Seat)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh (35/M, B2-14), Sunita (32/F, B2-15)"
                  value={passengerDetails}
                  onChange={(e) => setPassengerDetails(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Remarks / Internal Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regular passenger, promised balance next day"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Financials & Auto Calculations */}
          <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200 space-y-4">
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Fare Breakdown &amp; Financials (Only Numbers)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Ticket Fare */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ticket Fare (₹) *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Fare amount"
                  value={ticketAmount}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleNumericChange(e.target.value, setTicketAmount)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:border-emerald-500 font-bold"
                />
                {errors.ticketAmount && <p className="text-rose-600 text-xs mt-1">{errors.ticketAmount}</p>}
              </div>

              {/* Service Charge */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agency Fee / Charge (₹)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Service fee"
                  value={charge}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleNumericChange(e.target.value, setCharge)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              {/* Net Amount / Customer Amount (Auto-Calculated) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Net Client Amount</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Auto</span>
                </label>
                <div className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-sm font-bold text-emerald-800 font-mono shadow-xs">
                  ₹{netAmount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Amount Received */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount Received (₹)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Amount received"
                  value={amountReceived}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleNumericChange(e.target.value, setAmountReceived)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              {/* Agent Profit (Auto-Calculated) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Profit Margin</span>
                  <span className="text-[10px] text-teal-700 font-bold">Auto</span>
                </label>
                <div className="w-full bg-white border border-teal-300 rounded-xl px-3 py-2 text-sm font-bold text-teal-800 font-mono shadow-xs">
                  +₹{profit.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Pending Due (Auto-Calculated) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Outstanding Due</span>
                  <span className="text-[10px] text-amber-700 font-bold">Auto</span>
                </label>
                <div className={`w-full bg-white border rounded-xl px-3 py-2 text-sm font-bold font-mono shadow-xs ${
                  due > 0 ? 'border-amber-400 text-amber-800' : 'border-slate-300 text-slate-500'
                }`}>
                  {due > 0 ? `₹${due.toLocaleString('en-IN')}` : '₹0 (Paid)'}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save &amp; Record Booking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
