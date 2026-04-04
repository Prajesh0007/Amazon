import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Utensils, Star, Clock, MapPin, Search, ChevronRight, Zap, Filter } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';

const FoodHub = () => {
    const { businesses, fetchBusinesses, products, loading } = useProductStore();
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [restaurantProducts, setRestaurantProducts] = useState([]);
    const [filter, setFilter] = useState('All');

    const apiUrl = useProductStore(state => state.apiUrl);

    useEffect(() => {
        fetchBusinesses({ businessType: 'Restaurant' });
    }, [fetchBusinesses]);

    const handleRestaurantClick = async (biz) => {
        setSelectedRestaurant(biz);
        try {
            const { data } = await axios.get(`${apiUrl}/products/business/${biz._id}/products`);
            setRestaurantProducts(data);
        } catch (err) {
            console.error('Error fetching menu');
        }
    };

    const categories = ['All', 'Burger', 'Pizza', 'Sushi', 'Indian', 'Italian'];

    return (
        <div className="bg-orange-50/30 dark:bg-slate-950 min-h-screen pb-20">
            {/* Food Hub Hero */}
            <div className="relative h-[350px] overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80" 
                    className="w-full h-full object-cover brightness-50"
                    alt="Food Header"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-6">
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-6xl font-black tracking-tighter uppercase text-center"
                    >
                        Food <span className="text-orange-500">Plate</span>
                    </motion.h1>
                    <div className="max-w-2xl w-full px-6">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search restaurants or dishes..." 
                                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl py-5 pl-16 pr-6 text-white placeholder-white/50 outline-none focus:bg-white/20 transition-all font-bold"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
                
                {!selectedRestaurant ? (
                    <>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 dark:text-white">Top Restaurants In <span className="text-orange-500 underline">Mumbai</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {businesses.map((biz, i) => (
                                    <motion.div
                                        key={biz._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => handleRestaurantClick(biz)}
                                        className="bg-white dark:bg-slate-900 rounded-[3rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all cursor-pointer group"
                                    >
                                        <div className="relative h-64 rounded-[2.5rem] overflow-hidden mb-6">
                                            <img 
                                                src={biz.logo || `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80`} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                alt={biz.name}
                                            />
                                            <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                                <Star size={14} className="fill-orange-500 text-orange-500" />
                                                {biz.rating} Verified
                                            </div>
                                        </div>
                                        <div className="px-6 pb-6 space-y-4">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-2">{biz.name}</h3>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed line-clamp-1">{biz.tags.join(' • ')}</p>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Clock size={16} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{biz.avgDeliveryTime || '30-45 mins'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Starts from</p>
                                                    <p className="text-xl font-black dark:text-white">₹{biz.avgCostForTwo || 200}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-12"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-12">
                            <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden shadow-2xl shrink-0">
                                <img src={selectedRestaurant.logo || `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80`} className="w-full h-full object-cover" alt="Restaurant" />
                            </div>
                            <div className="flex-1 space-y-6">
                                <button 
                                    onClick={() => setSelectedRestaurant(null)}
                                    className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4 hover:underline"
                                >
                                    <ChevronRight className="rotate-180" size={14} /> Back to Hub
                                </button>
                                <div className="space-y-2">
                                    <h2 className="text-5xl font-black tracking-tighter dark:text-white uppercase leading-none">{selectedRestaurant.name}</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">{selectedRestaurant.tags.join(' • ')}</p>
                                </div>
                                <div className="flex gap-6 pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</span>
                                        <div className="flex items-center gap-1 font-black">
                                            <Star size={16} className="fill-orange-500 text-orange-500" /> {selectedRestaurant.rating}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery</span>
                                        <div className="flex items-center gap-1 font-black dark:text-white">
                                            <Clock size={16} /> {selectedRestaurant.avgDeliveryTime}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {restaurantProducts.map((p, i) => (
                                <motion.div
                                    key={p._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 flex items-center gap-6 group hover:shadow-xl transition-all"
                                >
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 border-2 ${p.isVeg ? 'border-green-500' : 'border-red-500'} p-0.5`}>
                                                <div className={`w-full h-full rounded-full ${p.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Elite Choice</span>
                                        </div>
                                        <h4 className="font-extrabold text-sm dark:text-white group-hover:text-orange-500 transition-colors">{p.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 line-clamp-1">{p.description}</p>
                                        <p className="font-black text-lg dark:text-white">₹{p.price}</p>
                                    </div>
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg relative">
                                        <img src={p.images[0]} className="w-full h-full object-cover" alt="Dish" />
                                        <button className="absolute bottom-1 left-1.5 right-1.5 bg-white py-1.5 rounded-lg text-[10px] font-black text-green-600 shadow-xl border border-green-100 hover:bg-green-50 transition-colors uppercase">Add</button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
};


export default FoodHub;
