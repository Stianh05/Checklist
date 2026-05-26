import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onAdd
}: AddProductModalProps) {
  const [name, setName] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setName('');
    }
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim());
      onClose();
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-[340px] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Input section */}
              <div className="bg-white rounded-[18px] p-6 mb-4 shadow-2xl">
                <input
                  type="text"
                  placeholder="Drink name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                  className="w-full text-xl font-bold text-[#444748] focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Actions section */}
              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-brand-red text-white font-bold py-5 rounded-[14px] shadow-lg shadow-brand-red/30 active:scale-[0.98] transition-all"
                >
                  Submit
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-white text-brand-red border-2 border-brand-red font-bold py-5 rounded-[14px] active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
