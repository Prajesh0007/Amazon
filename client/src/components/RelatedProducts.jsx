import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const RelatedProducts = ({ category, currentProductId }) => {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
                const response = await axios.get(`${apiUrl}/products?category=${category}&limit=12`);
                // Filter out current product
                const filtered = response.data.products.filter(p => p._id !== currentProductId);
                setProducts(filtered);
            } catch (error) {
                console.error("Related fetch error:", error);
            }
        };
        fetchRelated();
    }, [category, currentProductId]);

    const next = () => {
        setCurrentIndex((prev) => (prev + 4 >= products.length ? 0 : prev + 4));
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 4 < 0 ? Math.max(0, products.length - 4) : prev - 4));
    };

    if (products.length === 0) return null;

    return (
        <div className="space-y-6 pt-12 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold tracking-tight dark:text-white">Products related to this item</h3>
                <div className="flex gap-2">
                    <button onClick={prev} className="p-2 rounded-full border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={next} className="p-2 rounded-full border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="relative overflow-hidden">
                <motion.div 
                    className="flex gap-6"
                    initial={false}
                    animate={{ x: `-${currentIndex * 25}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {products.map((item) => (
                        <div 
                            key={item._id} 
                            onClick={() => {
                                navigate(`/product/${item._id}`);
                                window.scrollTo(0, 0);
                            }}
                            className="min-w-[250px] w-1/4 group cursor-pointer bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 overflow-hidden shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-4">
                                <img 
                                    src={item.images[0]} 
                                    alt={item.name} 
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                                />
                            </div>
                            <h4 className="text-sm font-bold line-clamp-2 dark:text-white mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {item.name}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex text-[var(--accent)]">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={12} className={s <= Math.floor(item.rating) ? "fill-current" : "text-gray-300 dark:text-gray-700"} />
                                    ))}
                                </div>
                                <span className="text-[10px] text-gray-500 font-bold">{item.numReviews}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[10px] font-bold">₹</span>
                                <span className="text-lg font-extrabold">{item.price.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default RelatedProducts;
