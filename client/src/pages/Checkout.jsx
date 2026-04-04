import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, Lock, CheckCircle2, ChevronRight, ArrowLeft, ShoppingBag, Zap, Info, MapPin, Clock, Navigation, Phone } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [tip, setTip] = useState(0);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });
  
  const [orderComplete, setOrderComplete] = useState(false);
  const [liveStatus, setLiveStatus] = useState('Preparing');

  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const hasService = (type) => cart.items.some(item => item.product.serviceType === type);

  const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const shipping = subtotal > 1000 ? 0 : 150;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax + tip;

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        orderItems: cart.items.map(item => ({
          name: item.product.name,
          qty: item.qty,
          image: item.product.images[0],
          price: item.product.price,
          product: item.product._id
        })),
        shippingAddress: address,
        paymentMethod: 'Stripe',
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        tipPrice: tip,
        totalPrice: total
      };

      const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');
      await axios.post(`${apiUrl}/orders`, orderData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      toast.success('Mega-Order Confirmed!', {
          icon: <Zap className="text-orange-500" />,
          style: { borderRadius: '20px', background: '#333', color: '#fff' }
      });
      
      clearCart();
      setOrderComplete(true);
      setTimeout(() => setLiveStatus('Captain Assigned'), 3000);
      setTimeout(() => setLiveStatus('Arriving'), 6000);
    } catch (err) {
      toast.error('Failed to place order');
    }
  };

  if (cart.items.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
                {orderComplete ? (
                    <motion.div 
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 text-center shadow-3xl space-y-8 border-2 border-green-500/20"
                    >
                        <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
                            <ShieldCheck size={64} className="text-white" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white leading-none">Order Synchronized!</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Prepare for your Elite delivery</p>
                        </div>
                        
                        {/* Live Tracking Card */}
                        <div className="bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-10 text-left space-y-6 max-w-lg mx-auto border border-slate-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                                        <Navigation size={20} className="text-white" />
                                    </div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Super App Live Hub</p>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${
                                    liveStatus === 'Arriving' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                                }`}>
                                    {liveStatus}
                                </span>
                            </div>
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between text-white font-black text-xs uppercase tracking-widest">
                                    <span>{liveStatus === 'Arriving' ? 'Captain is here!' : 'Captain On The Way'}</span>
                                    <span className="text-indigo-400">{liveStatus === 'Arriving' ? '0 Mins' : '4 Mins'}</span>
                                </div>
                                <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: '10%' }}
                                        animate={{ width: liveStatus === 'Preparing' ? '30%' : (liveStatus === 'Captain Assigned' ? '60%' : '100%') }}
                                        className="h-full bg-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 pt-6 border-t border-slate-700">
                               <div className="w-12 h-12 rounded-full border-2 border-slate-700 flex items-center justify-center">
                                   <Phone size={18} className="text-slate-400" />
                               </div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight flex-1 italic">Secure encrypted voice channel active with Captain Vikram</p>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                             <button onClick={() => navigate('/')} className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all outline-none">
                                 Back to Hub
                             </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {/* Checkout Steps */}
                        <div className="flex items-center justify-center mb-12">
                            {[1, 2].map((s) => (
                                <div key={s} className="flex items-center">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black border-2 transition-all ${
                                        step >= s ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900' : 'bg-transparent border-slate-200 text-slate-300'
                                    }`}>
                                        {s}
                                    </div>
                                    {s < 2 && <div className={`w-20 h-1 mx-4 ${step > s ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-slate-800'}`} />}
                                </div>
                            ))}
                        </div>

                        {step === 1 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
                                <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Delivery <span className="text-blue-500">Node</span></h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Street Address</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500" 
                                            placeholder="Enter Destination" 
                                            value={address.street}
                                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">City</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black uppercase tracking-widest outline-none" 
                                            placeholder="Mumbai" 
                                            value={address.city}
                                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Zip Node</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black uppercase tracking-widest outline-none" 
                                            placeholder="400001" 
                                            value={address.zip}
                                            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setStep(2)}
                                    disabled={!address.street || !address.city || !address.zip}
                                    className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 hover:scale-105 transition-all"
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 shadow-sm border border-slate-100 dark:border-slate-800 space-y-12">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Unified <span className="text-green-500">Pay</span></h2>
                                    <button onClick={() => setStep(1)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">Back</button>
                                </div>

                                {hasService('Food') && (
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Delivery Partner Tip</p>
                                        <div className="flex gap-4">
                                            {[20, 30, 50, 100].map(val => (
                                                <button 
                                                    key={val}
                                                    onClick={() => setTip(val)}
                                                    className={`px-6 py-3 rounded-xl font-black text-xs transition-all ${tip === val ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                                                >
                                                    ₹{val}
                                                </button>
                                            ))}
                                            <button onClick={() => setTip(0)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-auto hover:text-red-500">Skip</button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center gap-6 border-2 border-blue-500/20">
                                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-blue-500">
                                            <CreditCard />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-black uppercase tracking-widest dark:text-white leading-none mb-1">Stripe Gateway High-Sec</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Encrypted Checkout Active</p>
                                        </div>
                                        <Lock size={16} className="text-slate-400" />
                                    </div>
                                </div>

                                <button 
                                    onClick={handlePlaceOrder}
                                    className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none"
                                >
                                    Confirm Mega Order
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Right Summary */}
        {!orderComplete && (
            <div className="lg:col-span-4 space-y-8">
                <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 sticky top-24">
                    <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">Order Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="dark:text-white">₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Service Fee</span>
                            <span className="dark:text-white">₹{shipping.toLocaleString()}</span>
                        </div>
                        {tip > 0 && (
                            <div className="flex justify-between text-[10px] font-black text-orange-500 uppercase tracking-widest">
                                <span>Captain Tip</span>
                                <span>₹{tip}</span>
                            </div>
                        )}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                            <span className="text-xl font-black uppercase tracking-tighter dark:text-white">Payable</span>
                            <span className="text-3xl font-black dark:text-white">₹{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;
