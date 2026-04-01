import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Github, Chrome, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login, register, loading, error, user, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
    return () => clearError();
  }, [user, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(formData.email, formData.password);
    } else {
      await register(formData.name, formData.email, formData.password);
    }
  };

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    clearError();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex flex-col items-center gap-3 mb-12 group transition-transform hover:scale-105">
          <span className="text-4xl font-black text-slate-900 dark:text-white tracking-widest uppercase font-display italic">
            AMZN<span className="text-amber-500 not-italic">.</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-4 bg-amber-500" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Quantum Security Active</p>
            <span className="h-[1px] w-4 bg-amber-500" />
          </div>
        </Link>

        {/* Auth Card */}
        <motion.div
           layout
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-card bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl py-10 px-6 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] sm:rounded-[2.5rem] sm:px-12 border border-white/20 dark:border-white/5 relative overflow-hidden"
        >
          {/* Progress Bar for Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute top-0 left-0 h-1 bg-amber-500 z-10 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              />
            )}
          </AnimatePresence>

          <div className="mb-10 flex flex-col items-center gap-2 text-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display">
              {isLogin ? 'Welcome Back' : 'Join Elite'}
            </h2>
            <button 
              onClick={toggleAuth}
              className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already a member? Sign in'}
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      required={!isLogin}
                      className="input-field w-full pl-10"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  className="input-field w-full pl-10"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Password</label>
                {isLogin && <a href="#" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Forgot?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  className="input-field w-full pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full amazon-button py-5 text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 group transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                    <Loader2 size={24} className="animate-spin text-slate-900" />
                    <span>Synchronizing...</span>
                </div>
              ) : (
                <>
                  {isLogin ? 'Initiate Protocol' : 'Create Profile'}
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs font-bold text-gray-500 uppercase">
                <span className="bg-white dark:bg-gray-900 px-4">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-bold text-sm">
                <Chrome size={18} /> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-bold text-sm">
                <Github size={18} /> GitHub
              </button>
            </div>
          </div>
        </motion.div>

        {!isLogin && (
          <p className="mt-8 text-center text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
            By creating an account, you agree to Amazon Clone's <a href="#" className="underline font-bold">Conditions of Use</a> and <a href="#" className="underline font-bold">Privacy Notice</a>.
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
