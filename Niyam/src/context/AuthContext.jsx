import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.observeAuthState((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (payload) => {
    const nextUser = await authService.login(payload);
    setUser(nextUser);
    return nextUser;
  };

  const loginWithGoogle = async () => {
    const nextUser = await authService.loginWithGoogle();
    setUser(nextUser);
    return nextUser;
  };

  const signup = async (payload) => {
    const nextUser = await authService.signup(payload);
    setUser(nextUser);
    return nextUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, loginWithGoogle, signup, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
