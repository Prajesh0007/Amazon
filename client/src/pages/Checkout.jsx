import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, Lock, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
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

      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
      await axios.post(`${apiUrl}/orders`, orderData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      toast.success('Order placed successfully!', {
          icon: <CheckCircle2 className="text-green-500" />,
          style: { borderRadius: '20px', background: '#333', color: '#fff' }
      });
      
      clearCart();
      setStep(3);
    } catch (err) {
      toast.error('Failed to place order');
    }
  };

  if (cart.items.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Main checkout flow */}
        <div className="lg:col-span-8 space-y-8">
            {/* Checkout Steps */}
            <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                    step >= s ? 'bg-slate-900 border-slate-900 text-white' : 'bg-transparent border-gray-300 text-gray-400'
                }`}>
                    {step > s ? <CheckCircle2 size={20} /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-1 mx-2 ${step > s ? 'bg-slate-900' : 'bg-gray-300'}`} />}
                </div>
            ))}
            </div>

            {step === 1 && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 shadow-sm border border-slate-100 dark:border-slate-800"
            >
                <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-500">
                    <Truck size={24} />
                </div>
                Shipping Destination
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Street Address</label>
                    <input 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Enter full address" 
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">City</label>
                    <input 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Mumbai" 
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Zip Code</label>
                    <input 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="400001" 
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    />
                </div>
                </div>
                <button 
                onClick={() => setStep(2)}
                disabled={!address.street || !address.city || !address.zip}
                className="mt-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
                >
                Proceed to Payment
                </button>
            </motion.div>
            )}

            {step === 2 && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 shadow-sm border border-slate-100 dark:border-slate-800"
            >
                <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setStep(1)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <h2 className="text-3xl font-black flex items-center gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-2xl text-green-500">
                        <CreditCard size={24} />
                    </div>
                    Unified Payment
                </h2>
                </div>
                
                <div className="space-y-8">
                    {/* Tip for Food orders */}
                    {hasService('Food') && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-black uppercase text-orange-500 tracking-widest">Delivery Partner Tip</h4>
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
                                <button onClick={() => setTip(0)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500">Not now</button>
                            </div>
                        </div>
                    )}

                    <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xl font-black">Final Payment</span>
                            <span className="text-3xl font-black text-blue-600">₹{total.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-blue-500/20">
                                <CreditCard className="text-blue-500" />
                                <div className="flex-1">
                                    <p className="text-xs font-black uppercase tracking-widest">Stripe Secure Check</p>
                                    <p className="text-[10px] text-slate-400 font-bold">Encrypted End-to-End</p>
                                </div>
                                <Lock size={16} className="text-slate-300" />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handlePlaceOrder}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                        Place Order Now
                    </button>
                </div>
            </motion.div>
            )}

            {step === 3 && (
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-slate-900 rounded-[3rem] p-16 text-center shadow-xl border border-slate-100 dark:border-slate-800 space-y-8"
            >
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-green-500/30">
                <CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Victory!</h2>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Your Mega-Order is synchronized</p>
                </div>
                <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">
                We've alerted your Restaurant, Grocery store, and Warehouse partners. Track everything in your dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button 
                    onClick={() => navigate('/orders')}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 py-4 px-12 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                >
                    Order History
                </button>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 px-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all"
                >
                    Back to Hub
                </button>
                </div>
            </motion.div>
            )}
        </div>

        {/* Right: Summary */}
        {step !== 3 && (
            <div className="lg:col-span-4 space-y-8">
                <div className="p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                   <h3 className="text-lg font-black uppercase tracking-widest">Order Summary</h3>
                   
                   <div className="space-y-4">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                           <span>Subtotal</span>
                           <span className="text-slate-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                           <span>Shipping</span>
                           <span className="text-slate-900 dark:text-white">₹{shipping.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                           <span>Tax (GST)</span>
                           <span className="text-slate-900 dark:text-white">₹{tax.toLocaleString()}</span>
                       </div>
                       {tip > 0 && (
                            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-orange-500">
                                <span>Tip</span>
                                <span>₹{tip}</span>
                            </div>
                       )}
                       <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                           <span className="text-xl font-black uppercase tracking-tighter">Total</span>
                           <span className="text-3xl font-black">₹{total.toLocaleString()}</span>
                       </div>
                   </div>

                   {/* Service Badges */}
                   <div className="space-y-4 pt-8">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Vertical Insights</p>
                        <div className="flex flex-wrap gap-2">
                            {hasService('Food') && <div className="px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-full text-[8px] font-black uppercase tracking-widest">Instant Food</div>}
                            {hasService('Grocery') && <div className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-full text-[8px] font-black uppercase tracking-widest">Wait-Less 10M</div>}
                            {hasService('Pharmacy') && <div className="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-full text-[8px] font-black uppercase tracking-widest">Health Hub Verified</div>}
                        </div>
                   </div>
                </div>

                <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white flex items-center gap-4 shadow-2xl shadow-blue-500/20">
                    <ShieldCheck size={32} />
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest">Secure Checkout</p>
                        <p className="text-[8px] font-medium opacity-80 uppercase leading-none">Your data is safe with our 256-bit encryption</p>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;
