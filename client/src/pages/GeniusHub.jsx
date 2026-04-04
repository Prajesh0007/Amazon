import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Shield, Search, Star, Clock, Heart, ChevronRight, User, Phone, CheckCircle2 } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';

const GeniusHub = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchProducts({ serviceType: 'HomeService' });
    }, [fetchProducts]);

    const categories = ['All', 'Cleaning', 'Repair', 'Electrical', 'Plumbing', 'Salon'];

    return (
        <div className="bg-amber-50/20 dark:bg-slate-950 min-h-screen pb-20">
            {/* Genius Hub Header */}
            <div className="px-6 py-12 bg-white dark:bg-slate-900 border-b border-amber-100 dark:border-amber-900/30">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
                    <motion.div 
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600"
                    >
                        <Wrench size={32} />
                    </motion.div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">Genius <span className="text-amber-500">Hub</span></h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Elite Professionals at your doorstep 24/7</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Sidebar Filter */}
                <div className="lg:col-span-3">
                    <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6 shadow-sm sticky top-24">
                        <h3 className="text-lg font-black uppercase tracking-tight dark:text-white">Genius Sectors</h3>
                        <div className="space-y-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                        filter === cat 
                                        ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20' 
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-amber-50'
                                    }`}
                                >
                                    {cat}
                                    <ChevronRight size={14} className={filter === cat ? 'rotate-90' : 'rotate-0'} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Professionals Explorer */}
                <div className="lg:col-span-9">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {products.map((p, i) => (
                                <motion.div
                                    key={p._id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group overflow-hidden"
                                >
                                    <Link to={`/product/${p._id}`}>
                                        <div className="relative aspect-[4/3] p-6 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                            <img 
                                                src={p.images[0]} 
                                                className="w-full h-full object-cover rounded-3xl shadow-lg group-hover:scale-105 transition-transform duration-700"
                                                alt={p.name}
                                            />
                                        </div>
                                        <div className="p-8 space-y-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                                                        {p.category}
                                                    </div>
                                                </div>
                                                <h4 className="font-extrabold text-sm dark:text-white leading-tight">{p.name || 'Professional Genius'}</h4>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Star size={12} className="fill-amber-500 text-amber-500" />
                                                    <span className="text-[10px] font-black dark:text-white">{p.rating}</span>
                                                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">(2.5k+)</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 font-bold text-[8px] uppercase tracking-widest">
                                                    <Clock size={12} /> 45 mins arrival
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                                <p className="text-xl font-black dark:text-white">₹{p.price}</p>
                                                <button className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                                                    Book Pro
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
        </div>
    );
};

export default GeniusHub;
