import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, Shield, Truck, Sparkles, Laptop, Gamepad, Headphones, Smartphone, Home as HomeIcon, Watch, BookOpen, Baby, Dumbbell, ShoppingBag } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import ProductGrid from '../components/ProductGrid';
import SkeletonLoader from '../components/SkeletonLoader';
import FlashSale from '../components/FlashSale';
import BuyAgain from '../components/BuyAgain';
import RecentlyViewed from '../components/RecentlyViewed';

const Home = () => {
  const { products, loading, fetchProducts, fetchMoreProducts, page, pages, total, activeService } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [serviceType, setServiceType] = useState('Shopping');

  const fetchInitialProducts = useCallback(() => {
    fetchProducts({ category: selectedCategory, pageNumber: 1, serviceType });
  }, [fetchProducts, selectedCategory, serviceType]);

  useEffect(() => {
    fetchInitialProducts();
  }, [fetchInitialProducts]);

  const handleLoadMore = () => {
    if (page < pages) {
      fetchMoreProducts({ category: selectedCategory, pageNumber: page + 1, serviceType });
    }
  };

  const services = [
    { id: 'Shopping', name: 'Elite Shop', icon: <ShoppingBag size={24} />, color: 'blue', desc: 'Amazon/Flipkart', path: '/' },
    { id: 'Food', name: 'Instant Food', icon: <Zap size={24} />, color: 'orange', desc: 'Swiggy/Zomato', path: '/food-hub' },
    { id: 'Grocery', name: 'Wait-Less', icon: <Truck size={24} />, color: 'green', desc: 'Zepto/Blinkit', path: '/grocery-hub' },
    { id: 'Pharmacy', name: 'Health Hub', icon: <Shield size={24} />, color: 'red', desc: 'Apollo/1mg', path: '/health-hub' },
  ];

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
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-700">
      {/* Super App Service Hub */}
      <div className="max-w-7xl mx-auto pt-16 px-6 grid grid-cols-2 md:grid-cols-4 gap-4 pb-12">
        {services.map((s) => (
          <Link
            key={s.id}
            to={s.path}
            onClick={() => s.id === 'Shopping' && setServiceType('Shopping')}
            className={`relative overflow-hidden group p-6 rounded-[2.5rem] border-2 transition-all duration-500 hover:scale-105 active:scale-95 block ${
              serviceType === s.id 
              ? `bg-${s.color}-500/10 border-${s.color}-500 shadow-2xl shadow-${s.color}-500/20` 
              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-all ${
              serviceType === s.id ? `bg-${s.color}-500 text-white` : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
            }`}>
              {s.icon}
            </div>
            <h3 className={`text-lg font-black uppercase tracking-tighter ${serviceType === s.id ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              {s.name}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.desc}</p>
          </Link>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative h-[450px] mx-6 rounded-[3rem] overflow-hidden bg-slate-900 group shadow-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 flex items-center px-16 z-20">
          <div className="max-w-2xl space-y-6">
             <motion.div
              layoutId="badge"
              className={`inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-4`}
             >
                <div className={`w-2 h-2 rounded-full animate-ping ${serviceType === 'Food' ? 'bg-orange-500' : 'bg-amber-500'}`} />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">
                  {serviceType === 'Food' ? 'Express Delivery' : 'Premium Selection'}
                </span>
             </motion.div>
             <motion.h1 
               layoutId="title"
               className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.8] uppercase"
             >
               {serviceType === 'Shopping' && <>MODERN <br /><span className="text-blue-500">UTILITY</span></>}
               {serviceType === 'Food' && <>CRAVE <br /><span className="text-orange-500">INSTANT</span></>}
               {serviceType === 'Grocery' && <>DAILY <br /><span className="text-green-500">FRESH</span></>}
               {serviceType === 'Pharmacy' && <>CARE <br /><span className="text-red-500">VITAL</span></>}
             </motion.h1>
          </div>
        </div>
        <motion.img 
          key={serviceType}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          src={
            serviceType === 'Shopping' ? "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80" :
            serviceType === 'Food' ? "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&q=80" :
            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80"
          } 
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-50"
        />
      </div>

      <div className="max-w-7xl mx-auto mt-16 relative z-30 px-6 space-y-16">
        
        {/* Quick Hub Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/orders" className="p-8 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] flex items-center justify-between group shadow-2xl">
            <div className="space-y-1">
              <h4 className="text-2xl font-black uppercase tracking-tight">Consumer Dashboard</h4>
              <p className="text-xs opacity-60 font-medium uppercase tracking-widest">Track all 4 service orders</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-black/10 flex items-center justify-center group-hover:translate-x-2 transition-transform">
              <ChevronRight size={24} />
            </div>
          </Link>
          <Link to="/seller" className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex items-center justify-between group shadow-sm">
            <div className="space-y-1">
              <h4 className="text-2xl font-black uppercase tracking-tight">Seller Hub</h4>
              <p className="text-xs opacity-60 font-medium uppercase tracking-widest">Manage Restaurant / Store / Shop</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:translate-x-2 transition-transform">
              <ChevronRight size={24} />
            </div>
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] border font-black text-xs uppercase tracking-widest transition-all duration-500 ${
                selectedCategory === cat.name 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-110 z-10' 
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500'
              }`}
            >
              {cat.icon}
              {cat.name}
            </motion.button>
          ))}
        </div>

        {/* Product Listing */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100 dark:border-gray-800 pb-10">
            <div className="space-y-1 text-center md:text-left">
              <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
                {serviceType} <span className="text-slate-400">Essentials</span>
              </h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">
                Found {total || 0} Assets optimized for {serviceType}
              </p>
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
                     <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-12 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl disabled:opacity-50"
                     >
                        {loading ? 'Processing...' : 'Load More Items'}
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
