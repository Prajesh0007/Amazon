import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Star, Home, Calendar, Users, Heart, ChevronRight, Share2, Map } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';

const StayHub = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchProducts({ serviceType: 'Stay' });
    }, [fetchProducts]);

    const categories = ['All', 'Resorts', 'Suites', 'Villas', 'Beachfront', 'Cabins'];

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
            {/* Stay Hub Explorer */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm sticky top-[4.5rem] z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`flex flex-col items-center gap-2 px-6 py-2 transition-all group ${
                                    filter === cat ? 'border-b-2 border-slate-900 dark:border-white opacity-100' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                                }`}
                            >
                                <Home size={20} className={filter === cat ? 'text-purple-500' : 'text-slate-400'} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{cat}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 rounded-full px-6 py-3 border border-slate-100 dark:border-slate-700 w-full md:w-auto">
                        <Calendar size={16} className="text-purple-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Apr 10 - Apr 15</span>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
                        <Users size={16} className="text-purple-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">2 Guests</span>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
                        <Search size={16} className="text-slate-900 dark:text-white" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnimatePresence>
                        {products.map((p, i) => (
                            <motion.div
                                key={p._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group cursor-pointer"
                            >
                                <Link to={`/product/${p._id}`}>
                                    <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm group-hover:shadow-3xl transition-all mb-4">
                                        <img 
                                            src={p.images[0]} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            alt={p.name}
                                        />
                                        <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full shadow-lg hover:bg-white/40 transition-colors">
                                            <Heart size={18} className="text-white hover:text-red-500" />
                                        </div>
                                        <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <Star size={10} className="fill-purple-500 text-purple-500" />
                                            {p.rating} (Verified Stay)
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-extrabold text-sm dark:text-white leading-tight">{p.name || 'Grand Resort'}</h3>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <MapPin size={12} />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Mumbai, India</p>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Available Now</p>
                                        <p className="text-sm font-black dark:text-white mt-1">₹{p.price.toLocaleString()} <span className="font-normal text-[10px] text-slate-400 uppercase tracking-widest ml-1">per night</span></p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Float Action Map */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-xs uppercase tracking-widest shadow-3xl hover:scale-110 active:scale-95 transition-all">
                    Show Map <Map size={18} />
                </button>
            </div>
        </div>
    );
};

export default StayHub;
