import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUser, type AuthUser } from "../api/auth";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  loginUser: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem("forgedesk_token");

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);
        setToken(storedToken);

        localStorage.setItem("forgedesk_user", JSON.stringify(currentUser));
      } catch {
        localStorage.removeItem("forgedesk_token");
        localStorage.removeItem("forgedesk_user");

        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

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
        isLoading,
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
