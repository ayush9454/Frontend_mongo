import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { authService, errorMessage, onSessionExpired } from "../services/api";
import type { User } from "../types";
interface AuthContextType {
  user: User | null;
  loading: boolean;
  sessionError: string;
  login: (user: User, token: string) => void;
  logout: () => void;
  retrySession: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within an AuthProvider");
  return value;
};
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null),
    [loading, setLoading] = useState(true),
    [sessionError, setSessionError] = useState("");
  const generation = useRef(0);
  const logout = useCallback(() => {
    generation.current++;
    setUser(null);
    setLoading(false);
    setSessionError("");
    ["user", "token", "userId", "bookings"].forEach((key) =>
      localStorage.removeItem(key),
    );
  }, []);
  const retrySession = useCallback(() => {
    const run = ++generation.current;
    if (!localStorage.getItem("token")) {
      setLoading(false);
      setUser(null);
      return;
    }
    setLoading(true);
    setSessionError("");
    authService
      .me()
      .then((response) => {
        if (run === generation.current) {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      })
      .catch((err) => {
        if (run === generation.current) {
          setUser(null);
          setSessionError(
            errorMessage(err, "Unable to verify your session. Please retry."),
          );
        }
      })
      .finally(() => {
        if (run === generation.current) setLoading(false);
      });
  }, []);
  useEffect(() => {
    const unsubscribe = onSessionExpired(logout);
    const counter = generation;
    retrySession();
    return () => {
      counter.current++;
      unsubscribe();
    };
  }, [logout, retrySession]);
  const login = useCallback((details: User, token: string) => {
    generation.current++;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(details));
    localStorage.removeItem("userId");
    setUser(details);
    setLoading(false);
    setSessionError("");
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, loading, sessionError, login, logout, retrySession }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
