import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, Shield, Truck, Sparkles, Laptop, Gamepad, Headphones, Smartphone, Home as HomeIcon, Watch, BookOpen, Baby, Dumbbell, ShoppingBag } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import ProductGrid from '../components/ProductGrid';
import SkeletonLoader from '../components/SkeletonLoader';
import FlashSale from '../components/FlashSale';
import BuyAgain from '../components/BuyAgain';
import RecentlyViewed from '../components/RecentlyViewed';

const Home = () => {
  const { products, loading, fetchProducts, fetchMoreProducts, page, pages, total } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchInitialProducts = useCallback(() => {
    fetchProducts({ category: selectedCategory, pageNumber: 1 });
  }, [fetchProducts, selectedCategory]);

  useEffect(() => {
    fetchInitialProducts();
  }, [fetchInitialProducts]);

  const handleLoadMore = () => {
    if (page < pages) {
      fetchMoreProducts({ category: selectedCategory, pageNumber: page + 1 });
    }
  };

  const categories = [
    { name: 'All', icon: <Sparkles size={18} /> },
    { name: 'Electronics', icon: <Laptop size={18} /> },
    { name: 'Computing', icon: <Gamepad size={18} /> },
    { name: 'Audio', icon: <Headphones size={18} /> },
    { name: 'Mobile', icon: <Smartphone size={18} /> },
    { name: 'Home', icon: <HomeIcon size={18} /> },
    { name: 'Fashion', icon: <Watch size={18} /> },
    { name: 'Toys', icon: <Baby size={18} /> },
    { name: 'Sports', icon: <Dumbbell size={18} /> },
    { name: 'Grocery', icon: <ShoppingBag size={18} /> },
    { name: 'Books', icon: <BookOpen size={18} /> },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32">
      {/* Hero Section */}
      <div className="relative h-[650px] overflow-hidden bg-slate-900 group">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-950 z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-15" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-5xl px-8 text-center z-20 space-y-8">
             <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-4 shadow-2xl"
             >
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] font-heading">The New Standard of Luxury</span>
             </motion.div>
             
             <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] uppercase font-display"
             >
               ELEVATE <br /> 
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-orange-600 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                EVERYDAY
               </span>
             </motion.h1>
             
             <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed opacity-60 font-body"
             >
               Curated collections of world-class technology and lifestyle essentials. 
               Experience the future of commerce today.
             </motion.p>
          </div>
        </div>

        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80" 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-lighten grayscale hover:grayscale-0 transition-all duration-1000"
        />
      </div>

      <div className="max-w-7xl mx-auto -mt-24 relative z-30 px-6 space-y-16">
        
        {/* Flash Sale Component */}
        <FlashSale />

        {/* New Home Sections */}
        <div className="space-y-16 py-4">
            <BuyAgain />
            <RecentlyViewed />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] border font-black text-xs uppercase tracking-widest transition-all duration-500 ${
                selectedCategory === cat.name 
                ? 'bg-amber-500 border-amber-500 text-slate-900 shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)] scale-110 z-10' 
                : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-100 dark:border-slate-800 text-slate-500 hover:border-amber-500/50 shadow-sm'
              }`}
            >
              <div className={selectedCategory === cat.name ? 'text-slate-900' : 'text-amber-500'}>
                {cat.icon}
              </div>
              {cat.name}
            </motion.button>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 px-10 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
          {[
            { icon: <Truck />, label: 'Prime Delivery', sub: 'In as little as 2 hours' },
            { icon: <Shield />, label: 'Guaranteed', sub: 'Elite Buyer Protection' },
            { icon: <Zap />, label: 'Smart Filtering', sub: 'AI Search Enabled' },
            { icon: <Sparkles />, label: '100K+ Items', sub: 'Expanding Daily' },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-1 group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[var(--secondary)] group-hover:bg-[var(--secondary)] group-hover:text-[var(--primary)] transition-all transform rotate-3 group-hover:rotate-0">
                {f.icon}
              </div>
              <span className="text-[11px] font-black uppercase tracking-tight mt-2">{f.label}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{f.sub}</span>
            </div>
          ))}
        </div>

        {/* Product Listing */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100 dark:border-gray-800 pb-10">
            <div className="space-y-1 text-center md:text-left">
              <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
                {selectedCategory === 'All' ? 'Trending Catalog' : `${selectedCategory}`}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2">
                 <span className="w-8 h-[2px] bg-[var(--secondary)] inline-block" />
                 <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">
                  Total {total || 0} Assets Found
                 </p>
              </div>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {loading && page === 1 ? (
              <SkeletonLoader key="skeleton" />
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductGrid products={products} loading={false} />
                
                {/* Pagination / Load More */}
                {page < pages && (
                  <div className="mt-20 flex flex-col items-center gap-6">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                       Viewing {products.length} of {total} products
                     </p>
                     <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-12 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl disabled:opacity-50 transition-all hover:shadow-[var(--secondary)]/20"
                     >
                        {loading ? 'Powering Up...' : 'Load Elite Items'}
                     </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Home;
