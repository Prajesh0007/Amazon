import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart`, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const discountedPrice = product.price; // Could add discount logic here
  const rating = product.rating || 0;
  const numReviews = product.numReviews || 0;

  return (
    <motion.div
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass-card overflow-hidden group flex flex-col h-full active:scale-[0.98]"
    >
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-square bg-white dark:bg-slate-900/40">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      <div className="p-4 flex flex-col flex-grow gap-2">
        <Link 
          to={`/product/${product._id}`}
          className="text-sm font-bold line-clamp-2 hover:text-amber-500 transition-colors h-10 tracking-tight leading-snug"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`${
                i < Math.floor(rating)
                  ? 'fill-[var(--accent)] text-[var(--accent)]'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
          <span className="text-xs text-blue-500 font-bold ml-1 hover:underline cursor-pointer">
            {numReviews.toLocaleString()}
          </span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">₹</span>
            <span className="text-2xl font-black tracking-tighter">{product.price.toLocaleString('en-IN')}</span>
          </div>
          
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
            M.R.P: <span className="line-through">₹{(product.price * 1.2).toLocaleString('en-IN')}</span>
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-red-500/20">
              Limited time deal
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full mt-4 amazon-button flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
