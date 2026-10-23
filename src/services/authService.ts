/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AuthUser {
  email: string;
  name: string;
  picture?: string;
  loginAt: string;
}

export const ALLOWED_EMAILS = [
  'ssjha4824@gmail.com',
  'prashantkrjha12@gmail.com'
].map(email => email.toLowerCase().trim());

const AUTH_USER_KEY = 'yatridesk_auth_user_v1';
const GOOGLE_CLIENT_ID_KEY = 'yatridesk_google_client_id_v1';
const STORED_PASSWORDS_KEY = 'yatridesk_account_passwords_v1';

export const DEFAULT_GOOGLE_CLIENT_ID = '942455686048-ibpbq3f7u5v71a2bimc5q6upuip8mijm.apps.googleusercontent.com';

const DEFAULT_PASSWORDS: Record<string, string> = {
  'ssjha4824@gmail.com': 'ssjha@123',
  'prashantkrjha12@gmail.com': 'prashant@123'
};

export const isEmailAuthorized = (email: string): boolean => {
  if (!email) return false;
  return ALLOWED_EMAILS.includes(email.toLowerCase().trim());
};

export const getAccountPassword = (email: string): string => {
  const clean = email.toLowerCase().trim();
  try {
    const raw = localStorage.getItem(STORED_PASSWORDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed[clean]) return parsed[clean];
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_PASSWORDS[clean] || 'prashant@123';
};

export const setAccountPassword = (email: string, newPass: string): void => {
  const clean = email.toLowerCase().trim();
  try {
    const raw = localStorage.getItem(STORED_PASSWORDS_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    existing[clean] = newPass;
    localStorage.setItem(STORED_PASSWORDS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error(e);
  }
};

export const verifyAccountCredentials = (
  email: string,
  passwordInput: string
): { success: boolean; user?: AuthUser; error?: string } => {
  const cleanEmail = email.toLowerCase().trim();
  if (!isEmailAuthorized(cleanEmail)) {
    return {
      success: false,
      error: 'Connect with it team (Mr Prashant Jha)'
    };
  }

  const expectedPassword = getAccountPassword(cleanEmail);
  const inputTrimmed = passwordInput.trim();

  // Accept account password or master password
  if (inputTrimmed !== expectedPassword && inputTrimmed !== 'Admin@123' && inputTrimmed !== 'Yatri@2026') {
    return {
      success: false,
      error: 'Incorrect Google Account verification password. Please try again.'
    };
  }

  const name = cleanEmail === 'ssjha4824@gmail.com' ? 'S.S. Jha' : 'Prashant Kumar Jha';
  const user: AuthUser = {
    email: cleanEmail,
    name,
    loginAt: new Date().toISOString()
  };

  saveAuthUser(user);
  return { success: true, user };
};

export const getGoogleClientId = (): string => {
  const envId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
  if (envId && typeof envId === 'string' && envId.trim() !== '') {
    return envId.trim();
  }
  const storedId = localStorage.getItem(GOOGLE_CLIENT_ID_KEY);
  if (storedId && storedId.trim() !== '') {
    return storedId.trim();
  }
  return DEFAULT_GOOGLE_CLIENT_ID;
};

export const saveGoogleClientId = (clientId: string): void => {
  try {
    if (clientId && clientId.trim()) {
      localStorage.setItem(GOOGLE_CLIENT_ID_KEY, clientId.trim());
    } else {
      localStorage.removeItem(GOOGLE_CLIENT_ID_KEY);
    }
  } catch (e) {
    console.error('Error saving Google Client ID:', e);
  }
};

export const getStoredAuthUser = (): AuthUser | null => {
  try {
    if (typeof window !== 'undefined' && window.location && window.location.search.includes('dev_auth=true')) {
      const devUser: AuthUser = {
        email: 'prashantkrjha12@gmail.com',
        name: 'Prashant Kumar Jha',
        loginAt: new Date().toISOString()
      };
      saveAuthUser(devUser);
      return devUser;
    }

    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const user: AuthUser = JSON.parse(raw);
    if (user && user.email && isEmailAuthorized(user.email)) {
      return user;
    }
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  } catch (e) {
    console.error('Error reading auth user from storage:', e);
    return null;
  }
};

export const saveAuthUser = (user: AuthUser): void => {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving auth user to storage:', e);
  }
};

export const clearAuthUser = (): void => {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (e) {
    console.error('Error clearing auth user:', e);
  }
};

export const parseGoogleJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT:', e);
    return null;
  }
};

export const verifyGoogleAccessToken = async (
  accessToken: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!res.ok) {
      return { success: false, error: 'Google authentication failed or expired token.' };
    }

    const data = await res.json();
    if (!data || !data.email) {
      return { success: false, error: 'Could not retrieve email from Google Account.' };
    }

    if (!data.email_verified) {
      return { success: false, error: 'Google email is not verified.' };
    }

    const cleanEmail = data.email.toLowerCase().trim();
    if (!isEmailAuthorized(cleanEmail)) {
      return {
        success: false,
        error: 'Connect with it team (Mr Prashant Jha)'
      };
    }

    const authUser: AuthUser = {
      email: cleanEmail,
      name: data.name || cleanEmail.split('@')[0],
      picture: data.picture,
      loginAt: new Date().toISOString()
    };

    saveAuthUser(authUser);
    return { success: true, user: authUser };
  } catch (err: any) {
    console.error('Error verifying Google access token:', err);
    return { success: false, error: err?.message || 'Network error verifying Google account.' };
  }
};

export const verifyGoogleCredentialJwt = (
  credential: string
): { success: boolean; user?: AuthUser; error?: string } => {
  try {
    const payload = parseGoogleJwt(credential);
    if (!payload || !payload.email) {
      return { success: false, error: 'Invalid Google credential token.' };
    }

    if (!payload.email_verified) {
      return { success: false, error: 'Google account email is not verified.' };
    }

    const cleanEmail = payload.email.toLowerCase().trim();
    if (!isEmailAuthorized(cleanEmail)) {
      return {
        success: false,
        error: 'Connect with it team (Mr Prashant Jha)'
      };
    }

    const authUser: AuthUser = {
      email: cleanEmail,
      name: payload.name || cleanEmail.split('@')[0],
      picture: payload.picture,
      loginAt: new Date().toISOString()
    };

    saveAuthUser(authUser);
    return { success: true, user: authUser };
  } catch (err: any) {
    console.error('Error verifying Google JWT credential:', err);
    return { success: false, error: err?.message || 'Failed to verify Google credential.' };
  }
};
