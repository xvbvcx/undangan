"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type ToastVariant = "info" | "success" | "error";
type ToastEntry = { id: number; message: string; variant: ToastVariant };

type ToastContextValue = {
  push: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const push = useCallback((message: string, variant: ToastVariant = "info") => {
    counter += 1;
    const id = counter;
    setToasts((current) => [...current, { id, message, variant }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.variant}`}>{toast.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  // Fallback to a noop logger so component code can call useToast() even when
  // rendered outside the provider (e.g. inside the standalone preview tree).
  if (!context) {
    return {
      push: (message: string, variant: ToastVariant = "info") => {
        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-console
          console[variant === "error" ? "error" : "log"](`[toast:${variant}] ${message}`);
        }
      }
    };
  }
  return context;
}

// Optional client-side hook for forms that want the same look as toasts but
// inline. Keeps the context-free usage we already have working.
export function useFormStatus() {
  const [status, setStatus] = useState<{ message: string; variant: ToastVariant } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!status) return;
    const id = setTimeout(() => setStatus(null), 5000);
    return () => clearTimeout(id);
  }, [status]);

  return { status, setStatus, loading, setLoading };
}
