import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { Sparkles } from "lucide-react";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; show: boolean } | null>(null);
  const timerRef = useRef<any | null>(null);

  const showToast = useCallback((message: string) => {
    // Clear any active timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast({ message, show: true });
    
    // Auto-hide after 3 seconds
    timerRef.current = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, show: false } : null));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          className={`fixed bottom-6 md:bottom-8 right-6 md:right-8 z-[9999] flex items-center gap-3.5 px-5 py-4 bg-[#FAF8F5] border border-[#9D6C76]/25 rounded-2xl shadow-xl transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)] ${
            toast.show
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95 pointer-events-none"
          }`}
          style={{
            boxShadow: "0 12px 32px -8px rgba(40, 39, 63, 0.12)",
          }}
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#9D6C76]/10 text-[#9D6C76]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-body text-xs font-bold tracking-wider uppercase text-[#28273F]">
            {toast.message}
          </span>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
