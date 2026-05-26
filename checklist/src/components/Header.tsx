import { useStore } from '../store';
import { Package } from 'lucide-react';

export default function Header() {
  const { wipeSide, items } = useStore();

  const activeItemsCount = Object.values(items).filter(i => i.completed || i.quantity > 0).length;

  return (
    <header className="sticky top-0 z-40 bg-brand-red px-4 py-4 safe-top shadow-lg">
      <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
        <button 
          onClick={wipeSide}
          className="flex items-center gap-2 group active:scale-95 transition-transform text-left"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <Package size={24} className="text-white group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase text-white">WIPE SIDE</h1>
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
            <span className="text-[11px] font-black uppercase tracking-tight text-white">
              {activeItemsCount} ITEMS
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
