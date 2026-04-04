import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, CheckCircle2, XCircle, Bell, Navigation, Phone, MessageSquare, Star, Zap } from 'lucide-react';
import axios from 'axios';
import useProductStore from '../store/useProductStore';

const CaptainDashboard = () => {
    const [bookings, setBookings] = useState([
        { id: 'RDE-101', type: 'Ride', user: 'Rahul S.', pickup: 'Andheri West', drop: 'Bandra Kurla Complex', price: 450, status: 'New' },
        { id: 'SER-202', type: 'HomeService', user: 'Priya M.', service: 'AC Repair', location: 'Juhu Tara Rd', price: 800, status: 'New' },
    ]);
    const [activeDuty, setActiveDuty] = useState(false);

    const acceptBooking = (id) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Accepted' } : b));
    };

    return (
        <div className="bg-slate-900 min-h-screen text-white pb-20">
            {/* Header */}
            <div className="px-8 py-10 bg-slate-800/50 border-b border-slate-700/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500 overflow-hidden border-4 border-slate-700 shadow-2xl">
                             <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" className="w-full h-full object-cover" alt="Captain" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Captain <span className="text-indigo-400">Vikram</span></h1>
                            <div className="flex items-center gap-2 mt-2">
                                <Star size={14} className="fill-amber-400 text-amber-400" />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">4.9 • Platinum Partner</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Earnings</p>
                            <p className="text-3xl font-black">₹12,450.00</p>
                        </div>
                        <button 
                            onClick={() => setActiveDuty(!activeDuty)}
                            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                activeDuty ? 'bg-green-500 text-white shadow-xl shadow-green-500/20' : 'bg-slate-700 text-slate-400'
                            }`}
                        >
                            {activeDuty ? 'Go Offline' : 'Go Online'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Active Bookings */}
                <div className="lg:col-span-8 space-y-8">
                    <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                        <Bell className="text-indigo-400" /> New Orders Nearby
                    </h2>
                    
                    <div className="space-y-4">
                        <AnimatePresence>
                            {bookings.map((b) => (
                                <motion.div
                                    key={b.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-slate-800 rounded-[2.5rem] p-8 border border-slate-700/50 flex items-center justify-between group hover:border-indigo-500/50 transition-all"
                                >
                                    <div className="flex items-center gap-8">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                            b.type === 'Ride' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-400'
                                        }`}>
                                            {b.type === 'Ride' ? <Navigation size={28} /> : <Zap size={28} />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{b.type} • {b.id}</p>
                                            <h3 className="text-xl font-black leading-none">{b.user}</h3>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                <MapPin size={12} className="text-red-400" /> {b.pickup || b.location}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right flex items-center gap-8">
                                        <div className="space-y-1 mr-8">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Net Earn</p>
                                            <p className="text-2xl font-black text-white">₹{b.price}</p>
                                        </div>
                                        {b.status === 'New' ? (
                                            <div className="flex gap-3">
                                                <button onClick={() => acceptBooking(b.id)} className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center hover:scale-110 transition-all">
                                                    <CheckCircle2 size={24} />
                                                </button>
                                                <button className="w-12 h-12 bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center hover:scale-110 transition-all">
                                                    <XCircle size={24} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="px-6 py-2 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/30 font-bold">
                                                Accepted
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right: Stats */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-800 rounded-[2.5rem] p-8 border border-slate-700/50 space-y-6">
                        <h3 className="text-lg font-black uppercase tracking-widest">Captain Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Acceptance</p>
                                <p className="text-2xl font-black">98%</p>
                            </div>
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Completion</p>
                                <p className="text-2xl font-black">100%</p>
                            </div>
                        </div>
                        <div className="bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Zap className="text-indigo-400" size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Surge Bonus Active</span>
                            </div>
                            <span className="text-[10px] font-black text-indigo-400">+₹50/Ride</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaptainDashboard;
