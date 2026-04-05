import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Zap, Shield, Clock, TrendingUp, ChevronRight, Search, Heart, LayoutGrid, Sparkles } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';

const Home = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState(100000);
    const [minRating, setMinRating] = useState(0);

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

    const bestSellers = products?.filter(p => p.isBestSeller).slice(0, 8) || [];

    const filteredProducts = (products || []).filter(p => 
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.category?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (p.price <= priceRange) &&
        (p.rating >= minRating)
    );

    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen pb-20 pt-32 px-6">
                <div className="max-w-7xl mx-auto space-y-20">
                     <div className="h-64 bg-white animate-pulse rounded-[4rem] border border-slate-100 shadow-sm" />
                     <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <div key={n} className="bg-white animate-pulse rounded-[3.5rem] h-[300px] border border-slate-100 shadow-sm" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20 overflow-hidden relative">
            {/* Filter Sidebar overlay */}
            <AnimatePresence>
                {showFilters && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilters(false)}
                            className="fixed inset-0 bg-slate-900/10 backdrop-blur-md z-[60]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] p-12 border-l border-slate-100"
                        >
                            <div className="space-y-12 h-full flex flex-col justify-between">
                                <div className="space-y-12">
                                    <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                                        <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 font-elegant">Elite <span className="text-blue-600">Filters</span></h3>
                                        <button onClick={() => setShowFilters(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                                            <ChevronRight size={32} />
                                        </button>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center px-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Price Threshold</label>
                                                <span className="text-xl font-black text-slate-900 tracking-tighter">₹{priceRange.toLocaleString()}</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="200000" 
                                                step="1000"
                                                value={priceRange}
                                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                                className="w-full accent-blue-600 h-2 bg-slate-100 rounded-full appearance-none cursor-pointer"
                                            />
                                        </div>

                                        <div className="space-y-8">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2 block">Rating Protocol</label>
                                            <div className="grid grid-cols-5 gap-4">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button 
                                                        key={star}
                                                        onClick={() => setMinRating(star)}
                                                        className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                                                            minRating >= star ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-lg' : 'border-slate-50 bg-slate-50 shadow-inner'
                                                        }`}
                                                    >
                                                        <Star size={16} className={minRating >= star ? 'fill-blue-500' : 'text-slate-300'} />
                                                        <span className="text-[9px] font-black">{star}+</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => {
                                        setPriceRange(200000);
                                        setMinRating(0);
                                        setShowFilters(false);
                                    }}
                                    className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-600 transition-all active:scale-95 shadow-slate-900/10"
                                >
                                    Reset Discovery Protocol
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Super Search & Banner */}
            <div className="relative border-b border-slate-100 px-6 py-24 text-center overflow-hidden bg-white shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,97,255,0.05),transparent)] pointer-events-none" />
                <div className="max-w-4xl mx-auto space-y-10 relative z-10">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl font-black uppercase tracking-tighter text-slate-900 leading-none font-elegant"
                    >
                        Active <span className="text-blue-600 underline decoration-8 underline-offset-12">Universe</span>
                    </motion.h1>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] leading-relaxed italic">Omni-Commerce • Masterworks • Pilot Command • Luxe Estates</p>
                    
                    <div className="flex items-center gap-6 bg-slate-50 rounded-[4rem] px-12 py-8 border border-slate-200 shadow-xl w-full max-w-2xl mx-auto mt-16 transition-all focus-within:ring-[20px] focus-within:ring-blue-500/5 hover:border-blue-500/30 group">
                        <Search size={28} className="text-blue-600" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text" 
                            placeholder="Explore the active ecosystem..." 
                            className="bg-transparent border-none outline-none w-full text-base font-black uppercase tracking-widest text-slate-900 placeholder-slate-300"
                        />
                        <button 
                            onClick={() => setShowFilters(true)}
                            className="p-4 bg-white/50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl shadow-sm border border-slate-200 transition-all group-hover:shadow-md"
                        >
                            <TrendingUp size={20} />
                        </button>
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
                            className={`flex items-center gap-4 px-10 py-6 rounded-[2.5rem] border font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-700 shadow-lg whitespace-nowrap ${
                                selectedCategory === cat.id 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/30 scale-110 z-10' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-blue-500/30'
                            }`}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>

                {/* Best Sellers Row */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-4 font-elegant text-left">
                            Elite <span className="text-blue-600">Sellers</span> <Star size={28} className="fill-amber-500 text-amber-500" />
                        </h2>
                        <Link to="/search?category=Best Sellers" className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 hover:text-blue-700 transition-colors">Global Inventory Rank <ChevronRight size={14} className="inline ml-2" /></Link>
                    </div>
                    <div className="flex gap-10 overflow-x-auto no-scrollbar px-2 py-4 pb-16">
                        {bestSellers.map((p) => (
                            <Link key={p._id} to={`/product/${p._id}`} className="flex-shrink-0 w-72 group bg-white rounded-[4rem] p-8 border border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-500/20 transition-all relative overflow-hidden text-left">
                                <div className="absolute top-8 left-8 z-10 bg-blue-600 text-white text-[9px] font-black px-4 py-2 rounded-xl shadow-lg uppercase tracking-widest">Global Rank #1</div>
                                <div className="aspect-square bg-slate-50 rounded-[3rem] p-8 mb-8 overflow-hidden shadow-inner">
                                    <img src={p.images?.[0]} className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-1000" alt={p.name} />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[9px] font-black text-blue-600/60 uppercase tracking-[0.3em] italic leading-none">{p.serviceType}</p>
                                    <h3 className="font-black text-lg text-slate-900 uppercase line-clamp-1 tracking-tighter transition-colors group-hover:text-blue-600">{p.name}</h3>
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{p.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Main Product Grid */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                         <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 font-elegant text-left">Active <span className="text-slate-400">Ecosystem</span> Inventory</h2>
                         <div className="flex items-center gap-4 px-6 py-3 bg-blue-50 border border-blue-100 rounded-2xl">
                             <TrendingUp size={18} className="text-blue-600" />
                             <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Flux Rate Optimized</span>
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
                                <Link to={`/product/${p._id}`} className="group bg-white p-8 rounded-[4rem] border border-slate-100 shadow-lg hover:shadow-2xl hover:border-blue-500/20 transition-all flex flex-col justify-between h-full relative overflow-hidden text-left">
                                     <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                     <div>
                                        <div className="aspect-square bg-slate-50 rounded-[3rem] p-8 mb-8 relative overflow-hidden shadow-inner group-hover:shadow-blue-500/5 transition-all">
                                            <img src={p.images?.[0]} className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-1000" alt={p.name} />
                                            {p.isPrime && (
                                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-blue-600 text-white text-[9px] font-black rounded-xl shadow-lg tracking-widest uppercase">Elite</div>
                                            )}
                                            <div className="absolute bottom-4 right-4 flex gap-2 items-center px-4 py-2 bg-white/90 rounded-2xl text-[10px] font-black text-blue-600 shadow-xl backdrop-blur-md border border-slate-100">
                                                <Star size={12} className="fill-amber-500 text-amber-500" /> {p.rating}
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic pb-2">{p.serviceType} • {p.category}</p>
                                        <h3 className="font-black text-lg text-slate-900 uppercase leading-tight line-clamp-2 tracking-tighter transition-colors group-hover:text-blue-600">{p.name || 'Elite Enterprise Hub'}</h3>
                                    </div>
                                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-50">
                                        <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{p.price}</span>
                                        <div className="p-4 bg-slate-50 text-slate-300 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-slate-100">
                                            <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* Elite Best Sellers Grid Showcase */}
                <div className="space-y-12 mt-32">
                    <div className="flex items-center justify-between border-b-2 border-slate-100 pb-8 px-4">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 font-elegant text-left">Elite <span className="text-blue-600">Global</span> Best Sellers</h2>
                        <div className="flex items-center gap-4 px-6 py-3 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm">
                             <Zap size={14} className="text-blue-600 animate-pulse" />
                             <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Master Inventory Class</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[
                            { name: "Artisanal Azure Brew", price: "450", category: "Drinks", img: "https://images.unsplash.com/photo-1544022613-e87ce71c8599?w=400&q=80" },
                            { name: "Organic Farm Estate Box", price: "1200", category: "Grocery", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80" },
                            { name: "Global Pilot Chrono", price: "24500", category: "Genius", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
                            { name: "Elite Stay Suite Pass", price: "8500", category: "Stay", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" }
                        ].map((p, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -15 }}
                                className="bg-white rounded-[4rem] p-8 border border-slate-100 shadow-xl group overflow-hidden relative shadow-blue-500/5"
                            >
                                <div className="aspect-square bg-slate-50 rounded-[3rem] p-8 mb-8 overflow-hidden relative border border-slate-100">
                                    <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">ELITE ITEM</div>
                                    <img src={p.img} className="w-full h-full object-cover rounded-2xl transition-transform duration-1000 group-hover:scale-110 shadow-lg" alt={p.name} />
                                </div>
                                <div className="space-y-6 text-left px-2">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-2 italic">{p.category} Specialist</p>
                                        <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase line-clamp-1 font-elegant">{p.name}</h4>
                                    </div>
                                    <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                                        <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{p.price}</p>
                                        <button className="px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95 shadow-slate-900/10">Secure Now</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Active Universal Bridge Contact */}
            <div className="fixed bottom-12 right-12 z-50">
                <button className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] shadow-xl shadow-blue-500/30 flex items-center justify-center hover:rotate-12 hover:scale-110 active:scale-90 transition-all group overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    <Zap size={36} className="animate-pulse" />
                </button>
            </div>
        </div>
    );
};

export default Home;
