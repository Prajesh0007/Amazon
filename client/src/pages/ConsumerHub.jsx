import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Zap, Truck, Shield, Clock, MapPin, ChevronRight, CheckCircle2, Package, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConsumerHub = () => {
  const [activeTab, setActiveTab] = useState('All');
  
  const stats = [
    { label: 'Active Orders', value: '4', icon: <Clock size={16} /> },
    { label: 'Saved Items', value: '24', icon: <ShoppingBag size={16} /> },
    { label: 'Membership', value: 'Prime+', icon: <Shield size={16} /> },
  ];

  const orders = [
    { id: '#FD-882', type: 'Food', name: 'Pizza Paradise', status: 'On the Way', time: '12 mins', icon: <Zap className="text-orange-500" />, progress: 75 },
    { id: '#GR-102', type: 'Grocery', name: 'Wait-Less Mart', status: 'Packing', time: '5 mins', icon: <Truck className="text-green-500" />, progress: 30 },
    { id: '#SH-441', type: 'Shopping', name: 'Elite Electronics', status: 'Shipped', time: 'Tomorrow', icon: <ShoppingBag className="text-blue-500" />, progress: 50 },
    { id: '#PH-009', type: 'Pharmacy', name: 'Health Hub', status: 'Delivered', time: '1 hr ago', icon: <Shield className="text-red-500" />, progress: 100 },
  ];

  const filteredOrders = activeTab === 'All' ? orders : orders.filter(o => o.type === activeTab);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white">Central <span className="text-blue-500">Command</span></h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manage your entire ecosystem lifecycle</p>
          </div>
          
          <div className="flex gap-4">
            {stats.map((s, i) => (
              <div key={i} className="px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
                <div className="text-blue-500">{s.icon}</div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">{s.label}</p>
                  <p className="text-sm font-black dark:text-white">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['All', 'Shopping', 'Food', 'Grocery', 'Pharmacy'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    activeTab === tab 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                    : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredOrders.map(order => (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                          {order.icon}
                        </div>
                        <div>
                          <h4 className="font-black text-sm dark:text-white">{order.name}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.id} • {order.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-black uppercase tracking-tighter ${order.progress === 100 ? 'text-green-500' : 'text-blue-500'}`}>
                          {order.status}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 italic">Est. {order.time}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${order.progress}%` }}
                          className={`h-full rounded-full ${
                            order.type === 'Food' ? 'bg-orange-500' : 
                            order.type === 'Grocery' ? 'bg-green-500' : 
                            order.type === 'Pharmacy' ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                        <span>Ordered</span>
                        <span>Processed</span>
                        <span>Out for delivery</span>
                        <span>Arrived</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar - Support & Secondary Actions */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white space-y-6 shadow-2xl shadow-blue-500/20">
              <h3 className="text-2xl font-black uppercase tracking-tight leading-none">Need Help <br />With All This?</h3>
              <p className="text-xs font-medium opacity-80">Our unified support team is available 24/7 to help with any of your 4 services.</p>
              <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                Launch Support Bot
              </button>
            </div>

            <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
              <h3 className="text-lg font-black uppercase tracking-tight dark:text-white">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: 'Manage Subscriptions', icon: <Search size={14} /> },
                  { label: 'Payment Methods', icon: <CheckCircle2 size={14} /> },
                  { label: 'Privacy Settings', icon: <Shield size={14} /> },
                ].map((act, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{act.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{act.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerHub;
