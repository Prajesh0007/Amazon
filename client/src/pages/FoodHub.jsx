import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Search, Star, Clock, Plus, Flame, Leaf, ChevronRight, Info, BookOpen, ShoppingBag } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const FoodHub = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts({ serviceType: 'Food' });
    }, [fetchProducts]);

    const categories = [
        { id: 'All', icon: <Utensils size={18} />, label: 'All' },
        { id: 'Burger', icon: <Flame size={18} />, label: 'Burger' },
        { id: 'Pizza', icon: <Plus size={18} />, label: 'Pizza' },
        { id: 'Sushi', icon: <Leaf size={18} />, label: 'Sushi' },
        { id: 'Indian', icon: <Flame size={18} />, label: 'Indian' },
        { id: 'Italian', icon: <Flame size={18} />, label: 'Italian' }
    ];

    const filteredFood = products.filter(p => 
        (selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase()) &&
        (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.category?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAddToCart = (p) => {
        toast.success(`${p.name} added to cart!`);
    };

    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen pb-20 pt-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-white animate-pulse rounded-[3rem] h-[500px] border border-slate-100 shadow-sm" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Food Header */}
            <div className="px-6 py-12 bg-white/80 backdrop-blur-3xl border-b border-slate-100 sticky top-[4.5rem] z-40 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20">
                            <Utensils size={32} />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none font-elegant">Culinary <span className="text-blue-600 underline decoration-4 underline-offset-8">Mastery</span></h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Elite 20-minute flux delivery active</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 rounded-[2rem] px-8 py-5 border border-slate-200 w-full md:w-96 shadow-inner">
                        <Search size={18} className="text-slate-400" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text" 
                            placeholder="Discover your next craving..." 
                            className="bg-transparent border-none outline-none w-full text-xs font-bold uppercase tracking-widest text-slate-900 placeholder-slate-400"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Horizontal Category Filter */}
                <div className="lg:col-span-12 flex gap-4 overflow-x-auto no-scrollbar py-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all duration-500 shadow-sm ${
                                selectedCategory === cat.id 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-600/20 scale-105' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-blue-500/30'
                            }`}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>

                {/* Vertical Food Display Hub */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredFood.length === 0 && !loading ? (
                        <div className="col-span-full py-40 text-center space-y-4">
                             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search size={32} className="text-slate-300" />
                             </div>
                             <h3 className="text-2xl font-black uppercase text-slate-400 tracking-tighter">No Elite Tastes Found</h3>
                             <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Adjust your filters or command a different search</p>
                        </div>
                    ) : filteredFood.map((p) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            key={p._id} 
                            className="bg-white rounded-[3.5rem] p-8 border border-slate-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col"
                        >
                            {/* Signature Recipe Card Design */}
                            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden mb-8 bg-slate-50 shadow-inner">
                                <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                                <div className="absolute top-4 right-4 px-5 py-3 bg-white/90 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-xl border border-slate-100 backdrop-blur-md flex items-center gap-2">
                                    <Clock size={12} /> {p.timeToDeliver || '20 Mins'}
                                </div>
                                <div className="absolute bottom-6 left-6 flex gap-2">
                                     <div className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black rounded-xl shadow-2xl uppercase tracking-tighter">Elite Express</div>
                                     <div className="px-4 py-2 bg-white/80 text-slate-900 text-[9px] font-black rounded-xl shadow-2xl uppercase tracking-tighter backdrop-blur-md border border-white/20">Artisan Signature</div>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-[0.3em] italic">{p.category} Specialist</p>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-tight line-clamp-1">{p.name}</h3>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                                        <Flame size={24} className="group-hover:animate-bounce" />
                                    </div>
                                </div>

                                {/* Deep Metadata: Ingredients */}
                                <div className="space-y-3">
                                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                                         <BookOpen size={12} /> Ingredients Palette
                                     </div>
                                     <div className="flex flex-wrap gap-2">
                                          {(p.ingredients || ['Artisanal Base', 'Chef Spices', 'Fresh Greens']).map((ing, idx) => (
                                              <span key={idx} className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest border border-slate-100">
                                                  {ing}
                                              </span>
                                          ))}
                                     </div>
                                </div>

                                {/* Deep Metadata: Recipe / Description */}
                                <div className="space-y-2 flex-1 text-left">
                                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                                         <Info size={12} /> Culinary Protocol
                                     </div>
                                     <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic line-clamp-3">
                                         {p.recipe || p.description}
                                     </p>
                                </div>

                                <div className="flex items-center justify-between pt-8 mt-auto">
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1 line-through">₹{p.price + 250}</span>
                                        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">₹{p.price}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all shadow-sm border border-slate-100">
                                            <Heart size={20} />
                                        </button>
                                        <button 
                                            onClick={() => handleAddToCart(p)}
                                            className="px-8 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                                        >
                                            Add to Order <ShoppingBag size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FoodHub;
