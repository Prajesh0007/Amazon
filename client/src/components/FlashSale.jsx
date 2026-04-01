import React, { useState, useEffect } from 'react';
import { Timer, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-[2rem] p-8 text-white shadow-2xl group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Zap size={200} />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <Sparkles size={14} className="text-yellow-300" />
            <span className="text-[10px] font-black uppercase tracking-widest">Limited Time Offer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
            FLASH <span className="italic text-yellow-300 underline decoration-wavy">SALE</span> ENDS IN:
          </h2>
          <p className="text-white/80 font-medium max-w-md">
            Get up to 70% off on premium electronics and computing gear. These deals won't last forever!
          </p>
        </div>

        <div className="flex gap-4">
          {[
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINS', value: timeLeft.minutes },
            { label: 'SECS', value: timeLeft.seconds },
          ].map((unit, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-16 h-20 md:w-20 md:h-24 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-3xl md:text-4xl font-black shadow-lg">
                {unit.value.toString().padStart(2, '0')}
              </div>
              <span className="text-[10px] font-bold tracking-widest mt-1 opacity-80">{unit.label}</span>
            </div>
          ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-white text-red-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-yellow-50 transition-colors"
        >
          Explore Deals
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FlashSale;
