import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';

const Cart = () => {
  const { cart, removeFromCart, updateQty } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const totalItems = cart.items.reduce((acc, item) => acc + item.qty, 0);
  const shipping = subtotal > 1000 ? 0 : 150;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6"
        >
          <ShoppingCart size={40} className="text-gray-400" />
        </motion.div>
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like you haven't added anything to your cart yet. Discover something new today!
        </p>
        <Link to="/" className="amazon-button px-10 py-3 text-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.items.map((item) => (
                <motion.div
                  key={item.product._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 shadow-sm border border-gray-100 dark:border-gray-800"
                >
                  <Link to={`/product/${item.product._id}`} className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 dark:bg-white/5 rounded-xl p-2">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <Link to={`/product/${item.product._id}`} className="font-bold text-lg hover:text-[var(--accent)] transition-colors line-clamp-1">
                          {item.product.name}
                        </Link>
                        <span className="font-extrabold text-xl ml-4">₹{(item.product.price * item.qty).toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-xs text-green-600 font-bold uppercase tracking-widest">In Stock</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-inner">
                          <button 
                            onClick={() => updateQty(item.product._id, Math.max(1, item.qty - 1))}
                            className="p-1 px-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                          <button 
                            onClick={() => updateQty(item.product._id, item.qty + 1)}
                            className="p-1 px-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border-l dark:border-gray-700"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                        <button 
                          onClick={() => removeFromCart(item.product._id)}
                          className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                      <span className="text-xs text-gray-400 font-medium hidden sm:block">Unit price: ₹{item.product.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 space-y-6">
              <h3 className="text-xl font-extrabold tracking-tight">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-gray-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Shipping Fee</span>
                  <span className={shipping === 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Estimated Tax (18%)</span>
                  <span className="text-gray-900 dark:text-white">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
                  <span className="font-bold text-lg">Order Total</span>
                  <span className="font-extrabold text-2xl">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full amazon-button py-4 text-lg flex items-center justify-center gap-2 group shadow-lg"
              >
                Proceed to Checkout
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-3">
                  <div className="text-green-500 mt-0.5"><ShieldCheck size={18} /></div>
                  <p className="text-[10px] text-gray-500 font-medium">Safe and Secure Payment. Easy returns. 100% Authentic products.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-100/50 dark:border-blue-800/30">
               <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                 <Truck size={20} />
                 <p className="text-xs font-bold uppercase tracking-[0.2em] leading-none">Free Express Delivery</p>
               </div>
               <p className="text-[10px] text-gray-500 mt-2">Spend ₹1,000 more to qualify for express shipping (Selected areas).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
