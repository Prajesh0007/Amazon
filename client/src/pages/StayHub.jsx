import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Star, Home, Calendar, Users, Heart, ChevronRight, Share2, Map, Wind, DollarSign, User, Shield, Zap } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';

const StayHub = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [budget, setBudget] = useState(10000);
    const [guests, setGuests] = useState(2);
    const [hasAC, setHasAC] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts({ serviceType: 'Stay' });
    }, [fetchProducts]);

    const categories = ['All', 'Resorts', 'Suites', 'Villas', 'Beachfront', 'Cabins'];

    const filteredStays = products.filter(p => 
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        (p.price <= budget) &&
        (p.maxGuests >= guests || !p.maxGuests) &&
        (!hasAC || p.hasAC) &&
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 overflow-hidden">
            {/* Stay Hub Explorer Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-800 shadow-sm sticky top-[4.5rem] z-40">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row items-center justify-between gap-8">
                    {/* Category Scroll */}
                    <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 w-full lg:w-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`flex flex-col items-center gap-3 px-6 py-3 transition-all group min-w-[80px] ${
                                    selectedCategory === cat ? 'border-b-4 border-indigo-600 dark:border-white opacity-100 scale-105' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
                                }`}
                            >
                                <Home size={22} className={selectedCategory === cat ? 'text-indigo-600' : 'text-slate-400'} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{cat}</span>
                            </button>
                        ))}
                    </div>

                    {/* Advanced Filter Command Console */}
                    <div className="flex flex-wrap items-center gap-6 bg-white dark:bg-slate-800 rounded-[2.5rem] px-10 py-5 border border-slate-100 dark:border-slate-700 w-full lg:w-auto shadow-2xl ring-8 ring-indigo-500/5 transition-all">
                        <div className="flex flex-col gap-2 min-w-[120px]">
                            <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Hub Budget (Max)</label>
                            <div className="flex items-center gap-3">
                               <DollarSign size={16} className="text-indigo-600" />
                               <input 
                                    type="range" 
                                    min="1000" 
                                    max="15000" 
                                    step="500"
                                    value={budget}
                                    onChange={(e) => setBudget(Number(e.target.value))}
                                    className="w-24 accent-indigo-600 cursor-pointer"
                               />
                               <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">₹{budget}</span>
                            </div>
                        </div>

                        <div className="w-px h-8 bg-slate-100 dark:bg-slate-700 hidden lg:block" />

                        <div className="flex flex-col gap-2">
                           <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Node Capacity</label>
                           <div className="flex items-center gap-3">
                               <Users size={16} className="text-indigo-600" />
                               <select 
                                    value={guests}
                                    onChange={(e) => setGuests(Number(e.target.value))}
                                    className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none dark:text-white border-none cursor-pointer"
                               >
                                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guests</option>)}
                               </select>
                           </div>
                        </div>

                        <div className="w-px h-8 bg-slate-100 dark:bg-slate-700 hidden lg:block" />

                        <label className="flex items-center gap-4 cursor-pointer group">
                           <div className={`w-10 h-6 rounded-full p-1 transition-all flex ${hasAC ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}>
                               <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                           </div>
                           <input 
                                type="checkbox" 
                                checked={hasAC}
                                onChange={(e) => setHasAC(e.target.checked)}
                                className="hidden"
                           />
                           <div className="flex flex-col gap-0.5">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${hasAC ? 'text-indigo-600' : 'text-slate-400'}`}>Premium AC</span>
                                <span className="text-[7px] font-black text-slate-300 uppercase leading-none">Protocol Node</span>
                           </div>
                        </label>

                        <div className="w-px h-8 bg-slate-100 dark:bg-slate-700 hidden lg:block" />

                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl px-4 py-2 border border-slate-100 dark:border-slate-800">
                             <Search size={18} className="text-slate-400 cursor-pointer hover:scale-110 transition-all" />
                             <input 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="text"
                                placeholder="Search Places..."
                                className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest dark:text-white w-24"
                             />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-16 relative">
                <div className="flex justify-between items-end mb-16 border-b-4 border-slate-100 dark:border-slate-800 pb-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                             <Sparkles className="text-indigo-600 animate-pulse" size={24} />
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">World Elite Network</span>
                        </div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter dark:text-white leading-none">Luxury <span className="text-indigo-600 underline">Nodes</span> Available</h2>
                    </div>
                    <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest italic">{filteredStays.length} Stays Verified</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {filteredStays.map((p, i) => (
                        <div key={p._id} className="group cursor-pointer space-y-6 flex flex-col h-full animate-in zoom-in duration-500 delay-150">
                            <Link to={`/product/${p._id}`} className="flex flex-col flex-1">
                                <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm group-hover:shadow-4xl transition-all border-4 border-transparent group-hover:border-indigo-600/20">
                                    {/* Multi-view Image Node Scroller */}
                                    <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out group-hover:scale-105">
                                         <img src={p.images[0]} className="w-full h-full object-cover shadow-2xl" alt={p.name} />
                                    </div>
                                    
                                    {/* Multiple View Indicators (Simulation) */}
                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                        {[1,2,3].map(dot => <div key={dot} className={`w-2 h-2 rounded-full shadow-xl border border-white/20 ${dot === 1 ? 'bg-white scale-125' : 'bg-white/40'}`} />)}
                                    </div>

                                    <div className="absolute top-8 right-8 p-4 bg-white/20 backdrop-blur-3xl rounded-[1.5rem] shadow-2xl hover:bg-white/40 transition-all border border-white/20 group-hover:scale-110">
                                        <Heart size={20} className="text-white hover:text-red-500 fill-transparent hover:fill-red-500 transition-all" />
                                    </div>
                                    
                                    <div className="absolute top-8 left-8 px-6 py-3 bg-slate-900/90 backdrop-blur-3xl rounded-[1.2rem] text-[9px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-3 border border-white/10 shadow-2xl">
                                        <Shield size={12} className="text-indigo-400" />
                                        Verified Hub
                                    </div>

                                    <div className="absolute bottom-8 right-8 px-6 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center gap-3 shadow-4xl border border-white/10">
                                        <Star size={14} className="fill-indigo-600 text-indigo-600" />
                                        {p.rating}
                                    </div>
                                </div>

                                <div className="space-y-4 px-4 mt-8 flex flex-col flex-1">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-2">
                                             <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/30 font-black">
                                                 {p.category} Specialist
                                             </div>
                                             {p.hasAC && (
                                                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30 font-black">
                                                    AC ACTIVE
                                                </div>
                                             )}
                                        </div>
                                        <h3 className="font-black text-2xl dark:text-white leading-tight uppercase transition-colors group-hover:text-indigo-600 line-clamp-2">{p.name || 'Elite Resort Node'}</h3>
                                    </div>
                                    
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                            <MapPin size={14} className="text-red-500" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Global Elite Hub • Mumbai</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                             <div className="flex items-center gap-2">
                                                 <User size={14} className="text-slate-400" />
                                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.maxGuests || 4} Node Limit</p>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                 <Wind size={14} className="text-slate-400" />
                                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Check OK</p>
                                             </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-8 mt-auto border-t border-slate-50 dark:border-slate-800">
                                         <p className="text-3xl font-black dark:text-white tracking-tighter">₹{p.price.toLocaleString()} <span className="font-normal text-[10px] text-slate-400 uppercase tracking-[0.2em] ml-2 italic">/ Cycle</span></p>
                                         <button className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-4xl hover:scale-110 active:scale-95 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                                             <Share2 size={18} />
                                         </button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Float Command Center Button */}
            <div className="fixed bottom-12 right-12 z-50">
                <button className="flex items-center gap-6 px-12 py-7 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[3rem] font-black text-[12px] uppercase tracking-widest shadow-4xl hover:scale-105 active:scale-95 transition-all border border-white/10 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-indigo-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    <span className="relative z-10">Deploy Interactive Map</span> 
                    <Map size={24} className="relative z-10 group-hover:rotate-12 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default StayHub;
