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
            <div className="bg-slate-50 min-h-screen pb-20 pt-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-white animate-pulse rounded-[4rem] h-[500px] border border-slate-100 shadow-sm" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20 overflow-hidden">
            {/* Genius Hub Command Header */}
            <div className="px-6 py-16 bg-white/80 backdrop-blur-3xl border-b border-slate-100 sticky top-[4.5rem] z-40 shadow-sm text-left">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/30 transform -rotate-6">
                            <Wrench size={40} className="animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none font-elegant">Active <span className="text-blue-600 underline underline-offset-8">Artisans</span></h1>
                            <div className="flex items-center gap-3">
                                 <Activity size={14} className="text-blue-600" />
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Concierge Protocol Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-slate-50 rounded-full px-10 py-6 border border-slate-200 w-full lg:w-[500px] shadow-inner focus-within:ring-8 focus-within:ring-blue-500/5 transition-all">
                        <Search size={22} className="text-slate-400" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text" 
                            placeholder="Find Specialist Hub or Service..." 
                            className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase tracking-widest text-slate-900 placeholder-slate-300"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
                {/* Reduced Interactive Sidebar Controller */}
                <div className="lg:col-span-2">
                    <div className="space-y-10 sticky top-52">
                        <div className="p-8 bg-white rounded-[3.5rem] border border-slate-100 space-y-8 shadow-xl overflow-hidden group text-left">
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            
                            <div className="flex items-center gap-3 relative z-10 border-b border-slate-50 pb-6">
                                <Settings size={18} className="text-blue-600" />
                                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Sectors</h3>
                            </div>
                            
                            <div className="space-y-3 relative z-10">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-[1.5rem] font-black text-[9px] uppercase tracking-widest transition-all duration-500 ${
                                            selectedCategory === cat.id 
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105 z-10' 
                                            : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-blue-500/30'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                             {cat.icon}
                                             {cat.label}
                                        </div>
                                        <ChevronRight size={14} className={`transition-transform duration-700 ${selectedCategory === cat.id ? 'translate-x-1' : 'opacity-20 translate-x-3'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-blue-600 text-white rounded-[3.5rem] space-y-6 shadow-xl relative overflow-hidden group/card text-left">
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl group-hover/card:scale-150 transition-transform duration-1000" />
                            <div className="flex items-center gap-3 relative z-10">
                                <Shield className="text-white" size={18} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Verified Unit</span>
                            </div>
                            <p className="text-[9px] font-black opacity-80 leading-relaxed uppercase tracking-widest relative z-10 italic">Elite Specialist verified by Active Security.</p>
                        </div>
                    </div>
                </div>

                {/* Expanded Professional Node Explorer */}
                <div className="lg:col-span-10 space-y-12">
                    <div className="flex items-center justify-between border-b-2 border-slate-100 pb-10">
                         <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 font-elegant text-left">Global <span className="text-blue-600">Artisan</span> Grid</h2>
                         <div className="flex items-center gap-4 px-8 py-4 bg-blue-50 rounded-[2rem] border border-blue-100 shadow-sm transition-all hover:border-blue-500/20">
                             <Zap size={18} className="text-blue-600 fill-blue-600 animate-bounce" />
                             <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Grid Sync Active</span>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                        {filteredGenius.length === 0 && !loading ? (
                             <div className="col-span-full py-60 text-center space-y-6">
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Search size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-3xl font-black uppercase text-slate-300 tracking-tighter">Artisan Grid Offline</h3>
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
                                        className="bg-white rounded-[4rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-500/20 transition-all group overflow-hidden flex flex-col backdrop-blur-sm"
                                    >
                                        <Link to={`/product/${p._id}`} className="group/img relative aspect-[5/4] p-10 bg-slate-50 flex items-center justify-center overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <img 
                                                src={p.images?.[0]} 
                                                className="w-full h-full object-cover rounded-[3rem] shadow-xl group-hover:scale-110 transition-transform duration-1000 border-4 border-white"
                                                alt={p.name}
                                            />
                                            <div className="absolute bottom-12 right-12 p-5 bg-white/90 backdrop-blur-3xl rounded-[1.5rem] shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 border border-slate-100">
                                                <Heart size={20} className="text-slate-300 hover:text-red-500 cursor-pointer fill-transparent hover:fill-red-500 transition-all" />
                                            </div>
                                            <div className="absolute top-12 left-12 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-xl text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-blue-500/20">ELITE DEPLOY</div>
                                        </Link>
                                        
                                        <div className="p-12 space-y-10 text-left flex-1 flex flex-col">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="px-6 py-2 bg-blue-50 text-blue-600 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">
                                                        {p.category} Specialist
                                                    </div>
                                                    <div className="flex items-center gap-3 text-slate-400">
                                                         <MapPin size={14} className="text-blue-600" />
                                                         <span className="text-[11px] font-black uppercase tracking-widest">Global Hub</span>
                                                    </div>
                                                </div>
                                                <h4 className="font-black text-3xl text-slate-900 leading-tight uppercase line-clamp-1 transition-colors group-hover:text-blue-600 font-elegant">{p.name}</h4>
                                            </div>
                                            
                                            <div className="flex items-center justify-between border-y border-slate-50 py-8">
                                                <div className="flex items-center gap-3">
                                                    <Star size={20} className="fill-amber-500 text-amber-500" />
                                                    <span className="text-[18px] font-black text-slate-900 tracking-tighter">{p.rating}</span>
                                                    <span className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none ml-1 italic">Range</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-slate-400 font-black text-[11px] uppercase tracking-widest bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                                                    <Clock size={18} className="text-blue-600" /> {p.timeToDeliver || '45 Mins'}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-6 mt-auto">
                                                <div className="flex flex-col">
                                                     <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest leading-none mb-2 italic">Fee Structure</span>
                                                     <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{p.price}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleBooking(p)}
                                                    className="px-10 py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all hover:scale-105 group/book shadow-blue-500/20"
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
                <button className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] shadow-xl flex items-center justify-center hover:scale-110 active:rotate-12 transition-all group overflow-hidden shadow-blue-500/20">
                     <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                     <Phone size={36} className="animate-pulse" />
                </button>
            </div>
        </div>
    );
};

export default GeniusHub;
