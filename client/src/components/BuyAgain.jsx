import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const BuyAgain = () => {
    const [boughtItems, setBoughtItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBought = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // In a real app, this would be a dedicated "buy again" endpoint
                // For now, we'll fetch some products that might interest them or simulate from orders
                const ordersResponse = await axios.get(`http://localhost:5000/api/orders/myorders`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                
                // Get unique products from all orders
                const products = [];
                const seenProducts = new Set();
                
                ordersResponse.data.orders.forEach(order => {
                    order.orderItems.forEach(item => {
                        if (!seenProducts.has(item.product)) {
                            products.push(item);
                            seenProducts.add(item.product);
                        }
                    });
                });
                
                setBoughtItems(products.slice(0, 6));
            } catch (error) {
                console.error("Buy Again fetch error:", error);
                
                // Fallback: Simulate if API fails or no orders
                // This is just for demonstration purposes
                const fallbackResponse = await axios.get(`http://localhost:5000/api/products?limit=6`);
                setBoughtItems(fallbackResponse.data.products);
            } finally {
                setLoading(false);
            }
        };

        fetchBought();
    }, [user]);

    if (!user || boughtItems.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600">
                        <ShoppingBag size={20} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">Buy It Again</h3>
                </div>
                <button 
                    onClick={() => navigate('/orders')}
                    className="flex items-center gap-1 text-[10px] font-black text-blue-500 hover:underline uppercase tracking-widest"
                >
                    View All Orders <ChevronRight size={14} />
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {boughtItems.map((item) => (
                    <motion.div 
                        key={item.product || item._id}
                        whileHover={{ y: -5 }}
                        className="cursor-pointer group flex flex-col h-full"
                        onClick={() => navigate(`/product/${item.product || item._id}`)}
                    >
                        <div className="flex-1 aspect-square rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 mb-2 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-xl group-hover:border-orange-500 transition-all">
                            <img src={item.image || item.images[0]} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-[10px] font-bold dark:text-white line-clamp-2 leading-[1.3] truncate">{item.name}</p>
                        <p className="text-[10px] font-black text-orange-600 mt-1 uppercase">Order Again</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default BuyAgain;
