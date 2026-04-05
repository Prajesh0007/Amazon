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
      <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen bg-slate-50">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-3xl aspect-square border border-slate-100 shadow-sm" />
          <div className="space-y-6 text-left">
            <div className="h-10 bg-white rounded w-3/4 border border-slate-100" />
            <div className="h-6 bg-white rounded w-1/4 border border-slate-100" />
            <div className="h-32 bg-white rounded w-full border border-slate-100" />
            <div className="h-12 bg-white rounded w-1/2 border border-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Image Gallery */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[3rem] p-8 aspect-square flex items-center justify-center relative shadow-xl border border-slate-100 group"
            >
              <img 
                src={product.images?.[activeImg]} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <button 
                onClick={toggleWishlist}
                className="absolute top-6 right-6 p-4 rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-slate-100 hover:scale-110 transition-all active:scale-95"
              >
                <Heart size={24} className={isWishlisted ? "fill-red-500 text-red-500" : "text-slate-300"} />
              </button>
            </motion.div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all p-3 bg-white shadow-sm ${
                    activeImg === i ? 'border-blue-600 scale-105' : 'border-slate-100 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">
                  {product.brand} • {product.category}
                </span>
                {product.manufacturer && (
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">By {product.manufacturer}</span>
                )}
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 leading-none font-elegant uppercase">
                {product.name}
              </h1>
              <p className="text-[11px] font-black text-blue-600 hover:underline cursor-pointer uppercase tracking-[0.2em] italic">
                Visit the {product.seller?.name || 'Active Artisans'} Archive
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-white px-4 py-2 rounded-full gap-2 transition-all hover:bg-slate-50 cursor-default border border-slate-100 shadow-sm">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={`${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-black text-slate-900">{product.rating}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">{product.numReviews} Global Signals</span>
                
                {product.isPrime && (
                  <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">
                    <Check size={10} strokeWidth={4} /> Prime Connect
                  </div>
                )}
              </div>
            </div>

            {/* Product Specifications Section */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-100">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none">{key}</span>
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* AI Summary Highlight */}
            {product.aiSummary && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-blue-50 p-10 rounded-[4rem] relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="flex items-center gap-3 mb-6 text-blue-600 relative z-10">
                  <Brain size={28} className="animate-pulse" />
                  <h3 className="font-black text-xl uppercase tracking-tighter">AI Command Synthesis</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 italic uppercase font-medium tracking-tight relative z-10">
                  "{product.aiSummary.summary}"
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.4em] mb-2 leading-none">Positive Benchmarks</p>
                    {product.aiSummary.pros.map((pro, i) => (
                      <div key={i} className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-tight">
                        <Check size={16} className="text-green-500" /> {pro}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-2 leading-none">Logic Constraints</p>
                    {product.aiSummary.cons.map((con, i) => (
                      <div key={i} className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-tight line-through opacity-60">
                        <Info size={16} className="text-red-400" /> {con}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="py-8 space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-black text-slate-400 align-top mt-1 uppercase">Price Link</span>
                <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-xl text-slate-300 line-through font-black tracking-tighter ml-4">₹{(product.price * 1.2).toLocaleString('en-IN')}</span>
                <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest ml-4 shadow-sm border border-green-100">20% Elite Discount</div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none italic">Inclusive of global taxation protocol</p>
              
              <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                <div className="flex items-center border-2 border-slate-100 rounded-[2rem] overflow-hidden bg-white shadow-xl w-full md:w-auto">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-4 px-8 hover:bg-slate-50 transition-all font-black text-xl text-slate-400"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-black text-xl text-slate-900">{qty}</span>
                  <button 
                    onClick={() => setQty(qty + 1)}
                    className="p-4 px-8 hover:bg-slate-50 transition-all border-l-2 border-slate-100 font-black text-xl text-slate-900"
                  >
                    +
                  </button>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 w-full bg-slate-900 text-white rounded-[2rem] py-6 flex items-center justify-center gap-4 group shadow-xl font-black text-sm uppercase tracking-[0.3em] active:scale-95 transition-all"
                >
                  <ShoppingCart size={22} className="group-hover:rotate-12 transition-transform" />
                  Add to Vault
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="flex-1 w-full bg-blue-600 text-white rounded-[2rem] py-6 flex items-center justify-center gap-4 font-black text-sm uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Zap size={22} className="fill-current" />
                  Execute Now
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-slate-100">
              <div className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-inner">
                  <Truck size={28} />
                </div>
                <div className="space-y-1 text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Elite Flux</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight">Instant Node Deployment</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 shadow-inner">
                  <RotateCcw size={28} />
                </div>
                <div className="space-y-1 text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Reversal Link</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight">7-Day Return Symmetry</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="bg-green-50 p-4 rounded-2xl text-green-600 shadow-inner">
                  <Shield size={28} />
                </div>
                <div className="space-y-1 text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Secure Vault</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight">Encrypted Transaction</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 text-left">
              <h3 className="font-black text-3xl tracking-tighter uppercase leading-none font-elegant">Archive <span className="text-blue-600">Manifesto</span></h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap uppercase tracking-tight">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* New Detailed Sections */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 space-y-10">
                <RatingBreakdown rating={product.rating} numReviews={product.numReviews} />
                
                {/* Vertical Specific Protocol Info */}
                {product.serviceType === 'Food' && (
                  <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[4rem] border border-blue-50 shadow-xl shadow-blue-500/5 text-left relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-20xl" />
                      <h4 className="text-sm font-black uppercase text-blue-600 mb-8 flex items-center gap-4 relative z-10">
                         <Info size={20} /> Artisan Source Protocol
                      </h4>
                      <div className="space-y-6 relative z-10">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none mb-2 italic">Recipe Archive Node</p>
                         <p className="text-sm font-bold text-slate-700 leading-relaxed italic uppercase tracking-tight">
                            {product.recipe || 'This signature dish is prepared using high-grade organic elements and a traditional slow-cooking protocol.'}
                         </p>
                      </div>
                      <div className="mt-10 pt-10 border-t border-slate-50 relative z-10">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6 leading-none">Verification Elements</p>
                         <div className="flex flex-wrap gap-3">
                             {(product.ingredients || ['Artisanal Base', 'House Spices', 'Fresh Greens']).map((ing, i) => (
                               <span key={i} className="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-blue-600 border border-blue-50 uppercase tracking-[0.2em] shadow-sm">
                                  {ing}
                               </span>
                             ))}
                         </div>
                      </div>
                    </div>
                    <div className="p-8 bg-blue-600 text-white rounded-[3rem] shadow-xl shadow-blue-500/20 text-center">
                       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 mb-2">Deploy Status</p>
                       <p className="text-sm font-black italic tracking-tighter uppercase">ACTIVE HUB VERIFIED • 25 MINS ETA</p>
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
