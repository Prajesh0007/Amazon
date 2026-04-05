import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Zap, Shield, Clock, TrendingUp, ChevronRight, Search, Heart, LayoutGrid, Sparkles } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';

const Home = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const categories = [
        { id: 'All', icon: <LayoutGrid size={20} />, label: 'All' },
        { id: 'Electronics', icon: <Zap size={20} />, label: 'Tech' },
        { id: 'Computing', icon: <TrendingUp size={18} />, label: 'PC' },
        { id: 'Smart Home', icon: <Shield size={18} />, label: 'Security' },
        { id: 'Fashion', icon: <Sparkles size={18} />, label: 'Vibe' },
        { id: 'Sports', icon: <Star size={18} />, label: 'Pro' }
    ];

    const bestSellers = products.filter(p => p.isBestSeller).slice(0, 8);

    const filteredProducts = products.filter(p => 
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="bg-[#010103] min-h-screen pb-20 pt-32 px-6">
                <div className="max-w-7xl mx-auto space-y-20">
                     <div className="h-64 bg-slate-900/40 animate-pulse rounded-[4rem] border border-white/5" />
                     <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <div key={n} className="bg-slate-900/40 animate-pulse rounded-[3.5rem] h-[300px] border border-white/5" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#010103] dark:bg-[#010103] min-h-screen pb-20 overflow-hidden">
            {/* Super Search & Banner */}
            <div className="relative border-b border-white/5 px-6 py-24 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,121,5,0.15),transparent)] pointer-events-none" />
                <div className="max-w-4xl mx-auto space-y-10 relative z-10">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl font-black uppercase tracking-tighter text-white leading-none font-elegant"
                    >
                        Midnight <span className="text-amber-500 underline decoration-8 underline-offset-12">Universe</span>
                    </motion.h1>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] leading-relaxed italic">Omni-Commerce • Artisan • Pilot Command • Estate Hub</p>
                    
                    <div className="flex items-center gap-6 bg-white/5 backdrop-blur-3xl rounded-full px-12 py-8 border border-white/10 shadow-4xl w-full max-w-2xl mx-auto mt-16 transition-all focus-within:ring-[20px] focus-within:ring-amber-500/5 hover:border-amber-500/30">
                        <Search size={28} className="text-amber-500" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text" 
                            placeholder="Search the global ecosystem..." 
                            className="bg-transparent border-none outline-none w-full text-base font-black uppercase tracking-widest text-white placeholder-slate-700"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
                
                {/* Discovery Categories */}
                <div className="flex gap-6 overflow-x-auto no-scrollbar py-4 px-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-4 px-10 py-6 rounded-[2.5rem] border font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-700 shadow-4xl whitespace-nowrap ${
                                selectedCategory === cat.id 
                                ? 'bg-amber-500 text-black border-amber-500 shadow-amber-500/30 scale-110 z-10' 
                                : 'bg-white/5 border-white/5 text-slate-500 hover:border-amber-500/30'
                            }`}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>

                {/* Best Sellers Row */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between border-b border-white/5 pb-8">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-white flex items-center gap-4 font-elegant">
                            Elite <span className="text-amber-500">Sellers</span> <Star size={28} className="fill-amber-500 text-amber-500" />
                        </h2>
                        <Link to="/search?category=Best Sellers" className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-500 hover:text-white transition-colors">Global Inventory Rank <ChevronRight size={14} className="inline ml-2" /></Link>
                    </div>
                    <div className="flex gap-10 overflow-x-auto no-scrollbar px-2 py-4 pb-16">
                        {bestSellers.map((p) => (
                            <Link key={p._id} to={`/product/${p._id}`} className="flex-shrink-0 w-72 group bg-white/5 backdrop-blur-md rounded-[4rem] p-8 border border-white/5 shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/20 transition-all relative overflow-hidden">
                                <div className="absolute top-8 left-8 z-10 bg-amber-500 text-black text-[9px] font-black px-4 py-2 rounded-xl shadow-4xl uppercase tracking-widest">Global Rank #1</div>
                                <div className="aspect-square bg-slate-900 rounded-[3rem] p-8 mb-8 overflow-hidden shadow-4xl">
                                    <img src={p.images[0]} className="w-full h-full object-contain group-hover:scale-125 group-hover:rotate-6 transition-transform duration-1000" alt={p.name} />
                                </div>
                                <div className="space-y-4 text-center">
                                    <p className="text-[9px] font-black text-amber-500/60 uppercase tracking-[0.3em] italic leading-none">{p.serviceType}</p>
                                    <h3 className="font-black text-lg text-white uppercase line-clamp-1 tracking-tighter transition-colors group-hover:text-amber-500">{p.name}</h3>
                                    <p className="text-3xl font-black text-white tracking-tighter">₹{p.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Main Product Grid */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between border-b border-white/5 pb-8">
                         <h2 className="text-4xl font-black uppercase tracking-tighter text-white font-elegant">Active <span className="text-slate-600">Ecosystem</span> Inventory</h2>
                         <div className="flex items-center gap-4 px-6 py-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                             <TrendingUp size={18} className="text-amber-500" />
                             <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Flux Rate Optimized</span>
                         </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
                        {filteredProducts.map((p) => (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                key={p._id}
                            >
                                <Link to={`/product/${p._id}`} className="group bg-black/20 backdrop-blur-md p-8 rounded-[4rem] border border-white/5 hover:shadow-4xl hover:border-amber-500/20 transition-all flex flex-col justify-between h-full relative overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                     <div>
                                        <div className="aspect-square bg-slate-900 rounded-[3rem] p-8 mb-8 relative overflow-hidden shadow-4xl group-hover:shadow-amber-500/5 transition-all">
                                            <img src={p.images[0]} className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-1000" alt={p.name} />
                                            {p.isPrime && (
                                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-amber-500 text-black text-[9px] font-black rounded-xl shadow-4xl tracking-widest uppercase border border-amber-600/20">Elite</div>
                                            )}
                                            <div className="absolute bottom-4 right-4 flex gap-2 items-center px-4 py-2 bg-black/80 rounded-2xl text-[10px] font-black text-amber-500 shadow-2xl backdrop-blur-md border border-white/10">
                                                <Star size={12} className="fill-amber-500 text-amber-500" /> {p.rating}
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 italic">{p.serviceType} • {p.category}</p>
                                        <h3 className="font-black text-lg text-white uppercase leading-tight line-clamp-2 tracking-tighter transition-colors group-hover:text-amber-500">{p.name || 'Elite Enterprise Hub'}</h3>
                                    </div>
                                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/5">
                                        <span className="text-2xl font-black text-white tracking-tighter">₹{p.price}</span>
                                        <div className="p-4 bg-white/5 text-slate-500 rounded-2xl group-hover:bg-amber-500 group-hover:text-black transition-all shadow-4xl border border-white/10">
                                            <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
