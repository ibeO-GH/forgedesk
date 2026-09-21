import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthUser } from "../api/auth";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loginUser: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem("forgedesk_user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("forgedesk_token");
  });

  function loginUser(authUser: AuthUser, authToken: string) {
    setUser(authUser);
    setToken(authToken);

    localStorage.setItem("forgedesk_user", JSON.stringify(authUser));
    localStorage.setItem("forgedesk_token", authToken);
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem("forgedesk_user");
    localStorage.removeItem("forgedesk_token");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
