import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Utensils, Star, Clock, MapPin, Search, ChevronRight, Zap, Filter, ArrowLeft, Plus } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';

const FoodHub = () => {
    const { businesses, fetchBusinesses, apiUrl } = useProductStore();
    const { addToCart } = useCartStore();
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [restaurantProducts, setRestaurantProducts] = useState([]);
    const [loadingMenu, setLoadingMenu] = useState(false);

    useEffect(() => {
        console.log('--- FoodHub Mount --- Fetching Restaurants');
        fetchBusinesses({ serviceType: 'Food' });
    }, [fetchBusinesses]);

    const handleRestaurantClick = async (biz) => {
        setSelectedRestaurant(biz);
        setLoadingMenu(true);
        console.log('Fetching menu for:', biz.name);
        try {
            const { data } = await axios.get(`${apiUrl}/products/business/${biz._id}/products`);
            // Ensure data is an array
            const products = Array.isArray(data) ? data : (data.products || []);
            setRestaurantProducts(products);
        } catch (err) {
            console.error('Error fetching menu:', err);
            toast.error('Failed to load menu');
        } finally {
            setLoadingMenu(false);
        }
    };

    const handleAddToCart = (e, p) => {
        e.stopPropagation();
        addToCart(p, 1);
        toast.success(`${p.name} added to cart!`);
    };

    return (
        <div className="bg-orange-50/30 dark:bg-slate-950 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-orange-100 dark:border-slate-800 px-6 py-12">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600">
                        <Utensils size={32} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black tracking-tighter uppercase dark:text-white leading-none">
                            Food <span className="text-orange-500 underline decoration-4 underline-offset-8">Plate</span>
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Instant Gastronomy Delivered</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {!selectedRestaurant ? (
                    <div className="space-y-8">
                        <div className="flex justify-between items-end">
                            <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Elite <span className="text-orange-500">Kitchens</span></h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{businesses.length} Establishments Open</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {(businesses || []).map((biz) => (
                                <div
                                    key={biz._id}
                                    onClick={() => handleRestaurantClick(biz)}
                                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all cursor-pointer group overflow-hidden"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img 
                                            src={biz.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                            alt={biz.name}
                                        />
                                        <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                            <Star size={14} className="fill-orange-500 text-orange-500" />
                                            {biz.rating}
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{biz.name}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{biz.category} • {biz.description?.substring(0, 50)}...</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                                <Clock size={16} /> 25-30 MINS
                                            </div>
                                            <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Restaurant Detail Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-12">
                            <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden shadow-2xl shrink-0">
                                <img src={selectedRestaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'} className="w-full h-full object-cover" alt="Logo" />
                            </div>
                            <div className="flex-1 space-y-6 text-center md:text-left">
                                <button 
                                    onClick={() => setSelectedRestaurant(null)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                                >
                                    <ArrowLeft size={14} /> Back to Hub
                                </button>
                                <h2 className="text-5xl font-black tracking-tighter dark:text-white uppercase leading-none">{selectedRestaurant.name}</h2>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-xl text-[10px] font-black uppercase">
                                        <Star size={14} className="fill-orange-600" /> {selectedRestaurant.rating} Rating
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl text-[10px] font-black uppercase">
                                        <Clock size={14} /> {selectedRestaurant.avgDeliveryTime || '30 MINS'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Menu Grid */}
                        <div className="space-y-8">
                             <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Recommended <span className="text-orange-500">Menu</span></h3>
                             {loadingMenu ? (
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                     {[...Array(6)].map((_, i) => (
                                         <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
                                     ))}
                                 </div>
                             ) : (
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                     {restaurantProducts.map((p) => (
                                         <div
                                             key={p._id}
                                             className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 flex items-center gap-6 group hover:shadow-xl transition-all"
                                         >
                                             <div className="flex-1 space-y-2">
                                                 <div className="flex items-center gap-2">
                                                     <div className={`w-3 h-3 border-2 ${p.isVeg ? 'border-green-500' : 'border-red-500'} p-0.5`}>
                                                         <div className={`w-full h-full rounded-full ${p.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                                                     </div>
                                                     <span className="text-[8px] font-black text-slate-400 tracking-widest uppercase">Signature</span>
                                                 </div>
                                                 <h4 className="font-extrabold text-sm dark:text-white group-hover:text-orange-500 transition-colors uppercase">{p.name}</h4>
                                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest line-clamp-1">{p.description}</p>
                                                 <p className="font-black text-lg dark:text-white">₹{p.price}</p>
                                             </div>
                                             <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg relative shrink-0">
                                                 <img src={p.images?.[0] || 'https://via.placeholder.com/200'} className="w-full h-full object-cover" alt="Dish" />
                                                 <button 
                                                    onClick={(e) => handleAddToCart(e, p)}
                                                    className="absolute bottom-1 left-1.5 right-1.5 bg-white py-1.5 rounded-lg text-[10px] font-black text-green-600 shadow-xl border border-green-100 hover:bg-green-50 active:scale-95 transition-all uppercase"
                                                 >
                                                    Add <Plus size={10} className="inline ml-1" />
                                                 </button>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodHub;
