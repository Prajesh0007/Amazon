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

  const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const total = subtotal + (subtotal > 1000 ? 0 : 150) + Math.round(subtotal * 0.18);

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
        shippingPrice: subtotal > 1000 ? 0 : 150,
        taxPrice: Math.round(subtotal * 0.18),
        totalPrice: total
      };

      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
      const { data } = await axios.post(`${apiUrl}/orders`, orderData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      toast.success('Order placed successfully!', {
          style: { borderRadius: '10px', background: '#333', color: '#fff' }
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
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Checkout Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                step >= s ? 'bg-[var(--secondary)] border-[var(--secondary)] text-white' : 'bg-transparent border-gray-300 text-gray-400'
              }`}>
                {step > s ? <CheckCircle2 size={20} /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-[var(--secondary)]' : 'bg-gray-300'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800"
          >
            <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
              <Truck className="text-blue-500" /> Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest px-1">Street Address</label>
                <input 
                  type="text" 
                  className="input-field w-full" 
                  placeholder="123 Shopping St." 
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest px-1">City</label>
                <input 
                  type="text" 
                  className="input-field w-full" 
                  placeholder="New York" 
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest px-1">Zip Code</label>
                <input 
                  type="text" 
                  className="input-field w-full" 
                  placeholder="10001" 
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                />
              </div>
            </div>
            <button 
              onClick={() => setStep(2)}
              disabled={!address.street || !address.city || !address.zip}
              className="mt-8 amazon-button w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Next: Payment <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setStep(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-2xl font-extrabold flex items-center gap-2">
                <CreditCard className="text-green-500" /> Payment
              </h2>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">Total Amount to Pay</span>
                <span className="text-2xl font-extrabold">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-blue-500/30">
                   <CreditCard className="text-blue-500" />
                   <div className="flex-1">
                     <p className="text-sm font-bold">Stripe Secure Payment</p>
                     <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Credit / Debit / UPI</p>
                   </div>
                   <Lock size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              className="w-full amazon-button py-4 flex items-center justify-center gap-2 group"
            >
              <ShieldCheck size={20} />
              Confirm & Pay Now
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-2xl border border-gray-100 dark:border-gray-800 space-y-6"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
               <CheckCircle2 size={48} />
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">Order Successful!</h2>
            <p className="text-gray-500 max-w-sm mx-auto">
              Your order has been placed and is currently being processed. You will receive an email confirmation shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
               <button 
                onClick={() => navigate('/orders')}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 py-3 px-8 rounded-xl font-bold transition-colors"
               >
                 View My Orders
               </button>
               <button 
                onClick={() => navigate('/')}
                className="amazon-button py-3 px-8"
               >
                 Continue Shopping
               </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
