import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Shield, Truck, RotateCcw, Brain, Check, Info, Heart, Zap } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import RatingBreakdown from '../components/RatingBreakdown';
import RelatedProducts from '../components/RelatedProducts';
import AICompare from '../components/AICompare';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, fetchProductById } = useProductStore();
  const { addToCart } = useCartStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (product) {
      const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const filtered = stored.filter(p => p._id !== product._id);
      const updated = [product, ...filtered].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
    }
  }, [product]);

  useEffect(() => {
    fetchProductById(id);
  }, [id, fetchProductById]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`Added ${qty} items to cart`, {
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
      icon: <ShoppingCart size={20} className="text-green-500" />,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/checkout');
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist", {
        icon: <Heart size={20} className={isWishlisted ? "text-gray-400" : "text-red-500 fill-current"} />,
    });
  };

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-200 dark:bg-gray-800 aspect-square rounded-3xl" />
          <div className="space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Image Gallery */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card bg-white dark:bg-gray-900 rounded-3xl p-8 aspect-square flex items-center justify-center relative shadow-2xl border border-gray-100 dark:border-gray-800 group"
            >
              <img 
                src={product.images[activeImg]} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <button 
                onClick={toggleWishlist}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-100 dark:border-gray-700 hover:scale-110 transition-all active:scale-95"
              >
                <Heart size={24} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
              </button>
            </motion.div>
            
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all p-2 bg-white dark:bg-gray-800 ${
                    activeImg === i ? 'border-[var(--accent)]' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full uppercase tracking-wider">
                {product.brand} • {product.category}
              </span>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight dark:text-white">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={`${i < Math.floor(product.rating) ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500 font-medium">{product.numReviews} Global Ratings</span>
              </div>
            </div>

            {/* AI Summary Highlight */}
            {product.aiSummary && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-100/50 dark:border-blue-800/30 p-6 rounded-3xl relative overflow-hidden backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
                  <Brain size={24} className="animate-pulse" />
                  <h3 className="font-bold text-lg">AI Shopping Assistant Summary</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 italic">
                  "{product.aiSummary.summary}"
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-extrabold text-green-600 uppercase tracking-widest">Pros</p>
                    {product.aiSummary.pros.map((pro, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs font-medium dark:text-gray-200">
                        <Check size={14} className="text-green-500" /> {pro}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-extrabold text-red-600 uppercase tracking-widest">Cons</p>
                    {product.aiSummary.cons.map((con, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Info size={14} className="text-red-400" /> {con}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI Comparison Tool */}
            <AICompare currentProduct={product} />

            <div className="border-t border-b border-gray-200 dark:border-gray-800 py-6 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold align-top mt-1">₹</span>
                <span className="text-4xl font-extrabold">{product.price.toLocaleString('en-IN')}</span>
                <span className="text-lg text-gray-500 line-through">₹{(product.price * 1.2).toLocaleString('en-IN')}</span>
                <span className="text-lg font-bold text-green-600 ml-2">20% Off</span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inclusive of all taxes</p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold">{qty}</span>
                  <button 
                    onClick={() => setQty(qty + 1)}
                    className="p-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-l dark:border-gray-700"
                  >
                    +
                  </button>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 amazon-button py-3.5 flex items-center justify-center gap-2 group shadow-lg"
                >
                  <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" />
                  Add to Cart
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  <Zap size={20} className="fill-current" />
                  Buy Now
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600">
                  <Truck size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold leading-none">Free Delivery</p>
                  <p className="text-[10px] text-gray-500">Scheduled delivery for eligible items</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-orange-50 dark:bg-orange-900/30 p-2 rounded-xl text-orange-600">
                  <RotateCcw size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold leading-none">7-Day Returns</p>
                  <p className="text-[10px] text-gray-500">Returnable for a full refund</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-xl text-green-600">
                  <Shield size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold leading-none">Secure Transaction</p>
                  <p className="text-[10px] text-gray-500">Your data is always protected</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-extrabold text-xl tracking-tight leading-none">Product Description</h3>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* New Detailed Sections */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 lowercase">
                <RatingBreakdown rating={product.rating} numReviews={product.numReviews} />
            </div>
            <div className="lg:col-span-8">
                <div className="glass-card bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="font-bold text-xl mb-6 dark:text-white">Customer Video Reviews</h3>
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400">
                        <p className="text-sm font-medium italic">"The display is absolutely stunning, and battery life exceeded my expectations..."</p>
                    </div>
                </div>
            </div>
        </div>

        <RelatedProducts category={product.category} currentProductId={id} />
      </div>
    </div>
  );
};

export default ProductDetails;
