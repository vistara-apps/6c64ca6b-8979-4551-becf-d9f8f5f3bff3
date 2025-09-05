'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 200);
  }, [toast.id, removeToast]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" aria-hidden="true" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-error" aria-hidden="true" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning" aria-hidden="true" />;
      case 'info':
        return <Info className="w-5 h-5 text-primary" aria-hidden="true" />;
    }
  };

  const getColorClasses = () => {
    switch (toast.type) {
      case 'success':
        return 'border-success/30 bg-success/10';
      case 'error':
        return 'border-error/30 bg-error/10';
      case 'warning':
        return 'border-warning/30 bg-warning/10';
      case 'info':
        return 'border-primary/30 bg-primary/10';
    }
  };

  return (
    <div
      className={cn(
        'glass-card p-4 border-l-4 transition-all duration-200 ease-out transform',
        getColorClasses(),
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95',
        isExiting && 'translate-x-full opacity-0 scale-95'
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start space-x-3">
        {getIcon()}
        
        <div className="flex-1 min-w-0">
          <h4 className="heading-4 text-text-primary mb-1">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="body-small text-text-secondary">
              {toast.message}
            </p>
          )}
          
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleClose}
          className="btn-icon p-1 text-text-tertiary hover:text-text-secondary"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Convenience hooks for different toast types
export function useSuccessToast() {
  const { addToast } = useToast();
  
  return useCallback((title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'success', title, message, action });
  }, [addToast]);
}

export function useErrorToast() {
  const { addToast } = useToast();
  
  return useCallback((title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'error', title, message, action });
  }, [addToast]);
}

export function useWarningToast() {
  const { addToast } = useToast();
  
  return useCallback((title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'warning', title, message, action });
  }, [addToast]);
}

export function useInfoToast() {
  const { addToast } = useToast();
  
  return useCallback((title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'info', title, message, action });
  }, [addToast]);
}

// Toast utility functions for direct usage
export const toast = {
  success: (title: string, message?: string, action?: Toast['action']) => {
    // This would need to be implemented with a global toast instance
    console.log('Success toast:', { title, message, action });
  },
  error: (title: string, message?: string, action?: Toast['action']) => {
    console.log('Error toast:', { title, message, action });
  },
  warning: (title: string, message?: string, action?: Toast['action']) => {
    console.log('Warning toast:', { title, message, action });
  },
  info: (title: string, message?: string, action?: Toast['action']) => {
    console.log('Info toast:', { title, message, action });
  },
};
