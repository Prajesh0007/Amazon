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
            <div className="bg-slate-50 min-h-screen pb-20 pt-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <div key={n} className="bg-white animate-pulse rounded-[3.5rem] h-[350px] border border-slate-100 shadow-sm" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20 overflow-hidden">
            {/* Header Hub */}
            <div className="bg-white/80 backdrop-blur-3xl border-b border-slate-100 px-6 py-12 sticky top-[4.5rem] z-40 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                            <ShoppingCart size={32} />
                        </div>
                        <div className="space-y-1 text-left">
                            <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900 leading-none font-elegant">
                                Active <span className="text-blue-600 underline decoration-4 underline-offset-8">Market</span>
                            </h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Elite 10-minute flux delivery active</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-slate-50 rounded-[2rem] px-8 py-5 border border-slate-200 w-full md:w-96 shadow-inner focus-within:ring-8 focus-within:ring-blue-500/5 transition-all">
                        <Search size={18} className="text-slate-400" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text" 
                            placeholder="Discover fresh essentials..." 
                            className="bg-transparent border-none outline-none w-full text-xs font-bold uppercase tracking-widest text-slate-900 placeholder-slate-300"
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
                            className={`flex items-center gap-4 px-10 py-5 rounded-[2.5rem] border font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 shadow-lg whitespace-nowrap ${
                                selectedCategory === cat.id 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-600/30 scale-105 z-10' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-blue-500/30'
                            }`}
                        >
                            <Box size={16} /> {cat.label}
                        </button>
                    ))}
                </div>

                {/* Vertical Subsection Previews: Dynamic Discovery */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {['Fruits', 'Vegetables', 'Dairy'].map(sub => (
                        <div key={sub} className="p-12 bg-white rounded-[4rem] border border-slate-100 shadow-xl space-y-10 group cursor-pointer hover:border-blue-500/30 transition-all relative overflow-hidden text-left">
                             <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                             <div className="flex items-center justify-between relative z-10">
                                 <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 font-elegant">{sub} <span className="text-blue-600">Estate</span></h3>
                                 <ArrowRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all font-black" />
                             </div>
                             <div className="grid grid-cols-2 gap-6 relative z-10">
                                 {products.filter(p => p.category === sub).slice(0, 2).map((p, idx) => (
                                     <div key={idx} className="aspect-square bg-slate-50 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-inner border border-slate-100">
                                         <img src={p.images?.[0]} alt="Item" className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-1000" title={p.name} />
                                         <p className="text-[8px] font-black text-slate-400 mt-3 line-clamp-1 truncate uppercase tracking-widest">{p.name || 'Organic'}</p>
                                     </div>
                                 ))}
                             </div>
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] text-center mt-6">Bio-Purity Protocol Active</p>
                        </div>
                    ))}
                </div>

                {/* Main Product Inventory Hub */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between border-b-2 border-slate-100 pb-8">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 font-elegant text-left">Elite <span className="text-blue-600">Inventory</span> Estates</h2>
                        <div className="flex items-center gap-3 px-6 py-3 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm">
                            <Zap size={14} className="text-blue-600 animate-pulse" />
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Instant Flux Active</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                        {filteredGrocery.length === 0 && !loading ? (
                             <div className="col-span-full py-40 text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black uppercase text-slate-300 tracking-tighter">Market Inventory Empty</h3>
                             </div>
                        ) : filteredGrocery.map((p, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                key={p._id} 
                                className="bg-white rounded-[4rem] p-6 border border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-500/20 transition-all group relative overflow-hidden"
                            >
                                <Link to={`/product/${p._id}`}>
                                    <div className="relative aspect-square mb-8 bg-slate-50 rounded-[3rem] p-8 overflow-hidden shadow-inner group-hover:shadow-blue-500/5 transition-all">
                                        <img src={p.images?.[0]} className="w-full h-full object-contain group-hover:rotate-12 group-hover:scale-125 transition-transform duration-1000" alt={p.name} />
                                        <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                                            <Zap size={10} /> {p.timeToDeliver || '12 Mins'}
                                        </div>
                                        <div className="absolute bottom-4 right-4 text-[11px] font-black text-blue-600 bg-white/90 px-3 py-1.5 rounded-xl backdrop-blur-md border border-slate-100 shadow-xl">
                                            <Star size={12} className="inline fill-amber-500 text-amber-500 p-0.5" /> {p.rating}
                                        </div>
                                    </div>
                                    <div className="space-y-6 px-4 text-left">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-[0.3em] leading-none mb-2 italic">{p.brand || 'Elite Fresh'}</p>
                                            <h4 className="font-black text-xl text-slate-900 leading-tight uppercase line-clamp-1 tracking-tighter">{p.name}</h4>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                            <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{p.price}</p>
                                            <button 
                                                onClick={(e) => { e.preventDefault(); handleAddToCart(p); }}
                                                className="w-14 h-14 rounded-[1.5rem] bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-100 active:scale-90"
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
                <button className="flex items-center gap-6 px-12 py-8 bg-blue-600 text-white rounded-[3rem] font-black text-[13px] uppercase tracking-[0.3em] shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all">
                    Search Global Grid <Search size={24} />
                </button>
            </div>
        </div>
    );
};

export default GroceryHub;
