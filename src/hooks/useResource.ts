import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { errorMessage } from "../services/api";
const subscribers = new Set<() => void>();
export function invalidateResources() {
  subscribers.forEach((listener) => listener());
}
export function useResource<T>(loader: () => Promise<T>) {
  const { user } = useAuth();
  const [data, setData] = useState<T | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const current = useRef(0);
  const reload = useCallback(async () => {
    const request = ++current.current;
    setLoading(true);
    setError("");
    try {
      const value = await loader();
      if (request === current.current) setData(value);
    } catch (err) {
      if (request === current.current)
        setError(errorMessage(err, "Unable to load data. Please retry."));
    } finally {
      if (request === current.current) setLoading(false);
    }
  }, [loader]);
  useEffect(() => {
    const counter = current;
    setData(null);
    void reload();
    subscribers.add(reload);
    const onFocus = () => {
      void reload();
    };
    window.addEventListener("focus", onFocus);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void reload();
    }, 60000);
    return () => {
      ++counter.current;
      subscribers.delete(reload);
      window.removeEventListener("focus", onFocus);
      window.clearInterval(timer);
    };
  }, [reload, user?.userId]);
  return { data, loading, error, reload };
}
