/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from './store';
import Header from './components/Header';
import ProductList from './components/ProductList';
import FetchMode from './components/FetchMode';
import ErrorToast from './components/ErrorToast';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { init, viewMode, loading, seedProducts } = useStore();

  useEffect(() => {
    // 1. Initial local setup
    const cleanup = init();
    seedProducts();
    
    return () => {
      cleanup();
    };
  }, [init, seedProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg space-y-4">
        <h1 className="text-2xl font-black tracking-tighter uppercase text-brand-red animate-pulse">WIPE SIDE</h1>
        <Loader2 className="animate-spin text-brand-gray" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col relative overflow-hidden">
      <Header />
      
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-32">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <ProductList />
          ) : (
            <FetchMode />
          )}
        </AnimatePresence>
      </main>

      <ErrorToast />
    </div>
  );
}
