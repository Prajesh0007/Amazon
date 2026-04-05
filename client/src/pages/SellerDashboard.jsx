import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, DollarSign, TrendingUp, UserCheck, Truck, Shield } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
  const { user, updateUser } = useAuthStore();
  const isSeller = user?.role === 'seller';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [businessType, setBusinessType] = useState('Shopping');
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    brand: '',
    stock: '',
    serviceType: 'Shopping',
    isVeg: false,
    timeToDeliver: ''
  });

  useEffect(() => {
    if (isSeller) {
      fetchSellerProducts();
    }
  }, [isSeller, user]);

  const handleRegisterSeller = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/seller/register', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      updateUser({ role: 'seller' });
      toast.success('Successfully registered as a Super-Seller!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerProducts = async () => {
    try {
      const res = await fetch('/api/seller/products', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ ...newProduct, serviceType: businessType })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add product');
      
      toast.success(`${businessType} item listed successfully!`);
      setProducts([...products, data]);
      setNewProduct({ name: '', price: '', description: '', category: '', brand: '', stock: '', serviceType: businessType, isVeg: false, timeToDeliver: '' });
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isSeller) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6 overflow-hidden relative text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.05),transparent)] pointer-events-none" />
        <div className="max-w-4xl w-full space-y-12 relative z-10">
            <motion.div 
                initial={{ scale: 0.8, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-40 h-40 bg-amber-500 text-white rounded-[3.5rem] flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 ring-4 ring-amber-500/5 mb-8"
            >
                <TrendingUp size={80} />
            </motion.div>
            <div className="space-y-4">
                <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter font-elegant italic">Active <span className="text-amber-500 underline decoration-8 underline-offset-12 p-2">Seller</span> Command</h1>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] leading-relaxed max-w-2xl mx-auto italic">
                    Establish your Estate • List Elite Inventory • Command the Global Grid
                </p>
            </div>
            <p className="text-slate-500 max-w-xl mx-auto text-lg font-black uppercase tracking-tight leading-snug">
                Join the Active Elite. Reach millions across our unified service ecosystem.
            </p>
            <button
                onClick={handleRegisterSeller}
                disabled={loading}
                className="px-16 py-8 bg-amber-500 text-white rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.4em] shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
                {loading ? 'Initializing Protocol...' : 'Launch Business Command'}
            </button>
        </div>
      </div>
    );
  }

  const businessTypes = [
    { id: 'Shopping', label: 'E-commerce Estate', icon: <Package size={20} />, color: 'amber' },
    { id: 'Food', label: 'Artisan Restaurant', icon: <Plus size={20} />, color: 'orange' },
    { id: 'Grocery', label: 'Fresh Market Grid', icon: <Truck size={20} />, color: 'green' },
    { id: 'Pharmacy', label: 'Vitality Center', icon: <Shield size={20} />, color: 'red' }
  ];

  const colorMap = {
    amber: 'bg-amber-500 text-white shadow-xl shadow-amber-500/20 border-amber-500',
    orange: 'bg-orange-600 text-white shadow-xl shadow-orange-600/20 border-orange-600',
    green: 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 border-emerald-600',
    red: 'bg-red-600 text-white shadow-xl shadow-red-600/20 border-red-600'
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Hub Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20 pb-12 border-b border-slate-100">
          <div className="space-y-4 text-left">
            <h1 className="text-5xl font-black tracking-tighter uppercase text-slate-900 font-elegant">Active <span className="text-amber-500 underline underline-offset-8">Seller</span> Command</h1>
            <div className="flex items-center gap-4">
              <span className="px-5 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-2xl border border-emerald-100 shadow-sm transition-all hover:border-emerald-500/20">Active Sectors Verified</span>
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] italic">Omni-Channel Sync Protocol V4</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {businessTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setBusinessType(type.id)}
                className={`flex items-center gap-4 px-8 py-5 rounded-[2rem] border font-black text-[11px] uppercase tracking-widest transition-all duration-500 hover:scale-105 active:scale-95 shadow-sm ${
                  businessType === type.id 
                  ? colorMap[type.color]
                  : 'bg-white text-slate-400 border-slate-100 hover:border-amber-500/30'
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
          
          {/* Listing Form */}
          <div className="lg:col-span-4 text-left">
            <div className="p-12 bg-white backdrop-blur-3xl rounded-[4rem] border border-slate-100 shadow-xl sticky top-24 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <h3 className="text-2xl font-black uppercase mb-10 text-slate-900 flex items-center gap-4 font-elegant relative z-10 font-elegant">
                <Plus size={28} className="text-amber-500" /> Deploy {businessType}
              </h3>
              
              <form onSubmit={handleAddProduct} className="space-y-6 relative z-10">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-[0.3em] italic leading-none mb-2">Item Identity Link</label>
                    <input required type="text" placeholder="Designation..." className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border border-slate-100 outline-none focus:ring-8 focus:ring-amber-500/5 text-slate-900 font-black text-xs uppercase tracking-widest transition-all shadow-inner" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-[0.3em] italic leading-none mb-2">Price (₹)</label>
                    <input required type="number" placeholder="Valuation..." className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-slate-900 font-black text-xs tracking-widest outline-none focus:ring-4 focus:ring-amber-500/5 shadow-inner" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-[0.3em] italic leading-none mb-2">Inventory Link</label>
                    <input required type="number" placeholder="Units..." className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-slate-900 font-black text-xs tracking-widest outline-none focus:ring-4 focus:ring-amber-500/5 shadow-inner" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                  </div>
                </div>

                {businessType === 'Food' && (
                  <label className="flex items-center gap-4 p-6 bg-orange-50 rounded-[2rem] border border-orange-100 cursor-pointer hover:bg-orange-100 transition-all group shadow-sm">
                    <input type="checkbox" checked={newProduct.isVeg} onChange={e => setNewProduct({...newProduct, isVeg: e.target.checked})} className="w-6 h-6 accent-orange-600" />
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-[0.2em] italic">Vegetarian Protocol Active</span>
                  </label>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-[0.3em] italic leading-none mb-2">Category Sector Link</label>
                  <input required type="text" placeholder="Sector Class..." className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest outline-none focus:ring-4 focus:ring-amber-500/5 shadow-inner" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-[0.3em] italic leading-none mb-2">Logistics Est Link</label>
                  <input type="text" placeholder={businessType === 'Food' ? '30 mins' : 'Instant Flux'} className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest outline-none focus:ring-4 focus:ring-amber-500/5 shadow-inner" value={newProduct.timeToDeliver} onChange={e => setNewProduct({...newProduct, timeToDeliver: e.target.value})} />
                </div>

                <textarea required placeholder="Detailed Metadata Disclosure..." rows={4} className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest outline-none focus:ring-4 focus:ring-amber-500/5 resize-none shadow-inner" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                
                <button type="submit" className="w-full py-8 bg-amber-500 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-xl shadow-amber-500/20 hover:scale-[1.05] active:scale-95 transition-all">
                  Confirm Listing Deployment
                </button>
              </form>
            </div>
          </div>

          {/* Active Inventory */}
          <div className="lg:col-span-8 space-y-12 text-left">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-8">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 font-elegant">Elite <span className="text-slate-300">Active</span> Inventory</h3>
              <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-amber-500/20">
                 <span className="text-3xl font-black text-amber-500 tracking-tighter">{products?.length || 0}</span>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-l border-slate-100 pl-4 italic leading-none">Sector Units Indexed</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {products?.length === 0 ? (
                <div className="col-span-full py-40 text-center border-4 border-dashed border-slate-100 rounded-[4rem] group hover:border-amber-500/20 transition-all bg-white/50">
                   <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm border border-slate-100">
                     <Package size={48} className="text-slate-100" />
                   </div>
                  <p className="text-[11px] font-black uppercase text-slate-300 tracking-[0.4em] italic leading-none">No active sectors in this grid link</p>
                </div>
              ) : (
                products?.map(p => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={p._id} 
                    className="p-10 bg-white rounded-[3.5rem] border border-slate-100 flex gap-8 hover:shadow-xl hover:border-amber-500/20 transition-all relative overflow-hidden group shadow-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="w-32 h-32 bg-slate-50 rounded-[2rem] overflow-hidden shrink-0 shadow-inner border border-slate-100 p-6 flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-700">
                      <img src={p.images?.[0]} alt={p.name} className="max-w-full max-h-full object-contain group-hover:scale-125 transition-transform duration-1000" />
                    </div>
                    <div className="flex-1 space-y-4 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className={`text-[10px] font-black uppercase tracking-[0.3em] italic leading-none mb-2 ${p.serviceType === 'Food' ? 'text-orange-600' : 'text-amber-500'}`}>{p.serviceType} Estate Protocol</p>
                          <h4 className="font-black text-2xl text-slate-900 line-clamp-1 uppercase tracking-tighter transition-colors group-hover:text-amber-600">{p.name}</h4>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-3">
                            <span className="px-5 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest italic group-hover:text-slate-900 transition-colors">Inv: {p.stock}</span>
                            <span className="px-5 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest italic group-hover:text-slate-900 transition-colors">{p.timeToDeliver || 'Flux Link'}</span>
                        </div>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{p.price}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;