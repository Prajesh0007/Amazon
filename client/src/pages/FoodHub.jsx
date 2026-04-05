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
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAddToCart = (p) => {
        toast.success(`${p.name} added to cart!`);
    };

    return (
        <div className="bg-orange-50/10 dark:bg-slate-950 min-h-screen pb-20">
            {/* Food Header */}
            <div className="px-6 py-12 bg-white dark:bg-slate-900 border-b border-orange-100 dark:border-orange-950/20 sticky top-[4.5rem] z-40 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-3xl flex items-center justify-center text-orange-600 shadow-xl">
                            <Utensils size={32} />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white leading-none">Food <span className="text-orange-500 underline decoration-4 underline-offset-8">Hub</span></h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">30-minute node delivery active</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 rounded-full px-8 py-4 border border-slate-100 dark:border-slate-700 w-full md:w-96 shadow-inner">
                        <Search size={18} className="text-slate-400" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text" 
                            placeholder="Craving something specific?" 
                            className="bg-transparent border-none outline-none w-full text-xs font-bold uppercase tracking-widest dark:text-white"
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
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all ${
                                selectedCategory === cat.id 
                                ? 'bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-500/30 scale-105' 
                                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-orange-500/30'
                            }`}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>

                {/* Vertical Food Display Hub */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredFood.map((p) => (
                        <div key={p._id} className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-3xl transition-all group relative overflow-hidden flex flex-col">
                            {/* Signature Recipe Card Design */}
                            <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-8 bg-slate-50 dark:bg-slate-800 shadow-inner group-hover:shadow-2xl transition-all">
                                <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                                <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 dark:bg-slate-900/90 rounded-2xl text-[10px] font-black uppercase tracking-widest text-orange-600 shadow-xl backdrop-blur-md flex items-center gap-2">
                                    <Clock size={12} /> {p.timeToDeliver || '30 Mins'}
                                </div>
                                <div className="absolute bottom-4 left-4 flex gap-2">
                                     <div className="px-3 py-1 bg-green-500/90 text-white text-[8px] font-black rounded-lg shadow-lg uppercase">Prime Node</div>
                                     <div className="px-3 py-1 bg-orange-500/90 text-white text-[8px] font-black rounded-lg shadow-lg uppercase">Signature</div>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 italic">{p.category} Special</p>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white leading-tight line-clamp-1">{p.name || 'Chef’s Selection'}</h3>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 rounded-2xl flex items-center justify-center text-orange-600">
                                        <Flame size={24} className="group-hover:animate-bounce" />
                                    </div>
                                </div>

                                {/* Deep Metadata: Ingredients */}
                                <div className="space-y-3">
                                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                                         <BookOpen size={12} /> Master Ingredients
                                     </div>
                                     <div className="flex flex-wrap gap-2">
                                          {(p.ingredients || ['Artisanal Base', 'Chef Spices', 'Local Greens']).map((ing, idx) => (
                                              <span key={idx} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[8px] font-bold text-slate-500 uppercase dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                                                  {ing}
                                              </span>
                                          ))}
                                     </div>
                                </div>

                                {/* Deep Metadata: Recipe / Description */}
                                <div className="space-y-2 flex-1">
                                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                                         <Info size={12} /> Chef's Protocol
                                     </div>
                                     <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic line-clamp-3">
                                         {p.recipe || p.description || 'Our secret signature dish prepared with high-grade organic elements and tradition.'}
                                     </p>
                                </div>

                                <div className="flex items-center justify-between pt-8 mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 line-through">₹{p.price + 150}</span>
                                        <p className="text-3xl font-black dark:text-white tracking-tighter leading-none">₹{p.price}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all shadow-sm">
                                            <Heart size={20} />
                                        </button>
                                        <button 
                                            onClick={() => handleAddToCart(p)}
                                            className="px-8 bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                                        >
                                            Add Node <ShoppingBag size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FoodHub;
