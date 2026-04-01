import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RecentlyViewed = () => {
    const [recent, setRecent] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        // Only show last 6
        setRecent(stored.slice(0, 6));
    }, []);

    if (recent.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">Your Recently Viewed</h3>
                <button 
                    onClick={() => {
                        localStorage.removeItem('recentlyViewed');
                        setRecent([]);
                    }}
                    className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest"
                >
                    Clear All
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {recent.map((item) => (
                    <motion.div 
                        key={item._id}
                        whileHover={{ y: -5 }}
                        className="cursor-pointer group"
                        onClick={() => navigate(`/product/${item._id}`)}
                    >
                        <div className="aspect-square rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 mb-2 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-xl group-hover:border-[var(--secondary)] transition-all">
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-[10px] font-bold dark:text-white line-clamp-1 group-hover:text-blue-600 truncate">{item.name}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
