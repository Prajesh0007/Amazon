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
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Commander Hub Header */}
            <div className="px-8 py-12 bg-white border-b border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-40 pointer-events-none" />
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 overflow-hidden border-4 border-white shadow-xl shadow-indigo-500/20 group">
                             <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Commander" />
                        </div>
                        <div className="text-left space-y-1">
                            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none text-slate-900 font-elegant">Commander <span className="text-indigo-600 underline underline-offset-8">Vikram</span></h1>
                            <div className="flex items-center gap-3 mt-2">
                                <Star size={16} className="fill-amber-400 text-amber-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">4.9 • Platinum Partner Protocol</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none italic">Total Revenue Link</p>
                            <p className="text-4xl font-black text-slate-900 tracking-tighter">₹12,450.00</p>
                        </div>
                        <button 
                            onClick={() => setActiveDuty(!activeDuty)}
                            className={`px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 ${
                                activeDuty 
                                ? 'bg-green-500 text-white shadow-green-500/20 scale-105' 
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                        >
                            {activeDuty ? 'Duty Active' : 'Duty Inactive'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
                {/* Left: Active Dispatch Hub */}
                <div className="lg:col-span-8 space-y-12">
                    <div className="flex items-center justify-between border-b-2 border-slate-100 pb-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4 text-slate-900 font-elegant">
                            <Bell className="text-indigo-600 animate-bounce" size={24} /> Global <span className="text-indigo-600">Dispatch</span> Queue
                        </h2>
                        <span className="px-6 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                           Sync Active • 2 Orders Nearby
                        </span>
                    </div>
                    
                    <div className="space-y-6">
                        <AnimatePresence mode='popLayout'>
                            {bookings.map((b) => (
                                <motion.div
                                    key={b.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white rounded-[3.5rem] p-10 border border-slate-100 flex items-center justify-between group hover:border-indigo-500/30 transition-all shadow-xl hover:shadow-2xl relative overflow-hidden text-left"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="flex items-center gap-10 relative z-10">
                                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner ${
                                            b.type === 'Ride' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                        }`}>
                                            {b.type === 'Ride' ? <Navigation size={32} /> : <Zap size={32} />}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{b.type} PROTOCOL • {b.id}</p>
                                                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                                            </div>
                                            <h3 className="text-2xl font-black leading-none text-slate-900 tracking-tighter uppercase">{b.user}</h3>
                                            <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                                                <MapPin size={16} className="text-red-500" /> {b.pickup || b.location}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right flex items-center gap-12 relative z-10">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-none mb-2 italic">Net Payout Link</p>
                                            <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{b.price}</p>
                                        </div>
                                        {b.status === 'New' ? (
                                            <div className="flex gap-4">
                                                <button onClick={() => acceptBooking(b.id)} className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-green-500/20">
                                                    <CheckCircle2 size={32} />
                                                </button>
                                                <button className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-slate-100">
                                                    <XCircle size={32} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="px-8 py-4 bg-green-50 text-green-600 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] border border-green-100 shadow-sm flex items-center gap-3 animate-pulse">
                                                <CheckCircle2 size={16} /> Accepted Status
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right: Operational Metrics */}
                <div className="lg:col-span-4 space-y-10 text-left">
                    <div className="bg-white rounded-[4rem] p-10 border border-slate-100 space-y-10 shadow-xl relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 border-b border-slate-50 pb-6">Commander Analytics</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 leading-none">Acceptance Link</p>
                                <p className="text-4xl font-black text-slate-900 tracking-tighter">98%</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 leading-none">Complete Link</p>
                                <p className="text-4xl font-black text-slate-900 tracking-tighter">100%</p>
                            </div>
                        </div>
                        <div className="bg-indigo-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/20 flex items-center justify-between group cursor-pointer hover:scale-105 transition-all">
                            <div className="flex items-center gap-4">
                                <Zap className="text-white animate-pulse" size={24} />
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none opacity-80 italic">Surge Protocol Engage</span>
                                    <p className="text-xs font-black uppercase tracking-widest">+₹50/Execution active</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-white rounded-[4rem] border border-slate-100 shadow-xl space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 opacity-60">System Bridge</h4>
                        <div className="flex gap-4">
                            <button className="flex-1 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 hover:bg-slate-100 transition-all active:scale-95">
                                <MessageSquare size={24} className="mx-auto" />
                            </button>
                            <button className="flex-1 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 hover:bg-slate-100 transition-all active:scale-95">
                                <Phone size={24} className="mx-auto" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaptainDashboard;
