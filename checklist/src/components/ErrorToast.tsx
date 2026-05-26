import { useStore } from '../store';
import { AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ErrorToast() {
  const { error, clearError } = useStore();

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-6 left-4 right-4 z-[100] max-w-sm mx-auto"
        >
          <div className="bg-brand-dark text-white p-4 rounded-2xl shadow-2xl border border-red-500/30 flex items-start gap-3">
            <div className="mt-0.5">
              <AlertCircle size={20} className="text-brand-red" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase tracking-tight text-brand-red mb-1">System Error</p>
              <p className="text-sm font-medium leading-tight opacity-90 break-words">
                {typeof error === 'string' ? error : (error as any).error}
              </p>
              {typeof error === 'object' && (error as any).path && (
                <p className="text-[10px] font-mono opacity-50 mt-1 uppercase tracking-widest">
                  Path: {(error as any).path}
                </p>
              )}
            </div>
            <button 
              onClick={clearError}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
