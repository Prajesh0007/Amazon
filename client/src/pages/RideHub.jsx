import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, MapPin, Search, Star, Clock, Zap, Shield, ChevronRight, User, Phone, Map, Navigation, Send, AlertTriangle, Activity, Bike, MoreHorizontal } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import RideMap from '../components/RideMap';

const RideHub = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [selectedRide, setSelectedRide] = useState(null);
    const [pickup, setPickup] = useState('Central Hub (Mumbai)');
    const [destination, setDestination] = useState('');
    const [bookingStatus, setBookingStatus] = useState('Idle'); // Idle, Searching, Confirmed, Arriving, Completed

    useEffect(() => {
        fetchProducts({ serviceType: 'Ride' });
    }, [fetchProducts]);

    useEffect(() => {
        if (products.length > 0 && !selectedRide) {
            const rides = products.filter(p => p.serviceType === 'Ride');
            if (rides.length > 0) setSelectedRide(rides[0]);
        }
    }, [products, selectedRide]);

    const handleReqestRide = () => {
        if (!destination) {
            toast.error('Command Failure: Set Target Destination');
            return;
        }
        setBookingStatus('Searching');
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 3000)),
            {
                loading: 'Initializing Pilot Synchronization...',
                success: 'Pilot Command Confirmed!',
                error: 'Connection Lost',
            }
        ).then(() => {
            setBookingStatus('Confirmed');
            setTimeout(() => setBookingStatus('Arriving'), 5000);
        });
    };

    const rideTypes = [
        { id: 'Bike (Rapido)', icon: <Bike size={24} />, label: 'Fast Bike' },
        { id: 'Auto (Ola)', icon: <Activity size={24} />, label: 'Auto Hub' },
        { id: 'Mini', icon: <Car size={24} />, label: 'Mini' },
        { id: 'Prime', icon: <Zap size={24} />, label: 'Prime Elite' },
        { id: 'SUV', icon: <Shield size={24} />, label: 'SUV Max' }
    ];

    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen flex items-center justify-center">
                 <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin shadow-2xl" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 animate-pulse">Syncing Pilot Grid...</p>
                 </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen relative overflow-hidden flex flex-col">
            
            {/* Background Map Layer - Full Screen */}
            <div className="absolute inset-0 z-0 opacity-80 contrast-125">
                <RideMap destination={destination ? [19.0760, 72.8777] : null} />
            </div>

            {/* Top Command Overlay (Search & Stats) */}
            <div className="relative z-10 p-6 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full">
                <div className="bg-white/80 backdrop-blur-3xl border border-slate-100 rounded-[2.5rem] p-4 flex flex-col md:flex-row items-center gap-4 flex-1 shadow-xl group transition-all hover:bg-white">
                    <div className="flex items-center gap-4 px-6 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 w-full md:w-auto">
                        <MapPin size={20} className="text-blue-600 animate-pulse" />
                        <div className="flex flex-col text-left">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Current Site</span>
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter truncate max-w-[120px]">{pickup}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 flex-1 px-6 w-full">
                        <Navigation size={20} className="text-slate-900 rotate-45 group-hover:scale-125 transition-transform" />
                        <input 
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Enter Target Hub Destination..."
                            className="bg-transparent border-none outline-none text-[12px] font-black uppercase tracking-[0.2em] text-slate-900 w-full placeholder-slate-300"
                        />
                    </div>
                </div>

                <div className="bg-blue-600 text-white px-10 py-4 rounded-[2.5rem] flex items-center gap-6 shadow-xl shadow-blue-500/20 whitespace-nowrap">
                    <Zap size={24} className="animate-bounce" />
                    <div className="text-left">
                        <p className="text-[8px] font-black uppercase tracking-widest leading-none">Traffic Density</p>
                        <p className="text-[14px] font-black uppercase tracking-tighter leading-none">Low Protocol</p>
                    </div>
                </div>
            </div>

            {/* Bottom Floating Command Hub (Vehicle Selection) */}
            <div className="relative z-10 mt-auto p-6 md:p-12 mb-0 overflow-hidden">
                <AnimatePresence>
                    {bookingStatus === 'Idle' ? (
                        <motion.div 
                            initial={{ y: 200, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 200, opacity: 0 }}
                            className="max-w-4xl mx-auto bg-white/90 backdrop-blur-3xl border-2 border-slate-100 rounded-[4rem] p-10 shadow-2xl"
                        >
                            <div className="flex flex-wrap md:flex-nowrap gap-6 overflow-x-auto no-scrollbar pb-8 mb-8 border-b border-slate-100">
                                {rideTypes.map(type => (
                                    <button 
                                        key={type.id}
                                        onClick={() => {
                                            const match = products.find(p => p.category === type.id);
                                            if (match) setSelectedRide(match);
                                        }}
                                        className={`flex flex-col items-center gap-3 p-6 rounded-[2.5rem] transition-all min-w-[120px] group ${
                                            selectedRide?.category === type.id 
                                            ? 'bg-blue-600 text-white scale-110 shadow-xl shadow-blue-500/20' 
                                            : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-blue-500/30'
                                        }`}
                                    >
                                        <div className="group-hover:translate-y-[-5px] transition-transform">{type.icon}</div>
                                        <span className="text-[9px] font-black uppercase tracking-widest truncate w-full text-center">{type.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl p-4 flex items-center justify-center border border-slate-100 shadow-inner">
                                        <img src={selectedRide?.images?.[0]} className="w-full h-full object-contain" alt="ride" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-tight">{selectedRide?.name || 'Elite Hub Car'}</h3>
                                        <div className="flex items-center gap-4">
                                            <p className="text-blue-600 font-black text-xl">₹{selectedRide?.price || 0}</p>
                                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{selectedRide?.timeToDeliver || '4 mins'} Away</p>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleReqestRide}
                                    className="px-16 py-8 bg-blue-600 text-white text-[13px] font-black uppercase tracking-[0.4em] rounded-[3rem] shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
                                >
                                    Confirm Command <Zap size={20} className="fill-white group-hover:scale-150 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="max-w-2xl mx-auto bg-white/95 backdrop-blur-4xl border-4 border-blue-600 p-12 rounded-[5rem] shadow-2xl text-center space-y-10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 left-0 h-2 bg-blue-500/10 overflow-hidden">
                                <motion.div 
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="h-full w-1/3 bg-blue-600 shadow-xl shadow-blue-600"
                                />
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <div className="w-32 h-32 bg-blue-600 rounded-[3rem] flex items-center justify-center p-8 animate-pulse shadow-xl shadow-blue-500/30">
                                    <Activity size={60} className="text-white" />
                                </div>
                                <div className="space-y-2">
                                     <h3 className="text-5xl font-black uppercase text-slate-900 tracking-tighter">
                                         {bookingStatus === 'Searching' && 'Connecting...'}
                                         {bookingStatus === 'Confirmed' && 'Pilot Interlock'}
                                         {bookingStatus === 'Arriving' && 'Pilot Inbound'}
                                     </h3>
                                     <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Syncing GPS Coordinates</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-inner">
                                <div className="flex items-center gap-6">
                                     <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300">
                                         <User size={32} />
                                     </div>
                                     <div className="text-left">
                                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Elite Pilot</p>
                                         <p className="text-[14px] font-black text-slate-900 uppercase tracking-tighter">Captain Active V4</p>
                                     </div>
                                </div>
                                <div className="flex gap-4">
                                     <div className="w-14 h-14 bg-green-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl cursor-pointer hover:scale-110 transition-transform">
                                         <Phone size={24} />
                                     </div>
                                     <div 
                                        onClick={() => setBookingStatus('Idle')}
                                        className="w-14 h-14 bg-red-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl cursor-pointer hover:scale-110 transition-transform"
                                     >
                                         <AlertTriangle size={24} />
                                     </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Global Captain Hub Bridge - Mini Overlay */}
            <div className="absolute top-24 right-10 z-20 hidden lg:block">
                 <Link to="/captain-dashboard" className="px-8 py-5 bg-white/80 backdrop-blur-3xl border border-slate-100 rounded-full flex items-center gap-4 group transition-all hover:bg-blue-600 hover:text-white shadow-xl">
                    <User size={18} className="text-blue-600 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Pilot Console</span>
                 </Link>
            </div>
            <p className="fixed bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-300 uppercase tracking-[0.5em] z-20 pointer-events-none">Active Professional Command Center V4</p>
        </div>
    );
};

export default RideHub;
