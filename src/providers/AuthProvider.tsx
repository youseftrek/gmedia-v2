"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@/lib/auth";

export type AuthContextType = {
  isAuthenticated: boolean;
  session: Session | null;
  setSession: (session: Session | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  session: null,
  setSession: () => {},
  setIsAuthenticated: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (data.success) {
        setSession(data.session);
        setIsAuthenticated(true);
      }
    };
    fetchSession();
  }, []);

  const logout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });
    if (response.ok) {
      setIsAuthenticated(false);
      setSession(null);
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        session,
        setSession,
        setIsAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
