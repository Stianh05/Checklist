import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface QuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (quantity: number) => void;
  productName: string;
  initialQuantity: number;
}

export default function QuantityModal({
  isOpen,
  onClose,
  onSelect,
  productName,
  initialQuantity
}: QuantityModalProps) {
  const [selected, setSelected] = useState(initialQuantity || 1);
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelected(initialQuantity || 1);
    }
  }, [isOpen, initialQuantity]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-[340px] bg-white rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 pb-4">
                <h3 className="text-base font-bold text-[#444748]">
                  Select Quantity {productName}
                </h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-1 text-[#444748]/50 hover:text-[#444748] transition-colors"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Number Grid */}
              <div className="px-5 py-2 grid grid-cols-5 gap-2">
                {numbers.map((num) => (
                  <button
                    key={num}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(num);
                    }}
                    className={cn(
                      "aspect-square flex items-center justify-center text-sm font-bold rounded-lg border transition-all active:scale-90",
                      selected === num
                        ? "bg-[#B21317] border-[#B21317] text-white shadow-lg shadow-brand-red/20 scale-105"
                        : "bg-[#F8F9FA] border-[#E9ECEF] text-[#444748] active:bg-[#E9ECEF] active:border-[#CED4DA]"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="p-5 pt-6 border-t border-[#F1F3F4] mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(selected);
                    onClose();
                  }}
                  className="w-full bg-[#B21317] hover:bg-[#9E1114] text-white font-black py-4 rounded-xl shadow-lg shadow-brand-red/30 transition-all active:scale-[0.98] uppercase tracking-wider"
                >
                  BRUK
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
