import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Star, Clock, MapPin, Search, ChevronRight, Zap, Filter } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';

const FoodHub = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchProducts({ serviceType: 'Food' });
    }, [fetchProducts]);

    const categories = ['All', 'Burger', 'Pizza', 'Sushi', 'Indian', 'Italian'];

    return (
        <div className="bg-orange-50/30 dark:bg-slate-950 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[300px] overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80" 
                    className="w-full h-full object-cover brightness-50"
                    alt="Food Header"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-6">
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-6xl font-black tracking-tighter uppercase text-center"
                    >
                        Food <span className="text-orange-500">Hub</span>
                    </motion.h1>
                    <div className="max-w-2xl w-full px-6">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search for restaurants or dishes..." 
                                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl py-5 pl-16 pr-6 text-white placeholder-white/50 outline-none focus:bg-white/20 transition-all font-bold"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
                {/* Category Filter */}
                <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap shadow-xl ${
                                filter === cat 
                                ? 'bg-orange-500 text-white scale-105' 
                                : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 hover:bg-orange-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {products.map((p, i) => (
                            <motion.div
                                key={p._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group"
                            >
                                <Link to={`/product/${p._id}`}>
                                    <div className="relative h-64 overflow-hidden">
                                        <img 
                                            src={p.images[0]} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            alt={p.name}
                                        />
                                        <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                            <Zap size={14} className="text-orange-500" />
                                            Free Delivery
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
                                            <h3 className="text-white font-black text-xl leading-none">{p.name}</h3>
                                            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-2">{p.brand || 'Premium Restaurant'}</p>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                                <Star size={14} className="fill-green-600 text-green-600" />
                                                <span className="text-xs font-black text-green-700 dark:text-green-400">{p.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Clock size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">30-45 mins</span>
                                            </div>
                                            <p className="text-xl font-black dark:text-white">₹{p.price}</p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-sm border-2 ${p.isVeg ? 'border-green-500 p-0.5' : 'border-red-500 p-0.5'}`}>
                                                    <div className={`w-full h-full rounded-full ${p.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{p.isVeg ? 'Veg' : 'Non-Veg'}</span>
                                            </div>
                                            <button className="flex items-center gap-1 text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline">
                                                Add Dish <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default FoodHub;
