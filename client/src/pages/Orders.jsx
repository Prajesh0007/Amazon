import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, ChevronRight, CheckCircle2, Clock, MapPin, Box, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
        const { data } = await axios.get(`${apiUrl}/orders/myorders`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="max-w-4xl mx-auto py-20 text-center animate-pulse font-bold text-gray-500">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <Package size={40} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          You haven't placed any orders yet. Start shopping to fill this space!
        </p>
        <Link to="/" className="amazon-button px-10 py-3 text-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">Your Orders</h1>

        <div className="space-y-6">
          {orders.map((order, idx) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 group"
            >
              {/* Top Header */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 flex flex-col md:flex-row justify-between gap-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-wrap gap-8 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                  <div className="space-y-1">
                    <p>Order Placed</p>
                    <p className="text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p>Total</p>
                    <p className="text-gray-900 dark:text-white">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="space-y-1">
                    <p>Ship To</p>
                    <div className="flex items-center gap-1 group/addr cursor-pointer">
                      <p className="text-blue-500">{user.name}</p>
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Order # {order._id.slice(-10)}</p>
                  <Link to={`/order/${order._id}`} className="text-xs font-bold text-blue-500 hover:underline">View Order Details</Link>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.isDelivered ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {order.isDelivered ? 'Delivered' : 'Arriving Soon'}
                  </div>
                </div>

                <div className="space-y-6">
                  {order.orderItems.map((item, i) => (
                    <div key={i} className="flex gap-6 items-center">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-xl p-2 flex-shrink-0">
                         <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Link to={`/product/${item.product}`} className="font-bold text-sm hover:text-[var(--accent)] line-clamp-2 transition-colors">
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-4">
                          <button className="amazon-button py-1.5 px-4 text-xs">Buy it again</button>
                          <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 py-1.5 px-4 text-xs font-bold rounded-lg transition-colors">Track package</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-[var(--accent)] transition-colors">
                  Need help? Contact Support <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
