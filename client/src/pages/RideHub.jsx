import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, MapPin, Search, Star, Clock, Zap, Shield, ChevronRight, User, Phone, Map, Navigation, Send, AlertTriangle, Activity } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const RideHub = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [selectedRide, setSelectedRide] = useState(products.filter(p => p.serviceType === 'Ride')[0] || null);
    const [pickup, setPickup] = useState('My Hub (Mumbai Center)');
    const [destination, setDestination] = useState('');
    const [bookingStatus, setBookingStatus] = useState('Idle'); // Idle, Searching, Confirmed, Arriving, Completed

    useEffect(() => {
        fetchProducts({ serviceType: 'Ride' });
    }, [fetchProducts]);

    const handleReqestRide = () => {
        if (!destination) {
            toast.error('Protocol Failure: Set Destination Node');
            return;
        }
        setBookingStatus('Searching');
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 3000)),
            {
                loading: 'Initializing Pilot Connection...',
                success: 'Pilot Command Confirmed!',
                error: 'Connection Lost',
            }
        ).then(() => {
            setBookingStatus('Confirmed');
            setTimeout(() => setBookingStatus('Arriving'), 5000);
        });
    };

    return (
        <div className="bg-indigo-50/20 dark:bg-slate-950 min-h-screen relative overflow-hidden">
            {/* Background Interaction Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-40">
                <div className="absolute top-20 left-40 w-3 h-3 rounded-full bg-indigo-500 animate-ping" />
                <div className="absolute bottom-40 right-20 w-3 h-3 rounded-full bg-indigo-600 animate-ping delay-700" />
                <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.1),transparent)]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 min-h-[90vh]">
                
                {/* Left: Command Node Console (Booking) */}
                <div className="lg:col-span-4 space-y-8 flex flex-col justify-center">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border-2 border-slate-100 dark:border-slate-800 p-10 shadow-4xl rounded-[4rem] space-y-10 h-fit relative">
                        <div className="absolute top-10 right-10">
                             <Activity size={24} className="text-indigo-600 animate-pulse" />
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                                <Navigation size={32} className="text-white rotate-45" />
                            </div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white leading-none">Global <span className="text-indigo-600">Ride</span> Hub</h2>
                        </div>

                        {/* Input Management Protocol */}
                        <div className="space-y-6">
                            <div className="relative group">
                                <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 absolute top-4 left-16 z-20">Origin Hub</label>
                                <MapPin size={20} className="absolute left-8 top-1/2 -translate-y-1/2 text-green-500 z-10" />
                                <input 
                                    value={pickup}
                                    readOnly
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-[2.5rem] py-8 pl-20 pr-8 text-[11px] font-black uppercase tracking-widest outline-none dark:text-white shadow-inner" 
                                />
                            </div>
                            <div className="relative group">
                                <label className="text-[8px] font-black uppercase tracking-widest text-indigo-500 absolute top-4 left-16 z-20">Target Destination Node</label>
                                <Send size={20} className="absolute left-8 top-1/2 -translate-y-1/2 text-red-500 z-10 transition-transform group-focus-within:translate-x-2" />
                                <input 
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    type="text" 
                                    className="w-full bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-slate-700 rounded-[2.5rem] py-8 pl-20 pr-8 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-8 focus:ring-indigo-500/10 transition-all dark:text-white shadow-3xl text-indigo-600" 
                                    placeholder="Enter Destination hub..." 
                                />
                            </div>
                        </div>

                        {/* Vehicle Pilot Selection */}
                        <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-4">
                            {products.filter(p => p.serviceType === 'Ride').map((r) => (
                                <button
                                    key={r._id}
                                    onClick={() => setSelectedRide(r)}
                                    className={`w-full p-6 rounded-[2.5rem] flex items-center justify-between border-4 transition-all group ${
                                        selectedRide?._id === r._id 
                                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-900/40 shadow-2xl scale-[1.02]' 
                                        : 'border-transparent bg-slate-50 dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-6 text-left">
                                        <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-center p-3 shadow-xl group-hover:scale-110 transition-transform border border-slate-100 dark:border-slate-800">
                                            <img src={r.images[0]} className="w-full h-full object-contain" alt={r.name} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase dark:text-white leading-none mb-1">{r.name}</p>
                                            <div className="flex items-center gap-2">
                                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{r.rating} • 1.2K Drives</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xl font-black dark:text-white tracking-tighter">₹{r.price}</p>
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={handleReqestRide}
                            disabled={!destination || !selectedRide || bookingStatus !== 'Idle'}
                            className="w-full py-8 bg-indigo-600 text-white rounded-[3rem] font-black text-[13px] uppercase tracking-[0.2em] shadow-4xl shadow-indigo-600/30 disabled:opacity-30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                        >
                            {bookingStatus === 'Idle' ? (
                                <>Command Inbound <Zap size={22} className="fill-white group-hover:animate-bounce" /></>
                            ) : (
                                <>Syncing Protocol <Clock size={22} className="animate-spin" /></>
                            )}
                        </button>
                    </div>

                    {/* Protocol Information */}
                    <div className="p-10 bg-slate-900 dark:bg-slate-800 text-white rounded-[4rem] shadow-4xl space-y-6 border border-indigo-500/20 group relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                        <div className="flex items-center gap-4 relative z-10 text-indigo-400">
                           <Shield size={24} />
                           <p className="text-[11px] font-black uppercase tracking-widest">Protocol 7: Multi-Layer Hub Safety</p>
                        </div>
                        <p className="text-[9px] opacity-60 font-bold leading-relaxed uppercase tracking-widest relative z-10 italic">Real-time node tracking and encrypted Pilot-to-Client communication protocol fully engaged for the entire duration of the ride.</p>
                    </div>
                </div>

                {/* Right: Interaction Terminal (Live Visual Updates) */}
                <div className="lg:col-span-8 flex flex-col justify-end pb-20 relative">
                   <AnimatePresence mode='wait'>
                       {bookingStatus !== 'Idle' ? (
                           <motion.div 
                               initial={{ scale: 0.8, opacity: 0, y: 100 }}
                               animate={{ scale: 1, opacity: 1, y: 0 }}
                               exit={{ scale: 0.8, opacity: 0, y: 100 }}
                               className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-4xl p-16 rounded-[5rem] border-4 border-indigo-600 shadow-4xl w-full flex flex-col md:flex-row items-center gap-16 relative overflow-hidden"
                           >
                               <div className="absolute top-0 right-0 left-0 h-2 bg-indigo-600/10 overflow-hidden">
                                    <motion.div 
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="h-full w-1/3 bg-indigo-600 shadow-2xl shadow-indigo-600"
                                    />
                               </div>
                               
                               <div className="relative">
                                   <div className="w-48 h-48 bg-indigo-600 rounded-[4rem] flex items-center justify-center p-12 animate-pulse shadow-4xl shadow-indigo-600/20">
                                       <Car size={100} className="text-white" />
                                   </div>
                                   <div className="absolute -top-6 -right-6 w-20 h-20 bg-green-500 rounded-full border-8 border-white dark:border-slate-950 flex items-center justify-center shadow-2xl">
                                       <Activity size={32} className="text-white animate-bounce" />
                                   </div>
                               </div>
                               
                               <div className="flex-1 space-y-6 text-center md:text-left">
                                   <div className="space-y-2">
                                       <div className="flex items-center justify-center md:justify-start gap-4">
                                            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-ping" />
                                            <p className="text-[12px] font-black text-indigo-600 uppercase tracking-[0.3em] leading-none mb-1">Live Interlock Synced</p>
                                       </div>
                                       <h3 className="text-7xl font-black uppercase tracking-tighter dark:text-white leading-none">
                                           {bookingStatus === 'Searching' && 'Connecting...'}
                                           {bookingStatus === 'Confirmed' && 'Pilot Link established'}
                                           {bookingStatus === 'Arriving' && 'Arrival at Hub'}
                                       </h3>
                                       <div className="flex items-center gap-3 justify-center md:justify-start border-t border-slate-100 dark:border-slate-800 pt-6">
                                            <p className="text-[14px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">Destination Node:</p>
                                            <span className="text-[16px] text-red-600 italic font-black uppercase tracking-tighter px-4 py-1 bg-red-50 dark:bg-red-950/20 rounded-xl">{destination || 'Pending Command'}</span>
                                       </div>
                                   </div>
                                   
                                   <div className="flex flex-wrap justify-center md:justify-start gap-6">
                                       <div className="flex items-center gap-3 px-8 py-5 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest dark:text-white border border-slate-100 dark:border-slate-700">
                                            <Phone size={18} className="text-indigo-600" /> Pilot Encrypted Hub
                                       </div>
                                       <div className="flex items-center gap-3 px-8 py-5 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest dark:text-white border border-slate-100 dark:border-slate-700">
                                            <Map size={18} className="text-indigo-600" /> Live {selectedRide?.name} Tracking
                                       </div>
                                   </div>
                               </div>
                           </motion.div>
                       ) : (
                           <motion.div 
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               className="bg-indigo-900/5 dark:bg-slate-900/40 rounded-[6rem] p-32 flex flex-col items-center justify-center text-center space-y-12 border-4 border-dashed border-indigo-100 dark:border-slate-800 relative group overflow-hidden"
                           >
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-4xl relative z-10 group-hover:scale-110 transition-transform">
                                    <AlertTriangle size={60} className="text-indigo-100 dark:text-slate-700" />
                                </div>
                                <div className="space-y-4 relative z-10">
                                     <h3 className="text-4xl font-black uppercase tracking-tighter dark:text-slate-700">Awaiting Commands</h3>
                                     <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest leading-relaxed max-w-sm mx-auto">Input your Target Destination Node above to begin real-time Pilot synchronization and tracking.</p>
                                </div>
                           </motion.div>
                       )}
                   </AnimatePresence>
                </div>
            </div>
            
            {/* Global Captain Hub Bridge - Z-index high for floating feel */}
            <Link to="/captain-dashboard" className="fixed bottom-12 right-12 flex items-center gap-6 px-10 py-6 bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-4xl hover:scale-105 active:scale-95 transition-all group z-50 overflow-hidden relative">
                 <div className="absolute inset-0 bg-indigo-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 opacity-5" />
                 <div className="w-14 h-14 rounded-[1.2rem] bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shadow-xl relative z-10 group-hover:rotate-12 transition-transform">
                    <User className="text-indigo-600 transition-colors group-hover:text-red-500" size={32} />
                 </div>
                 <div className="text-left relative z-10">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Global Pilot Node</p>
                    <p className="text-[14px] font-black dark:text-white uppercase tracking-tighter">Enter Captain Command Hub</p>
                 </div>
                 <ChevronRight className="relative z-10 text-slate-300 group-hover:translate-x-2 transition-transform" />
            </Link>
        </div>
    );
};

export default RideHub;
