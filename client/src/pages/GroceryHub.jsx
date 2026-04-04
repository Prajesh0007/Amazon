import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, ShoppingCart, Search, Filter, Rocket, ChevronRight } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';

const GroceryHub = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchProducts({ serviceType: 'Grocery' });
    }, [fetchProducts]);

    const categories = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Snacks', 'Drinks'];

    return (
        <div className="bg-green-50/20 dark:bg-slate-950 min-h-screen pb-20">
            {/* Header Content */}
            <div className="px-6 py-8 bg-green-600 text-white shadow-xl">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <Rocket size={32} className="animate-bounce" /> Wait-Less <span className="text-green-200">Grocery</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-green-100">Flash-fast 10 minute delivery guaranteed</p>
                    </div>
                    <div className="max-w-xl w-full px-6">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-green-400 group-hover:text-green-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search everything fresh..." 
                                className="w-full bg-white rounded-2xl py-4 pl-16 pr-6 text-slate-900 placeholder-slate-400 outline-none focus:ring-4 focus:ring-green-400/30 transition-all font-bold shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12">
                <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap shadow-xl ${
                                filter === cat 
                                ? 'bg-green-600 text-white scale-105' 
                                : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 hover:bg-green-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {(products || []).map((p) => (
                        <div
                            key={p._id}
                            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group p-4 flex flex-col h-full"
                        >
                            <Link to={`/product/${p._id}`} className="flex-1 flex flex-col">
                                <div className="relative aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800 mb-4 p-4 flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={p.images?.[0] || 'https://via.placeholder.com/200'}
                                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        alt={p.name}
                                    />
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                                        <Zap size={10} strokeWidth={4} /> 10 mins
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <h4 className="font-bold text-xs dark:text-white line-clamp-2 leading-tight group-hover:text-green-600 transition-colors uppercaseTracking-widest">{p.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.brand || 'Fresh Mart'}</p>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <p className="text-sm font-black dark:text-white">₹{p.price}</p>
                                    <button className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm">
                                        <ShoppingCart size={16} />
                                    </button>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GroceryHub;
