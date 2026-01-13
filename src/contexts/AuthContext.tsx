import {
  createContext,
  useContext,
  useState,
 type ReactNode,
  useEffect,
} from "react";
import { getAccessToken, login, refresh, logout } from "../utils/auth.utils"; // Adjust path

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (username: string, password: string) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!getAccessToken()
  );

  // Optional: Sync state if cookies change externally (rare, but for completeness)
  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!getAccessToken());
    window.addEventListener("storage", checkAuth); // Cookies don't trigger this, but if you mix with localStorage elsewhere
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, login, refresh, logout }}
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
