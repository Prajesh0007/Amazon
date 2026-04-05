import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Shield, Truck, RotateCcw, Brain, Check, Info, Heart, Zap } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import RatingBreakdown from '../components/RatingBreakdown';
import RelatedProducts from '../components/RelatedProducts';
import AICompare from '../components/AICompare';
import ReviewList from '../components/ReviewList';
import QuestionSection from '../components/QuestionSection';
import AIReviewSummarizer from '../components/AIReviewSummarizer';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, reviews, questions, loading, fetchProductById } = useProductStore();
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
    const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isPresent = stored.some(p => p._id === id);
    
    let updated;
    if (isPresent) {
      updated = stored.filter(p => p._id !== id);
      setIsWishlisted(false);
      toast.success("Removed from Wishlist");
    } else {
      updated = [...stored, { ...product, collection: 'General' }];
      setIsWishlisted(true);
      toast.success("Added to Wishlist");
    }
    
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };
  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(stored.some(p => p._id === id));
  }, [id]);

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
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.brand} • {product.category}
                </span>
                {product.manufacturer && (
                  <span className="text-xs text-gray-500 font-medium">By {product.manufacturer}</span>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight dark:text-white">
                {product.name}
              </h1>
              <p className="text-sm font-medium text-[var(--accent)] hover:underline cursor-pointer">
                Visit the {product.seller?.name || 'Amazon Clone'} Store
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full gap-2 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 cursor-default">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={`${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500 font-medium">{product.numReviews} Global Ratings</span>
                
                {product.isPrime && (
                  <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-blue-600/20">
                    <Check size={10} strokeWidth={4} /> Prime
                  </div>
                )}
              </div>
            </div>

            {/* Product Specifications Section */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100 dark:border-gray-800">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">{key}</span>
                    <span className="text-sm font-bold dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            )}

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
            <div className="lg:col-span-4 space-y-8">
                <RatingBreakdown rating={product.rating} numReviews={product.numReviews} />
                
                {/* Vertical Specific Protocol Info */}
                {product.serviceType === 'Food' && (
                  <div className="space-y-6">
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-8 rounded-[2.5rem] border-2 border-orange-100 dark:border-orange-800 shadow-xl shadow-orange-500/5">
                      <h4 className="text-sm font-black uppercase text-orange-600 mb-6 flex items-center gap-3">
                         <Info size={18} /> Chef's Protocol
                      </h4>
                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Secret Recipe Node</p>
                         <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">
                            {product.recipe || 'This signature dish is prepared using high-grade organic elements and a traditional slow-cooking protocol.'}
                         </p>
                      </div>
                      <div className="mt-8 pt-8 border-t border-orange-100 dark:border-orange-800">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Master Ingredients</p>
                         <div className="flex flex-wrap gap-2">
                             {(product.ingredients || ['Artisanal Base', 'House Spices', 'Fresh Greens']).map((ing, i) => (
                               <span key={i} className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-[9px] font-bold text-orange-600 border border-orange-100 dark:border-orange-800 uppercase tracking-wider shadow-sm">
                                  {ing}
                               </span>
                             ))}
                         </div>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-900 text-white rounded-[2rem] border border-orange-500/20">
                       <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">Node Status</p>
                       <p className="text-xs font-bold italic">FOOD HUB VERIFIED • 25 MINS ETA</p>
                    </div>
                  </div>
                )}

                {product.serviceType === 'Stay' && (
                  <div className="space-y-6">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[2.5rem] border-2 border-indigo-100 dark:border-indigo-800 shadow-xl shadow-indigo-500/5">
                      <h4 className="text-sm font-black uppercase text-indigo-600 mb-6 flex items-center gap-3">
                         <Home size={18} /> Elite Amenities
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                         {(product.amenities || ['WiFi', 'Pool', 'AC', 'Gym', 'Breakfast']).map((am, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-indigo-50 dark:border-indigo-800">
                               <Check size={14} className="text-indigo-500" />
                               <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-widest">{am}</span>
                            </div>
                         ))}
                      </div>
                      <div className="mt-8 pt-8 border-t border-indigo-100 dark:border-indigo-800 space-y-4">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Capacity</span>
                            <span className="text-xs font-black dark:text-white uppercase">{product.maxGuests || 4} Guests Max</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Climate Link</span>
                            <span className="text-xs font-black text-green-500 uppercase">{product.hasAC ? 'AC Protocol Engage' : 'Standard'}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {product.serviceType === 'Pharmacy' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
                    <h4 className="text-sm font-black uppercase text-blue-600 mb-2">Health Hub Info</h4>
                    <p className="text-xs font-bold dark:text-white mb-1">Manufacturer: {product.manufacturer || 'Certified Pharma'}</p>
                    <p className="text-[10px] text-red-500 font-black tracking-widest">CONSULT DOCTOR BEFORE USE</p>
                  </div>
                )}
            </div>

            <div className="lg:col-span-8 space-y-12">
                <AIReviewSummarizer reviews={reviews} />
                <QuestionSection questions={questions} />
                <ReviewList reviews={reviews} />
            </div>
        </div>

        <RelatedProducts category={product.category} currentProductId={id} />
      </div>
    </div>
  );
};

export default ProductDetails;
