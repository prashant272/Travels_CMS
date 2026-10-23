/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  FileSpreadsheet, 
  Settings, 
  PlusCircle, 
  Users, 
  Clock, 
  Layers, 
  Menu, 
  X,
  Eye, 
  EyeOff, 
  RefreshCw, 
  Globe, 
  LogOut
} from 'lucide-react';
import { AgencyProfile, GoogleSheetConfig, WhatsAppConfig, AuthUser } from '../types/crm';
import { SharePortalModal } from './SharePortalModal';

interface HeaderProps {
  agency: AgencyProfile;
  sheetConfig: GoogleSheetConfig;
  waConfig: WhatsAppConfig;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  activeTab: 'dashboard' | 'customer_pnr' | 'pending_dues';
  setActiveTab: (tab: 'dashboard' | 'customer_pnr' | 'pending_dues') => void;
  onOpenNewBooking: () => void;
  onOpenSheetSync: () => void;
  onOpenWaSettings: () => void;
  onOpenAgencySettings: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  privacyMask: boolean;
  setPrivacyMask: (val: boolean) => void;
  showToast?: (msg: string) => void;
}

export const getLivePortalUrl = (): string => {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin || window.location.href;
  }
  return '';
};

export const Header: React.FC<HeaderProps> = ({
  agency,
  sheetConfig,
  waConfig,
  currentUser,
  onLogout,
  activeTab,
  setActiveTab,
  onOpenNewBooking,
  onOpenSheetSync,
  onOpenWaSettings,
  onOpenAgencySettings,
  onTriggerSync,
  isSyncing,
  privacyMask,
  setPrivacyMask,
  showToast
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleTabSwitch = (tab: 'dashboard' | 'customer_pnr' | 'pending_dues') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Agency Info - Clean without extra tags or subtitles */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-black text-xl tracking-wider">
              YD
            </div>
            <div>
              <h1 className="font-black text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                {agency.name || 'YatriDesk Travel CRM'}
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Tabs - Bold & Ergonomic Menu Buttons */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button
              onClick={() => handleTabSwitch('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-sm font-black border border-slate-200/80 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-bold border border-transparent'
              }`}
            >
              <Layers className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleTabSwitch('customer_pnr')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'customer_pnr'
                  ? 'bg-white text-slate-900 shadow-sm font-black border border-slate-200/80 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-bold border border-transparent'
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === 'customer_pnr' ? 'text-sky-500' : 'text-slate-400'}`} />
              <span>Booking Manage</span>
            </button>
            <button
              onClick={() => handleTabSwitch('pending_dues')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'pending_dues'
                  ? 'bg-white text-slate-900 shadow-sm font-black border border-slate-200/80 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-bold border border-transparent'
              }`}
            >
              <Clock className={`w-4 h-4 ${activeTab === 'pending_dues' ? 'text-rose-500' : 'text-slate-400'}`} />
              <span>Pending Due</span>
            </button>
          </nav>

          {/* Action Tools & Integration Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* 2-Way Google Sheet Sync Button */}
            <button
              onClick={onOpenSheetSync}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                sheetConfig.isConnected
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Google Sheet Live 2-Way Sync"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline font-bold">Sheet:</span>
              <span className={`w-2 h-2 rounded-full ${sheetConfig.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className="text-[11px] font-bold">{sheetConfig.isConnected ? 'Live Sync' : 'Link Sheet'}</span>
            </button>

            {/* Quick Instant Sync Trigger */}
            {sheetConfig.isConnected && (
              <button
                onClick={onTriggerSync}
                disabled={isSyncing}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Sync Now with Google Sheet"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            )}

            {/* Privacy Mask Toggle */}
            <button
              onClick={() => setPrivacyMask(!privacyMask)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
              title={privacyMask ? "Unhide financial amounts" : "Hide financial amounts"}
            >
              {privacyMask ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
            </button>

            {/* Authenticated User & Sign Out */}
            {currentUser && (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 border border-slate-200 rounded-xl px-2 py-1 shadow-2xs">
                {currentUser.picture ? (
                  <img
                    src={currentUser.picture}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-300"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black text-[11px] flex items-center justify-center shadow-xs uppercase">
                    {(currentUser.name || currentUser.email).charAt(0)}
                  </div>
                )}
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[11px] font-extrabold text-slate-900 leading-tight max-w-[120px] truncate">
                    {currentUser.name || currentUser.email.split('@')[0]}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono leading-none truncate max-w-[120px]">
                    {currentUser.email}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-0.5 cursor-pointer"
                  title={`Sign out (${currentUser.email})`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Agency Settings */}
            <button
              onClick={onOpenAgencySettings}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Agency Settings & Profile"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* New Booking Primary CTA */}
            <button
              onClick={onOpenNewBooking}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Booking</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu - Eye-Comfort Light */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 flex flex-col gap-2 animate-fadeIn">
            <button
              onClick={() => handleTabSwitch('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-extrabold ${
                activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-600" />
              Dashboard
            </button>
            <button
              onClick={() => handleTabSwitch('customer_pnr')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-extrabold ${
                activeTab === 'customer_pnr' ? 'bg-sky-500 text-white font-black' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-sky-600" />
              Booking Manage
            </button>
            <button
              onClick={() => handleTabSwitch('pending_dues')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-extrabold ${
                activeTab === 'pending_dues' ? 'bg-rose-500 text-white font-black' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4 text-rose-600" />
              Pending Due
            </button>

            <button
              onClick={() => { setIsShareModalOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Globe className="w-4 h-4 text-sky-600" />
              Share / Open Portal URL (Phone &amp; Laptop)
            </button>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => { onOpenSheetSync(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                {sheetConfig.isConnected ? 'Google Sheet Synced' : 'Link Google Sheet'}
              </button>
              <button
                onClick={() => { onOpenAgencySettings(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 font-bold"
              >
                <Settings className="w-3.5 h-3.5" />
                Settings
              </button>
            </div>

            {/* Mobile User Profile & Logout */}
            {currentUser && (
              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                    {(currentUser.name || currentUser.email).charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[150px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block truncate max-w-[150px]">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Portal Modal */}
      {isShareModalOpen && (
        <SharePortalModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          agencyName={agency.name}
        />
      )}
    </header>
  );
};
