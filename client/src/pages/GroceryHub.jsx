import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Zap, Plus, Box, ArrowRight, Star, Clock, ShoppingBag } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const GroceryHub = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts({ serviceType: 'Grocery' });
    }, [fetchProducts]);

    const categories = [
        { id: 'All', label: 'Market' },
        { id: 'Fruits', label: 'Fresh Fruits' },
        { id: 'Vegetables', label: 'Garden' },
        { id: 'Dairy', label: 'Dairy' },
        { id: 'Snacks', label: 'Snacks' },
        { id: 'Drinks', label: 'Drinks' }
    ];

    const filteredGrocery = products.filter(p => 
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAddToCart = (p) => {
        toast.success(`${p.name} added to market basket!`);
    };

    if (loading) {
        return (
            <div className="bg-[#010103] min-h-screen pb-20 pt-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <div key={n} className="bg-slate-900/40 animate-pulse rounded-[3.5rem] h-[350px] border border-white/5" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#010103] dark:bg-[#010103] min-h-screen pb-20 overflow-hidden">
            {/* Header Hub */}
            <div className="bg-black/60 backdrop-blur-3xl border-b border-white/5 px-6 py-12 sticky top-[4.5rem] z-40 shadow-2xl">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500 shadow-2xl ring-4 ring-amber-500/5">
                            <ShoppingCart size={32} />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black tracking-tighter uppercase text-white leading-none font-elegant">
                                Midnight <span className="text-amber-500 underline decoration-4 underline-offset-8">Market</span>
                            </h1>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Elite 10-minute delivery active</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-white/5 rounded-[2rem] px-8 py-5 border border-white/10 w-full md:w-96 shadow-2xl focus-within:ring-8 focus-within:ring-amber-500/5 transition-all">
                        <Search size={18} className="text-slate-500" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text" 
                            placeholder="Discover fresh essentials..." 
                            className="bg-transparent border-none outline-none w-full text-xs font-bold uppercase tracking-widest text-white placeholder-slate-700"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-12 space-y-16 relative">
                {/* Section Horizontal Category Explorer */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-4 px-10 py-5 rounded-[2.5rem] border font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl hover:shadow-amber-500/10 whitespace-nowrap ${
                                selectedCategory === cat.id 
                                ? 'bg-amber-500 text-black border-amber-500 shadow-amber-500/30 scale-105 z-10' 
                                : 'bg-white/5 border-white/5 text-slate-500 hover:border-amber-500/30'
                            }`}
                        >
                            <Box size={16} /> {cat.label}
                        </button>
                    ))}
                </div>

                {/* Vertical Subsection Previews: Dynamic Discovery */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {['Fruits', 'Vegetables', 'Dairy'].map(sub => (
                        <div key={sub} className="p-12 bg-white/5 rounded-[4rem] border border-white/5 shadow-2xl space-y-10 group cursor-pointer hover:border-amber-500/30 transition-all relative overflow-hidden backdrop-blur-md">
                             <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                             <div className="flex items-center justify-between relative z-10">
                                 <h3 className="text-3xl font-black uppercase tracking-tighter text-white font-elegant">{sub} <span className="text-amber-500">Estate</span></h3>
                                 <ArrowRight className="text-slate-700 group-hover:text-amber-500 group-hover:translate-x-2 transition-all font-black" />
                             </div>
                             <div className="grid grid-cols-2 gap-6 relative z-10">
                                 {products.filter(p => p.category === sub).slice(0, 2).map((p, idx) => (
                                     <div key={idx} className="aspect-square bg-black/40 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-4xl group-hover:shadow-amber-500/5 transition-all border border-white/5">
                                         <img src={p.images[0]} alt="Item" className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-1000" title={p.name} />
                                         <p className="text-[8px] font-black text-slate-500 mt-3 line-clamp-1 truncate uppercase tracking-widest">{p.name || 'Organic'}</p>
                                     </div>
                                 ))}
                             </div>
                             <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] text-center mt-6">Bio-Purity Protocol Active</p>
                        </div>
                    ))}
                </div>

                {/* Main Product Inventory Node */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between border-b-2 border-white/5 pb-8">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-white font-elegant">Elite <span className="text-amber-500">Inventory</span> Estates</h2>
                        <div className="flex items-center gap-3 px-6 py-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl shadow-4xl">
                            <Zap size={14} className="text-amber-500 animate-pulse" />
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Instant Flux Active</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                        {filteredGrocery.length === 0 && !loading ? (
                             <div className="col-span-full py-40 text-center space-y-4">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={32} className="text-slate-800" />
                                </div>
                                <h3 className="text-2xl font-black uppercase text-slate-800 tracking-tighter">Market Inventory Empty</h3>
                             </div>
                        ) : filteredGrocery.map((p, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                key={p._id} 
                                className="bg-black/20 backdrop-blur-md rounded-[4rem] p-6 border border-white/5 shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/20 transition-all group relative overflow-hidden"
                            >
                                <Link to={`/product/${p._id}`}>
                                    <div className="relative aspect-square mb-8 bg-slate-900 rounded-[3rem] p-8 overflow-hidden shadow-4xl group-hover:shadow-amber-500/10 transition-all">
                                        <img src={p.images[0]} className="w-full h-full object-contain group-hover:rotate-12 group-hover:scale-125 transition-transform duration-1000" alt={p.name} />
                                        <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-4xl">
                                            <Zap size={10} className="fill-black" /> {p.timeToDeliver || '12 Mins'}
                                        </div>
                                        <div className="absolute bottom-4 right-4 text-[11px] font-black text-amber-500 bg-black/80 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/5 shadow-2xl">
                                            <Star size={12} className="inline fill-amber-500 p-0.5" /> {p.rating}
                                        </div>
                                    </div>
                                    <div className="space-y-6 px-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] leading-none mb-2 italic">{p.brand || 'Midnight Fresh'}</p>
                                            <h4 className="font-black text-xl text-white leading-tight uppercase line-clamp-1 tracking-tighter">{p.name}</h4>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                            <p className="text-3xl font-black text-white tracking-tighter">₹{p.price}</p>
                                            <button 
                                                onClick={(e) => { e.preventDefault(); handleAddToCart(p); }}
                                                className="w-14 h-14 rounded-[1.5rem] bg-white/5 text-slate-500 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all shadow-4xl border border-white/10 active:scale-90"
                                            >
                                                <Plus size={28} />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Global Estate Map Button Simulation */}
            <div className="fixed bottom-12 left-12 z-50">
                <button className="flex items-center gap-6 px-12 py-8 bg-amber-500 text-black rounded-[3rem] font-black text-[13px] uppercase tracking-[0.3em] shadow-4xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all">
                    Search Global Grid <Search size={24} />
                </button>
            </div>
        </div>
    );
};

export default GroceryHub;
