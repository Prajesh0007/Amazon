import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Github, Twitter, Instagram, Facebook, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--primary)] text-white mt-auto">
      <button 
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <ArrowUp size={16} /> Back to top
      </button>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-lg mb-4">Get to Know Us</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Press Releases</a></li>
            <li><a href="#" className="hover:underline">Amazon Science</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4">Connect with Us</h4>
          <div className="flex gap-4 text-gray-300">
            <Facebook className="hover:text-[var(--secondary)] cursor-pointer transition-colors" />
            <Twitter className="hover:text-[var(--secondary)] cursor-pointer transition-colors" />
            <Instagram className="hover:text-[var(--secondary)] cursor-pointer transition-colors" />
            <Github className="hover:text-[var(--secondary)] cursor-pointer transition-colors" />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4">Make Money with Us</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link to="/seller" className="hover:underline">Sell on Amazon</Link></li>
            <li><a href="#" className="hover:underline">Protect and Build Your Brand</a></li>
            <li><a href="#" className="hover:underline">Amazon Global Selling</a></li>
            <li><a href="#" className="hover:underline">Become an Affiliate</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4">Let Us Help You</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#" className="hover:underline">Returns Centre</a></li>
            <li><a href="#" className="hover:underline">100% Purchase Protection</a></li>
            <li><a href="#" className="hover:underline">Amazon App Download</a></li>
            <li><a href="#" className="hover:underline">Help</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-8 flex flex-col items-center gap-4 text-sm text-gray-400">
        <div className="font-bold text-xl tracking-tighter text-white">
          AMAZON<span className="text-[var(--secondary)]">CLONE</span>
        </div>
        <p>© 2026, Amazon Clone. Built with React & AI.</p>
        <div className="flex gap-6 mt-2">
          <a href="#" className="hover:underline">Conditions of Use</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">Ad-Choice</a>
        </div>
      </div>
    </footer>
  );
};

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
