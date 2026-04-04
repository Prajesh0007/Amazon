import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, MapPin, Search, Star, Clock, Zap, Shield, ChevronRight, User, Phone, Map } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';

const RideHub = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [selectedRide, setSelectedRide] = useState(null);
    const [pickup, setPickup] = useState('My Current Location');
    const [drop, setDrop] = useState('');
    const [bookingStatus, setBookingStatus] = useState('Idle'); // Idle, Searching, Confirmed, Arriving

    useEffect(() => {
        fetchProducts({ serviceType: 'Ride' });
    }, [fetchProducts]);

    const handleBooking = () => {
        setBookingStatus('Searching');
        setTimeout(() => setBookingStatus('Confirmed'), 3000);
        setTimeout(() => setBookingStatus('Arriving'), 6000);
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen relative overflow-hidden">
            {/* Map Placeholder */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05),transparent)]" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left side: Booking Form */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 p-8 shadow-3xl rounded-[2.5rem] space-y-8"
                    >
                        <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Request <span className="text-indigo-500">Ride</span></h2>
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-green-500" />
                                <input 
                                    value={pickup}
                                    onChange={(e) => setPickup(e.target.value)}
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" 
                                    placeholder="Pickup location" 
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-red-500" />
                                <input 
                                    value={drop}
                                    onChange={(e) => setDrop(e.target.value)}
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" 
                                    placeholder="Enter Destination" 
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {products.map((r) => (
                                <button
                                    key={r._id}
                                    onClick={() => setSelectedRide(r)}
                                    className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                                        selectedRide?._id === r._id 
                                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/30' 
                                        : 'border-transparent bg-slate-50 dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center p-2 shadow-sm">
                                            <img src={r.images[0]} className="w-full h-full object-contain" alt={r.name} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase dark:text-white leading-none">{r.name}</p>
                                            <p className="text-[8px] text-slate-400 font-bold tracking-widest mt-1">2 mins away</p>
                                        </div>
                                    </div>
                                    <p className="text-xs font-black dark:text-white">₹{r.price.toLocaleString()}</p>
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={handleBooking}
                            disabled={!drop || !selectedRide || bookingStatus !== 'Idle'}
                            className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 disabled:opacity-50 hover:scale-105 transition-all"
                        >
                            {bookingStatus === 'Idle' ? 'Book Ride Now' : 'Processing...'}
                        </button>
                    </motion.div>

                    <div className="p-8 bg-slate-900 dark:bg-slate-800 text-white rounded-[2.5rem] shadow-xl space-y-4">
                        <div className="flex items-center gap-3">
                           <Shield className="text-green-500" />
                           <p className="text-[10px] font-black uppercase tracking-widest">Safe Travel Guarantee</p>
                        </div>
                        <p className="text-[8px] opacity-60 font-medium leading-relaxed uppercase">Rides are monitored by our 24/7 Elite Command Center for complete user safety.</p>
                    </div>
                </div>

                {/* Right side: Real-time update */}
                <div className="lg:col-span-8 flex flex-col justify-end pb-12">
                   <AnimatePresence>
                       {bookingStatus !== 'Idle' && (
                           <motion.div 
                               initial={{ y: 50, opacity: 0 }}
                               animate={{ y: 0, opacity: 1 }}
                               exit={{ y: 50, opacity: 0 }}
                               className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl p-8 rounded-[3rem] border-2 border-indigo-500 shadow-3xl max-w-lg w-full flex items-center justify-between"
                           >
                               <div className="flex items-center gap-6">
                                   <div className="relative">
                                       <div className="w-20 h-20 bg-indigo-500 rounded-2xl flex items-center justify-center p-3 animate-pulse">
                                           <Car size={40} className="text-white" />
                                       </div>
                                       <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
                                           <Zap size={14} className="text-white fill-white" />
                                       </div>
                                   </div>
                                   <div className="space-y-1">
                                       <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">
                                           {bookingStatus === 'Searching' && 'Finding Captain...'}
                                           {bookingStatus === 'Confirmed' && 'Captain Assigned'}
                                           {bookingStatus === 'Arriving' && 'Arriving in 1 Min'}
                                       </h3>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Booking ID: RDE-8829-QX</p>
                                   </div>
                               </div>
                               {bookingStatus === 'Arriving' && (
                                   <div className="flex items-center gap-2">
                                       <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Phone className="text-indigo-500 fill-indigo-500" size={16} />
                                       </div>
                                       <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <User className="text-slate-900 dark:text-white" size={16} />
                                       </div>
                                   </div>
                               )}
                           </motion.div>
                       )}
                   </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default RideHub;
