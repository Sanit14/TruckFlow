import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

const ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: '🔔',
};

const STYLES = {
  success: 'border-emerald-500/40 bg-emerald-900/30 text-emerald-200',
  error: 'border-rose-500/40 bg-rose-900/30 text-rose-200',
  warning: 'border-amber-500/40 bg-amber-900/30 text-amber-200',
  info: 'border-brand-500/40 bg-brand-900/30 text-brand-200',
};

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const t1 = setTimeout(() => setVisible(true), 10);
    // Auto-remove after duration
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration ?? 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [toast, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 glass rounded-xl px-4 py-3 border shadow-2xl max-w-sm w-full
        transition-all duration-300 ease-out
        ${STYLES[toast.type ?? 'info']}
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <span className="text-lg shrink-0 leading-none mt-0.5">{ICONS[toast.type ?? 'info']}</span>
      <div className="min-w-0 flex-1">
        {toast.title && <p className="font-semibold text-sm leading-tight">{toast.title}</p>}
        <p className="text-xs opacity-80 mt-0.5 leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 300); }}
        className="text-current opacity-40 hover:opacity-80 transition-opacity shrink-0 text-sm"
      >✕</button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container — fixed top-right */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
