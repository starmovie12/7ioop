'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: string; message: string; type: ToastType; }
interface ToastCtx { showToast: (msg: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastCtx>({ showToast: () => {} });
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);

  const icons = {
    success: <CheckCircle size={16} className="text-green-400 flex-shrink-0" />,
    error: <AlertCircle size={16} className="text-red-400 flex-shrink-0" />,
    info: <Info size={16} className="text-blue-400 flex-shrink-0" />,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border bg-[#1a1f2e] border-white/10 backdrop-blur-xl shadow-2xl pointer-events-auto max-w-xs"
            style={{ animation: 'slideIn 0.3s ease-out' }}>
            {icons[t.type]}
            <p className="text-white text-sm font-medium flex-1">{t.message}</p>
            <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} className="text-gray-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
