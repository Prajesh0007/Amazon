import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, DollarSign, TrendingUp, UserCheck } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto px-6 py-20 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-32 h-32 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-[3rem] flex items-center justify-center mb-10 rotate-12 shadow-2xl">
          <TrendingUp size={64} />
        </div>
        <h1 className="text-5xl font-black mb-6 dark:text-white uppercase tracking-tighter">Become a <span className="text-indigo-600">Power</span> Seller</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-xl text-lg font-medium leading-relaxed">
          Open your Restaurant, Grocery Store, or Online Shop. Reach millions of customers across all our Super App verticals.
        </p>
        <button
          onClick={handleRegisterSeller}
          disabled={loading}
          className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-500/30 transition-all hover:scale-105"
        >
          {loading ? 'Initializing...' : 'Launch Your Business'}
        </button>
      </div>
    );
  }

  const businessTypes = [
    { id: 'Shopping', label: 'E-commerce Shop', icon: <Package size={20} />, color: 'blue' },
    { id: 'Food', label: 'Restaurant / Cafe', icon: <Plus size={20} />, color: 'orange' },
    { id: 'Grocery', label: 'Fresh Market', icon: <Truck size={20} />, color: 'green' },
    { id: 'Pharmacy', label: 'Medical Hub', icon: <Shield size={20} />, color: 'red' }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Hub Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase dark:text-white">Seller <span className="text-indigo-600">Command</span></h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500 text-white text-[8px] font-black uppercase rounded-full">Active Nodes</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Multi-Vertical Verified</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {businessTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setBusinessType(type.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${
                  businessType === type.id 
                  ? `bg-${type.color}-500 text-white shadow-xl shadow-${type.color}-500/20 border-${type.color}-500` 
                  : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800'
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Listing Form */}
          <div className="lg:col-span-4">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm sticky top-24">
              <h3 className="text-xl font-black uppercase mb-8 dark:text-white flex items-center gap-3 text-indigo-600">
                <Plus size={24} /> List New {businessType}
              </h3>
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 ml-2">Item Name</label>
                  <input required type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 ml-2">Price (₹)</label>
                    <input required type="number" className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 ml-2">Quantity</label>
                    <input required type="number" className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                  </div>
                </div>

                {businessType === 'Food' && (
                  <label className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/50 cursor-pointer">
                    <input type="checkbox" checked={newProduct.isVeg} onChange={e => setNewProduct({...newProduct, isVeg: e.target.checked})} className="w-5 h-5 accent-orange-500" />
                    <span className="text-[10px] font-black uppercase text-orange-600">Vegetarian Item</span>
                  </label>
                )}

                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 ml-2">Category</label>
                  <input required type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 ml-2">Delivery Time (Est)</label>
                  <input type="text" placeholder={businessType === 'Food' ? '30 mins' : '2 days'} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" value={newProduct.timeToDeliver} onChange={e => setNewProduct({...newProduct, timeToDeliver: e.target.value})} />
                </div>

                <textarea required placeholder="Detailed Description..." rows={3} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                
                <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] transition-all">
                  Confirm Listing
                </button>
              </form>
            </div>
          </div>

          {/* Active Inventory */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black uppercase tracking-tight dark:text-white">Active <span className="text-slate-400">Inventory</span></h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{products.length} Items Indexed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.length === 0 ? (
                <div className="col-span-2 py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
                  <Package size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-xs font-black uppercase text-slate-400">No active nodes in this sector</p>
                </div>
              ) : (
                products.map(p => (
                  <div key={p._id} className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex gap-6 hover:shadow-xl transition-all">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                      <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className={`text-[8px] font-black uppercase tracking-widest ${p.serviceType === 'Food' ? 'text-orange-500' : 'text-blue-500'}`}>{p.serviceType}</p>
                          <h4 className="font-black text-sm dark:text-white line-clamp-1">{p.name}</h4>
                        </div>
                        <span className="text-sm font-black dark:text-white">₹{p.price}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[8px] font-black uppercase text-slate-500">Stock: {p.stock}</span>
                        <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[8px] font-black uppercase text-slate-500">{p.timeToDeliver}</span>
                      </div>
                    </div>
                  </div>
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