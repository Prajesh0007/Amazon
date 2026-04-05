import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Shield, Search, Star, Clock, Heart, ChevronRight, User, Phone, CheckCircle2, Zap, Settings, Hammer, Sparkles, Activity, MapPin } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const GeniusHub = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts({ serviceType: 'HomeService' });
    }, [fetchProducts]);

    const categories = [
        { id: 'All', icon: <Settings size={18} />, label: 'All Services' },
        { id: 'Cleaning', icon: <Sparkles size={18} />, label: 'Elite Cleaning' },
        { id: 'Repair', icon: <Hammer size={18} />, label: 'Master Repair' },
        { id: 'Electrical', icon: <Zap size={18} />, label: 'Grid Support' },
        { id: 'Plumbing', icon: <Activity size={18} />, label: 'Fluid Repair' },
        { id: 'Salon', icon: <User size={18} />, label: 'Grooming Hub' },
        { id: 'AC Repair', icon: <Zap size={18} />, label: 'Climate Node' }
    ];

    const filteredGenius = products.filter(p => 
        (selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase()) &&
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="bg-[#010103] min-h-screen pb-20 pt-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-slate-900/40 animate-pulse rounded-[4rem] h-[500px] border border-white/5" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#010103] dark:bg-[#010103] min-h-screen pb-20 overflow-hidden">
            {/* Genius Hub Command Header */}
            <div className="px-6 py-16 bg-black/60 backdrop-blur-3xl border-b border-white/5 sticky top-[4.5rem] z-40 shadow-2xl">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-amber-500 rounded-[2.5rem] flex items-center justify-center text-black shadow-4xl shadow-amber-500/30 transform -rotate-6">
                            <Wrench size={40} className="animate-pulse" />
                        </div>
                        <div className="space-y-2 text-left">
                            <h1 className="text-5xl font-black uppercase tracking-tighter text-white leading-none font-elegant">Elite <span className="text-amber-500 underline underline-offset-8">Masterworks</span></h1>
                            <div className="flex items-center gap-3">
                                 <Activity size={14} className="text-amber-500" />
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Global Concierge Protocol Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-white/5 rounded-full px-10 py-6 border border-white/10 w-full lg:w-[500px] shadow-2xl focus-within:ring-8 focus-within:ring-amber-500/5 transition-all">
                        <Search size={22} className="text-slate-500" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text" 
                            placeholder="Find Specialist Hub or Service..." 
                            className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase tracking-widest text-white placeholder-slate-700"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
                {/* Fixed Interactive Sidebar Controller */}
                <div className="lg:col-span-3">
                    <div className="p-10 bg-white/5 rounded-[4rem] border border-white/5 space-y-10 shadow-2xl sticky top-52 overflow-hidden backdrop-blur-md group">
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        
                        <div className="flex items-center gap-4 relative z-10 border-b border-white/5 pb-8">
                            <Settings size={22} className="text-amber-500" />
                            <h3 className="text-xl font-black uppercase tracking-tight text-white">Service Sectors</h3>
                        </div>
                        
                        <div className="space-y-4 relative z-10">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`w-full flex items-center justify-between p-6 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500 group-btn ${
                                        selectedCategory === cat.id 
                                        ? 'bg-amber-500 text-black shadow-4xl shadow-amber-500/20 scale-105 z-10' 
                                        : 'bg-black/40 text-slate-500 border border-white/5 hover:border-amber-500/30'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                         {cat.icon}
                                         {cat.label}
                                    </div>
                                    <ChevronRight size={16} className={`transition-transform duration-700 ${selectedCategory === cat.id ? 'translate-x-2' : 'opacity-20 translate-x-4'}`} />
                                </button>
                            ))}
                        </div>

                        <div className="p-10 bg-black/60 text-white rounded-[3.5rem] space-y-8 shadow-4xl border border-white/10 relative overflow-hidden group/card">
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500 opacity-10 rounded-full blur-3xl group-hover/card:scale-150 transition-transform duration-1000" />
                            <div className="flex items-center gap-4 relative z-10 text-amber-500">
                                <Shield className="text-amber-500" size={20} />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">Security Station</span>
                            </div>
                            <p className="text-[10px] font-black opacity-60 leading-relaxed uppercase tracking-widest relative z-10 italic">Every Elite Specialist is background-verified by Midnight Security protocols before deployment.</p>
                        </div>
                    </div>
                </div>

                {/* Professional Node Explorer */}
                <div className="lg:col-span-9 space-y-12">
                    <div className="flex items-center justify-between border-b-2 border-white/5 pb-10">
                         <h2 className="text-4xl font-black uppercase tracking-tighter text-white font-elegant">Global <span className="text-amber-500">Artisan</span> Grid</h2>
                         <div className="flex items-center gap-4 px-8 py-4 bg-white/5 rounded-[2rem] border border-white/10 shadow-4xl transition-all hover:border-amber-500/20">
                             <Zap size={18} className="text-amber-500 fill-amber-500 animate-bounce" />
                             <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Grid Sync Active</span>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                        {filteredGenius.length === 0 && !loading ? (
                             <div className="col-span-full py-60 text-center space-y-6">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                                    <Search size={40} className="text-slate-800" />
                                </div>
                                <h3 className="text-3xl font-black uppercase text-slate-800 tracking-tighter">Artisan Grid Offline</h3>
                             </div>
                        ) : (
                            <AnimatePresence mode='popLayout'>
                                {filteredGenius.map((p, i) => (
                                    <motion.div
                                        key={p._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        exit={{ opacity: 0, scale: 0.9, y: -30 }}
                                        className="bg-white/5 rounded-[4rem] border border-white/5 shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/20 transition-all group overflow-hidden flex flex-col backdrop-blur-sm"
                                    >
                                        <Link to={`/product/${p._id}`} className="group/img relative aspect-[5/4] p-10 bg-slate-900 flex items-center justify-center overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <img 
                                                src={p.images?.[0]} 
                                                className="w-full h-full object-cover rounded-[3rem] shadow-4xl group-hover:scale-110 transition-transform duration-1000 border-4 border-white/5"
                                                alt={p.name}
                                            />
                                            <div className="absolute bottom-12 right-12 p-5 bg-black/60 backdrop-blur-3xl rounded-[1.5rem] shadow-4xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 border border-white/10">
                                                <Heart size={20} className="text-white hover:text-red-500 cursor-pointer fill-transparent hover:fill-red-500 transition-all" />
                                            </div>
                                            <div className="absolute top-12 left-12 px-6 py-3 bg-amber-500 text-black rounded-2xl shadow-4xl text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-amber-500/20">ELITE DEPLOY</div>
                                        </Link>
                                        
                                        <div className="p-12 space-y-10 text-left flex-1 flex flex-col">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="px-6 py-2 bg-amber-500/10 text-amber-500 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest border border-amber-500/20 shadow-4xl">
                                                        {p.category} Specialist
                                                    </div>
                                                    <div className="flex items-center gap-3 text-slate-500">
                                                         <MapPin size={14} className="text-amber-500" />
                                                         <span className="text-[11px] font-black uppercase tracking-widest">Global Hub</span>
                                                    </div>
                                                </div>
                                                <h4 className="font-black text-3xl text-white leading-tight uppercase line-clamp-1 transition-colors group-hover:text-amber-500 font-elegant">{p.name}</h4>
                                            </div>
                                            
                                            <div className="flex items-center justify-between border-y border-white/5 py-8">
                                                <div className="flex items-center gap-3">
                                                    <Star size={20} className="fill-amber-500 text-amber-500" />
                                                    <span className="text-[18px] font-black text-white tracking-tighter">{p.rating}</span>
                                                    <span className="text-[11px] text-slate-600 font-black uppercase tracking-[0.2em] leading-none ml-1 italic">Range</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-slate-500 font-black text-[11px] uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                                                    <Clock size={18} className="text-amber-500" /> {p.timeToDeliver || '45 Mins'}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-6 mt-auto">
                                                <div className="flex flex-col">
                                                     <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2 italic">Fee Structure</span>
                                                     <p className="text-4xl font-black text-white tracking-tighter">₹{p.price}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleBooking(p)}
                                                    className="px-12 py-6 bg-amber-500 text-black rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-4xl active:scale-95 transition-all hover:scale-105 group/book shadow-amber-500/20"
                                                >
                                                    Deploy Artisan <ChevronRight size={18} className="inline ml-2 group-hover:translate-x-2 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Global Emergency Genius Contact Bridge */}
            <div className="fixed bottom-12 right-12 z-50">
                <button className="w-24 h-24 bg-amber-500 text-black rounded-[2rem] shadow-4xl flex items-center justify-center hover:scale-110 active:rotate-12 transition-all group overflow-hidden shadow-amber-500/20">
                     <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                     <Phone size={36} className="animate-pulse" />
                </button>
            </div>
        </div>
    );
};

export default GeniusHub;
