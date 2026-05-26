import React, { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { useStore } from '../store';
import ProductItem from './ProductItem';
import AddProductModal from './AddProductModal';
import { Plus } from 'lucide-react';

export default function ProductList() {
  const { products, items, addProduct } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sorting Logic:
  // 1. Active (quantity > 0, completed = false)
  // 2. Completed (completed = true)
  // 3. Empty (quantity = 0)
  
  const sortedProducts = [...products].sort((a, b) => {
    const itemA = items[a.id];
    const itemB = items[b.id];
    
    const statusA = getStatusOrder(itemA);
    const statusB = getStatusOrder(itemB);
    
    if (statusA !== statusB) return statusA - statusB;
    return a.name.localeCompare(b.name);
  });

  function getStatusOrder(item: any) {
    if (item?.completed) return 2; // Completed -> Collected
    if (item && item.quantity > 0) return 1; // Active -> Needs Restock
    return 3; // Empty/Unset -> Fully Stocked
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Category Banner */}
      <div className="bg-brand-dark px-6 py-4 rounded-[20px] text-center shadow-xl">
        <h2 className="text-xl font-black uppercase tracking-[0.05em] text-white">
          Check list
        </h2>
      </div>

      <div className="space-y-8">
        {/* Mangler Section */}
        {sortedProducts.filter(p => getStatusOrder(items[p.id]) === 1).length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#444748] opacity-70 whitespace-nowrap">
                Needs Restock
              </span>
              <div className="flex-1 h-px bg-[#444748]/10" />
            </div>
            {sortedProducts.filter(p => getStatusOrder(items[p.id]) === 1).map((product) => (
              <ProductItem 
                key={product.id} 
                product={product} 
                sessionItem={items[product.id] as any}
              />
            ))}
          </div>
        )}

        {/* Ferdig Hentet Section */}
        {sortedProducts.filter(p => getStatusOrder(items[p.id]) === 2).length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-green whitespace-nowrap">
                Collected
              </span>
              <div className="flex-1 h-px bg-brand-green/20" />
            </div>
            {sortedProducts.filter(p => getStatusOrder(items[p.id]) === 2).map((product) => (
              <ProductItem 
                key={product.id} 
                product={product} 
                sessionItem={items[product.id] as any}
              />
            ))}
          </div>
        )}

        {/* Full Beholdning Section */}
        {sortedProducts.filter(p => getStatusOrder(items[p.id]) === 3).length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#444748] opacity-50 whitespace-nowrap">
                Fully Stocked
              </span>
              <div className="flex-1 h-px bg-[#444748]/10" />
            </div>
            {sortedProducts.filter(p => getStatusOrder(items[p.id]) === 3).map((product) => (
              <ProductItem 
                key={product.id} 
                product={product} 
                sessionItem={items[product.id] as any}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Item Button */}
      <div className="pt-4 pb-8">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full bg-brand-red text-white font-black uppercase tracking-wider py-5 rounded-[20px] shadow-xl shadow-brand-red/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} strokeWidth={3} />
          Add Item
        </button>
      </div>

      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addProduct}
      />
    </div>
  );
}
