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

    return (
        <div className="bg-emerald-50/20 dark:bg-slate-950 min-h-screen pb-20 overflow-hidden">
            {/* Header Hub */}
            <div className="bg-white dark:bg-slate-900 border-b border-emerald-100 dark:border-emerald-950/20 px-6 py-12 sticky top-[4.5rem] z-40 shadow-sm backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center text-emerald-600 shadow-xl ring-4 ring-emerald-50 dark:ring-emerald-900/10">
                            <ShoppingCart size={32} />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white leading-none">
                                Wait-Less <span className="text-emerald-500 underline decoration-4 underline-offset-8">Market</span>
                            </h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">10-minute grocery nodes active</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 rounded-full px-8 py-4 border border-slate-100 dark:border-slate-700 w-full md:w-96 shadow-inner focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                        <Search size={18} className="text-slate-400" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text" 
                            placeholder="Find Fresh Essentials..." 
                            className="bg-transparent border-none outline-none w-full text-xs font-bold uppercase tracking-widest dark:text-white"
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
                            className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] border font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-transparent hover:shadow-emerald-500/10 whitespace-nowrap ${
                                selectedCategory === cat.id 
                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/30 scale-105 z-10' 
                                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-emerald-500/30'
                            }`}
                        >
                            <Box size={16} /> {cat.label}
                        </button>
                    ))}
                </div>

                {/* Vertical Subsection Previews: Dynamic Discovery */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {['Fruits', 'Vegetables', 'Dairy'].map(sub => (
                        <div key={sub} className="p-10 bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm space-y-8 group cursor-pointer hover:border-emerald-500/30 transition-all relative overflow-hidden">
                             <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                             <div className="flex items-center justify-between relative z-10">
                                 <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white">{sub} <span className="text-emerald-500">Node</span></h3>
                                 <ArrowRight className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all font-black" />
                             </div>
                             <div className="grid grid-cols-2 gap-4 relative z-10">
                                 {products.filter(p => p.category === sub).slice(0, 2).map((p, idx) => (
                                     <div key={idx} className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center shadow-inner group-hover:shadow-3xl transition-all">
                                         <img src={p.images[0]} alt="Item" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" title={p.name} />
                                         <p className="text-[7px] font-black text-slate-400 mt-2 line-clamp-1">{p.name || 'Organic'}</p>
                                     </div>
                                 ))}
                             </div>
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center mt-4">Verified Bio-Purity Protocol Active</p>
                        </div>
                    ))}
                </div>

                {/* Main Product Inventory Node */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between border-b-4 border-slate-50 dark:border-slate-800 pb-6">
                        <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">Active <span className="text-emerald-500">Inventory</span> Nodes</h2>
                        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                            <Zap size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Instant Sync Active</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                        {filteredGrocery.map((p, i) => (
                            <div key={p._id} className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-6 border-2 border-slate-50 dark:border-slate-800 shadow-sm hover:shadow-4xl hover:border-emerald-500/20 transition-all group relative animate-in fade-in slide-in-from-bottom-5 duration-500">
                                <Link to={`/product/${p._id}`}>
                                    <div className="relative aspect-square mb-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] p-8 overflow-hidden shadow-inner group-hover:shadow-2xl">
                                        <img src={p.images[0]} className="w-full h-full object-contain group-hover:rotate-6 group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                                        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/30">
                                            <Zap size={10} className="fill-white" /> {p.timeToDeliver || '10 Mins'}
                                        </div>
                                        <div className="absolute bottom-4 right-4 text-[10px] font-black text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded-lg backdrop-blur-md">
                                            <Star size={10} className="inline fill-emerald-500 text-emerald-500" /> {p.rating}
                                        </div>
                                    </div>
                                    <div className="space-y-4 px-2">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">{p.brand || 'Farm Fresh Node'}</p>
                                            <h4 className="font-black text-lg dark:text-white leading-tight uppercase line-clamp-1">{p.name || 'Organic Node'}</h4>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                            <p className="text-2xl font-black dark:text-white tracking-tighter">₹{p.price}</p>
                                            <button 
                                                onClick={(e) => { e.preventDefault(); handleAddToCart(p); }}
                                                className="w-12 h-12 rounded-[1.2rem] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-transparent hover:shadow-emerald-500/30 active:scale-90"
                                            >
                                                <Plus size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Global Node Map Button Simulation */}
            <div className="fixed bottom-10 left-10 z-50">
                <button className="flex items-center gap-4 px-10 py-6 bg-emerald-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-4xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all">
                    Search Hub Maps <Search size={20} />
                </button>
            </div>
        </div>
    );
};

export default GroceryHub;
