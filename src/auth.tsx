import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearToken, getToken, setToken } from './api/http';
import { currentUser, login as apiLogin, logout as apiLogout, AdminUser, LoginResult } from './api';

interface AuthState {
  user: AdminUser | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<LoginResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  signIn: async () => {
    throw new Error('not ready');
  },
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    currentUser()
      .then((u) => setUser(u))
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      signIn: async (username, password) => {
        const res = await apiLogin(username, password);
        setToken(res.token);
        const u = await currentUser();
        setUser(u);
        return res;
      },
      signOut: async () => {
        try {
          await apiLogout();
        } catch {
          /* logout must always clear local state */
        }
        clearToken();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
