import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Share2, Plus, Filter, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [collections, setCollections] = useState(['General', 'Tech', 'Gifts']);
  const [activeCollection, setActiveCollection] = useState('General');
  const { addToCart } = useCartStore();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(stored.map(item => ({ ...item, collection: item.collection || 'General' })));
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item._id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    toast.success('Removed from Wishlist');
  };

  const moveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
    toast.success('Moved to Shopping Cart');
  };

  const filteredItems = wishlist.filter(item => item.collection === activeCollection);

  const addCollection = () => {
    const name = prompt('Enter Collection Name:');
    if (name && !collections.includes(name)) {
      setCollections([...collections, name]);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none dark:text-white">
              MY <span className="text-[var(--secondary)]">LISTS</span>
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-[2px] bg-amber-500" />
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">
                {wishlist.length} Curated Assets
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
              <button 
                onClick={() => toast.success('Link copied to clipboard!')}
                className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-amber-500 transition-all group"
              >
                <Share2 size={18} className="group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={addCollection}
                className="flex items-center gap-3 px-6 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-amber-500/20 transition-all"
              >
                <Plus size={16} /> New Collection
              </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Collection Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">Your Collections</h3>
            <div className="flex flex-col gap-2">
              {collections.map(col => (
                <button
                  key={col}
                  onClick={() => setActiveCollection(col)}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${
                    activeCollection === col 
                    ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' 
                    : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-amber-500/50'
                  }`}
                >
                  {col}
                  <span className={`px-2 py-0.5 rounded-full text-[8px] bg-black/10 dark:bg-white/10`}>
                    {wishlist.filter(item => item.collection === col).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {filteredItems.length > 0 ? (
                <motion.div 
                  key={activeCollection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {filteredItems.map(item => (
                    <div 
                      key={item._id} 
                      className="group bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:border-amber-500/30 transition-all relative overflow-hidden"
                    >
                      <div className="flex gap-6">
                        <Link to={`/product/${item._id}`} className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
                          <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-contain" />
                        </Link>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">{item.category}</p>
                              <h4 className="font-bold text-sm dark:text-white line-clamp-1">{item.name}</h4>
                            </div>
                            <button 
                              onClick={() => removeFromWishlist(item._id)}
                              className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          <p className="text-xl font-black">₹{item.price.toLocaleString('en-IN')}</p>
                          
                          <div className="flex gap-2 pt-2">
                            <button 
                              onClick={() => moveToCart(item)}
                              className="flex-1 flex items-center justify-center gap-2 py-2 bg-amber-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/10"
                            >
                              <ShoppingCart size={14} /> Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-32 text-center"
                >
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-300 mb-6 border border-dashed border-gray-300 dark:border-gray-800">
                    <Heart size={40} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Collection is empty</h3>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-2 mb-8">Start curating your dream list today.</p>
                  <Link 
                    to="/search"
                    className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
                  >
                    Explore Catalog
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
