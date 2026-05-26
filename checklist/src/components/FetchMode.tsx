import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { Check, ChevronRight, Package, Loader2 } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { cn } from '../lib/utils';

export default function FetchMode() {
  const { products, items, toggleComplete } = useStore();
  
  const activeItems = useMemo(() => {
    return products.filter(p => {
      const item = items[p.id];
      return item && item.quantity > 0 && !item.completed;
    });
  }, [products, items]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProduct = activeItems[currentIndex];

  const handleComplete = async () => {
    if (!currentProduct) return;
    await toggleComplete(currentProduct.id);
    // The lists will update, if this was the last item, activeItems will shrink.
    // We stay at the same index if possible, else go to 0.
  };

  if (activeItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-brand-green/20 rounded-full flex items-center justify-center text-brand-green">
          <Check size={48} strokeWidth={3} />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-black uppercase tracking-tighter">All Clear</h2>
          <p className="text-brand-gray">Everything has been fetched.</p>
        </div>
      </div>
    );
  }

  // Ensure index is valid
  const safeIndex = Math.min(currentIndex, activeItems.length - 1);
  const product = activeItems[safeIndex];
  const item = items[product.id];

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gray">
          Fetching: {safeIndex + 1} of {activeItems.length}
        </h2>
        <div className="flex gap-2">
          {activeItems.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                i === safeIndex ? "bg-brand-red w-4" : "bg-white/10"
              )} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-brand-card rounded-[40px] p-8 border border-white/10 space-y-10 shadow-2xl"
        >
          <div className="space-y-2 text-center">
            <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-gray">
              {product.category}
            </span>
            <h3 className="text-4xl font-black uppercase tracking-tighter leading-none break-words">
              {product.name}
            </h3>
            {product.location && (
              <p className="text-brand-gray font-bold uppercase tracking-widest text-sm">
                Location: {product.location}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-9xl font-black leading-none text-brand-red tabular-nums">
              {item.quantity}
            </span>
            <span className="text-sm font-black uppercase tracking-widest text-brand-gray">
              Units to fetch
            </span>
          </div>

          <button
            onClick={handleComplete}
            className="w-full h-24 bg-brand-green text-black rounded-3xl font-black text-2xl uppercase tracking-tighter flex items-center justify-center gap-4 shadow-xl shadow-brand-green/20 active:scale-95 transition-all"
          >
            <Check size={32} strokeWidth={4} />
            FETCHED
          </button>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center px-4">
        <button
          disabled={safeIndex === 0}
          onClick={() => setCurrentIndex(safeIndex - 1)}
          className="text-sm font-bold uppercase tracking-widest text-brand-gray disabled:opacity-0 transition-opacity"
        >
          Previous
        </button>
        <button
          disabled={safeIndex === activeItems.length - 1}
          onClick={() => setCurrentIndex(safeIndex + 1)}
          className="text-sm font-bold uppercase tracking-widest text-brand-gray disabled:opacity-0 transition-opacity flex items-center gap-2"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
