import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearToken, getToken, setToken } from './api/http';
import {
  currentUser,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  AdminUser,
  LoginResult,
} from './api';

interface AuthState {
  user: AdminUser | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<LoginResult & { is_admin: boolean }>;
  signUp: (data: {
    username: string;
    email?: string;
    nickname?: string;
    password: string;
    confirm_password: string;
  }) => Promise<LoginResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  signIn: async () => {
    throw new Error('not ready');
  },
  signUp: async () => {
    throw new Error('not ready');
  },
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // /api/admin/user/current answers {username, nickname, route_names, ...} and
  // marks administrators with the wildcard route "*" instead of is_admin.
  const normalize = (u: AdminUser): AdminUser => ({
    ...u,
    is_admin: !!u.is_admin || (u.route_names || []).includes('*'),
  });

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    currentUser()
      .then((u) => setUser(normalize(u)))
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
        const u = normalize(await currentUser());
        setUser(u);
        return { ...res, is_admin: !!u.is_admin };
      },
      signUp: async (data) => {
        const res = await apiRegister(data);
        setToken(res.token);
        const u = normalize(await currentUser());
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
