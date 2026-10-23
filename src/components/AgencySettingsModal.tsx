/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Settings, Building2, Phone, Mail, MapPin, KeyRound, CreditCard, DollarSign, Check } from 'lucide-react';
import { AgencyProfile } from '../types/crm';

interface AgencySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency: AgencyProfile;
  onSaveAgency: (profile: AgencyProfile) => void;
}

export const AgencySettingsModal: React.FC<AgencySettingsModalProps> = ({
  isOpen,
  onClose,
  agency,
  onSaveAgency
}) => {
  const [name, setName] = useState(agency.name);
  const [phone, setPhone] = useState(agency.phone);
  const [email, setEmail] = useState(agency.email);
  const [address, setAddress] = useState(agency.address);
  const [gstNumber, setGstNumber] = useState(agency.gstNumber || '');
  const [upiId, setUpiId] = useState(agency.upiId || '');
  const [defaultCharge, setDefaultCharge] = useState(agency.defaultCharge || 150);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AgencyProfile = {
      name: name.trim() || 'My Travel Agency',
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      gstNumber: gstNumber.trim(),
      upiId: upiId.trim(),
      defaultCharge: Number(defaultCharge) || 150
    };
    onSaveAgency(updated);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto text-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Agency Profile &amp; Preferences</h2>
              <p className="text-xs text-slate-500">Branding on invoices, UPI payments and Agency details.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Agency Business Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Helpline Mobile Phone *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Office / Shop Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Shop No. 4, Station Road"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Payment UPI ID *</span>
                <span className="text-[10px] text-emerald-700 font-bold">For Due Invoices</span>
              </label>
              <input
                type="text"
                placeholder="agency@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-300 rounded-xl px-3 py-2 text-emerald-800 font-mono font-bold focus:bg-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GSTIN Number (Optional)
              </label>
              <input
                type="text"
                placeholder="07AAAAA0000A1Z5"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono uppercase focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Ticket Service Fee / Charge (₹)
              </label>
              <input
                type="number"
                min="0"
                value={defaultCharge}
                onChange={(e) => setDefaultCharge(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Default profit/service fee automatically added to new tickets.</p>
            </div>
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
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
            >
              {savedNotice ? <Check className="w-4 h-4" /> : null}
              <span>{savedNotice ? 'Saved!' : 'Save Agency Profile'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
