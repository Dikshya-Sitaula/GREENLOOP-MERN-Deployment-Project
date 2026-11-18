import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';
import { getToken, setToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!getToken());

  useEffect(() => {
    if (!getToken()) return;
    authApi
      .fetchMe()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, []);

  const startSession = useCallback(({ token, user: u }) => {
    setToken(token);
    setUser(u);
    return u;
  }, []);

  const login = useCallback((creds) => authApi.login(creds).then(startSession), [startSession]);
  const register = useCallback((body) => authApi.register(body).then(startSession), [startSession]);
  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, isAuthed: !!user, login, register, logout, setUser }),
    [user, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
