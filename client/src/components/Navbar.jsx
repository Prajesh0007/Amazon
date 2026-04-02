import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import SearchSuggestions from './SearchSuggestions';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${searchTerm}`);
    }
  };

  const navItems = [
    ...(user?.role === 'admin' ? [{ title: 'Admin Dashboard', path: '/admin' }] : []),
    { title: 'Best Sellers', path: '/search?category=Best%20Sellers' },
    { title: 'Deals', path: '/search?category=Deals' },
    { title: 'Electronics', path: '/search?category=Electronics' },
    { title: 'Home & Kitchen', path: '/search?category=Home' },
    { title: 'Fashion', path: '/search?category=Fashion' },
    { title: 'Sell', path: '/seller' },
  ];

  return (
    <nav className="sticky top-0 z-50 premium-gradient shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Nav Bar */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black text-white tracking-tighter uppercase font-display italic group-hover:scale-105 transition-transform">
              AMZN<span className="text-amber-400 not-italic">.</span>
            </span>
          </Link>

          {/* Search Box - Hidden on mobile */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl relative"
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          >
            <input
              type="text"
              placeholder="Search products, brands, and more..."
              className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-gray-900 dark:text-white rounded-l-2xl py-2.5 px-6 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-6 rounded-r-2xl transition-all duration-300 flex items-center justify-center group"
            >
              <Search size={18} className="group-hover:scale-110 transition-transform" />
            </button>

            <SearchSuggestions 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm}
              isVisible={showSuggestions}
              setIsVisible={setShowSuggestions}
            />
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-6 text-white text-sm font-medium">
            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="hover:text-amber-400 transition-all duration-300 p-2 bg-white/10 rounded-full hover:bg-white/20"
            >
              {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {/* Auth */}
            <div className="relative group">
              <Link to={user ? "/profile" : "/login"} className="flex flex-col items-start hover:text-[var(--secondary)] transition-colors">
                <span className="text-xs font-normal">Hello, {user ? user.name.split(' ')[0] : 'Sign in'}</span>
                <span className="font-bold flex items-center gap-1">Account & Lists</span>
              </Link>
              {user && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">My Orders</Link>
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Account Settings</Link>
                  <Link to="/seller" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-[var(--accent)]">Seller Hub / Sell</Link>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Returns & Orders */}
            <Link to="/orders" className="hidden lg:flex flex-col items-start hover:text-[var(--secondary)] transition-colors">
              <span className="text-xs font-normal">Returns</span>
              <span className="font-bold">& Orders</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex items-center gap-2 hover:text-amber-400 transition-all duration-300 relative group px-3 py-2 bg-white/5 rounded-2xl hover:bg-white/10">
              <div className="relative">
                <ShoppingCart size={22} className="group-hover:bounce" />
                {cart.items.length > 0 && (
                  <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#131921] animate-pulse">
                    {cart.items.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                )}
              </div>
              <span className="font-bold text-xs uppercase tracking-widest hidden lg:block">Cart</span>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Secondary Nav Line (Categories) */}
        <div className="hidden md:flex items-center gap-6 h-10 border-t border-white/10 text-white text-sm">
          <button className="flex items-center gap-1 font-bold">
            <Menu size={18} /> All
          </button>
          {navItems.map((item) => (
            <Link 
              key={item.title} 
              to={item.path} 
              className="hover:border hover:border-white border border-transparent px-2 py-1 rounded-sm transition-all"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
            <div className="relative w-4/5 h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col">
              <div className="p-6 bg-gray-100 dark:bg-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  <User className="text-gray-500" />
                </div>
                <span className="text-lg font-bold">Hello, {user ? user.name : 'Sign In'}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Shop By Category</h3>
                {navItems.map((item) => (
                  <Link 
                    key={item.title} 
                    to={item.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg font-medium hover:text-[var(--accent)]"
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Help & Settings</h3>
                  <Link to="/profile" className="block text-lg font-medium">Your Account</Link>
                  <Link to="/orders" className="block text-lg font-medium">Your Orders</Link>
                  {user && (
                    <button onClick={logout} className="block text-lg font-medium text-red-500">Sign Out</button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
