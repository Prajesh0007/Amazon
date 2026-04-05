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

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
            {/* Super Search & Banner */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-16 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-6xl font-black uppercase tracking-tighter dark:text-white leading-none">
                        Amazon <span className="text-indigo-600 underline decoration-8 underline-offset-8">Super App</span>
                    </h1>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none italic">Omni-commerce • Food • Ride • Stay • Genius Pro</p>
                    
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 rounded-full px-10 py-6 border border-slate-100 dark:border-slate-700 shadow-inner w-full max-w-2xl mx-auto mt-12 transition-all focus-within:ring-8 focus-within:ring-indigo-500/10">
                        <Search size={24} className="text-slate-400" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text" 
                            placeholder="Find anything in the ecosystem..." 
                            className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase tracking-widest dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
                
                {/* Discovery Categories */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-3 px-8 py-5 rounded-3xl border font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-transparent hover:shadow-indigo-500/10 whitespace-nowrap ${
                                selectedCategory === cat.id 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-600/20 scale-105 z-10' 
                                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-indigo-500/30'
                            }`}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>

                {/* Best Sellers Row */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3">
                            Best <span className="text-orange-500">Sellers</span> <Star size={24} className="fill-orange-500 text-orange-500" />
                        </h2>
                        <Link to="/search?category=Best Sellers" className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:underline">View Global Rank <ChevronRight size={12} className="inline" /></Link>
                    </div>
                    <div className="flex gap-8 overflow-x-auto no-scrollbar px-2 py-4 pb-12">
                        {bestSellers.map((p) => (
                            <Link key={p._id} to={`/product/${p._id}`} className="flex-shrink-0 w-64 group bg-white dark:bg-slate-900 rounded-[3rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-3xl transition-all relative overflow-hidden">
                                <div className="absolute top-6 left-6 z-10 bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg">#1 RANK</div>
                                <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] p-6 mb-6 overflow-hidden">
                                    <img src={p.images[0]} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                                </div>
                                <div className="space-y-2 text-center">
                                    <h3 className="font-black text-xs dark:text-white uppercase line-clamp-1">{p.name}</h3>
                                    <p className="text-lg font-black text-indigo-600">₹{p.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Main Product Grid */}
                <div className="space-y-8">
                    <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Eco <span className="text-slate-400">Inventory</span></h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {filteredProducts.map((p) => (
                            <Link key={p._id} to={`/product/${p._id}`} className="group bg-white dark:bg-slate-900 p-6 rounded-[3rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all flex flex-col justify-between">
                                <div>
                                    <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] p-6 mb-6 relative overflow-hidden group-hover:shadow-inner">
                                        <img src={p.images[0]} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                                        {p.isPrime && (
                                            <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-slate-900 text-[8px] font-black rounded-lg shadow-sm tracking-widest border border-yellow-500/20 uppercase">Prime</div>
                                        )}
                                        <div className="absolute bottom-2 right-2 flex gap-1 items-center px-3 py-1 bg-white/90 dark:bg-slate-900/90 rounded-full text-[10px] font-black dark:text-white shadow-xl backdrop-blur-md">
                                            <Star size={10} className="fill-orange-400 text-orange-400" /> {p.rating}
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{p.serviceType} • {p.category}</p>
                                    <h3 className="font-black text-sm dark:text-white uppercase leading-tight line-clamp-2">{p.name || 'Elite SuperApp Node'}</h3>
                                </div>
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                                    <span className="text-xl font-black dark:text-white">₹{p.price}</span>
                                    <button className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-indigo-500/0 hover:shadow-indigo-500/20">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
