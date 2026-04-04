import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, PlusCircle, Search, Filter, Phone, CheckCircle2, Package, Heart } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';

const HealthHub = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchProducts({ serviceType: 'Pharmacy' });
    }, [fetchProducts]);

    const categories = ['All', 'Medicine', 'Wellness', 'Personal Care', 'Devices'];

    return (
        <div className="bg-red-50/20 dark:bg-slate-950 min-h-screen pb-20">
            {/* Health Hub Hero */}
            <div className="px-6 py-12 bg-white dark:bg-slate-900 border-b border-red-100 dark:border-red-900/30">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-600"
                    >
                        <Shield size={32} />
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">Health <span className="text-red-500">Hub</span></h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">A division of Amazon Pharmacy • Trusted Care 24/7</p>
                    </div>
                    <div className="max-w-xl w-full px-6 flex gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-red-400" />
                            <input 
                                type="text" 
                                placeholder="Search medicines, wellness items..." 
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-red-50 dark:border-red-900/10 rounded-2xl py-4 pl-16 pr-6 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-red-500 transition-all font-bold"
                            />
                        </div>
                        <button className="px-6 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 transition-all">
                            Consult Expert
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Sidebar - Fast Info */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6 shadow-sm">
                        <h3 className="text-lg font-black uppercase tracking-tight dark:text-white">Categories</h3>
                        <div className="space-y-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                        filter === cat 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                                    }`}
                                >
                                    {cat}
                                    <PlusCircle size={14} className={filter === cat ? 'rotate-45' : 'rotate-0'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-gradient-to-br from-red-600 to-rose-600 rounded-[2.5rem] text-white space-y-6 shadow-2xl">
                        <div className="p-3 bg-white/20 rounded-2xl w-fit">
                            <PlusCircle size={24} />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight leading-none">Prescription Upload</h3>
                        <p className="text-[10px] font-medium opacity-80 leading-relaxed uppercase">Send us your prescription and let our AI handle the rest.</p>
                        <button className="w-full py-4 bg-white text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                            Upload Now
                        </button>
                    </div>
                </div>

                {/* Main Product Grid */}
                <div className="lg:col-span-9">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {products.map((p, i) => (
                                <motion.div
                                    key={p._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group overflow-hidden"
                                >
                                    <Link to={`/product/${p._id}`}>
                                        <div className="relative aspect-square p-8 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                            <img 
                                                src={p.images[0]} 
                                                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                alt={p.name}
                                            />
                                            {p.images.length > 0 && (
                                                <div className="absolute top-6 right-6 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-lg border border-slate-100 dark:border-slate-800">
                                                    <Heart size={16} className="text-red-500 fill-red-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-8 space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">{p.brand || 'Health Hub'}</p>
                                                <h4 className="font-extrabold text-sm dark:text-white line-clamp-2 leading-tight">{p.name}</h4>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={14} className="text-green-500" />
                                                <span className="text-[10px] font-black uppercase text-slate-400">Verified Seller</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                                <p className="text-xl font-black dark:text-white">₹{p.price}</p>
                                                <button className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                                                    Buy Now
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

export default HealthHub;
