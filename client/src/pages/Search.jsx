import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, Brain, ChevronDown, Check, X } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import ProductGrid from '../components/ProductGrid';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'All';
  
  const { products, loading, fetchProducts, aiSearch, total } = useProductStore();
  const [showFilters, setShowFilters] = useState(false);
  const [aiParams, setAiParams] = useState(null);
  
  // Local filter states
  const [maxPrice, setMaxPrice] = useState(200000);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const params = {
      keyword: query,
      category: categoryParam,
      maxPrice: maxPrice,
      brand: selectedBrand,
      sort: sortBy,
      pageNumber: 1
    };

    if (query && !aiParams) {
       // Run AI Search once if query exists to get intent
       const runAiSearch = async () => {
         const intent = await aiSearch(query);
         setAiParams(intent);
         // If AI suggests a category, we might want to update it, but let's stick to explicit filters for now
       };
       runAiSearch();
    }
    
    fetchProducts(params);
  }, [query, categoryParam, maxPrice, selectedBrand, sortBy, fetchProducts]);

  const categories = ['All', 'Electronics', 'Computing', 'Audio', 'Mobile', 'Home', 'Fashion', 'Toys', 'Sports', 'Grocery', 'Books', 'Automotive', 'Beauty', 'Health', 'Industrial', 'Software', 'Pharmacy', 'Pets', 'Garden', 'Music', 'Office'];
  const brands = ['Sony', 'Apple', 'Samsung', 'Logitech', 'Dell', 'HP', 'Nike', 'Adidas', 'Lego', 'Tesla', 'Bosch', 'L\'Oreal', 'Adobe', 'Pfizer', 'Herman Miller', 'Fender'];

  const handleCategoryChange = (cat) => {
    setSearchParams({ q: query, category: cat });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Search Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight uppercase">
              {query ? `Results for "${query}"` : 'Global Catalog'}
            </h1>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">
              Showing {products.length} of {total || 0} products
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white dark:bg-gray-900 px-5 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 font-black text-xs uppercase tracking-widest hover:border-[var(--secondary)] transition-all"
            >
              <Filter size={16} /> Filters
            </button>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-gray-900 px-5 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 font-black text-xs uppercase tracking-widest outline-none focus:border-[var(--secondary)] transition-all appearance-none pr-10 relative"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
            >
              <option value="">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* AI Insight Bar */}
        <AnimatePresence>
          {aiParams && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/30 rounded-[2rem] p-5 flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Brain size={24} className="animate-pulse" />
                  <span className="font-black text-[10px] uppercase tracking-[0.2em]">Semantic Intent</span>
                </div>
                <div className="h-4 w-px bg-blue-200 dark:bg-blue-800 hidden md:block" />
                <div className="flex-1 flex flex-wrap gap-2 items-center">
                  {aiParams.category && (
                    <span className="bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full text-[10px] font-black border border-blue-200 dark:border-blue-700 text-blue-600 flex items-center gap-1 uppercase tracking-wider">
                      Target: {aiParams.category} <Check size={12} />
                    </span>
                  )}
                  {aiParams.keywords && aiParams.keywords.map(kw => (
                    <span key={kw} className="bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full text-[10px] font-black border border-gray-200 dark:border-gray-700 flex items-center gap-1 uppercase tracking-wider">
                      {kw}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => setAiParams(null)}
                  className="p-2 hover:bg-white/50 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar Filters */}
          <div className={`lg:col-span-1 space-y-10 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="space-y-5">
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">Departments</h3>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => handleCategoryChange(cat)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                      categoryParam === cat 
                      ? 'bg-[var(--secondary)]/10 border-[var(--secondary)] text-[var(--secondary)] font-black' 
                      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500 font-bold hover:border-gray-200'
                    }`}
                  >
                    <span className="text-xs uppercase tracking-wider">{cat}</span>
                    {categoryParam === cat && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400 text-center">Budget Range</h3>
              <div className="space-y-4">
                <input 
                  type="range" 
                  className="w-full accent-[var(--secondary)] h-1.5 bg-gray-100 rounded-lg cursor-pointer" 
                  min="0" 
                  max="200000" 
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>₹0</span>
                  <span className="bg-[var(--secondary)] text-[var(--primary)] px-3 py-1 rounded-full">UP TO ₹{Number(maxPrice).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">Premium Brands</h3>
              <div className="grid grid-cols-2 gap-2">
                {brands.map(brand => (
                  <button 
                    key={brand} 
                    onClick={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                    className={`px-3 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                      selectedBrand === brand 
                      ? 'bg-black dark:bg-white text-white dark:text-black border-transparent' 
                      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="lg:col-span-3">
             {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
                  ))}
                </div>
             ) : products.length > 0 ? (
                <ProductGrid products={products} loading={false} />
             ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                   <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                     <X size={40} />
                   </div>
                   <h2 className="text-2xl font-black uppercase tracking-tight">No products found</h2>
                   <p className="text-gray-400 font-bold text-sm max-w-xs">Adjust your filters or try a different search term to find what you're looking for.</p>
                   <button 
                    onClick={() => { setMaxPrice(200000); setSelectedBrand(''); handleCategoryChange('All'); }}
                    className="mt-4 px-6 py-3 bg-[var(--secondary)] text-[var(--primary)] rounded-xl font-black text-xs uppercase tracking-widest shadow-lg"
                   >
                     Reset All Filters
                   </button>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
