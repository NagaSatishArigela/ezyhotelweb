"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS = { success: CheckCircle, error: XCircle, warning: AlertCircle, info: Info };
const STYLES = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-orange-50 border-orange-200 text-orange-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};
const ICON_STYLES = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-orange-500",
  info: "text-blue-500",
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const Icon = ICONS[toast.type];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onRemove(toast.id), 4000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [toast.id, onRemove]);

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full animate-in slide-in-from-right-full ${STYLES[toast.type]}`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${ICON_STYLES[toast.type]}`} />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((message: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
  }, []);

  const value: ToastContextValue = {
    toast: add,
    success: (m) => add(m, "success"),
    error: (m) => add(m, "error"),
    warning: (m) => add(m, "warning"),
    info: (m) => add(m, "info"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-24 lg:bottom-6 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
