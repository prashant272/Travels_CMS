/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, CheckCircle2, Lock } from 'lucide-react';
import { AgencyProfile } from '../types/crm';
import { 
  AuthUser, 
  getGoogleClientId, 
  verifyGoogleAccessToken, 
  verifyGoogleCredentialJwt 
} from '../services/authService';
import { TravelBackground } from './TravelBackground';

interface LoginScreenProps {
  agency: AgencyProfile;
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  agency,
  onLoginSuccess
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successUser, setSuccessUser] = useState<AuthUser | null>(null);
  const [isGoogleReady, setIsGoogleReady] = useState<boolean>(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const clientId = getGoogleClientId();

  // Initialize official Google Identity Services (GIS)
  useEffect(() => {
    let intervalId: any;

    const setupGoogleAuth = () => {
      const google = (window as any).google;
      if (!google || !google.accounts || !google.accounts.id || !clientId) return;

      clearInterval(intervalId);

      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response && response.credential) {
              setLoading(true);
              setErrorMessage(null);
              const result = verifyGoogleCredentialJwt(response.credential);
              setLoading(false);

              if (result.success && result.user) {
                setSuccessUser(result.user);
                setTimeout(() => onLoginSuccess(result.user!), 400);
              } else {
                setErrorMessage('Connect with it team (Mr Prashant Jha)');
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true
        });

        // Render official Google button into the container
        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            shape: 'pill',
            text: 'continue_with',
            logo_alignment: 'left',
            width: 280
          });
          setIsGoogleReady(true);
        }
      } catch (err) {
        console.warn('Google Auth Init:', err);
      }
    };

    setupGoogleAuth();
    intervalId = setInterval(setupGoogleAuth, 300);
    return () => clearInterval(intervalId);
  }, [clientId, onLoginSuccess]);

  // Click handler for Google OAuth 2.0 Popup
  const handleGoogleOAuthLogin = () => {
    setErrorMessage(null);

    const google = (window as any).google;
    if (google?.accounts?.oauth2?.initTokenClient && clientId) {
      try {
        setLoading(true);
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          prompt: 'select_account',
          callback: async (tokenResponse: any) => {
            setLoading(false);
            if (tokenResponse.error) {
              if (tokenResponse.error !== 'popup_closed_by_user') {
                setErrorMessage('Connect with it team (Mr Prashant Jha)');
              }
              return;
            }

            if (tokenResponse.access_token) {
              setLoading(true);
              const res = await verifyGoogleAccessToken(tokenResponse.access_token);
              setLoading(false);

              if (res.success && res.user) {
                setSuccessUser(res.user);
                setTimeout(() => onLoginSuccess(res.user!), 400);
              } else {
                setErrorMessage('Connect with it team (Mr Prashant Jha)');
              }
            }
          }
        });

        tokenClient.requestAccessToken();
        return;
      } catch (err) {
        setLoading(false);
        console.error('OAuth token client error:', err);
      }
    }

    // Fallback: click rendered Google button
    if (googleBtnRef.current) {
      const btn = googleBtnRef.current.querySelector('div[role="button"]') as HTMLElement;
      if (btn) {
        btn.click();
        return;
      }
    }
  };

  return (
    <div className="min-h-dvh w-full travel-canvas-bg flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans text-slate-800 relative overflow-x-hidden">
      
      {/* Indian Railways, Flight, and Luxury Bus Multi-Modal Travel Background */}
      <TravelBackground opacityPreset="balanced" showControls={true} />

      {/* Top Header - Mobile and Desktop Responsive */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-black text-xl tracking-wider">
            YD
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
              {agency.name || 'YatriDesk Travel CRM'}
            </h1>
            <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Agency Workstation</span>
            </p>
          </div>
        </div>
      </header>

      {/* Center Auth Box - Eye-Comfort Light Theme */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-sm sm:max-w-md">
          
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6 relative overflow-hidden text-center transition-all">
            
            {/* Top Accent Ribbon */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

            {/* Travel Agency Identity & Brand Icon */}
            <div className="space-y-2 pt-1">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-xs">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Travel Desk Sign In
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Authorized Agency Google Account Access
              </p>
            </div>

            {/* Error Message: Exactly "Connect with it team (Mr Prashant Jha)" */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 text-center shadow-xs animate-shake">
                <div className="flex items-center justify-center gap-2 font-extrabold text-rose-800 text-xs sm:text-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Success State */}
            {successUser && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-center space-y-2 animate-bounce">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-emerald-800">Authenticated with Google</h3>
                  <p className="text-xs text-emerald-700 font-mono font-bold">{successUser.email}</p>
                </div>
              </div>
            )}

            {/* Exactly ONE Google Sign In Button */}
            {!successUser && (
              <div className="pt-2 flex flex-col items-center w-full">
                {/* Official Google Identity Button (Rendered directly) */}
                <div
                  ref={googleBtnRef}
                  className={`w-full flex justify-center min-h-[44px] ${!isGoogleReady ? 'hidden' : ''}`}
                />

                {/* Fallback button shown ONLY before Google SDK finishes rendering */}
                {!isGoogleReady && (
                  <button
                    onClick={handleGoogleOAuthLogin}
                    disabled={loading}
                    className="w-full max-w-[280px] flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-white border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm shadow-md hover:bg-slate-50 hover:border-slate-400 active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                    </svg>
                    <span>{loading ? 'Authenticating with Google...' : 'Continue with Google'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100">
              <span>🔒 Authorized Agent Workstation (8-Hour Eye Care Mode)</span>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 py-4 text-center text-xs text-slate-500">
        <p>© 2026 {agency.name || 'YatriDesk'}. All rights reserved.</p>
      </footer>

    </div>
  );
};
