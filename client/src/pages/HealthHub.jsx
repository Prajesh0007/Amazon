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

    if (loading) {
        return (
            <div className="bg-[#010103] min-h-screen pb-20 pt-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-slate-900/40 animate-pulse rounded-[3.5rem] h-[500px] border border-white/5" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#010103] dark:bg-[#010103] min-h-screen pb-20 overflow-hidden">
            {/* Health Hub Hero */}
            <div className="px-6 py-16 bg-black/60 backdrop-blur-3xl border-b border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-40 pointer-events-none" />
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-10 relative z-10">
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 shadow-4xl ring-4 ring-red-500/5 border border-red-500/20"
                    >
                        <Shield size={40} className="animate-pulse" />
                    </motion.div>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black uppercase tracking-tighter text-white font-elegant">Global <span className="text-red-500">Vitality</span> Center</h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Elite Pharmacy Division • Trusted Care Protocol V4</p>
                    </div>
                    <div className="max-w-2xl w-full px-6 flex flex-col md:flex-row gap-6">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-red-500" />
                            <input 
                                type="text" 
                                placeholder="Search medicines, wellness items..." 
                                className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-6 pl-20 pr-8 text-white placeholder-slate-700 outline-none focus:ring-8 focus:ring-red-500/5 transition-all font-black text-[11px] uppercase tracking-widest shadow-2xl"
                            />
                        </div>
                        <button className="px-12 py-6 bg-red-500 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-4xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all">
                            Consult Expert
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
                
                {/* Left Sidebar - Fast Info */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="p-10 bg-white/5 rounded-[4rem] border border-white/5 space-y-10 shadow-2xl backdrop-blur-md">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                             <Filter size={18} className="text-red-500" />
                             <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Market Grid</h3>
                        </div>
                        <div className="space-y-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`w-full flex items-center justify-between p-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all group ${
                                        filter === cat 
                                        ? 'bg-red-500 text-white shadow-4xl shadow-red-500/20 scale-105' 
                                        : 'bg-black/40 text-slate-500 border border-white/5 hover:border-red-500/30'
                                    }`}
                                >
                                    {cat}
                                    <PlusCircle size={14} className={`transition-transform duration-500 ${filter === cat ? 'rotate-45 text-white' : 'rotate-0 group-hover:rotate-12'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-10 bg-gradient-to-br from-red-600 to-rose-700 rounded-[4rem] text-white space-y-8 shadow-4xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent)] opacity-40" />
                        <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl w-fit relative z-10 group-hover:scale-110 transition-transform">
                            <Package size={28} />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Prescription Upload</h3>
                            <p className="text-[10px] font-black opacity-80 leading-relaxed uppercase tracking-widest">Global Scan Protocol • 2-Minute AI Verification</p>
                        </div>
                        <button className="w-full py-6 bg-white text-red-600 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-4xl relative z-10 hover:scale-105 active:scale-95 transition-all">
                            Initiate Upload
                        </button>
                    </div>
                </div>

                {/* Main Product Grid */}
                <div className="lg:col-span-9">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {products.length === 0 && !loading ? (
                             <div className="col-span-full py-60 text-center space-y-6">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                                    <Search size={40} className="text-slate-800" />
                                </div>
                                <h3 className="text-3xl font-black uppercase text-slate-800 tracking-tighter">Inventory Station Empty</h3>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">RECALIBRATE FILTER</p>
                             </div>
                        ) : (
                            <AnimatePresence>
                                {products.map((p, i) => (
                                    <motion.div
                                        key={p._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white/5 rounded-[4rem] border border-white/5 shadow-2xl hover:shadow-red-500/10 hover:border-red-500/20 transition-all group overflow-hidden"
                                    >
                                        <Link to={`/product/${p._id}`}>
                                            <div className="relative aspect-square p-12 bg-slate-900 flex items-center justify-center overflow-hidden">
                                                <img 
                                                    src={p.images[0]} 
                                                    className="max-w-full max-h-full object-contain group-hover:scale-125 transition-transform duration-1000"
                                                    alt={p.name}
                                                />
                                                <div className="absolute top-6 right-6 p-4 bg-black/60 backdrop-blur-3xl rounded-full shadow-4xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                                    <Heart size={18} className="text-red-500 fill-red-500" />
                                                </div>
                                                <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white rounded-xl text-[8px] font-black uppercase tracking-[0.3em] shadow-4xl">
                                                     Premium Care
                                                </div>
                                            </div>
                                            <div className="p-10 space-y-6">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em] italic">{p.brand || 'Midnight Pharma'}</p>
                                                    <h4 className="font-black text-xl text-white line-clamp-2 leading-tight uppercase tracking-tighter">{p.name}</h4>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 size={16} className="text-red-500" />
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Medical Auth OK</span>
                                                </div>
                                                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                                    <p className="text-3xl font-black text-white tracking-tighter">₹{p.price}</p>
                                                    <button className="px-8 py-4 bg-white/5 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-4xl border border-white/10 hover:bg-red-500 hover:text-white transition-all active:scale-95 hover:scale-110">
                                                        Deploy
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthHub;
