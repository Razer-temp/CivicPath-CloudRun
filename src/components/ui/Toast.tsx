/**
 * @module components/ui/Toast
 * @description Accessible UI rendering layer for application toasts
 */

import React from 'react';
import { useToast } from '../../lib/ToastContext';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const icons = {
            info: <Info className="w-5 h-5 text-blue-500" />,
            success: <CheckCircle className="w-5 h-5 text-green-500" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
            error: <AlertCircle className="w-5 h-5 text-red-500" />,
          };

          const bgColors = {
            info: 'bg-blue-50 border-blue-200',
            success: 'bg-green-50 border-green-200',
            warning: 'bg-amber-50 border-amber-200',
            error: 'bg-red-50 border-red-200',
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`flex items-start gap-3 p-4 border rounded-lg shadow-lg max-w-sm ${bgColors[toast.type]}`}
              role="alert"
            >
              <div className="shrink-0">{icons[toast.type]}</div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto shrink-0 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded"
                aria-label="Dismiss message"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
