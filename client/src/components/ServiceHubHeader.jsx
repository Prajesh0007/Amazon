import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Zap, Truck, Shield, Home, Car, Wrench, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceHubHeader = () => {
  const location = useLocation();
  
  const services = [
    { id: 'Shopping', name: 'Elite Shop', icon: <ShoppingBag size={20} />, color: 'blue', path: '/' },
    { id: 'Food', name: 'Instant Food', icon: <Zap size={20} />, color: 'orange', path: '/food-hub' },
    { id: 'Grocery', name: 'Wait-Less', icon: <Truck size={20} />, color: 'green', path: '/grocery-hub' },
    { id: 'Pharmacy', name: 'Health Hub', icon: <Shield size={20} />, color: 'red', path: '/health-hub' },
    { id: 'Stay', name: 'Stay Hub', icon: <Home size={20} />, color: 'purple', path: '/stay-hub' },
    { id: 'Ride', name: 'Ride Hub', icon: <Car size={20} />, color: 'indigo', path: '/ride-hub' },
    { id: 'Genius', name: 'Genius Hub', icon: <Wrench size={20} />, color: 'amber', path: '/genius-hub' },
  ];

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4 overflow-x-auto no-scrollbar">
        {services.map((s) => {
          const isActive = location.pathname === s.path;
          return (
            <Link
              key={s.id}
              to={s.path}
              className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${
                isActive 
                ? `bg-${s.color}-500/10 border-${s.color}-500 shadow-lg shadow-${s.color}-500/20` 
                : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isActive ? `bg-${s.color}-500 text-white` : 'bg-slate-50 dark:bg-slate-700 text-slate-400'
              }`}>
                {s.icon}
              </div>
              <div className="text-left">
                <p className={`text-[10px] font-black uppercase tracking-tighter leading-none ${isActive ? `text-${s.color}-600` : 'text-slate-900 dark:text-white'}`}>
                  {s.name}
                </p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Super App</p>
              </div>
              {isActive && (
                <motion.div layoutId="active-pill" className="ml-2">
                  <ChevronRight size={14} className={`text-${s.color}-600`} />
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceHubHeader;
