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

    const handleBooking = (p) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: `Syncing with Genius Node: ${p.name}...`,
                success: `Booking Verified! Genius will arrive in ${p.timeToDeliver || '45 mins'}.`,
                error: 'Node Connection Failed',
            }
        );
    };

    return (
        <div className="bg-amber-50/10 dark:bg-slate-950 min-h-screen pb-20 overflow-hidden">
            {/* Genius Hub Command Header */}
            <div className="px-6 py-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border-b border-amber-100 dark:border-amber-900/30 sticky top-[4.5rem] z-40 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-amber-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-4xl shadow-amber-500/30 transform -rotate-6">
                            <Wrench size={40} className="animate-pulse" />
                        </div>
                        <div className="space-y-2 text-left">
                            <h1 className="text-5xl font-black uppercase tracking-tighter dark:text-white leading-none">Genius <span className="text-amber-600 underline underline-offset-8">Hub</span></h1>
                            <div className="flex items-center gap-3">
                                 <Activity size={14} className="text-amber-500" />
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Elite Professional Sync Protocol Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-800 rounded-full px-10 py-6 border border-slate-100 dark:border-slate-700 w-full lg:w-[500px] shadow-inner focus-within:ring-8 focus-within:ring-amber-500/10 transition-all">
                        <Search size={22} className="text-slate-400" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text" 
                            placeholder="Find Specialist Node or Service..." 
                            className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase tracking-widest dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
                {/* Fixed Interactive Sidebar Controller */}
                <div className="lg:col-span-3">
                    <div className="p-10 bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-slate-50 dark:border-slate-800 space-y-10 shadow-4xl sticky top-52 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="flex items-center gap-4 relative z-10 border-b border-slate-50 dark:border-slate-800 pb-6">
                            <Settings size={22} className="text-amber-500" />
                            <h3 className="text-xl font-black uppercase tracking-tight dark:text-white">Node Sectors</h3>
                        </div>
                        
                        <div className="space-y-4 relative z-10">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`w-full flex items-center justify-between p-6 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500 group-btn ${
                                        selectedCategory === cat.id 
                                        ? 'bg-amber-500 text-white shadow-4xl shadow-amber-500/30 scale-105 z-10' 
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 hover:text-amber-600'
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

                        <div className="p-8 bg-slate-950 dark:bg-slate-800 text-white rounded-[3rem] space-y-6 shadow-4xl border border-amber-500/20 relative overflow-hidden group/card">
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500 opacity-20 rounded-full blur-3xl group-hover/card:scale-150 transition-transform duration-1000" />
                            <div className="flex items-center gap-4 relative z-10">
                                <Shield className="text-amber-500" size={20} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Security Node</span>
                            </div>
                            <p className="text-[9px] font-bold opacity-60 leading-relaxed uppercase tracking-widest relative z-10">Every Genius Node is background-verified by SuperApp Elite Security protocols before deployment.</p>
                        </div>
                    </div>
                </div>

                {/* Professional Node Explorer */}
                <div className="lg:col-span-9 space-y-12">
                    <div className="flex items-center justify-between border-b-4 border-slate-50 dark:border-slate-800 pb-8">
                         <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">Active <span className="text-amber-500">Genius</span> Network</h2>
                         <div className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-slate-900 rounded-[1.5rem] border-2 border-slate-50 dark:border-slate-800 shadow-2xl group cursor-help transition-all hover:border-amber-500/20">
                             <Zap size={18} className="text-amber-500 fill-amber-500 animate-bounce" />
                             <span className="text-[11px] font-black uppercase tracking-widest dark:text-white">Node Tracking Active</span>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                        <AnimatePresence mode='popLayout'>
                            {filteredGenius.map((p, i) => (
                                <motion.div
                                    key={p._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -30 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    className="bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm hover:shadow-4xl hover:border-amber-500/20 transition-all group overflow-hidden flex flex-col"
                                >
                                    <Link to={`/product/${p._id}`} className="group/img relative aspect-[5/4] p-8 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img 
                                            src={p.images?.[0]} 
                                            className="w-full h-full object-cover rounded-[3rem] shadow-2xl group-hover:scale-110 transition-transform duration-1000 border-4 border-white/50 dark:border-slate-700/50"
                                            alt={p.name}
                                        />
                                        <div className="absolute bottom-12 right-12 p-4 bg-white/90 dark:bg-slate-900/90 rounded-[1.2rem] shadow-4xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                            <Heart size={20} className="text-slate-400 hover:text-red-500 cursor-pointer fill-transparent hover:fill-red-500 transition-all" />
                                        </div>
                                        <div className="absolute top-12 left-12 px-5 py-2 bg-amber-500 text-white rounded-xl shadow-2xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">PLATINUM</div>
                                    </Link>
                                    
                                    <div className="p-10 space-y-8 text-left flex-1 flex flex-col">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="px-5 py-2 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-800/50 shadow-inner">
                                                    {p.category} Specialist Node
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-300">
                                                     <MapPin size={12} />
                                                     <span className="text-[10px] font-black uppercase">Hub Prime</span>
                                                </div>
                                            </div>
                                            <h4 className="font-black text-2xl dark:text-white leading-tight uppercase line-clamp-1 transition-colors group-hover:text-amber-600">{p.name || 'Elite Genius Specialist'}</h4>
                                        </div>
                                        
                                        <div className="flex items-center justify-between border-y border-slate-50 dark:border-slate-800 py-6">
                                            <div className="flex items-center gap-2">
                                                <Star size={18} className="fill-amber-500 text-amber-500 shadow-xl" />
                                                <span className="text-[16px] font-black dark:text-white tracking-tighter">{p.rating}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none ml-1">(Elite Range)</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-5 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <Clock size={16} className="text-amber-500" /> {p.timeToDeliver || '45 Mins'}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 mt-auto">
                                            <div className="flex flex-col">
                                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 italic">Consult Code Active</span>
                                                 <p className="text-4xl font-black dark:text-white tracking-tighter">₹{p.price}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleBooking(p)}
                                                className="px-10 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest shadow-4xl active:scale-95 transition-all hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white group/book"
                                            >
                                                Book Node <ChevronRight size={16} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            
            {/* Global Emergency Genius Contact Bridge */}
            <div className="fixed bottom-12 right-12 z-50">
                <button className="w-20 h-20 bg-amber-500 text-white rounded-[1.8rem] shadow-4xl flex items-center justify-center hover:scale-110 active:rotate-12 transition-all group overflow-hidden">
                     <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                     <Phone size={32} className="animate-pulse" />
                </button>
            </div>
        </div>
    );
};

export default GeniusHub;
