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

    if (loading) {
        return (
            <div className="bg-[#010103] min-h-screen pb-20 pt-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="bg-slate-900/40 animate-pulse rounded-[4rem] h-[600px] border border-white/5" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#010103] dark:bg-[#010103] min-h-screen pb-20 overflow-hidden">
            {/* Stay Hub Explorer Header */}
            <div className="bg-black/60 backdrop-blur-3xl border-b border-white/5 shadow-2xl sticky top-[4.5rem] z-40">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row items-center justify-between gap-8">
                    {/* Category Scroll */}
                    <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 w-full lg:w-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`flex flex-col items-center gap-3 px-6 py-3 transition-all duration-500 group min-w-[80px] ${
                                    selectedCategory === cat ? 'border-b-4 border-amber-500 opacity-100 scale-105' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
                                }`}
                            >
                                <Home size={22} className={selectedCategory === cat ? 'text-amber-500' : 'text-slate-400'} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none text-white">{cat}</span>
                            </button>
                        ))}
                    </div>

                    {/* Advanced Filter Command Console */}
                    <div className="flex flex-wrap items-center gap-6 bg-white/5 rounded-[3rem] px-10 py-6 border border-white/10 w-full lg:w-auto shadow-2xl transition-all">
                        <div className="flex flex-col gap-2 min-w-[120px]">
                            <label className="text-[8px] font-black uppercase tracking-widest text-slate-500">Suite Budget (Max)</label>
                            <div className="flex items-center gap-3">
                               <DollarSign size={16} className="text-amber-500" />
                               <input 
                                    type="range" 
                                    min="1000" 
                                    max="50000" 
                                    step="500"
                                    value={budget}
                                    onChange={(e) => setBudget(Number(e.target.value))}
                                    className="w-24 accent-amber-500 cursor-pointer"
                               />
                               <span className="text-[10px] font-black text-white uppercase tracking-tighter">₹{budget.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="w-px h-8 bg-white/10 hidden lg:block" />

                        <div className="flex flex-col gap-2">
                           <label className="text-[8px] font-black uppercase tracking-widest text-slate-500">Elite Guests</label>
                           <div className="flex items-center gap-3">
                               <Users size={16} className="text-amber-500" />
                               <select 
                                    value={guests}
                                    onChange={(e) => setGuests(Number(e.target.value))}
                                    className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none text-white border-none cursor-pointer"
                               >
                                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guests</option>)}
                               </select>
                           </div>
                        </div>

                        <div className="w-px h-8 bg-white/10 hidden lg:block" />

                        <label className="flex items-center gap-4 cursor-pointer group">
                           <div className={`w-10 h-6 rounded-full p-1 transition-all duration-500 flex ${hasAC ? 'bg-amber-500 justify-end' : 'bg-slate-800 justify-start'}`}>
                               <div className="w-4 h-4 bg-white rounded-full shadow-2xl" />
                           </div>
                           <input 
                                type="checkbox" 
                                checked={hasAC}
                                onChange={(e) => setHasAC(e.target.checked)}
                                className="hidden"
                           />
                           <div className="flex flex-col gap-0.5">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${hasAC ? 'text-amber-500' : 'text-slate-500'}`}>Elite Climate</span>
                                <span className="text-[7px] font-black text-slate-600 uppercase leading-none">AC Protocol</span>
                           </div>
                        </label>

                        <div className="w-px h-8 bg-white/10 hidden lg:block" />

                        <div className="flex items-center gap-4 bg-black/40 rounded-2xl px-6 py-3 border border-white/5">
                             <Search size={18} className="text-slate-500 cursor-pointer hover:scale-110 transition-all" />
                             <input 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="text"
                                placeholder="Search Estates..."
                                className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-white w-32 placeholder-slate-700"
                             />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-16 relative">
                <div className="flex justify-between items-end mb-16 border-b-2 border-white/5 pb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                             <Sparkles className="text-amber-500 animate-pulse" size={24} />
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">World Elite Network</span>
                        </div>
                        <h2 className="text-6xl font-black uppercase tracking-tighter text-white leading-none font-elegant">Luxe <span className="text-amber-500">Estates</span> Available</h2>
                    </div>
                    <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest italic">{filteredStays.length} Stays Verified</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {filteredStays.length === 0 && !loading ? (
                         <div className="col-span-full py-60 text-center space-y-6">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                                <Search size={40} className="text-slate-800" />
                            </div>
                            <h3 className="text-3xl font-black uppercase text-slate-800 tracking-tighter">No Estates Match Your Command</h3>
                            <p className="text-xs font-bold text-slate-900 uppercase tracking-[0.3em]">RECALIBRATE FILTER PARAMETERS</p>
                         </div>
                    ) : filteredStays.map((p, i) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            key={p._id} 
                            className="group cursor-pointer space-y-6 flex flex-col h-full"
                        >
                            <Link to={`/product/${p._id}`} className="flex flex-col flex-1">
                                <div className="relative aspect-[4/5] rounded-[4.5rem] overflow-hidden bg-slate-900 shadow-2xl group-hover:shadow-amber-500/10 transition-all border-4 border-transparent group-hover:border-amber-500/20">
                                    {/* Multi-view Image Node Scroller */}
                                    <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out group-hover:scale-110">
                                         <img src={p.images[0]} className="w-full h-full object-cover" alt={p.name} />
                                    </div>
                                    
                                    {/* Multiple View Indicators (Simulation) */}
                                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                        {[1,2,3].map(dot => <div key={dot} className={`w-2 h-2 rounded-full shadow-2xl border border-white/20 ${dot === 1 ? 'bg-amber-500 scale-125' : 'bg-white/40'}`} />)}
                                    </div>

                                    <div className="absolute top-10 right-10 p-5 bg-black/60 backdrop-blur-3xl rounded-[2rem] shadow-4xl hover:bg-amber-500/20 transition-all border border-white/10 group-hover:scale-110">
                                        <Heart size={20} className="text-white hover:text-red-500 fill-transparent hover:fill-red-500 transition-all" />
                                    </div>
                                    
                                    <div className="absolute top-10 left-10 px-6 py-3 bg-black/80 backdrop-blur-3xl rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-3 border border-white/10 shadow-4xl">
                                        <Shield size={12} className="text-amber-500" />
                                        Elite Certified
                                    </div>

                                    <div className="absolute bottom-10 right-10 px-8 py-4 bg-amber-500 rounded-3xl text-[14px] font-black uppercase tracking-widest flex items-center gap-3 shadow-4xl text-black">
                                        <Star size={16} className="fill-black text-black" />
                                        {p.rating}
                                    </div>
                                </div>

                                <div className="space-y-6 px-6 mt-10 flex flex-col flex-1">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-3">
                                             <div className="px-4 py-2 bg-amber-500/10 text-amber-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-amber-500/20 font-black">
                                                 {p.category} Series
                                             </div>
                                             {p.hasAC && (
                                                <div className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-500/20 font-black">
                                                    CLIMATE LINK
                                                </div>
                                             )}
                                        </div>
                                        <h3 className="font-black text-3xl text-white leading-tight uppercase transition-colors group-hover:text-amber-500 line-clamp-2">{p.name}</h3>
                                    </div>
                                    
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3 text-slate-500 group-hover:text-white transition-colors">
                                            <MapPin size={16} className="text-amber-500" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">Global Elite District • Mumbai</p>
                                        </div>
                                        <div className="flex items-center gap-8">
                                             <div className="flex items-center gap-3">
                                                 <User size={16} className="text-slate-600" />
                                                 <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{p.maxGuests || 4} Guests</p>
                                             </div>
                                             <div className="flex items-center gap-3">
                                                 <Wind size={16} className="text-slate-600" />
                                                 <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Check Active</p>
                                             </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-10 mt-auto border-t border-white/5">
                                         <p className="text-4xl font-black text-white tracking-tighter">₹{p.price.toLocaleString()} <span className="font-normal text-[11px] text-slate-600 uppercase tracking-[0.3em] ml-2 italic">/ Cycle</span></p>
                                         <button className="p-5 bg-white/5 text-slate-400 rounded-[2rem] shadow-4xl hover:scale-110 active:scale-95 transition-all hover:bg-amber-500 hover:text-black border border-white/10">
                                             <Share2 size={20} />
                                         </button>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Float Command Center Button */}
            <div className="fixed bottom-12 right-12 z-50">
                <button className="flex items-center gap-8 px-14 py-8 bg-amber-500 text-black rounded-[4rem] font-black text-[13px] uppercase tracking-[0.3em] shadow-4xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all group overflow-hidden relative">
                    <span className="relative z-10">Deploy Interactive Grid</span> 
                    <Map size={28} className="relative z-10 group-hover:rotate-12 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default StayHub;
