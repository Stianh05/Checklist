import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { Product } from '../types';
import { Check, Edit2, Minus, Plus, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import QuantityModal from './QuantityModal';
import EditProductModal from './EditProductModal';

interface ProductItemProps {
  product: Product;
  sessionItem?: { quantity: number; completed: boolean };
  key?: any;
}

export default function ProductItem({ product, sessionItem }: ProductItemProps) {
  const { toggleComplete, adjustQuantity, updateQuantity, updateProduct, deleteProduct } = useStore();
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const quantity = sessionItem?.quantity || 0;
  const isCompleted = sessionItem?.completed || false;

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    adjustQuantity(product.id, 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    adjustQuantity(product.id, -1);
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 0) toggleComplete(product.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative flex items-center gap-4 h-[72px] px-4 rounded-[18px] bg-brand-card border border-[#E8E8E8] transition-all active:scale-[0.99] shadow-sm",
        isCompleted && "bg-brand-green/5 border-brand-green/20"
      )}
    >
      {/* Large Square Checkbox - Enlarged hitbox */}
      {(isCompleted || quantity > 0) && (
        <button
          type="button"
          onClick={handleComplete}
          className="flex items-center justify-center p-4 -ml-4 -mr-3 cursor-pointer active:scale-95 transition-transform"
        >
          <div className={cn(
            "w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all",
            isCompleted 
              ? "bg-brand-green border-brand-green text-black" 
              : "bg-white border-[#E8E8E8] text-transparent"
          )}>
            <Check size={20} strokeWidth={4} className={cn("transition-transform", isCompleted ? "scale-100" : "scale-0")} />
          </div>
        </button>
      )}

      {/* Product Info */}
      <div className={cn(
        "flex-1 min-w-0",
        !(isCompleted || quantity > 0) && "-ml-1"
      )}>
        <h3 className={cn(
          "text-[15px] font-bold line-clamp-2 leading-tight tracking-tight text-[#444748]",
          isCompleted && "line-through text-brand-green/70"
        )}>
          {product.name}
        </h3>
      </div>

      {/* Right side controls group */}
      <div className="flex items-center -mr-1" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowEditModal(true);
          }}
          className="w-8 h-11 flex items-center justify-center text-[#444748]/30 active:text-[#444748] transition-all active:scale-90"
        >
          <Edit2 size={16} strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={handleDecrement}
            className="w-11 h-11 flex items-center justify-center text-[#444748]/30 active:text-[#444748] active:bg-black/5 rounded-full transition-all active:scale-90"
          >
            <Minus size={20} strokeWidth={3} />
          </button>
          
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowQtyModal(true);
            }}
            className="w-10 h-11 flex items-center justify-center text-center active:bg-black/5 rounded-lg transition-all active:scale-95"
          >
            <span className={cn(
              "text-xl font-black tabular-nums transition-colors",
              quantity > 0 ? "text-[#444748]" : "text-[#444748]/20"
            )}>
              {quantity}
            </span>
          </button>

          <button
            type="button"
            onClick={handleIncrement}
            className="w-11 h-11 flex items-center justify-center text-[#444748]/30 active:text-[#444748] active:bg-black/5 rounded-full transition-all active:scale-90"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      <QuantityModal 
        isOpen={showQtyModal}
        onClose={() => setShowQtyModal(false)}
        onSelect={(qty) => updateQuantity(product.id, qty)}
        productName={product.name}
        initialQuantity={quantity}
      />

      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={(newName) => {
          updateProduct(product.id, newName);
          setShowEditModal(false);
        }}
        onDelete={() => {
          deleteProduct(product.id);
          setShowEditModal(false);
        }}
        productName={product.name}
      />
    </motion.div>
  );
}
